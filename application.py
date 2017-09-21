from flask import Flask, render_template, redirect, request, send_from_directory, make_response, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from werkzeug.utils import secure_filename
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import json
import os
import psycopg2

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static/uploads')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['SECRET_KEY'] = "thrillermj"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:oldworldc@localhost/markers"
app.config["SQLALCHEMY_ECHO"] = True
Bootstrap(app)
db = SQLAlchemy(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'



e = create_engine('postgresql+psycopg2://postgres:oldworldc@localhost/markers')

class User(UserMixin, db.Model):
    #user table
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
    marker = db.relationship("Coordinates", backref="marker", lazy="dynamic")

class Coordinates(db.Model):
    #coordinates table
    __tablename__ = "coordinates"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    year = db.Column(db.Integer)
    description = db.Column(db.Text)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    file = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, title, year, description, lat, lng, file, user_id):
        self.title = title
        self.year = year
        self.description = description
        self.lat = lat
        self.lng = lng
        self.file = file
        self.user_id = user_id

@login_manager.user_loader
def load_user(user_id):
    #manage webpage access
    return User.query.get(int(user_id))

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])

def allowed_file(filename):
    #file extensions that can be uploaded
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def search():
    #home page
    return render_template("search.html")

@app.route("/addphoto")
@login_required
def index():
    #add photo to map
    return render_template("addphoto.html")

@app.route("/map")
def markers():
    #see geocoded photos
    return render_template("map2.html")

@app.route("/map", methods=["GET", "POST"])
def register():
    if request.form["title"] == "" or request.form["year"] == "" or request.form["description"] == "" or request.form["lat"] == "" or request.form["lng"] =="":
        return render_template("failure.html")
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #save to database
            file = os.path.join('static/uploads', filename)
            coordinates = Coordinates(request.form["title"], request.form["year"], request.form["description"], request.form["lat"], request.form["lng"], file, current_user.username)
            db.session.add(coordinates)
            db.session.commit()

    return render_template("map2.html")

@app.route("/data", methods=["GET"])
def data():
    #access the coordinates table in the markers database to create a url. arguments represent the current viewport of google maps.
    #only the markers in the current viewport are loaded
    conn = e.connect()
    nelat = request.args.get('neLat')
    nelng = request.args.get('neLng')
    swlat = request.args.get('swLat')
    swlng = request.args.get('swLng')
    query = conn.execute("SELECT * FROM coordinates WHERE lat < %s AND lat > %s AND lng < %s AND lng > %s;", (nelat, swlat, nelng, swlng))
    result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
    jsonData = json.dumps(result)
    return jsonData
    query.close()


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for('markers'))

        return '<h1>Invalid username or password</h1>'
        #return '<h1>' + form.username.data + ' ' + form.password.data + '</h1>'

    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('markers'))

    return render_template('signup.html', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.username)

@app.route('/myphotos')
@login_required
def myphotos():
    username = current_user.username
    myList = Coordinates.query.filter_by(user_id=current_user.username).all()
    return render_template('myphotos.html', myList=myList)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('markers'))

@app.route("/base")
def base():
    return render_template("lay.html")
if __name__ == "__main__":
    app.run(debug=True)
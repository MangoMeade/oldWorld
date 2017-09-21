from flask import Flask, render_template, redirect, request, send_from_directory, make_response, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from werkzeug.utils import secure_filename
import json
import os


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static/uploads')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['SECRET_KEY'] = "thrillermj"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///markers.db"
app.config["SQLALCHEMY_ECHO"] = True
db = SQLAlchemy(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



e = create_engine('sqlite:///markers.db')


class Coordinates(db.Model):

    __tablename__ = "coordinates"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    year = db.Column(db.Integer)
    description = db.Column(db.Text)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    file = db.Column(db.Text)

    def __init__(self, title, year, description, lat, lng, file):
        self.title = title
        self.year = year
        self.description = description
        self.lat = lat
        self.lng = lng
        self.file = file

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/oldworld")
def markers():
    return render_template("retrieve2.html")
    
@app.route("/oldworld", methods=["GET", "POST"])
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
            coordinates = Coordinates(request.form["title"], request.form["year"], request.form["description"], request.form["lat"], request.form["lng"], file)
            db.session.add(coordinates)
            db.session.commit()
    
    return render_template("retrieve2.html")
    
@app.route("/data", methods=["GET", "POST"])
def data():
    conn = e.connect()
    year2 = request.args["year"]
    query = conn.execute("SELECT * FROM coordinates")
    #Query the result and get cursor.Dumping that datWHERE year  is looked by extension
    result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
    jsonData = json.dumps(result)
    return jsonData

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

if __name__ == "__main__":
    app.run(debug=True)
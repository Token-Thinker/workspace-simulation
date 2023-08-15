from flask import Flask, render_template, Response, request
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename
import cv2
import numpy as np
import base64
import os

# Define directories for storing uploaded files
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, '../uploads')

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__, static_folder="./static")
app.config['SECRET_KEY'] = 'secret!'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  
app.config['ALLOWED_EXTENSIONS'] = {'usd', 'gltf'}
socketio = SocketIO(app, cors_allowed_origins="*")

# Helper function to check if the file has allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Function to convert frame to grayscale
def apply_model1(frame):
    return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

# Function to apply blur to frame
def apply_model2(frame):
    return cv2.GaussianBlur(frame, (15, 15), 0)

# Function to convert base64 string to image
def base64_to_image(base64_string):
    base64_data = base64_string.split(",")[1]
    image_bytes = base64.b64decode(base64_data)
    image_array = np.frombuffer(image_bytes, dtype=np.uint8)
    return cv2.imdecode(image_array, cv2.IMREAD_COLOR)

# Function to convert image to base64
def image_to_base64(image):
    _, buffer = cv2.imencode('.jpg', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    return f'data:image/jpeg;base64,{encoded_image}'

# Event handlers for processing images
@socketio.on("image_gray")
def receive_image_gray(image):
    image = base64_to_image(image)
    gray_base64 = image_to_base64(apply_model1(image))
    emit("processed_image_gray", gray_base64)

@socketio.on("image_blur")
def receive_image_blur(image):
    image = base64_to_image(image)
    blur_base64 = image_to_base64(apply_model2(image))
    emit("processed_image_blur", blur_base64)

@app.route('/')
def home():
    return render_template('index.html')

# Route to handle file upload
@app.route('/upload_file', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return {'message': 'No file part in the request'}, 400
    file = request.files['file']
    # If user does not select file, return error
    if file.filename == '':
        return {'message': 'No selected file'}, 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return {'message': 'File uploaded successfully'}
    
    return {'message': 'Invalid file type'}, 400

if __name__ == '__main__':
    socketio.run(app, debug=True)
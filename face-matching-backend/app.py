import os
from flask import Flask, request, jsonify
from google.cloud import vision
from dotenv import load_dotenv
from PIL import Image
import io

# Load credentials from .env
load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

app = Flask(__name__)
client = vision.ImageAnnotatorClient()

@app.route("/detect-faces", methods=["POST"])
def detect_faces():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    content = image_file.read()

    image = vision.Image(content=content)
    response = client.face_detection(image=image)

    faces = response.face_annotations
    face_count = len(faces)

    return jsonify({
        "message": f"{face_count} face(s) detected.",
        "face_count": face_count
    })

if __name__ == "__main__":
    app.run(debug=True)

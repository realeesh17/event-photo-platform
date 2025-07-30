import face_recognition
import requests
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Face Matching Backend is running!"})

@app.route('/match-faces', methods=['POST'])
def match_faces():
    data = request.json
    images = data.get("images", [])  # Event images
    reference_images = data.get("references", [])  # Reference faces

    results = []

    # Load reference encodings
    reference_encodings = []
    for ref_url in reference_images:
        ref_data = requests.get(ref_url).content
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as ref_file:
            ref_file.write(ref_data)
            ref_path = ref_file.name
        ref_image = face_recognition.load_image_file(ref_path)
        ref_encodings = face_recognition.face_encodings(ref_image)
        if ref_encodings:
            reference_encodings.append((ref_url, ref_encodings[0]))

    # Match event images
    for img_url in images:
        img_data = requests.get(img_url).content
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as img_file:
            img_file.write(img_data)
            img_path = img_file.name
        event_image = face_recognition.load_image_file(img_path)
        event_encodings = face_recognition.face_encodings(event_image)

        for event_encoding in event_encodings:
            for ref_url, ref_encoding in reference_encodings:
                match = face_recognition.compare_faces([ref_encoding], event_encoding, tolerance=0.5)
                if match[0]:
                    results.append({"image": img_url, "match": ref_url})

    return jsonify({"status": "success", "matches": results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

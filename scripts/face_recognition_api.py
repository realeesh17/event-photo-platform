"""
Flask API for Face Recognition
This script provides the backend face recognition functionality
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import numpy as np
import base64
import io
from PIL import Image
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage for demo (Use DB in Production)
face_encodings_db = {}
event_photos = {}

def decode_base64_image(base64_string):
    """Decode base64 image string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def encode_faces_in_image(image_array):
    """Extract face encodings from image"""
    try:
        # Find face locations
        face_locations = face_recognition.face_locations(image_array)
        
        if not face_locations:
            return []
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        return [{
            'encoding': encoding.tolist(),
            'location': location
        } for encoding, location in zip(face_encodings, face_locations)]
    
    except Exception as e:
        print(f"Error encoding faces: {e}")
        return []

@app.route('/api/upload-event-photo', methods=['POST'])
def upload_event_photo():
    """Upload and process event photo"""
    try:
        data = request.json
        event_code = data.get('event_code')
        image_base64 = data.get('image')
        photo_id = data.get('photo_id')
        
        if not all([event_code, image_base64, photo_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Decode image
        image_array = decode_base64_image(image_base64)
        if image_array is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Extract face encodings
        faces = encode_faces_in_image(image_array)
        
        # Store in database
        if event_code not in event_photos:
            event_photos[event_code] = {}
        
        event_photos[event_code][photo_id] = {
            'faces': faces,
            'uploaded_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'faces_detected': len(faces),
            'photo_id': photo_id
        })
    
    except Exception as e:
        print(f"Error uploading photo: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/find-matches', methods=['POST'])
def find_matches():
    """Find matching photos based on selfie"""
    try:
        data = request.json
        event_code = data.get('event_code')
        selfie_base64 = data.get('selfie')
        
        if not all([event_code, selfie_base64]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Decode selfie
        selfie_array = decode_base64_image(selfie_base64)
        if selfie_array is None:
            return jsonify({'error': 'Invalid selfie data'}), 400
        
        # Extract face encoding from selfie
        selfie_faces = encode_faces_in_image(selfie_array)
        if not selfie_faces:
            return jsonify({'error': 'No face detected in selfie'}), 400
        
        selfie_encoding = np.array(selfie_faces[0]['encoding'])
        
        # Find matches in event photos
        matches = []
        if event_code in event_photos:
            for photo_id, photo_data in event_photos[event_code].items():
                for face in photo_data['faces']:
                    face_encoding = np.array(face['encoding'])
                    
                    # Compare faces (threshold: 0.6 for stricter matching)
                    distance = face_recognition.face_distance([face_encoding], selfie_encoding)[0]
                    
                    if distance < 0.6:  # Match found
                        matches.append({
                            'photo_id': photo_id,
                            'confidence': float(1 - distance),  # Convert to confidence score
                            'face_location': face['location']
                        })
        
        # Sort by confidence
        matches.sort(key=lambda x: x['confidence'], reverse=True)
        
        return jsonify({
            'success': True,
            'matches': matches,
            'total_matches': len(matches)
        })
    
    except Exception as e:
        print(f"Error finding matches: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/event-stats/<event_code>', methods=['GET'])
def get_event_stats(event_code):
    """Get statistics for an event"""
    try:
        if event_code not in event_photos:
            return jsonify({'error': 'Event not found'}), 404
        
        photos = event_photos[event_code]
        total_photos = len(photos)
        total_faces = sum(len(photo['faces']) for photo in photos.values())
        
        return jsonify({
            'event_code': event_code,
            'total_photos': total_photos,
            'total_faces': total_faces,
            'photos': list(photos.keys())
        })
    
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'face-recognition-api'})

if __name__ == '__main__':
    print("Starting Face Recognition API...")
    print("Make sure you have installed: pip install flask flask-cors face_recognition pillow")
    app.run(debug=True, host='0.0.0.0', port=5000)

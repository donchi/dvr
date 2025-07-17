# face_recognition.py
import sys
import json
import os
from deepface import DeepFace

def recognize_face(image_path):
    try:
        # Compare against your database of known faces
        result = DeepFace.find(
            img_path=image_path,
            db_path="public/images/visitors",  # Folder with known visitor photos
            model_name="Facenet",
            enforce_detection=False,
            detector_backend="opencv",
            silent=True,
            distance_metric="cosine",
            threshold=0.8
        )

        if not result or len(result[0]) == 0:
            return {"match": False, "message": "No matches found."}

        # Get all matches that meet the threshold
        matches = []
        for idx, row in result[0].iterrows():
            matches.append({
                "identity": row["identity"],
                "confidence": float(1 - row["distance"]),
                "distance": float(row["distance"])
            })

        return {
            "match": True,
            "matches": matches,  # Now returns all matches
            "count": len(matches)
        }

    except Exception as e:
        return {"error": str(e), "match": False}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path required", "match": False}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    result = recognize_face(image_path)
    print(json.dumps(result, indent=2))  # Pretty print for debugging
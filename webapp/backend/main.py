from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from src.services.gemini import validate_coffee_leaf
from src.services.yolo import classify_coffee_leaf

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.post("/validate")
def validate():
    body = request.get_json(silent=True) or {}
    image = body.get("image", "")

    if not image:
        return jsonify({"error": "image field is required"}), 400

    try:
        result = validate_coffee_leaf(image)
        return jsonify(result.model_dump(exclude_none=True))
    except Exception as e:
        app.logger.error("Gemini validation error: %s", e)
        return jsonify({"error": "Error al procesar la imagen"}), 500


@app.post("/classify")
def classify():
    body = request.get_json(silent=True) or {}
    image = body.get("image", "")

    if not image:
        return jsonify({"error": "image field is required"}), 400

    try:
        result = classify_coffee_leaf(image)
        return jsonify(result)
    except Exception as e:
        app.logger.error("YOLOv8 classification error: %s", e)
        return jsonify({"error": "Error al clasificar la imagen"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000, host="0.0.0.0")

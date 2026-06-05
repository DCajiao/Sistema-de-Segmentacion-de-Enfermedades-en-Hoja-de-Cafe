import logging

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from src.services.gemini import validate_coffee_leaf
from src.services.yolo import classify_coffee_leaf

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
logger = logging.getLogger(__name__)

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
        logger.error("Gemini validation error: %s", e, exc_info=True)
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
        logger.error("YOLOv8 classification error: %s", e, exc_info=True)
        return jsonify({"error": "Error al clasificar la imagen"}), 500


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    logger.info("Starting Flask on port %d", port)
    app.run(debug=False, port=port, host="0.0.0.0")

import random

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DISEASES = [
    "Antracnosis",
    "Mancha negra (Cercospora)",
    "Roña del aguacate",
    "Pudrición de raíz",
    "Sano",
]


@app.post("/validate")
def validate():
    is_avocado = random.random() < 0.8
    if is_avocado:
        return jsonify({"avocado": True})
    return jsonify({"avocado": False, "reason": "No se detectó un aguacate en la imagen."})


@app.post("/classify")
def classify():
    disease = random.choice(DISEASES)
    classification_time = round(random.uniform(0.5, 3.5), 2)
    return jsonify({"disease": disease, "classification_time": classification_time})


if __name__ == "__main__":
    app.run(debug=True, port=8000)

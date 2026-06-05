import base64
import io
import os
import time

from PIL import Image
from ultralytics import YOLO

# Class order matches data.yaml used during training
CLASS_NAMES = ["healthy", "miner", "phoma", "rust"]

# Thresholds from notebook (UMBRAL_CONFIANZA / UMBRAL_NMS)
CONF_THRESHOLD = 0.30
IOU_THRESHOLD = 0.45

# Input size used during training
IMG_SIZE = 640

_model: YOLO | None = None


def _get_model() -> YOLO:
    global _model
    if _model is None:
        model_path = os.environ.get("YOLO_MODEL_PATH", "model/best.pt")
        _model = YOLO(model_path)
    return _model


def _decode_image(image_base64: str) -> Image.Image:
    if "," in image_base64:
        _, data = image_base64.split(",", 1)
    else:
        data = image_base64
    return Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")


def classify_coffee_leaf(image_base64: str) -> dict:
    """
    Run YOLOv8n inference on a base64-encoded image.

    Returns the disease class with the highest confidence box.
    Falls back to 'healthy' when no boxes exceed the confidence threshold,
    since the image was already validated as a coffee leaf by /validate.
    """
    model = _get_model()
    image = _decode_image(image_base64)

    t0 = time.perf_counter()
    results = model.predict(
        source=image,
        imgsz=IMG_SIZE,
        conf=CONF_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False,
    )[0]
    classification_time = round(time.perf_counter() - t0, 2)

    if len(results.boxes) == 0:
        return {"disease": "healthy", "classification_time": classification_time}

    best = max(results.boxes, key=lambda b: float(b.conf[0]))
    disease = CLASS_NAMES[int(best.cls[0])]

    return {"disease": disease, "classification_time": classification_time}

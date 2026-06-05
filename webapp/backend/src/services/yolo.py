import base64
import io
import logging
import time

import torch
from PIL import Image
from ultralytics import YOLO

torch.backends.nnpack.enabled = False

logger = logging.getLogger(__name__)

MODEL_PATH = "model/best.pt"

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
        logger.info("Loading YOLOv8n model from %s", MODEL_PATH)
        _model = YOLO(MODEL_PATH)
        logger.info(
            "Model loaded — classes: %s | conf=%.2f | iou=%.2f | imgsz=%d",
            list(_model.names.values()),
            CONF_THRESHOLD,
            IOU_THRESHOLD,
            IMG_SIZE,
        )
    return _model


def _decode_image(image_base64: str) -> Image.Image:
    if "," in image_base64:
        _, data = image_base64.split(",", 1)
    else:
        data = image_base64
    return Image.open(io.BytesIO(base64.b64decode(data))).convert("RGB")


def classify_coffee_leaf(image_base64: str) -> dict:
    model = _get_model()
    image = _decode_image(image_base64)
    logger.debug("Running inference on image size %s", image.size)

    t0 = time.perf_counter()
    results = model.predict(
        source=image,
        imgsz=IMG_SIZE,
        conf=CONF_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False,
    )[0]
    classification_time = round(time.perf_counter() - t0, 2)

    n_boxes = len(results.boxes)
    logger.info("Inference done in %.2fs — %d box(es) detected", classification_time, n_boxes)

    detections = []
    for box in results.boxes:
        cid = int(box.cls[0])
        conf = float(box.conf[0])
        x1, y1, x2, y2 = [round(v, 1) for v in box.xyxy[0].tolist()]
        disease = CLASS_NAMES[cid]
        detections.append({
            "disease": disease,
            "confidence": round(conf, 3),
            "bbox": [x1, y1, x2, y2],
        })
        logger.info("  → %s (conf=%.3f, bbox=[%.0f,%.0f,%.0f,%.0f])", disease, conf, x1, y1, x2, y2)

    if not detections:
        logger.info("No boxes above conf=%.2f — leaf is healthy", CONF_THRESHOLD)

    return {"detections": detections, "classification_time": classification_time}

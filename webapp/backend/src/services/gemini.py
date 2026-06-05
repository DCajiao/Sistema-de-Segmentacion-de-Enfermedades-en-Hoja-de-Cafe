import base64
import os
from typing import Optional

from google import genai
from google.genai import types
from pydantic import BaseModel

VALIDATE_PROMPT = """
You are an expert agricultural AI specialized in coffee crop disease analysis.

Your task is to determine whether the provided image is suitable for disease segmentation on a coffee plant leaf.

A valid image must show a coffee plant leaf (Coffea arabica or Coffea canephora) with these characteristics:
- Elongated elliptical shape with a pointed tip and visible central midrib
- The leaf surface must be clear enough to observe potential disease symptoms (spots, lesions, discoloration)
- The leaf must occupy a significant portion of the frame
- The image must be sufficiently sharp and well-lit

Return coffee_leaf=true ONLY if all of the following are true:
1. The image clearly shows a coffee plant leaf.
2. The leaf surface is visible and sharp enough for disease analysis.
3. You are confident in the identification.

Return coffee_leaf=false if:
- The image does not show a coffee leaf (shows fruit, branch, soil, another plant species, a person, an object, etc.)
- The image is too blurry, too dark, or the leaf is too far away to distinguish surface details.
- You are not confident.

When coffee_leaf=false, the "reason" field is required: one short sentence in Spanish explaining why the image was rejected.

Be strict. When in doubt, return coffee_leaf=false.
"""


class ValidateResult(BaseModel):
    coffee_leaf: bool
    reason: Optional[str] = None


def _parse_image(image_base64: str) -> tuple[bytes, str]:
    """Strip optional data-URL prefix and detect MIME type."""
    if "," in image_base64:
        header, data = image_base64.split(",", 1)
        mime = header.split(":")[1].split(";")[0]
    else:
        data = image_base64
        prefix = data[:16]
        if prefix.startswith("/9j/"):
            mime = "image/jpeg"
        elif prefix.startswith("iVBORw0KGgo"):
            mime = "image/png"
        elif prefix.startswith("UklGR"):
            mime = "image/webp"
        else:
            mime = "image/jpeg"

    return base64.b64decode(data), mime


def validate_coffee_leaf(image_base64: str) -> ValidateResult:
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    image_bytes, mime_type = _parse_image(image_base64)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            VALIDATE_PROMPT,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ValidateResult,
        ),
    )

    return response.parsed

import base64
import os
from typing import Optional

from google import genai
from google.genai import types
from pydantic import BaseModel

VALIDATE_PROMPT = """
You are an expert agricultural AI specialized in coffee crop analysis.

Your task is to determine whether the provided image shows a coffee leaf.

A coffee leaf (Coffea arabica or Coffea canephora) typically has:
- An elongated elliptical shape with a pointed tip
- A prominent central midrib with visible lateral veins
- A glossy, smooth surface with dark green color
- Slightly wavy or undulate leaf margins

Evaluation criteria:
- Respond coffee_leaf=true ONLY if you clearly and confidently identify a coffee plant leaf.
- Respond coffee_leaf=false if the image shows something else (fruit, branch, soil, other plant), is too blurry, is unrelated, or you are not confident.
- The "reason" field is ONLY required when coffee_leaf=false. Write it in Spanish, one short sentence.

Be strict. When in doubt, respond coffee_leaf=false.
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

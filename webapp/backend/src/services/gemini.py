import base64
import os
from typing import Optional

from google import genai
from google.genai import types
from pydantic import BaseModel

VALIDATE_PROMPT = """
You are an expert agricultural AI specialized in avocado crop analysis.

Your task is to determine whether the provided image shows an avocado.

An avocado can be:
- The avocado fruit (Persea americana): pear-shaped, green, dark green, or purple-black skin
- A leaf from an avocado tree: elongated, smooth, glossy, dark green

Evaluation criteria:
- Respond avocado=true ONLY if you clearly and confidently identify an avocado fruit or avocado leaf.
- Respond avocado=false if the image shows something else, is too blurry, is unrelated, or you are not confident.
- The "reason" field is ONLY required when avocado=false. Write it in Spanish, one short sentence.

Be strict. When in doubt, respond avocado=false.
"""


class ValidateResult(BaseModel):
    avocado: bool
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


def validate_avocado(image_base64: str) -> ValidateResult:
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

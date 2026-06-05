import base64
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

from google import genai
from google.genai import types
from pydantic import BaseModel

VALIDATE_PROMPT = """
You are a pre-filter for a coffee leaf disease analysis system.

Your ONLY task is to determine whether the image shows a plant leaf of any kind.

Return coffee_leaf=true if:
- The image shows any plant leaf, in any condition: healthy, damaged, torn, folded, discolored, wilted, or diseased.
- Partial leaves, close-up shots of leaf surfaces, or leaves with poor lighting are acceptable.
- You do NOT need to identify the plant species.

Return coffee_leaf=false ONLY if:
- The image contains no leaf at all (e.g., hands, fruit, bare branch, soil, a person, an object, a blank surface).
- The image is completely unrelated to plant foliage.

When coffee_leaf=false, the "reason" field is required: one short sentence in Spanish explaining why the image was rejected.

Be permissive. Reject only clearly non-leaf images. When in doubt, return coffee_leaf=true.
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
    logger.info("Sending image to Gemini for coffee leaf validation")
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    image_bytes, mime_type = _parse_image(image_base64)
    logger.debug("Image parsed — mime_type=%s | size=%d bytes", mime_type, len(image_bytes))

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

    result = response.parsed
    logger.info("Gemini result: coffee_leaf=%s | reason=%s", result.coffee_leaf, result.reason)
    return result

import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

BRD_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "overview": {"type": "string"},
        "process_flow": {"type": "string"},
        "stakeholders": {"type": "array", "items": {"type": "string"}},
        "functional_requirements": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "description": {"type": "string"}
                },
                "required": ["id", "description"]
            }
        },
        "non_functional_requirements": {"type": "array", "items": {"type": "string"}},
        "user_stories": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "as_a": {"type": "string"},
                    "i_want": {"type": "string"},
                    "so_that": {"type": "string"}
                },
                "required": ["as_a", "i_want", "so_that"]
            }
        },
        "acceptance_criteria": {"type": "array", "items": {"type": "string"}},
        "assumptions": {"type": "array", "items": {"type": "string"}},
        "open_questions": {"type": "array", "items": {"type": "string"}}
    },
    "required": [
        "title", "overview", "process_flow", "stakeholders", "functional_requirements",
        "non_functional_requirements", "user_stories",
        "acceptance_criteria", "assumptions", "open_questions"
    ]
}

SYSTEM_PROMPT = """You are a senior business analyst. Given raw, possibly messy or contradictory
meeting notes or requirements text, produce a structured Business Requirements Document.

Be rigorous about the "open_questions" field — actively look for ambiguities, contradictions,
undefined actors, or missing information in the input, and flag them there rather than silently
resolving them yourself. Do not invent requirements that aren't implied by the input.

Also output a simple Mermaid.js flowchart using flowchart TD syntax representing the core process
described in the input. The process_flow value must contain valid Mermaid syntax only: no markdown
code fences and no explanation text, just the raw Mermaid syntax as a string value."""

import time

def generate_brd(raw_text: str, max_retries: int = 3) -> dict:
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=raw_text,
                config={
                    "system_instruction": SYSTEM_PROMPT,
                    "response_mime_type": "application/json",
                    "response_schema": BRD_SCHEMA,
                },
            )
            return json.loads(response.text)
        except Exception as e:
            if "UNAVAILABLE" in str(e) and attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # 1s, 2s, 4s backoff
                continue
            raise

from google.genai import types

def transcribe_audio(audio_bytes: bytes, mime_type: str) -> str:
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=[
            types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
            "Provide an exact, complete transcription of this audio. "
            "Do not summarize or interpret — transcribe the spoken words verbatim, "
            "including any filler words or false starts, as plain text with no extra commentary."
        ],
    )
    return response.text.strip()
import os
import json
from importlib import import_module

try:
    load_dotenv = import_module("dotenv").load_dotenv
    load_dotenv()
except ImportError:
    # dotenv is optional; use the process environment when it is unavailable.
    pass

try:
    anthropic = import_module("anthropic")
except ImportError as exc:
    raise ImportError(
        "The 'anthropic' package is required. Install it with: pip install anthropic"
    ) from exc

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

BRD_TOOL = {
    "name": "generate_brd",
    "description": "Generate a structured Business Requirements Document from raw meeting notes or requirements text.",
    "input_schema": {
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "overview": {"type": "string"},
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
            "title", "overview", "stakeholders", "functional_requirements",
            "non_functional_requirements", "user_stories",
            "acceptance_criteria", "assumptions", "open_questions"
        ]
    }
}

SYSTEM_PROMPT = """You are a senior business analyst. Given raw, possibly messy or contradictory
meeting notes or requirements text, produce a structured Business Requirements Document.

Be rigorous about the "open_questions" field — actively look for ambiguities, contradictions,
undefined actors, or missing information in the input, and flag them there rather than silently
resolving them yourself. Do not invent requirements that aren't implied by the input."""

def generate_brd(raw_text: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        tools=[BRD_TOOL],
        tool_choice={"type": "tool", "name": "generate_brd"},
        messages=[{"role": "user", "content": raw_text}]
    )

    for block in response.content:
        if block.type == "tool_use" and block.name == "generate_brd":
            return block.input

    raise ValueError("No tool_use block returned by the model")
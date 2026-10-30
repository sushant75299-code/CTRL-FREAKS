import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "qwen3:1.7b"


def ask_ai(prompt: str) -> str:
    """Send a prompt to the local Qwen model and return its response."""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        result = response.json()

        return result["message"]["content"].strip()

    except requests.exceptions.ConnectionError:
        return "AI service unavailable. Please make sure Ollama is running."

    except requests.exceptions.Timeout:
        return "AI request timed out. Please try again."

    except requests.exceptions.RequestException as error:
        return f"AI request failed: {error}"

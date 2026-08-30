# Configuration for the Calling AI Agent
import os

# The dedicated API key provided for the voice agent
GEMINI_API_KEY = ""

# Recommended Model for Voice Agent:
# gemini-2.5-flash is extremely fast, supports multimodal (audio/text), 
# and has a very generous free tier making it ideal for high-usage voice applications.
# If you are doing direct audio streaming, 'gemini-2.5-flash-native-audio-latest' is also available.
RECOMMENDED_MODEL = "gemini-2.5-flash"

def get_api_key():
    return os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)

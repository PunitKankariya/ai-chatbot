from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import os
import sys
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RAG API",
    description="Retrieval-Augmented Generation API",
    version="1.0.0"
)

# Load environment variables from backend/.env
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)
    logger.info("Loaded environment variables from backend/.env")
else:
    logger.warning("backend/.env not found; relying on system environment variables")

# Import the RAG model
try:
    # Ensure we can import from the sibling 'rag-api' directory
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    RAG_DIR = os.path.join(BASE_DIR, "rag-api")
    if RAG_DIR not in sys.path:
        sys.path.insert(0, RAG_DIR)

    from rag_model import generate_response
    logger.info("✅ Successfully imported RAG model")
except ImportError as e:
    logger.error(f"❌ Failed to import RAG model: {e}")

    # Fallback dummy function if rag_model is missing
    def generate_response(query: str) -> str:
        return f"Error: RAG model not available - {e}"

# Request model
class Query(BaseModel):
    question: str

# Health check route
@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "message": "RAG API is running 🚀"
    }

# Main generate route
@app.post("/generate")
def generate(query: Query):
    try:
        response = generate_response(query.question)
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )
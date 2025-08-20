from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RAG API", description="Retrieval-Augmented Generation API", version="1.0.0")

# Import the RAG model
try:
    from rag_model import generate_response
    logger.info("Successfully imported RAG model")
except ImportError as e:
    logger.error(f"Failed to import RAG model: {e}")
    def generate_response(query: str) -> str:
        return f"Error: RAG model not available - {e}"

class Query(BaseModel):
    question: str

@app.get("/")
def health_check():
    return {"status": "healthy", "message": "RAG API is running"}

@app.post("/generate")
def generate(query: Query):
    try:
        response = generate_response(query.question)
        return {"response": response, "status": "success"}
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")
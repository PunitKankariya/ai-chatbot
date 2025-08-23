import os
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Use the working simple RAG implementation
from simple_working_rag import generate_simple_response


class Message(BaseModel):
    role: str
    content: str


class AskRequest(BaseModel):
    question: str
    history: Optional[List[Message]] = None


app = FastAPI(title="Simple RAG API", version="1.0.0")

# CORS: allow local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"status": "ok", "service": "simple-rag-api"}


@app.post("/ask")
def ask(body: AskRequest):
    # Use the simple RAG implementation
    answer = generate_simple_response(body.question)
    return {"answer": answer}



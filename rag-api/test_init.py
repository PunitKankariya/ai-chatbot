import os
import sys

# Set environment variables
os.environ['GOOGLE_API_KEY'] = 'Q5JB1ZtAYlYYn7gJ6ksKu8rxhGSlxo'
os.environ['PINECONE_API_KEY'] = 'pcsk_4QGydV_91VWULgA2LCQh9L1bmyK9oCo2Hr6p23fbT7ZvSL2uSCKqCtK5YJ11JywA9isL2d'

# Import and test RAG
from rag_model import initialize_rag, generate_response

print("Initializing RAG pipeline...")
success = initialize_rag()
print(f"Initialization success: {success}")

if success:
    print("Testing RAG response...")
    response = generate_response("What is the heart?")
    print(f"Response: {response}")
else:
    print("Failed to initialize RAG pipeline")


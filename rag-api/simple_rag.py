import os
import re
from typing import List

def load_pdf_content():
    """Load and extract text from bio1.pdf"""
    try:
        from pypdf import PdfReader
        
        # Get path to PDF relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        repo_root = os.path.dirname(current_dir)
        pdf_path = os.path.join(repo_root, "bio1.pdf")
        
        if not os.path.exists(pdf_path):
            return "PDF file not found"
        
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        return text
    except Exception as e:
        return f"Error loading PDF: {e}"

def simple_search(query: str, content: str) -> str:
    """Simple keyword-based search in the content"""
    query_lower = query.lower()
    content_lower = content.lower()
    
    # Split content into sentences
    sentences = re.split(r'[.!?]+', content)
    
    # Find sentences that contain query words
    relevant_sentences = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10:  # Skip very short sentences
            continue
        
        # Check if sentence contains any query words
        query_words = query_lower.split()
        sentence_lower = sentence.lower()
        
        matches = sum(1 for word in query_words if word in sentence_lower)
        if matches > 0:
            relevant_sentences.append((sentence, matches))
    
    # Sort by relevance (number of matches)
    relevant_sentences.sort(key=lambda x: x[1], reverse=True)
    
    # Return top 3 most relevant sentences
    if relevant_sentences:
        result = "\n".join([s[0] for s in relevant_sentences[:3]])
        return result
    else:
        return "I couldn't find specific information about that in the document."

def generate_simple_response(query: str) -> str:
    """Generate a response using simple text search"""
    content = load_pdf_content()
    
    if content.startswith("Error") or content.startswith("PDF file not found"):
        return f"Sorry, I couldn't access the document: {content}"
    
    # Search for relevant content
    relevant_content = simple_search(query, content)
    
    if relevant_content == "I couldn't find specific information about that in the document.":
        return relevant_content
    
    # Format the response
    response = f"Based on the document, here's what I found:\n\n{relevant_content}"
    return response

if __name__ == "__main__":
    # Test the simple RAG
    test_query = "heart"
    response = generate_simple_response(test_query)
    print(f"Query: {test_query}")
    print(f"Response: {response}")


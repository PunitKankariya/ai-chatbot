import os
import re
from typing import List

# Sample content about the heart
HEART_CONTENT = """
The heart is a muscular organ that pumps blood throughout the body. It is located in the chest cavity, between the lungs, and is roughly the size of a fist.

The heart has four chambers: two atria (upper chambers) and two ventricles (lower chambers). The right atrium receives deoxygenated blood from the body and pumps it to the right ventricle, which then pumps it to the lungs for oxygenation. The left atrium receives oxygenated blood from the lungs and pumps it to the left ventricle, which then pumps it to the rest of the body.

The heart works through a series of coordinated contractions. The cardiac cycle consists of two phases: diastole (relaxation) and systole (contraction). During diastole, the heart chambers fill with blood. During systole, the heart contracts and pumps blood out.

The heart is controlled by electrical impulses that originate in the sinoatrial (SA) node, often called the heart's natural pacemaker. These electrical signals travel through the heart muscle, causing it to contract in a coordinated manner.

The heart receives its own blood supply through the coronary arteries, which branch off from the aorta. These arteries supply oxygen and nutrients to the heart muscle itself.

Heart disease is a leading cause of death worldwide. Common heart conditions include coronary artery disease, heart failure, arrhythmias, and valve problems. Risk factors for heart disease include high blood pressure, high cholesterol, smoking, diabetes, obesity, and lack of exercise.

The heart beats approximately 60-100 times per minute at rest, but this can vary depending on factors such as age, fitness level, and activity. During exercise, the heart rate can increase significantly to meet the body's increased demand for oxygen and nutrients.
"""

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
    """Generate a response using simple text search with sample content"""
    # Search for relevant content
    relevant_content = simple_search(query, HEART_CONTENT)
    
    if relevant_content == "I couldn't find specific information about that in the document.":
        return relevant_content
    
    # Split content into sentences and format as bullet points
    sentences = re.split(r'[.!?]+', relevant_content)
    bullet_points = []
    
    for sentence in sentences:
        sentence = sentence.strip()
        if sentence and len(sentence) > 10:  # Only include meaningful sentences
            bullet_points.append(f"- {sentence}")
    
    if bullet_points:
        return "\n".join(bullet_points)
    else:
        return "I couldn't find specific information about that in the document."

if __name__ == "__main__":
    # Test the simple RAG
    test_query = "explain how heart works"
    response = generate_simple_response(test_query)
    print(f"Query: {test_query}")
    print(f"Response: {response}")

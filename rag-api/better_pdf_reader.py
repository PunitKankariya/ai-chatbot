import os
import pdfplumber

def load_pdf_content():
    """Load and extract text from bio1.pdf using pdfplumber"""
    try:
        # Get path to PDF relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        repo_root = os.path.dirname(current_dir)
        pdf_path = os.path.join(repo_root, "bio1.pdf")
        
        if not os.path.exists(pdf_path):
            return "PDF file not found"
        
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        print(f"Extracted {len(text)} characters from PDF")
        return text
    except Exception as e:
        return f"Error loading PDF: {e}"

if __name__ == "__main__":
    content = load_pdf_content()
    print(f"Content length: {len(content)}")
    print("First 1000 characters:")
    print(content[:1000])

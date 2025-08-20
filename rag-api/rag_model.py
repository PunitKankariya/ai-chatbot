#! pip install -U langchain langchain-openai
#!pip install -qU "langchain[google-genai]"
#!pip install -qU langchain-pinecone
#!pip install langchain-community pypdf

import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize variables
rag_chain = None
is_initialized = False

def initialize_rag():
    """Initialize the RAG pipeline with proper error handling."""
    global rag_chain, is_initialized
    
    if is_initialized:
        return True
        
    try:
        # Try to import required modules
        from langchain_pinecone import PineconeVectorStore
        from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
        from langchain_community.document_loaders import PyPDFLoader
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_core.output_parsers import StrOutputParser
        from langchain_core.runnables import RunnablePassthrough
        from langchain_core.prompts import ChatPromptTemplate
        from pinecone import Pinecone
        
        logger.info("Successfully imported all required modules")
        
        # Check if required environment variables are set
        google_api_key = os.environ.get("GOOGLE_API_KEY")
        pinecone_api_key = os.environ.get("PINECONE_API_KEY")
        
        if not google_api_key or google_api_key == "YOUR_GOOGLE_API_KEY":
            logger.warning("GOOGLE_API_KEY not set or using placeholder value")
            return False
            
        if not pinecone_api_key or pinecone_api_key == "YOUR_PINECONE_API_KEY":
            logger.warning("PINECONE_API_KEY not set or using placeholder value")
            return False
        
        # Check if PDF file exists
        pdf_path = "bio1.pdf"
        if not os.path.exists(pdf_path):
            logger.warning(f"PDF file {pdf_path} not found")
            return False
            
        # Load PDF
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
        logger.info(f"Loaded {len(docs)} documents from PDF")
        
        # Split text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        logger.info(f"Split into {len(splits)} chunks")
        
        # Google Embeddings
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        # Pinecone setup
        pc = Pinecone(api_key=pinecone_api_key)
        index_name = "ai-bot-1"
        
        vector_store = PineconeVectorStore.from_documents(docs, embeddings, index_name=index_name)
        
        # Retriever
        retriever = vector_store.as_retriever()
        
        # Prompt
        template = """
        Context:
        {context}
        
        Question:
        {question}
        
        Answer:
        """
        prompt = ChatPromptTemplate.from_template(template)
        
        # LLM
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
        
        # RAG Chain
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        
        is_initialized = True
        logger.info("RAG pipeline initialized successfully")
        return True
        
    except ImportError as e:
        logger.error(f"Failed to import required modules: {e}")
        return False
    except Exception as e:
        logger.error(f"Failed to initialize RAG pipeline: {e}")
        return False

def generate_response(query: str) -> str:
    """Generate an answer from the RAG pipeline."""
    global rag_chain, is_initialized
    
    if not is_initialized:
        if not initialize_rag():
            return "Error: RAG pipeline not initialized. Please check your API keys and PDF file."
    
    if rag_chain is None:
        return "Error: RAG pipeline not available"
    
    try:
        response = rag_chain.invoke(query)
        return response
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        return f"Error: {e}"

# Try to initialize on import
try:
    initialize_rag()
except Exception as e:
    logger.warning(f"Could not initialize RAG on import: {e}")
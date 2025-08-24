#! pip install -U langchain langchain-openai
#!pip install -qU "langchain[google-genai]"
#!pip install -qU langchain-pinecone
#!pip install langchain-community pypdf

import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        from langchain_core.runnables import RunnablePassthrough, RunnableLambda
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
        
        # Check if PDF file exists (resolve relative to repo root)
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        pdf_path = os.path.join(repo_root, "bio1.pdf")
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
        
        # Index the split chunks (not the whole documents)
        vector_store = PineconeVectorStore.from_documents(splits, embeddings, index_name=index_name)
        
        # Retriever (top-k similar chunks)
        retriever = vector_store.as_retriever(search_kwargs={"k": 7})

        # Utility to turn retrieved docs into a single context string
        def format_docs(docs):
            return "\n\n".join(d.page_content for d in docs)
        
        # Prompt
        template = """
        You are a helpful assistant. Use ONLY the provided Context to answer the Question.
        If the answer is not explicitly present in the Context, reply exactly with: I don't know.
        Be concise and cite facts from the Context.

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
            {
                "context": retriever | RunnableLambda(format_docs),
                "question": RunnablePassthrough(),
            }
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
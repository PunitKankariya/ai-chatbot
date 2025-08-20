#!/usr/bin/env python3
"""
Test script to verify the FastAPI app can be imported correctly
"""

try:
    import rag_api
    print("✅ Successfully imported rag_api module")
    
    # Check if app attribute exists
    if hasattr(rag_api, 'app'):
        print("✅ Found 'app' attribute in rag_api module")
        print(f"   App title: {rag_api.app.title}")
        print(f"   App version: {rag_api.app.version}")
    else:
        print("❌ 'app' attribute not found in rag_api module")
        
    # Check if generate_response function is available
    if hasattr(rag_api, 'generate_response'):
        print("✅ generate_response function is available")
    else:
        print("❌ generate_response function not found")
        
except ImportError as e:
    print(f"❌ Failed to import rag_api module: {e}")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

print("\nTest completed!")

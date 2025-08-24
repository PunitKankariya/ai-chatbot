import os

print(f"Current working directory: {os.getcwd()}")
print(f"__file__: {__file__}")
print(f"Directory of current file: {os.path.dirname(os.path.abspath(__file__))}")
print(f"Project root: {os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))}")
print(f"PDF path: {os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bio1.pdf'))}")
print(f"PDF exists: {os.path.exists(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'bio1.pdf')))}")

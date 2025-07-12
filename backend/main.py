from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import fitz  # PyMuPDF
from openai import OpenAI


# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Allow frontend requests (CORS setup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic check routes
@app.get("/")
def read_root():
    return {"message": "Lab Report Explainer backend running"}

@app.get("/config-check")
def config_check():
    return {
        "openai_key_exists": bool(os.getenv("OPENAI_API_KEY")),
        "db_url_exists": bool(os.getenv("DATABASE_URL")),
    }

# Main functionality route
@app.post("/generate-explanation/")
async def generate_explanation(file: UploadFile = File(None), text: str = Form(None)):
    extracted_text = ""

    if file:
        contents = await file.read()
        pdf = fitz.open(stream=contents, filetype="pdf")
        for page in pdf:
            extracted_text += page.get_text()
    elif text:
        extracted_text = text
    else:
        return {"error": "No file or text provided."}

    if not extracted_text.strip():
        return {"error": "Uploaded file or text is empty."}

    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful medical assistant."},
            {"role": "user", "content": f"Please explain this lab report in simple terms:\n{extracted_text}"}
        ],
        max_tokens=1000
    )

        explanation = response.choices[0].message.content

        return {"explanation": explanation}

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/debug-key/")
def debug_key():
    return {"openai_key_loaded": bool(os.getenv("OPENAI_API_KEY"))}


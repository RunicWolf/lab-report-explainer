from fastapi import FastAPI, UploadFile, File, Form, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import fitz  # PyMuPDF
import json
from openai import OpenAI
import uuid
from typing import Dict, List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from backend.database import SessionLocal



# Import database and models
from backend.database import SessionLocal
from backend.models import Doctor

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage
session_history: Dict[str, list] = {}
session_mode: Dict[str, str] = {}

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DoctorOut(BaseModel):
    name: str
    specialty: str
    location: str
    contact_info: str

    class Config:
        orm_mode = True

@app.get("/")
def read_root():
    return {"message": "Lab Report Explainer backend running"}

@app.get("/config-check")
def config_check():
    return {
        "openai_key_exists": bool(os.getenv("OPENAI_API_KEY")),
        "db_url_exists": bool(os.getenv("DATABASE_URL")),
    }

@app.get("/debug-key/")
def debug_key():
    return {"openai_key_loaded": bool(os.getenv("OPENAI_API_KEY"))}

@app.post("/start-session/")
async def start_session(file: UploadFile = File(None), text: str = Form(None)):
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

    session_id = str(uuid.uuid4())
    session_mode[session_id] = "structured"

    system_message = {
        "role": "system",
        "content": (
            "You are a medical assistant. Given raw lab report text, respond strictly in JSON format like this:\n"
            "{\n"
            "  \"diagnosis\": \"...\",\n"
            "  \"suggested_action\": \"...\",\n"
            "  \"notes\": \"...\"\n"
            "}\n"
            "Do not include any extra text or formatting outside this JSON object."
        )
    }

    session_history[session_id] = [system_message, {"role": "user", "content": extracted_text}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=session_history[session_id],
        max_tokens=1000
    )
    content = response.choices[0].message.content.strip()
    try:
        structured_output = json.loads(content)
    except json.JSONDecodeError:
        structured_output = {"error": "AI response was not valid JSON.", "raw_response": content}

    session_history[session_id].append({"role": "assistant", "content": content})

    return {"session_id": session_id, **structured_output}

class ChatInput(BaseModel):
    session_id: str
    user_message: str

@app.post("/chat/")
async def continue_chat(data: ChatInput):
    if data.session_id not in session_history:
        return {"error": "Invalid session ID."}

    if session_mode.get(data.session_id) == "structured":
        session_mode[data.session_id] = "chat"
        recent_history = session_history[data.session_id][-2:]
        refined_system_message = {
            "role": "system",
            "content": (
                "You are a medical assistant chatbot. Your job is to assist the user with questions related to their lab report. "
                "You can answer questions about possible causes, risks, lifestyle recommendations (such as diet, exercise, sports activity), "
                "and treatment options related to the reported condition. If the user asks unrelated questions (about entertainment, history, etc.), "
                "respond: 'I can only assist with healthcare-related questions.' Speak in natural language unless specifically requested to use JSON."
            )
        }
        session_history[data.session_id] = [refined_system_message] + recent_history

    session_history[data.session_id].append({"role": "user", "content": data.user_message})

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=session_history[data.session_id],
        max_tokens=1000
    )
    content = response.choices[0].message.content.strip()
    session_history[data.session_id].append({"role": "assistant", "content": content})
    return {"response": content}

@app.get("/doctors/")
def get_doctors(specialty: Optional[str] = None, location: Optional[str] = None):
    db = SessionLocal()  # ✅ Make sure this line exists

    query = db.query(Doctor)
    if specialty:
        query = query.filter(Doctor.specialty == specialty)
    if location:
        query = query.filter(Doctor.location == location)

    doctors = query.all()
    db.close()  # ✅ Always close the session

    return doctors


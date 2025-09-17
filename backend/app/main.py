from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from .db import Base, engine, SessionLocal
from .models import User, Provider, Agent
from .auth import router as auth_router
from .routers.users import router as users_router
from .routers.providers import router as providers_router
from .routers.agents import router as agents_router
from passlib.hash import bcrypt

app = FastAPI(title="TEA Backend")

origins = [o.strip() for o in os.getenv("CORS_ORIGINS","http://localhost:3000").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static para fotos
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    if os.getenv("AUTO_SEED","0") == "1":
        seed()

@app.get("/health")
def health(): return {"ok": True}

def seed():
    db: Session = SessionLocal()
    try:
        if not db.query(User).first():
            # Usuarios de prueba
            admin = User(
                name="Admin", email="admin@example.com",
                password_hash=bcrypt.hash("admin123"), role="admin"
            )
            caregiver = User(
                name="Cuidador", email="cuidador@example.com",
                password_hash=bcrypt.hash("cuidador123"), role="caregiver"
            )
            child = User(
                name="Niño", email="nino@example.com",
                password_hash=bcrypt.hash("nino123"), role="child",
                caregiver_id=2
            )
            db.add_all([admin, caregiver, child]); db.commit()

        if not db.query(Provider).first():
            p1 = Provider(type="LLM", vendor="openai", config={"model":"gpt-4o-mini"})
            p2 = Provider(type="STT", vendor="deepgram", config={"lang":"es-419"})
            p3 = Provider(type="TTS", vendor="azure", config={"voice":"es-MX-DaliaNeural"})
            db.add_all([p1,p2,p3]); db.commit()

        if not db.query(Agent).first():
            ag = Agent(
                name="Agente Demo",
                description="Demo de agente",
                model="gpt-4o-mini",
                temperature=0.6,
                llm_provider_id=1, stt_provider_id=2, tts_provider_id=3,
                active=True, system_prompt="Eres un asistente amable en español."
            )
            db.add(ag); db.commit()
    finally:
        db.close()

# Rutas
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(providers_router)
app.include_router(agents_router)

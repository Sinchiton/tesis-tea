from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
import jwt, os
from .db import get_db
from .models import User
from .schemas import UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])
JWT_SECRET = os.getenv("JWT_SECRET", "devsecret-change")

def make_token(user: User) -> str:
    # token simple (solo para dev)
    return jwt.encode({"sub": str(user.id), "role": user.role}, JWT_SECRET, algorithm="HS256")

@router.post("/register")
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email ya registrado")
    u = User(
        name=payload.name,
        email=payload.email,
        password_hash=bcrypt.hash(payload.password),
        role=payload.role,
        caregiver_id=payload.caregiver_id
    )
    db.add(u); db.commit(); db.refresh(u)
    token = make_token(u)
    return {"access": token, "id": u.id}

@router.post("/login")
def login(body: dict, db: Session = Depends(get_db)):
    email = body.get("email"); password = body.get("password")
    u = db.query(User).filter(User.email == email).first()
    if not u or not bcrypt.verify(password or "", u.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = make_token(u)
    return {"access": token, "id": u.id, "role": u.role, "name": u.name}

from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os, shutil
from ..db import get_db
from ..models import User
from ..schemas import UserCreate, UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.get("")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.asc()).all()
    return {"data": [UserOut.model_validate(u).model_dump() for u in users]}

@router.post("")
def create_user(body: UserCreate, db: Session = Depends(get_db)):
    u = User(
        name=body.name, email=body.email, role=body.role,
        password_hash="$2b$12$mockmockmockmockmockmockmockmockmockmockmo",  # dummy
        caregiver_id=body.caregiver_id
    )
    db.add(u); db.commit(); db.refresh(u)
    return {"ok": True, "id": u.id}

@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(User).get(user_id)
    if not u: return {"detail": "not found"}, 404
    return {"data": UserOut.model_validate(u).model_dump()}

@router.put("/{user_id}")
def update_user(user_id: int, body: dict, db: Session = Depends(get_db)):
    u = db.query(User).get(user_id)
    if not u: return {"detail": "not found"}, 404
    for k in ["name","email","role","caregiver_id","photo_url"]:
        if k in body: setattr(u, k, body[k])
    db.commit(); db.refresh(u)
    return {"data": UserOut.model_validate(u).model_dump()}

# Subida de foto local: guarda en /app/uploads y devuelve URL pública /uploads/<filename>
@router.post("/{user_id}/photo")
def upload_photo(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    os.makedirs("/app/uploads", exist_ok=True)
    ext = (file.filename or "jpg").split(".")[-1].lower()
    filename = f"user_{user_id}.{ext}"
    dest = f"/app/uploads/{filename}"
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    # URL servida por StaticFiles
    url = f"/uploads/{filename}"
    u = db.query(User).get(user_id)
    if u:
        u.photo_url = url
        db.commit()
    return {"url": url}

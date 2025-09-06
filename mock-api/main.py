# mock-api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime
import hashlib

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# --------- MODELOS ---------
Role = Literal["admin","therapist","caregiver","child"]

class RegisterIn(BaseModel):
    name:str; email:str; password:str; role:Role="caregiver"

class LoginIn(BaseModel):
    email:str; password:str

class UserOut(BaseModel):
    id:int; org_id:int; name:str; email:str; role:Role
    caregiver_id: Optional[int]=None
    created_at:str

class ProfileIn(BaseModel):
    luz:int; ruido:int; crowd:int; duracion:int; complejidad:int

class ProfileOut(ProfileIn):
    id:int; user_id:int; created_at:str

class Turn(BaseModel):
    role:str; text:str; at:str

class ConversationOut(BaseModel):
    id:int; user_id:int; agent_id:int; started_at:str; ended_at:Optional[str]=None
    turns: List[Turn]

# --------- "DB" EN MEMORIA ---------
ORG_ID = 1
USERS: List[UserOut] = []
PASSWORDS = {}  # email -> sha256
PROFILES: List[ProfileOut] = []
CONVERSATIONS: List[ConversationOut] = []

user_id = 1
prof_id = 1
conv_id = 1

def sha(s:str)->str: return hashlib.sha256(s.encode()).hexdigest()

# --------- AUTH ----------
@app.post("/auth/register")
def register(body: RegisterIn):
    global user_id
    # no duplicados
    if any(u.email.lower()==body.email.lower() for u in USERS):
        raise HTTPException(409, "Email ya registrado")
    item = UserOut(id=user_id, org_id=ORG_ID, name=body.name, email=body.email,
                   role=body.role, created_at=datetime.utcnow().isoformat()+"Z")
    USERS.append(item)
    PASSWORDS[body.email.lower()] = sha(body.password)
    user_id += 1
    # devuelve token de acceso mock
    return {"access": f"mock-token-{item.id}", "id": item.id}

@app.post("/auth/login")
def login(body: LoginIn):
    pwd = PASSWORDS.get(body.email.lower())
    if not pwd or pwd != sha(body.password):
        raise HTTPException(401, "Credenciales inválidas")
    # token mock
    uid = next(u.id for u in USERS if u.email.lower()==body.email.lower())
    return {"access": f"mock-token-{uid}"}

# --------- USERS ----------
@app.get("/users")
def list_users(role: Optional[Role] = None):
    data = USERS
    if role: data = [u for u in USERS if u.role == role]
    return {"data": data}

@app.post("/users")
def create_user(body: dict):
    global user_id
    name = body.get("name",""); email = body.get("email","")
    password = body.get("password",""); role = body.get("role","caregiver")
    if any(u.email.lower()==email.lower() for u in USERS):
        raise HTTPException(409, "Email ya registrado")
    item = UserOut(id=user_id, org_id=ORG_ID, name=name, email=email,
                   role=role, created_at=datetime.utcnow().isoformat()+"Z")
    USERS.append(item)
    if password: PASSWORDS[email.lower()] = sha(password)
    user_id += 1
    return {"ok": True, "id": item.id}

@app.get("/users/{uid}")
def get_user(uid:int):
    for u in USERS:
        if u.id == uid: return {"data": u}
    raise HTTPException(404, "no existe")

@app.put("/users/{uid}")
def update_user(uid:int, body: dict):
    for i,u in enumerate(USERS):
        if u.id == uid:
            USERS[i] = u.copy(update={"caregiver_id": body.get("caregiver_id")})
            return {"ok": True}
    raise HTTPException(404, "no existe")

# --------- PROFILES ----------
@app.get("/profiles/{user_id}")
def get_profile(user_id:int):
    for p in PROFILES:
        if p.user_id == user_id: return {"data": p}
    return {"data": None}

@app.post("/profiles/{user_id}")
def upsert_profile(user_id:int, p: ProfileIn):
    global prof_id
    for i,x in enumerate(PROFILES):
        if x.user_id == user_id:
            PROFILES[i] = ProfileOut(id=x.id, user_id=user_id, created_at=x.created_at, **p.dict())
            return {"ok": True, "id": x.id}
    item = ProfileOut(id=prof_id, user_id=user_id, created_at=datetime.utcnow().isoformat()+"Z", **p.dict())
    PROFILES.append(item); prof_id += 1
    return {"ok": True, "id": item.id}

# --------- CONVERSATIONS ----------
@app.get("/conversations")
def list_conversations(userId:int):
    return {"data": [c for c in CONVERSATIONS if c.user_id == userId]}

@app.post("/conversations/ingest")
def ingest(conv: dict):
    global conv_id
    now = datetime.utcnow().isoformat()+"Z"
    item = ConversationOut(id=conv_id, user_id=conv["user_id"], agent_id=conv["agent_id"],
                           started_at=now, ended_at=now, turns=conv.get("turns",[]))
    CONVERSATIONS.append(item); conv_id += 1
    return {"ok": True, "id": item.id}

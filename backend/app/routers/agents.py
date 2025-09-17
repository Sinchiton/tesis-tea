from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Agent
from ..schemas import AgentCreate, AgentUpdate, AgentOut

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("")
def list_agents(db: Session = Depends(get_db)):
    items = db.query(Agent).order_by(Agent.id.asc()).all()
    return {"data": [AgentOut.model_validate(a).model_dump() for a in items]}

@router.post("")
def create_agent(body: AgentCreate, db: Session = Depends(get_db)):
    a = Agent(**body.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return {"ok": True, "id": a.id}

@router.get("/{agent_id}")
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    a = db.query(Agent).get(agent_id)
    if not a: return {"detail":"not found"}, 404
    return {"data": AgentOut.model_validate(a).model_dump()}

@router.put("/{agent_id}")
def update_agent(agent_id: int, body: AgentUpdate, db: Session = Depends(get_db)):
    a = db.query(Agent).get(agent_id)
    if not a: return {"detail":"not found"}, 404
    data = body.model_dump(exclude_unset=True)
    for k,v in data.items():
        setattr(a, k, v)
    db.commit(); db.refresh(a)
    return {"data": AgentOut.model_validate(a).model_dump()}

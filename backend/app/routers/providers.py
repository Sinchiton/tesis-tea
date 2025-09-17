from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import Provider
from ..schemas import ProviderCreate, ProviderOut

router = APIRouter(prefix="/providers", tags=["providers"])

@router.get("")
def list_providers(db: Session = Depends(get_db)):
    items = db.query(Provider).order_by(Provider.id.asc()).all()
    return {"data": [ProviderOut.model_validate(p).model_dump() for p in items]}

@router.post("")
def create_provider(body: ProviderCreate, db: Session = Depends(get_db)):
    p = Provider(
        type=body.type, vendor=body.vendor, config=body.config or None,
        api_key_enc=body.api_key or None
    )
    db.add(p); db.commit(); db.refresh(p)
    return {"ok": True, "id": p.id}

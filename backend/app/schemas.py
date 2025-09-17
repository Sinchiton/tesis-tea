from pydantic import BaseModel, Field
from typing import Optional, Any

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "caregiver"
    caregiver_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    org_id: Optional[int] = None
    name: str
    email: str
    role: str
    caregiver_id: Optional[int] = None
    photo_url: Optional[str] = None
    class Config: from_attributes = True

class ProviderCreate(BaseModel):
    type: str
    vendor: str
    config: Optional[dict] = None
    api_key: Optional[str] = None

class ProviderOut(BaseModel):
    id: int
    org_id: Optional[int] = None
    type: str
    vendor: str
    config: Optional[dict] = None
    class Config: from_attributes = True

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    active: Optional[bool] = True
    system_prompt: Optional[str] = "Eres un asistente amable en español."
    model: str = "gpt-4o-mini"
    temperature: Optional[float] = 0.6
    llm_provider_id: Optional[int] = None
    stt_provider_id: Optional[int] = None
    tts_provider_id: Optional[int] = None

class AgentUpdate(AgentCreate):
    stt_stream: Optional[bool] = True
    llm_stream: Optional[bool] = False
    tts_stream: Optional[bool] = True
    input_sample_rate: Optional[int] = 16000
    output_sample_rate: Optional[int] = 24000
    output_format: Optional[str] = "mp3"
    endpointing_ms: Optional[int] = 400
    max_turns: Optional[int] = 50
    max_duration_s: Optional[int] = 900
    memory_mode: Optional[str] = "short"
    moderation: Optional[bool] = False
    store_transcript: Optional[bool] = True
    stt_fallback_id: Optional[int] = None
    llm_fallback_id: Optional[int] = None
    tts_fallback_id: Optional[int] = None

class AgentOut(BaseModel):
    id: int
    org_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    active: Optional[bool] = True
    system_prompt: Optional[str] = None
    model: str
    temperature: Optional[float] = 0.6
    llm_provider_id: Optional[int] = None
    stt_provider_id: Optional[int] = None
    tts_provider_id: Optional[int] = None
    class Config: from_attributes = True

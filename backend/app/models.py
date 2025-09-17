from sqlalchemy import Column, BigInteger, Integer, String, Boolean, ForeignKey, Text, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from .db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True)
    org_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(32), default="caregiver")  # superadmin/admin/therapist/caregiver/child
    caregiver_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=True)
    photo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Provider(Base):
    __tablename__ = "providers"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True)
    org_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    type: Mapped[str] = mapped_column(String(8))  # STT | LLM | TTS
    vendor: Mapped[str] = mapped_column(String(64))
    config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    api_key_enc: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Agent(Base):
    __tablename__ = "agents"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, index=True)
    org_id: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    system_prompt: Mapped[str | None] = mapped_column(Text)
    model: Mapped[str] = mapped_column(String(128))
    temperature: Mapped[float | None] = mapped_column()

    llm_provider_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))
    stt_provider_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))
    tts_provider_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))

    stt_stream: Mapped[bool | None] = mapped_column(Boolean, default=True)
    llm_stream: Mapped[bool | None] = mapped_column(Boolean, default=False)
    tts_stream: Mapped[bool | None] = mapped_column(Boolean, default=True)
    input_sample_rate: Mapped[int | None] = mapped_column(Integer)
    output_sample_rate: Mapped[int | None] = mapped_column(Integer)
    output_format: Mapped[str | None] = mapped_column(String(8))
    endpointing_ms: Mapped[int | None] = mapped_column(Integer)

    max_turns: Mapped[int | None] = mapped_column(Integer)
    max_duration_s: Mapped[int | None] = mapped_column(Integer)
    memory_mode: Mapped[str | None] = mapped_column(String(16))
    moderation: Mapped[bool | None] = mapped_column(Boolean, default=False)
    store_transcript: Mapped[bool | None] = mapped_column(Boolean, default=True)

    stt_fallback_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))
    llm_fallback_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))
    tts_fallback_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("providers.id"))

    created_at: Mapped[str] = mapped_column(DateTime(timezone=True), server_default=func.now())

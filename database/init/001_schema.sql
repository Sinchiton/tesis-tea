-- ==========================================================
-- DB: TEA – Esquema base
-- Ejecutado automáticamente por Postgres al iniciar el contenedor
-- Coloca este archivo en: database/init/001_schema.sql
-- ==========================================================

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS citext;     -- emails case-insensitive
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- crypt(), gen_salt() para hashes dev

-- ========= Tipos =========
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
    CREATE TYPE role_enum AS ENUM ('superadmin','admin','therapist','caregiver','child');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_type_enum') THEN
    CREATE TYPE provider_type_enum AS ENUM ('LLM','STT','TTS');
  END IF;
END$$;

-- ========= Organizaciones =========
CREATE TABLE IF NOT EXISTS organizations (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========= Roles (tabla maestra para permisos) =========
-- NOTA: el nombre del rol se alinea con role_enum
CREATE TABLE IF NOT EXISTS roles (
  name          role_enum PRIMARY KEY,
  description   TEXT
);

-- ========= Permisos granulares =========
CREATE TABLE IF NOT EXISTS permissions (
  id            BIGSERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,     -- p.e. 'providers.read'
  description   TEXT
);

-- ========= Relación rol-permiso =========
CREATE TABLE IF NOT EXISTS role_permissions (
  role_name     role_enum NOT NULL REFERENCES roles(name) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_name, permission_id)
);

-- ========= Usuarios =========
CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  org_id        BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         CITEXT NOT NULL UNIQUE,
  password_hash TEXT,                              -- en dev: crypt('pass', gen_salt('bf'))
  role          role_enum NOT NULL,
  caregiver_id  BIGINT NULL REFERENCES users(id) ON DELETE SET NULL, -- si es niño, responsable
  photo_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========= Proveedores (STT/LLM/TTS) =========
CREATE TABLE IF NOT EXISTS providers (
  id            BIGSERIAL PRIMARY KEY,
  org_id        BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type          provider_type_enum NOT NULL,
  vendor        TEXT NOT NULL,           -- 'openai','google','aws','deepgram','local', etc.
  config        JSONB,                   -- parámetros públicos (region, model, voice, etc.)
  api_key_enc   TEXT,                    -- opcional: cifrado en backend
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_providers_org ON providers(org_id);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers(type);

-- ========= Agentes conversacionales =========
CREATE TABLE IF NOT EXISTS agents (
  id                 BIGSERIAL PRIMARY KEY,
  org_id             BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  description        TEXT,
  model              TEXT NOT NULL,      -- modelo del LLM (p.e. gpt-4o-mini)
  temperature        NUMERIC(3,2) DEFAULT 0.7,
  voice              TEXT,               -- voz TTS (p.e. 'es-MX-CamilaNeural')
  active             BOOLEAN NOT NULL DEFAULT TRUE,

  llm_provider_id    BIGINT REFERENCES providers(id) ON DELETE SET NULL,
  stt_provider_id    BIGINT REFERENCES providers(id) ON DELETE SET NULL,
  tts_provider_id    BIGINT REFERENCES providers(id) ON DELETE SET NULL,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agents_org ON agents(org_id);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(active);

-- ========= Perfiles sensoriales =========
CREATE TABLE IF NOT EXISTS sensory_profiles (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  luz           SMALLINT CHECK (luz BETWEEN 0 AND 5),
  ruido         SMALLINT CHECK (ruido BETWEEN 0 AND 5),
  crowd         SMALLINT CHECK (crowd BETWEEN 0 AND 5),
  duracion      INTEGER CHECK (duracion >= 0),
  complejidad   SMALLINT CHECK (complejidad BETWEEN 0 AND 5),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensory_user ON sensory_profiles(user_id);

-- ========= Conversaciones =========
CREATE TABLE IF NOT EXISTS conversations (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id      BIGINT NOT NULL REFERENCES agents(id) ON DELETE SET NULL,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_agent ON conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conv_started ON conversations(started_at);

-- ========= Turnos de conversación =========
CREATE TABLE IF NOT EXISTS conversation_turns (
  id               BIGSERIAL PRIMARY KEY,
  conversation_id  BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role             TEXT NOT NULL CHECK (role IN ('user','assistant')),
  text             TEXT NOT NULL,
  at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turns_conv ON conversation_turns(conversation_id, at);

-- ========= Vistas / Helpers opcionales =========
-- Vista simple para permisos por rol (útil para devolver al frontend)
CREATE OR REPLACE VIEW v_role_permissions AS
SELECT r.name AS role, p.code AS permission
FROM roles r
JOIN role_permissions rp ON rp.role_name = r.name
JOIN permissions p ON p.id = rp.permission_id;

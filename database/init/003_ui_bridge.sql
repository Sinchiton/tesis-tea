-- ==========================================================
-- 003_ui_bridge.sql  (mapea exactamente lo que pide tu UI)
-- ==========================================================

-- Perfil “fijo” del paciente (campos que muestras en /children y /child-dashboard)
CREATE TABLE IF NOT EXISTS patient_profiles (
  user_id        BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age            SMALLINT CHECK (age BETWEEN 0 AND 120),
  tea_level      TEXT NOT NULL,                 -- 'Nivel 1', 'Nivel 2', etc (lo formateas en front si quieres)
  avatar_url     TEXT,
  status         TEXT NOT NULL DEFAULT 'active' -- active | completed | pending | attention
);

-- Preferencias / config actual del paciente (lo que editas en “Configurar Escenario”)
CREATE TABLE IF NOT EXISTS patient_settings (
  user_id           BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  scenario          TEXT,            -- 'Aula Escolar', 'Biblioteca', etc
  favorite_activity TEXT,
  current_goal      TEXT,            -- “Mejorar iniciación de diálogo”
  personality       TEXT             -- texto libre de personalidad del agente para Unity/LLM
);

-- Plan de sesiones (target semanal que pintas en tarjetas)
CREATE TABLE IF NOT EXISTS patient_plans (
  user_id           BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  target_sessions   SMALLINT NOT NULL DEFAULT 3
);

-- Sesiones (agenda + ejecución); con esto calculas weeklyProgress, sessionsThisWeek, etc.
-- status: scheduled | started | completed | cancelled
CREATE TABLE IF NOT EXISTS sessions (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id      BIGINT NULL REFERENCES agents(id) ON DELETE SET NULL,
  scheduled_at  TIMESTAMPTZ,
  started_at    TIMESTAMPTZ,
  ended_at      TIMESTAMPTZ,
  status        TEXT NOT NULL CHECK (status IN ('scheduled','started','completed','cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_times ON sessions(scheduled_at, started_at, ended_at);

-- Helpers de tiempo (semana actual)
CREATE OR REPLACE FUNCTION week_start(ts timestamptz) RETURNS timestamptz
LANGUAGE sql IMMUTABLE AS $$
  SELECT date_trunc('week', ts AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'
$$;

-- Vista que devuelve exactamente el “shape” que piden tus tarjetas en /children
CREATE OR REPLACE VIEW v_patient_cards AS
WITH
  this_week AS (
    SELECT s.user_id,
           COUNT(*) FILTER (WHERE s.status='completed'
                            AND s.ended_at >= week_start(now())
                            AND s.ended_at <  week_start(now()) + INTERVAL '7 days') AS sessions_this_week,
           COUNT(*) FILTER (WHERE s.status='completed') AS total_sessions,
           MAX(s.ended_at) AS last_session_at,
           MIN(s.scheduled_at) FILTER (WHERE s.status='scheduled' AND s.scheduled_at >= now()) AS next_session_at
    FROM sessions s
    GROUP BY s.user_id
  )
SELECT
  u.id,
  u.name,
  pp.age,
  pp.tea_level,
  COALESCE(pp.avatar_url, '/placeholder.svg') AS avatar_url,
  COALESCE(ps.scenario, 'Aula Escolar') AS scenario,
  COALESCE(ps.favorite_activity, 'Conversación Social') AS favorite_activity,
  COALESCE(ps.current_goal, 'Objetivo no configurado') AS current_goal,
  COALESCE(pp.status, 'active') AS status,

  COALESCE(tw.sessions_this_week, 0) AS sessions_this_week,
  COALESCE(ppl.target_sessions, 3)  AS target_sessions,
  COALESCE(tw.total_sessions, 0)    AS total_sessions,

  -- progreso semanal básico: completadas esta semana / objetivo semanal
  GREATEST(
    0,
    LEAST(
      100,
      ROUND(100.0 * COALESCE(tw.sessions_this_week,0) / NULLIF(COALESCE(ppl.target_sessions,3),0))
    )
  )::INT AS weekly_progress,

  tw.last_session_at,
  tw.next_session_at
FROM users u
JOIN patient_profiles  pp  ON pp.user_id = u.id
LEFT JOIN patient_settings ps ON ps.user_id = u.id
LEFT JOIN patient_plans    ppl ON ppl.user_id = u.id
LEFT JOIN this_week        tw  ON tw.user_id = u.id
WHERE u.role = 'child';

-- Vista detalle para /child-dashboard/[id]
CREATE OR REPLACE VIEW v_patient_detail AS
SELECT
  c.*,
  -- strings "amigables" los generas en el front (ej. “Hace 2 horas”),
  -- aquí solo devolvemos timestamps
  last_session_at,
  next_session_at
FROM v_patient_cards c;

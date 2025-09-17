-- ==========================================================
-- DB: TEA – Datos iniciales (DEV / Demo)
-- Ejecutado automáticamente por Postgres al iniciar el contenedor
-- Coloca este archivo en: database/init/002_seed.sql
-- ==========================================================

-- ---------- Organización por defecto ----------
INSERT INTO organizations (id, name)
VALUES (1, 'Default Org')
ON CONFLICT (id) DO NOTHING;

-- ---------- Roles ----------
INSERT INTO roles (name, description) VALUES
  ('superadmin','Acceso total a toda la plataforma'),
  ('admin','Administra organización, usuarios y configuración'),
  ('therapist','Terapeuta: ve métricas y configura sesiones'),
  ('caregiver','Cuidador/tutor: ve progreso del niño'),
  ('child','Niño/usuario final del juego')
ON CONFLICT (name) DO NOTHING;

-- ---------- Permisos base ----------
-- Puedes ampliar esta lista según tu frontend (Can.tsx) y backend
INSERT INTO permissions (code, description) VALUES
  ('providers.read','Listar proveedores'),
  ('providers.write','Crear/editar/eliminar proveedores'),
  ('agents.read','Listar agentes'),
  ('agents.write','Crear/editar/eliminar agentes'),
  ('users.read','Listar/consultar usuarios'),
  ('users.write','Crear/editar/eliminar usuarios'),
  ('conversations.read','Ver historial de conversaciones'),
  ('conversations.write','Crear registros de conversación'),
  ('stats.read','Ver paneles y métricas')
ON CONFLICT (code) DO NOTHING;

-- ---------- Asignación de permisos por rol ----------
-- superadmin: todos
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'superadmin', p.id FROM permissions p
ON CONFLICT DO NOTHING;

-- admin
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'admin', p.id
FROM permissions p
WHERE p.code IN (
  'providers.read','providers.write',
  'agents.read','agents.write',
  'users.read','users.write',
  'conversations.read','stats.read'
)
ON CONFLICT DO NOTHING;

-- therapist
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'therapist', p.id
FROM permissions p
WHERE p.code IN (
  'agents.read',
  'conversations.read',
  'stats.read'
)
ON CONFLICT DO NOTHING;

-- caregiver
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'caregiver', p.id
FROM permissions p
WHERE p.code IN (
  'conversations.read',
  'stats.read'
)
ON CONFLICT DO NOTHING;

-- child (normalmente sin permisos de administración)
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'child', p.id
FROM permissions p
WHERE p.code IN ('conversations.read')
ON CONFLICT DO NOTHING;

-- ---------- Usuarios de ejemplo ----------
-- superadmin (password: admin123) – solo para dev
INSERT INTO users (org_id, name, email, password_hash, role)
VALUES (
  1, 'Super Admin', 'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  'superadmin'
)
ON CONFLICT (email) DO NOTHING;

-- caregiver de ejemplo
INSERT INTO users (org_id, name, email, password_hash, role)
VALUES (
  1, 'Carmen López', 'cuidador@example.com',
  crypt('cuidador123', gen_salt('bf')),
  'caregiver'
)
ON CONFLICT (email) DO NOTHING;

-- niño asignado al cuidador
INSERT INTO users (org_id, name, email, role, caregiver_id, photo_url)
VALUES (1, 'Ana García', 'ana@example.com', 'child',
        (SELECT id FROM users WHERE email='cuidador@example.com'),
        '/uploads/children/ana.jpg')
ON CONFLICT (email) DO NOTHING;

-- perfil sensorial del niño
INSERT INTO sensory_profiles (user_id, luz, ruido, crowd, duracion, complejidad)
SELECT u.id, 2, 3, 2, 600, 2
FROM users u WHERE u.email='ana@example.com'
ON CONFLICT DO NOTHING;

-- ---------- Proveedores demo ----------
-- LLM (OpenAI)
INSERT INTO providers (org_id, type, vendor, config)
VALUES (1, 'LLM', 'openai', '{"model":"gpt-4o-mini"}')
RETURNING id INTO TEMP TABLE t_llm_id;

-- STT (Deepgram)
INSERT INTO providers (org_id, type, vendor, config)
VALUES (1, 'STT', 'deepgram', '{"model":"nova-2-general","language":"es"}')
RETURNING id INTO TEMP TABLE t_stt_id;

-- TTS (Azure)
INSERT INTO providers (org_id, type, vendor, config)
VALUES (1, 'TTS', 'azure', '{"voice":"es-MX-DaliaNeural","region":"eastus"}')
RETURNING id INTO TEMP TABLE t_tts_id;

-- ---------- Agente demo (vinculado a los 3 proveedores) ----------
INSERT INTO agents (org_id, name, description, model, temperature, voice,
                    active, llm_provider_id, stt_provider_id, tts_provider_id)
VALUES (
  1,
  'Maestra Paciente',
  'Educativa, comprensiva y estructurada. Lenguaje simple y refuerzo positivo.',
  'gpt-4o-mini',
  0.6,
  'es-MX-DaliaNeural',
  TRUE,
  (SELECT id FROM t_llm_id),
  (SELECT id FROM t_stt_id),
  (SELECT id FROM t_tts_id)
);

-- ---------- Conversación de ejemplo ----------
-- sesión
INSERT INTO conversations (user_id, agent_id)
SELECT
  (SELECT id FROM users WHERE email='ana@example.com'),
  (SELECT id FROM agents WHERE name='Maestra Paciente');

-- turnos
INSERT INTO conversation_turns (conversation_id, role, text, at)
SELECT c.id, 'user', 'Hola, me siento nerviosa hoy.', NOW()
FROM conversations c
JOIN users u ON u.id = c.user_id
WHERE u.email='ana@example.com'
ORDER BY c.id DESC LIMIT 1;

INSERT INTO conversation_turns (conversation_id, role, text, at)
SELECT c.id, 'assistant', 'Gracias por contarlo. Vamos a respirar juntas y lo tomamos con calma.', NOW()
FROM conversations c
JOIN users u ON u.id = c.user_id
WHERE u.email='ana@example.com'
ORDER BY c.id DESC LIMIT 1;

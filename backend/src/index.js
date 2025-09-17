import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Postgres (usa tu .env / compose)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "postgres"}@${process.env.DB_HOST || "db"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "tea"}`,
});

// ---------- Helpers ----------
function toFriendlyTime(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `Hoy ${d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  }
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function mapCardRow(r) {
  return {
    id: r.id,
    name: r.name,
    age: r.age,
    teaLevel: r.tea_level,
    avatar: r.avatar_url,
    scenario: r.scenario,
    lastSessionAt: r.last_session_at,    // ISO
    nextSessionAt: r.next_session_at,    // ISO
    // strings amigables (para no tocar el front de momento)
    lastSession: toFriendlyTime(r.last_session_at) ?? "—",
    nextSession: toFriendlyTime(r.next_session_at) ?? "Pendiente",
    weeklyProgress: r.weekly_progress ?? 0,
    sessionsThisWeek: r.sessions_this_week ?? 0,
    targetSessions: r.target_sessions ?? 0,
    totalSessions: r.total_sessions ?? 0,
    favoriteActivity: r.favorite_activity,
    currentGoal: r.current_goal,
    status: r.status || "active",
  };
}

// ---------- Endpoints mínimos ----------

// Auth (mock)
app.post("/auth/login", async (req, res) => {
  // aquí validarías usuario real; devolvemos mock
  return res.json({ access: "dev-token", user: { id: 1, name: "Dr. Demo", role: "therapist" } });
});

// Patients list (usa vista v_patient_cards)
app.get("/patients", async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM v_patient_cards ORDER BY id`);
  return res.json({ data: rows.map(mapCardRow) });
});

// Patient detail (usa vista v_patient_detail)
app.get("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(`SELECT * FROM v_patient_detail WHERE id = $1`, [id]);
  if (!rows.length) return res.status(404).json({ detail: "Paciente no encontrado" });
  return res.json({ data: mapCardRow(rows[0]) });
});

// Guardar configuración de escenario/persona del agente para un paciente
app.patch("/patients/:id/settings", async (req, res) => {
  const { id } = req.params;
  const { scenario, favoriteActivity, currentGoal, personality } = req.body || {};
  await pool.query(
    `INSERT INTO patient_settings(user_id, scenario, favorite_activity, current_goal, personality)
     VALUES($1,$2,$3,$4,$5)
     ON CONFLICT (user_id) DO UPDATE
       SET scenario = EXCLUDED.scenario,
           favorite_activity = EXCLUDED.favorite_activity,
           current_goal = EXCLUDED.current_goal,
           personality = EXCLUDED.personality`,
    [id, scenario, favoriteActivity, currentGoal, personality]
  );
  return res.json({ ok: true });
});

// Programar una sesión
app.post("/patients/:id/sessions", async (req, res) => {
  const { id } = req.params;
  const { scheduledAt, agentId } = req.body || {};
  const { rows } = await pool.query(
    `INSERT INTO sessions(user_id, agent_id, scheduled_at, status)
     VALUES($1,$2,$3,'scheduled') RETURNING id`,
    [id, agentId || null, scheduledAt]
  );
  return res.json({ ok: true, id: rows[0].id });
});

// Providers para selects (semilla previa)
app.get("/providers", async (req, res) => {
  const { type } = req.query; // LLM | STT | TTS
  const sql = type ? `SELECT * FROM providers WHERE type = $1 ORDER BY id` : `SELECT * FROM providers ORDER BY id`;
  const params = type ? [type] : [];
  const { rows } = await pool.query(sql, params);
  return res.json({ data: rows });
});

// Agents CRUD (básico)
app.get("/agents", async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM agents ORDER BY id`);
  return res.json({ data: rows });
});

app.post("/agents", async (req, res) => {
  const { name, description, model, temperature, voice, active, llmProviderId, sttProviderId, ttsProviderId } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO agents (name, description, model, temperature, voice, is_active, llm_provider_id, stt_provider_id, tts_provider_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [name, description, model, temperature, voice, !!active, llmProviderId, sttProviderId, ttsProviderId]
  );
  return res.json({ ok: true, id: rows[0].id });
});

app.patch("/agents/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, model, temperature, voice, active } = req.body;
  await pool.query(
    `UPDATE agents SET
       name = COALESCE($2,name),
       description = COALESCE($3,description),
       model = COALESCE($4,model),
       temperature = COALESCE($5,temperature),
       voice = COALESCE($6,voice),
       is_active = COALESCE($7,is_active)
     WHERE id = $1`,
    [id, name, description, model, temperature, voice, active]
  );
  return res.json({ ok: true });
});

app.delete("/agents/:id", async (req, res) => {
  await pool.query(`DELETE FROM agents WHERE id = $1`, [req.params.id]);
  return res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));

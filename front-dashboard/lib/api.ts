import type { Patient, Agent, Scenario, Conversation, SessionSchedule } from "@/types/database"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Patients API
export async function getPatients(caregiverId: string): Promise<Patient[]> {
  const response = await fetch(`${API_BASE_URL}/patients?caregiverId=${caregiverId}`)
  if (!response.ok) throw new Error("Failed to fetch patients")
  return response.json()
}

export async function getPatient(id: string): Promise<Patient> {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`)
  if (!response.ok) throw new Error("Failed to fetch patient")
  return response.json()
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update patient")
  return response.json()
}

// Agents API
export async function getAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/agents`)
  if (!response.ok) throw new Error("Failed to fetch agents")
  return response.json()
}

export async function createAgent(data: Omit<Agent, "id" | "createdAt" | "totalSessions">): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create agent")
  return response.json()
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update agent")
  return response.json()
}

// Scenarios API
export async function getScenarios(): Promise<Scenario[]> {
  const response = await fetch(`${API_BASE_URL}/scenarios`)
  if (!response.ok) throw new Error("Failed to fetch scenarios")
  return response.json()
}

export async function createScenario(data: Omit<Scenario, "id" | "createdAt" | "updatedAt">): Promise<Scenario> {
  const response = await fetch(`${API_BASE_URL}/scenarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create scenario")
  return response.json()
}

// Conversations API
export async function getConversations(patientId?: string, limit?: number): Promise<Conversation[]> {
  const params = new URLSearchParams()
  if (patientId) params.append("patientId", patientId)
  if (limit) params.append("limit", limit.toString())

  const response = await fetch(`${API_BASE_URL}/conversations?${params}`)
  if (!response.ok) throw new Error("Failed to fetch conversations")
  return response.json()
}

// Sessions API
export async function getSessionSchedules(patientId: string): Promise<SessionSchedule[]> {
  const response = await fetch(`${API_BASE_URL}/sessions?patientId=${patientId}`)
  if (!response.ok) throw new Error("Failed to fetch session schedules")
  return response.json()
}

export async function createSessionSchedule(data: Omit<SessionSchedule, "id" | "createdAt">): Promise<SessionSchedule> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create session schedule")
  return response.json()
}

// Metrics API
export async function getPatientMetrics(patientId: string, timeRange = "6m") {
  const response = await fetch(`${API_BASE_URL}/metrics/patient/${patientId}?range=${timeRange}`)
  if (!response.ok) throw new Error("Failed to fetch patient metrics")
  return response.json()
}

export async function getGlobalMetrics(patientIds?: string[]) {
  const params = patientIds ? `?patients=${patientIds.join(",")}` : ""
  const response = await fetch(`${API_BASE_URL}/metrics/global${params}`)
  if (!response.ok) throw new Error("Failed to fetch global metrics")
  return response.json()
}

// Normaliza errores de Axios/FastAPI a string legible
export function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  const detail = data?.detail ?? data?.message ?? data?.error ?? err?.message ?? err;

  // FastAPI: detail puede ser string | objeto | array de objetos
  if (Array.isArray(detail)) {
    // Pydantic v2: items con {msg, loc, type, ...}
    return detail
      .map((d: any) => d?.msg || d?.message || JSON.stringify(d))
      .join("; ");
  }

  if (typeof detail === "object") {
    // Si trae msg, úsalo; si no, compáctalo
    if (detail?.msg) return String(detail.msg);
    try { return JSON.stringify(detail); } catch { return String(detail); }
  }

  return String(detail);
}

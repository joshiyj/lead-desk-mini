// client/src/api.js — API helper functions
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function submitLead(data) {
  const res = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json; // bubble up { message, errors } to the caller
  return json;
}

// Phase 4 — admin API calls (auth-gated)
// export async function getLeads(params = {}) { ... }
// export async function updateLeadStatus(id, status) { ... }

// Phase 5 — auth
// export async function login(credentials) { ... }

// client/src/api.js — API helper functions
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Public ────────────────────────────────────────────────────────────────
export async function submitLead(data) {
  const res = await fetch(`${BASE_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

// ── Admin (auth header) ───────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Redirect to login on 401 (token expired / missing)
async function adminFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
    return; // halt
  }
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function getLeads({ search = '', status = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);

  return adminFetch(`${BASE_URL}/api/leads?${params}`, {
    headers: authHeaders(),
  }); // resolves to { leads: [...] }
}

export async function updateLeadStatus(id, status) {
  return adminFetch(`${BASE_URL}/api/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  }); // resolves to { lead: {...} }
}

// ── Auth ───────────────────────────────────────────────────────────
export async function login({ username, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (!res.ok) throw json; // { message: 'Invalid credentials' }
  return json; // { token }
}

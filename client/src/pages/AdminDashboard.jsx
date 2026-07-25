// client/src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/SummaryCards';
import LeadTable from '../components/LeadTable';
import Footer from '../components/Footer';
import { getLeads } from '../api';
import './AdminDashboard.css';

const STATUS_FILTERS = ['', 'New', 'Contacted', 'Closed'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');

  // Debounce search so we don't fire on every keystroke
  const debounceRef = useRef(null);

  const fetchLeads = useCallback(async (q, s) => {
    setLoading(true);
    setError('');
    try {
      const { leads: data } = await getLeads({ search: q, status: s });
      setLeads(data);
    } catch (err) {
      setError(err?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLeads('', '');
  }, [fetchLeads]);

  // Re-fetch on search change (debounced 350 ms)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchLeads(val, status), 350);
  };

  // Re-fetch on status filter change (immediate)
  const handleStatusChange = (s) => {
    setStatus(s);
    fetchLeads(search, s);
  };

  // Called by LeadTable after a status PATCH to keep local state in sync
  const handleLeadUpdate = (updated) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === updated._id ? updated : l)),
    );
  };

  return (
    <div className="light-dashboard-layout">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="light-dashboard-header">
        <div className="light-dashboard-header-inner">
          <div className="dashboard-brand">
            <div className="dashboard-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="4" height="10" rx="1.5" fill="white" />
                <rect x="10" y="7" width="4" height="14" rx="1.5" fill="white" />
                <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
              </svg>
            </div>
            <div>
              <h1 className="dashboard-brand-title">
                <span className="brand-lead">Lead</span>
                <span className="brand-desk">Desk</span>
              </h1>
              <p className="dashboard-subtitle">Admin Dashboard</p>
            </div>
          </div>

          {/* Logout */}
          <button
            id="logout-btn"
            className="light-logout-btn"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/admin/login', { replace: true });
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      <main className="light-dashboard-main">
        {/* ── Summary cards ──────────────────────────────────────────────── */}
        <SummaryCards leads={leads} />

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <div className="light-toolbar">
          <div className="light-search-wrap">
            <svg className="light-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="lead-search"
              type="search"
              className="light-search-input"
              placeholder="Search by name, email or message..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search leads"
            />
          </div>

          <div className="light-status-filters" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s || 'all'}
                id={`filter-${s || 'all'}`}
                className={`light-filter-btn${status === s ? ' light-filter-btn--active' : ''}`}
                onClick={() => handleStatusChange(s)}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error banner ───────────────────────────────────────────────── */}
        {error && (
          <div className="light-error-banner" role="alert">
            ⚠️ {error}
            <button onClick={() => fetchLeads(search, status)} className="light-retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* ── Lead table ─────────────────────────────────────────────────── */}
        <LeadTable
          leads={leads}
          loading={loading}
          onUpdate={handleLeadUpdate}
        />
      </main>

      <Footer />
    </div>
  );
}

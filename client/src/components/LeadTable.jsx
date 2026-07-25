// client/src/components/LeadTable.jsx
import toast from 'react-hot-toast';
import { updateLeadStatus } from '../api';
import './LeadTable.css';

const STATUS_OPTS = ['New', 'Contacted', 'Closed'];

const BADGE_CLASS = {
  New:       'light-badge light-badge--blue',
  Contacted: 'light-badge light-badge--amber',
  Closed:    'light-badge light-badge--green',
};

function formatDate(iso) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function StatusSelect({ lead, onUpdate }) {
  const handleChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const { lead: updated } = await updateLeadStatus(lead._id, newStatus);
      onUpdate(updated);
      toast.success(`Status → ${updated.status}`);
    } catch (err) {
      toast.error(err?.message || 'Could not update status');
    }
  };

  return (
    <div className="select-wrapper">
      <select
        className="light-status-select"
        value={lead.status}
        onChange={handleChange}
        aria-label={`Change status for ${lead.name}`}
      >
        {STATUS_OPTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <svg className="select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

export default function LeadTable({ leads, loading, onUpdate }) {
  // ── Loading state ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="light-table-card">
        <div className="table-state">
          <div className="table-spinner" aria-label="Loading leads…">
            <span className="spinner-ring" />
            <p>Loading leads…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────
  if (!leads.length) {
    return (
      <div className="light-table-card">
        <div className="table-state">
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">📋</div>
            <h3>No leads found</h3>
            <p>No lead submissions match your search or filter criteria.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Table ─────────────────────────────────────────────────────────────
  return (
    <div className="light-table-card">
      <div className="table-wrapper">
        <table className="light-lead-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>BUDGET</th>
              <th>MESSAGE</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td className="td-name">{lead.name}</td>
                <td>
                  <a href={`mailto:${lead.email}`} className="light-email-link">
                    {lead.email}
                  </a>
                </td>
                <td>
                  <span className="light-budget-pill">{lead.budgetRange}</span>
                </td>
                <td className="td-message">{lead.message}</td>
                <td className="td-date">{formatDate(lead.createdAt)}</td>
                <td>
                  <div className="light-status-cell">
                    <span className={BADGE_CLASS[lead.status]}>{lead.status}</span>
                    <StatusSelect lead={lead} onUpdate={onUpdate} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

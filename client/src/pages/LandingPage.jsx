// client/src/pages/LandingPage.jsx
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="light-landing-layout">
      {/* Ambient background glow blobs */}
      <div className="landing-bg-blob blob-top-left" />
      <div className="landing-bg-blob blob-bottom-right" />

      {/* ── Top Header Brand ────────────────────────────────────────── */}
      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="4" height="10" rx="1.5" fill="white" />
              <rect x="10" y="7" width="4" height="14" rx="1.5" fill="white" />
              <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
            </svg>
          </div>
          <span className="landing-brand-title">
            <span className="brand-lead">Lead</span>
            <span className="brand-desk">Desk</span>
          </span>
        </div>
      </header>

      {/* ── Hero Main Content ────────────────────────────────────────── */}
      <main className="landing-main">
        {/* Left Column: Hero Text & Stats */}
        <div className="hero-content">
          <div className="hero-badge">
            <span>🚀 Let's build something great</span>
          </div>

          <h1 className="hero-title">
            Turn your vision <br />
            into <span className="hero-gradient">reality</span>
          </h1>

          <p className="hero-subtitle">
            Tell us about your project and our team will reach out
            within 24 hours. No commitment, just a conversation.
          </p>

          {/* Stat Cards Row */}
          <div className="hero-stats">
            <div className="stat-pill">
              <div className="stat-icon-box icon-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-num">48h</span>
                <span className="stat-label">AVG RESPONSE</span>
              </div>
            </div>

            <div className="stat-pill">
              <div className="stat-icon-box icon-green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 11 11 13 15 9" />
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-num">100%</span>
                <span className="stat-label">FREE CONSULT</span>
              </div>
            </div>

            <div className="stat-pill">
              <div className="stat-icon-box icon-blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <div className="stat-text">
                <span className="stat-num">NDA</span>
                <span className="stat-label">ON REQUEST</span>
              </div>
            </div>
          </div>

          {/* Decorative Dot Grid */}
          <div className="hero-dot-grid">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="dot" />
            ))}
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="form-card" aria-label="Contact form">
          <div className="form-card-header">
            <div className="form-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h2 className="form-card-title">Start Your Project</h2>
              <p className="form-card-subtitle">Fill in your details and we'll take it from here.</p>
            </div>
          </div>
          <LeadForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

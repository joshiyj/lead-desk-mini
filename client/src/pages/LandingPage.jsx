// client/src/pages/LandingPage.jsx
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-layout">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <main className="landing-main">
        <div className="hero-content">
          <div className="hero-badge">🚀 Let's build something great</div>

          <h1 className="hero-title">
            Turn your vision into
            <span className="hero-gradient"> reality</span>
          </h1>

          <p className="hero-subtitle">
            Tell us about your project and our team will reach out within 24 hours.
            No commitment, just a conversation.
          </p>

          {/* Decorative stat pills */}
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-num">48h</span>
              <span className="stat-label">Avg response</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">100%</span>
              <span className="stat-label">Free consult</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">NDA</span>
              <span className="stat-label">On request</span>
            </div>
          </div>
        </div>

        {/* ── Form card ──────────────────────────────────────────────────── */}
        <div className="form-card" aria-label="Contact form">
          <div className="form-card-header">
            <h2 className="form-card-title">Start Your Project</h2>
            <p className="form-card-subtitle">Fill in your details and we'll take it from here.</p>
          </div>
          <LeadForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2236',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1a2236' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1a2236' } },
        }}
      />

      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin"          element={<AdminDashboard />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

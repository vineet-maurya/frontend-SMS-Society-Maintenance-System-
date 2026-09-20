import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Users, UserCog, ChevronRight, ArrowLeft } from 'lucide-react';
import "../allcss/signup.css";
import "../allcss/roleselect.css";

// Standalone by design: this page doesn't yet feed into the Signup form's
// own submission logic (auth.controller.js still decides the real role
// server-side). If a parent supplies onContinue, it's called with the
// clicked role; otherwise this falls back to navigating straight to the
// existing Signup form (/signup/details) with the role in router state —
// same prop pattern as SignupPage's onSignup / LoginPage's onLogin.
const ROLE_OPTIONS = [
  {
    value: 'user',
    title: 'Resident User',
    description: 'Pay maintenance, view digital receipts, and get payment reminders.',
    icon: Users,
  },
  {
    value: 'admin',
    title: 'Admin User',
    description: 'Manage residents, track collections, and configure society settings.',
    icon: UserCog,
  },
];

export default function RoleSelectPage({ onContinue }) {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (onContinue) {
      onContinue(role);
    } else {
      navigate('/signup/details', { state: { role } });
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-back" onClick={() => navigate('/')}>
        <ArrowLeft size={14} /> Back to Home
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="auth-logo-text">ROYAL AVENUE</div>
            <div className="auth-logo-sub">Society Manager</div>
          </div>
        </div>

        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Choose how you'll be using Royal Avenue.</p>

        <div className="role-options">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                type="button"
                key={option.value}
                className="role-option"
                onClick={() => handleSelect(option.value)}
                aria-label={`${option.title} — ${option.description}`}
              >
                <div className="role-option-icon">
                  <Icon size={20} />
                </div>
                <div className="role-option-text">
                  <div className="role-option-title">{option.title}</div>
                  <div className="role-option-desc">{option.description}</div>
                </div>
                <ChevronRight size={18} className="role-option-arrow" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
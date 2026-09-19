import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Users, UserCog, Check, ArrowLeft } from 'lucide-react';
import "../allcss/signup.css";
import "../allcss/roleselect.css";

// Standalone by design: this page doesn't yet feed into the Signup form
// (that wiring is a separate step). If a parent supplies onContinue, it's
// called with the chosen role; otherwise this falls back to navigating to
// /signup with the role in router state, same prop pattern as
// SignupPage's onSignup / LoginPage's onLogin.
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
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    if (onContinue) {
      onContinue(selectedRole);
    } else {
      navigate('/signup', { state: { role: selectedRole } });
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
            const isSelected = selectedRole === option.value;
            return (
              <button
                type="button"
                key={option.value}
                className={`role-option${isSelected ? ' role-option-selected' : ''}`}
                onClick={() => setSelectedRole(option.value)}
                aria-pressed={isSelected}
              >
                <div className="role-option-icon">
                  <Icon size={20} />
                </div>
                <div className="role-option-text">
                  <div className="role-option-title">{option.title}</div>
                  <div className="role-option-desc">{option.description}</div>
                </div>
                <div className="role-option-check">
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="auth-submit-btn role-select-continue-btn"
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continue
        </button>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
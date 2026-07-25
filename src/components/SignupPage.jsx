import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import '../allcss/Signup.css';

export default function SignupPage({ onSignup }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    societyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.societyName.trim()) next.societyName = 'Society name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(form.phone)) next.phone = 'Enter a valid 10 digit phone number';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (onSignup) {
        await onSignup(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Signup failed. Please try again.' });
    } finally {
      setSubmitting(false);
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
            <div className="auth-logo-text">AURA-SMS</div>
            <div className="auth-logo-sub">Society Manager</div>
          </div>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Set up digital maintenance collection for your society in minutes.</p>

        {errors.form && <div className="auth-error-banner">{errors.form}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="auth-input"
              placeholder="Aarav Sharma"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="auth-field-error">{errors.fullName}</span>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Society Name</label>
            <input
              type="text"
              name="societyName"
              className="auth-input"
              placeholder="Green Glen Heights"
              value={form.societyName}
              onChange={handleChange}
            />
            {errors.societyName && <span className="auth-field-error">{errors.societyName}</span>}
          </div>

          <div className="auth-row">
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="auth-input"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="auth-field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="auth-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="auth-input-icon-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="auth-input"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

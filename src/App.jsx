import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import LandingPage from './components/LandingPage.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import Residents from './components/Residents.jsx';
import Payments from './components/Payments.jsx';
import Reminders from './components/Reminders.jsx';
import Settings from './components/Settings.jsx';
import Signup from './components/SignupPage.jsx';
import Login from './components/LoginPage.jsx';
 
// Points at the Express/MongoDB Atlas backend.
// Set VITE_API_URL in a .env file at the frontend root to override in production.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
 
const api = axios.create({ baseURL: API_BASE });
 
// Mongoose documents come back with `_id`; the existing components (written
// against the old localStorage shape) expect `.id`. This keeps every other
// component unchanged by normalizing the field on the way in.
const withId = (doc) => (doc ? { ...doc, id: doc._id } : doc);
const withIds = (docs) => (Array.isArray(docs) ? docs.map(withId) : []);
 
const TOKEN_KEY = 'sms_token';
 
// NOTE: <BrowserRouter> already wraps <App /> in main.jsx — do NOT add
// another one here. Nesting two Routers causes broken/inconsistent navigation.
function App() {
  const navigate = useNavigate();
 
  // ---- Auth state ----
  // Kept in React state (not just localStorage) so the app re-renders
  // immediately after login/logout instead of needing a full page reload.
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
 
  // Keep axios + localStorage in sync with token state
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);
 
  // On first load, if a token already exists (page refresh), verify it's
  // still valid and restore the logged-in user.
  useEffect(() => {
    (async () => {
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setCurrentUser(res.data.data);
      } catch (err) {
        // token expired/invalid — clear it
        setToken(null);
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // null = "not loaded yet" so Layout never renders with undefined settings
  const [settings, setSettings] = useState(null);
  const [residents, setResidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
 
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };
 
  // Single source of truth: re-fetch everything from the API. Called after
  // login and after every mutation, so the UI is always in sync with what's
  // actually stored in MongoDB Atlas.
  const refreshData = useCallback(async () => {
    const [settingsRes, residentsRes, paymentsRes] = await Promise.all([
      api.get('/settings'),
      api.get('/residents'),
      api.get('/payments'),
    ]);
    setSettings(settingsRes.data.data);
    setResidents(withIds(residentsRes.data.data));
    setPayments(withIds(paymentsRes.data.data));
  }, []);
 
  // Only fetch app data once we actually know who's logged in — calling
  // these endpoints before login just throws 401s, since they're all
  // behind `protect` on the backend now.
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        setDataLoading(true);
        setLoadError(null);
        await refreshData();
      } catch (err) {
        console.error('Failed to load data from backend:', err);
        setLoadError(
          err.response?.data?.message ||
            'Could not reach the backend API. Is the server running on ' + API_BASE + '?'
        );
      } finally {
        setDataLoading(false);
      }
    })();
  }, [currentUser, refreshData]);
 
  // ---- Auth actions ----
  const handleSignup = async (formData) => {
    const res = await api.post('/auth/signup', formData);
    const { user, token: newToken } = res.data.data;
    setToken(newToken);
    setCurrentUser(user);
    showToast(`Welcome, ${user.fullName}!`, 'success');
    navigate('/dashboard');
  };
 
  const handleLogin = async (formData) => {
    const res = await api.post('/auth/login', formData);
    const { user, token: newToken } = res.data.data;
    setToken(newToken);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.fullName}!`, 'success');
    navigate('/dashboard');
  };
 
  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setSettings(null);
    setResidents([]);
    setPayments([]);
    navigate('/');
  };
 
  const handleOpenApp = () => {
    navigate(currentUser ? '/dashboard' : '/login');
  };
 
  const handleSaveSettings = async (newSettings) => {
    try {
      await api.put('/settings', newSettings);
      await refreshData();
      showToast('Settings saved successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings', 'error');
    }
  };
 
  const handleAddResident = async (newRes) => {
    try {
      await api.post('/residents', {
        name: newRes.name,
        flat: newRes.flat,
        phone: newRes.phone,
        status: newRes.status,
      });
      await refreshData();
      showToast('Resident added successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add resident', 'error');
    }
  };
 
  const handleDeleteResident = async (id) => {
    try {
      await api.delete(`/residents/${id}`);
      await refreshData();
      showToast('Resident deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete resident', 'error');
    }
  };
 
  const handleMarkPaid = async (residentId, method, txnId) => {
    try {
      await api.post(`/residents/${residentId}/mark-paid`, { method, txnId });
      await refreshData();
      showToast('Payment recorded successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to record payment', 'error');
    }
  };
 
  const handleResetDatabase = async () => {
    try {
      await api.post('/settings/reset');
      await refreshData();
      showToast('Database reset to demo data', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reset database', 'error');
    }
  };
 
  // Passed to pages (e.g. Dashboard's "View All" button) instead of the old
  // setActiveTab('residents') — now navigates to the matching route.
  const goToTab = (tab) => navigate(`/${tab}`);
 
  // ---- Route guard ----
  function RequireAuth({ children }) {
    if (!authChecked) return null; // don't flash a redirect during initial token check
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  }
 
  // ---- Initial auth check (runs once on app load) ----
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        Loading AURA-SMS...
      </div>
    );
  }
 
  return (
    <Routes>
      {/* Public routes — no auth required */}
      <Route path="/" element={<LandingPage onOpen={handleOpenApp} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
 
      {/* App shell: sidebar/header/toasts persist via <Outlet /> in Layout,
          shared across every nested child route below. Gated by RequireAuth
          so all five pages need a valid login. */}
      <Route
        element={
          <RequireAuth>
            <Layout
              settings={settings}
              residents={residents}
              toasts={toasts}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </RequireAuth>
        }
      >
        {dataLoading || !settings ? (
          <Route
            path="*"
            element={
              <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
                {loadError ? (
                  <>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Couldn't load your data</div>
                    <div style={{ color: 'var(--text-muted, #9ca3af)', fontSize: 13 }}>{loadError}</div>
                  </>
                ) : (
                  'Loading your dashboard...'
                )}
              </div>
            }
          />
        ) : (
          <>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  residents={residents}
                  payments={payments}
                  settings={settings}
                  setActiveTab={goToTab}
                />
              }
            />
            <Route
              path="/residents"
              element={
                <Residents
                  residents={residents}
                  payments={payments}
                  settings={settings}
                  onAddResident={handleAddResident}
                  onDeleteResident={handleDeleteResident}
                  onMarkPaid={handleMarkPaid}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="/payments"
              element={<Payments payments={payments} settings={settings} showToast={showToast} />}
            />
            <Route
              path="/reminders"
              element={<Reminders residents={residents} settings={settings} showToast={showToast} />}
            />
            <Route
              path="/settings"
              element={
                <Settings
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  onResetDatabase={handleResetDatabase}
                  residents={residents}
                  payments={payments}
                  showToast={showToast}
                />
              }
            />
          </>
        )}
      </Route>
 
      {/* Fallback: unknown routes go back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
 
export default App;
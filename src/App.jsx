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

// NOTE: <BrowserRouter> already wraps <App /> in main.jsx — do NOT add
// another one here. Nesting two Routers causes broken/inconsistent navigation.
function App() {
  const navigate = useNavigate();

  // null = "not loaded yet" so Layout never renders with undefined settings
  const [settings, setSettings] = useState(null);
  const [residents, setResidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Single source of truth: re-fetch everything from the API. Called on
  // mount and after every mutation, so the UI is always in sync with what's
  // actually stored in MongoDB Atlas (no separate localStorage to drift out
  // of sync with).
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        await refreshData();
      } catch (err) {
        console.error('Failed to load data from backend:', err);
        setLoadError(
          err.response?.data?.message ||
            'Could not reach the backend API. Is the server running on ' + API_BASE + '?'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshData]);

  const handleOpenApp = () => {
    navigate('/dashboard');
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

  // ---- Initial load / connection states ----
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
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

  if (loadError) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: 'white',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 700 }}>Couldn't connect to the backend</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted, #9ca3af)', maxWidth: '420px' }}>
          {loadError}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#6366f1',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage onOpen={handleOpenApp} />} />

      {/* App shell: sidebar/header/toasts persist via <Outlet /> in Layout,
          shared across every nested child route below */}
      <Route
        element={<Layout settings={settings} residents={residents} toasts={toasts} />}
      >
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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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
      </Route>

      {/* Fallback: unknown routes go back to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

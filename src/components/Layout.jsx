import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import "../allcss/Layout.css";

// Maps the current route path to the header title/subtitle text
// (this used to be getPageTitle()/getPageSubtitle() in the old tab-based App.jsx)
const PAGE_META = {
  '/dashboard': {
    title: 'Dashboard Overview',
    subtitle: 'Real-time metrics, collection targets, and recent payment logs',
  },
  '/residents': {
    title: 'Residents Directory',
    subtitle: 'Manage apartment owners, record payments, view digital receipts, and share UPI QR codes',
  },
  '/payments': {
    title: 'Payments Ledger',
    subtitle: 'Complete historical audit trail of maintenance collections grouped by month',
  },
  '/reminders': {
    title: 'Unpaid Reminders',
    subtitle: 'Pre-filled WhatsApp and SMS links to request payments without door-to-door visits',
  },
  '/settings': {
    title: 'System Settings',
    subtitle: 'Configure monthly maintenance pricing, society profile details, and trigger data CSV backups',
  },
};

function Layout({ settings, residents, toasts }) {
  const location = useLocation();
  const navigate = useNavigate();

  const meta = PAGE_META[location.pathname] || {
    title: 'Society Maintenance System',
    subtitle: '',
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="back-to-home" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back to Home
        </div>

        <div className="logo-container">
          <div className="logo-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="logo-text">AURA-SMS</div>
            <div className="logo-sub">Society Manager</div>
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/residents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> <span>Residents</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/payments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Receipt size={18} /> <span>Payments Ledger</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/reminders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> <span>Reminders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <SettingsIcon size={18} /> <span>Settings</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="sidebar-footer-title">{settings.societyName}</div>
          <div className="sidebar-footer-subtitle">
            ₹{settings.monthlyAmount}/month • {residents.length} units
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-title-section">
            <h1>{meta.title}</h1>
            <p>{meta.subtitle}</p>
          </div>
          <div className="header-actions">
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
              Ledger Period:{' '}
              <strong style={{ color: 'white' }}>
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </strong>
            </div>
          </div>
        </header>

        {/* This is where Dashboard/Residents/Payments/Reminders/Settings render,
            based on whichever child <Route> matched in App.jsx */}
        <Outlet />
      </main>

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${
              toast.type === 'error' ? 'toast-error' : toast.type === 'info' ? 'toast-info' : 'toast-success'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Layout;
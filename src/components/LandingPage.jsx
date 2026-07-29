import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import "../allcss/LandingPage.css";
import {
  Building2,
  Users,
  Smartphone,
  QrCode,
  MessageSquare,
  FileText,
  ShieldCheck,
  X,
  Check,
  AlertTriangle,
  Clock,
  Banknote,
  Phone,
  Download,
  Star,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function LandingPage({ onOpen }) {

  const navigate = useNavigate();
 

  // Animate stat numbers
  const statsRef = useRef(null);

  const problems = [
    {
      icon: <Clock size={18} />,
      title: "Chasing residents door-to-door",
      desc: "You spend weekends running flat to flat just to collect what is already owed to you.",
    },
    {
      icon: <Banknote size={18} />,
      title: "Counting cash and keeping notes",
      desc: "Paper registers get lost, totals are miscounted, and disputes arise with no proof.",
    },
    {
      icon: <Phone size={18} />,
      title: "No record of who paid what",
      desc: "When a resident denies payment, there is zero digital trail to verify the truth.",
    },
    {
      icon: <AlertTriangle size={18} />,
      title: "Reminder calls no one answers",
      desc: "Phone reminders feel intrusive. Most are ignored. Follow-ups take more time than collecting.",
    },
    {
      icon: <FileText size={18} />,
      title: "The treasurer is the only one who knows",
      desc: "If the secretary is unavailable, everything stalls. No backup, no transparency.",
    },
    {
      icon: <X size={18} />,
      title: "No receipts means no trust",
      desc: "Residents want proof of payment. Without a receipt, friction builds every month.",
    },
  ];

  const features = [
    {
      icon: <Users size={20} />,
      title: "Resident directory",
      desc: "Add all flats once. Search instantly by name or house number, see status at a glance.",
    },
    {
      icon: <Smartphone size={20} />,
      title: "Mark & log payments",
      desc: "Record UPI or cash with one tap. Transaction ID stored automatically as proof.",
    },
    {
      icon: <QrCode size={20} />,
      title: "Instant payment tracking",
      desc: "Generate a UPI QR per resident in seconds. Share it via WhatsApp for instant collection.",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "One-click WhatsApp reminders",
      desc: "Pre-filled message with your UPI ID. Send to unpaid residents without typing a word.",
    },
    {
      icon: <FileText size={20} />,
      title: "Digital receipts",
      desc: "Auto-generated, printable receipts replace paper signatures for every payment.",
    },
    {
      icon: <Download size={20} />,
      title: "CSV export anytime",
      desc: "Full payment ledger downloadable in one click. Share with your committee in seconds.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Overdue auto-detection",
      desc: "Residents who miss the month are flagged overdue automatically at month rollover.",
    },
    {
      icon: <Building2 size={20} />,
      title: "UPI as a service",
      desc: "One society UPI ID handles all payment methods — BHIM, GPay, PhonePe, Paytm.",
    },
    {
      icon: <Zap size={20} />,
      title: "Zero setup required",
      desc: "No app to install for residents. Everything runs in your browser and works offline.",
    },
  ];

  const steps = [
    {
      title: "Set up your UPI ID once",
      desc: "Enter your society name, monthly maintenance amount, and UPI ID in Settings. Done in 2 minutes.",
      badge: "2 min setup",
    },
    {
      title: "Add your residents",
      desc: "Enter each flat owner's name, house number, and phone. Bulk-friendly — takes under 5 minutes for 50 flats.",
      badge: "One time",
    },
    {
      title: "Share payment link via WhatsApp",
      desc: 'Tap any resident\'s "Share UPI" to auto-generate a QR code and payment link. Forward it directly in WhatsApp.',
      badge: "10 seconds per resident",
    },
    {
      title: "Record payment when it arrives",
      desc: "When payment is confirmed in your UPI app, mark it received. A digital receipt is auto-generated.",
      badge: "3 taps",
    },
    {
      title: "Send reminders for non-payers",
      desc: "Go to the Reminders tab. See who hasn't paid. Send a pre-filled WhatsApp or SMS with one click — no typing.",
      badge: "1 click per reminder",
    },
  ];

  const compareOld = [
    "Walk door-to-door for collection",
    "Carry cash, count manually",
    "Maintain a paper register",
    "No receipts — disputes happen",
    "Cannot tell who paid without calling",
    "Reminders take an hour of calls",
    "Data is lost when treasurer changes",
  ];

  const compareNew = [
    "Residents pay from their couch via UPI",
    "Payments land directly in your account",
    "Auto-updated digital ledger, always accurate",
    "Instant digital receipt for every payment",
    "Dashboard shows paid / pending at a glance",
    "Send all reminders in under 60 seconds",
    "All data persists in browser storage securely",
  ];

  const testimonials = [
    {
      name: "Meera Nair",
      role: "Secretary, Sunrise Residency",
      quote:
        '"I used to spend my entire Sunday chasing payments. Now I send reminders on Friday and everything is done by Saturday. It\'s changed my weekends completely."',
    },
    {
      name: "Suresh Iyer",
      role: "Treasurer, Palm Grove Apartments",
      quote:
        '"The digital receipts alone were worth it. No more arguments about whether someone paid. The system has proof with date, time, and transaction ID."',
    },
    {
      name: "Priyanka Roy",
      role: "RWA Head, Arbour Heights",
      quote:
        '"Setup took less than 10 minutes. The WhatsApp reminder feature is genius — residents actually pay faster now because it\'s so easy for them."',
    },
  ];

  return (
    <div className="landing-root">
      {/* Top Banner */}
      <div className="lp-banner">
        ✦ Free during our early access — no credit card required ✦
      </div>

      {/* Navbar */}
      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <div className="lp-nav-logo-icon">
            <ShieldCheck size={18} />
          </div>
          AURA-SMS
        </div>

        <div className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">How it works</a>
          <a href="#compare">Compare</a>
          <a href="#testimonials">Reviews</a>
        </div>

        <div className="lp-nav-cta">
          <button className="lp-btn lp-btn-ghost"
            onClick={() => navigate('/signup')}>
            Sign up
          </button>
          <button className="lp-btn lp-btn-ghost"
            onClick={() => navigate('/login')}>
            Login
          </button>
          {/* <button className="lp-btn lp-btn-green" 
            onClick={() => navigate('/dashboard')}>
            Open Dashboard →
          </button> */}
        </div>
      </nav>

      {/* Hero */}
      <div className="lp-hero">
        <div className="lp-section-label">✦ SOCIETY MAINTENANCE MANAGER</div>
        <h1>
          Maintenance collection,
          <br />
          finally digital
        </h1>
        <p className="lp-hero-sub">
          Stop using UPI manually with payment screenshots and WhatsApp
          messages. Finally, a smarter system for every housing society like
          yours.
        </p>
        <div className="lp-hero-btns">
          <button className="lp-btn lp-btn-green lp-btn-lg"
            onClick={() => navigate('/login')}>
            Open Dashboard
          </button>
          <a href="#workflow" className="lp-btn lp-btn-ghost lp-btn-lg">
            See how it works
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="lp-stats-bar">
        <div className="lp-stat-item">
          <div className="lp-stat-number">100+</div>
          <div className="lp-stat-label">Societies using it</div>
        </div>
        <div className="lp-stat-item">
          <div className="lp-stat-number">0</div>
          <div className="lp-stat-label">Setup cost</div>
        </div>
        <div className="lp-stat-item">
          <div className="lp-stat-number">5 min</div>
          <div className="lp-stat-label">To first collection</div>
        </div>
        <div className="lp-stat-item">
          <div className="lp-stat-number">100%</div>
          <div className="lp-stat-label">Browser-based, no install</div>
        </div>
      </div>

      {/* Problems Section */}
      <div className="lp-problems-bg">
        <div className="lp-section">
          <div className="lp-section-label">THE PROBLEM</div>
          <h2>Problems with manual collection</h2>
          <p className="lp-section-subtitle">
            If you are managing maintenance manually, you already know these
            pain points — every single month.
          </p>
          <div className="lp-problems-grid">
            {problems.map((p, i) => (
              <div key={i} className="lp-problem-card">
                <div className="lp-problem-icon">{p.icon}</div>
                <div className="lp-problem-title">{p.title}</div>
                <div className="lp-problem-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features">
        <div className="lp-section">
          <div className="lp-section-label">SOLUTION</div>
          <h2>Everything your society needs</h2>
          <p className="lp-section-subtitle">
            Built specifically for housing societies in India. Every feature is
            designed around how you actually collect maintenance.
          </p>
          <div className="lp-features-grid">
            {features.map((f, i) => (
              <div key={i} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      <div
        id="workflow"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="lp-section">
          <div className="lp-section-label">HOW IT WORKS</div>
          <h2>Your new monthly workflow</h2>
          <p className="lp-section-subtitle">
            Five simple steps. Repeatable every month. No confusion for the next
            secretary either.
          </p>
          <div className="lp-workflow-steps">
            {steps.map((s, i) => (
              <div key={i} className="lp-workflow-step">
                <div className="lp-step-number">{i + 1}</div>
                <div className="lp-step-content">
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-desc">{s.desc}</div>
                </div>
                <div className="lp-step-badge">{s.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPI Section */}
      <div className="lp-upi-section">
        <div className="lp-upi-inner">
          <div className="lp-upi-text">
            <div className="lp-section-label">ONE UPI ID</div>
            <h2>One UPI ID: every payment method</h2>
            <p>
              Add your society's UPI ID once and it works for all apps — Google
              Pay, PhonePe, Paytm, BHIM, and any other UPI app your residents
              prefer. No separate accounts needed.
            </p>
            <div className="lp-upi-badges">
              {["Google Pay", "PhonePe", "Paytm", "BHIM", "Any UPI App"].map(
                (m) => (
                  <span key={m} className="lp-upi-badge">
                    {m}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="lp-upi-card">
            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Society UPI ID
            </div>
            <div className="lp-upi-id-display">royalavenue@upi</div>
            <div
              style={{
                fontSize: "12px",
                color: "#4b5563",
                marginBottom: "16px",
              }}
            >
              Scan QR or pay using this ID directly
            </div>
            <div
              style={{
                background: "white",
                width: "120px",
                height: "120px",
                margin: "0 auto 16px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,1fr)",
                  gap: "2px",
                  padding: "10px",
                }}
              >
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "8px",
                      height: "8px",
                      background: [
                        0, 1, 2, 5, 6, 7, 9, 10, 11, 12, 14, 16, 18, 21, 24, 27,
                        30, 33, 36, 37, 38, 39, 41, 42, 43, 44, 45, 47, 48,
                      ].includes(i)
                        ? "#111"
                        : "transparent",
                      borderRadius: "1px",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="lp-upi-methods">
              {["GPay", "PhonePe", "Paytm", "BHIM"].map((m) => (
                <span key={m} className="lp-upi-method">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div id="compare">
        <div className="lp-section">
          <div className="lp-section-label">SEE THE DIFFERENCE</div>
          <h2>See the difference</h2>
          <p className="lp-section-subtitle">
            You already know which side you're on right now. Here's what
            switching looks like.
          </p>
          <div className="lp-compare-grid">
            <div className="lp-compare-card lp-compare-old">
              <div className="lp-compare-heading">
                <X size={18} /> Old method
              </div>
              <div className="lp-compare-list">
                {compareOld.map((item, i) => (
                  <div key={i} className="lp-compare-item">
                    <div className="lp-compare-dot-red">✕</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-compare-card lp-compare-new">
              <div className="lp-compare-heading">
                <Check size={18} /> With AURA-SMS
              </div>
              <div className="lp-compare-list">
                {compareNew.map((item, i) => (
                  <div key={i} className="lp-compare-item">
                    <div className="lp-compare-dot-green">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div
        id="testimonials"
        style={{
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="lp-section">
          <div className="lp-section-label">COMMITTEE LEADERS</div>
          <h2>What residents are saying</h2>
          <p className="lp-section-subtitle">
            From secretaries who were collecting with pen and paper last month.
          </p>
          <div className="lp-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="lp-testimonial-card">
                <div className="lp-testimonial-stars">{"★★★★★"}</div>
                <div className="lp-testimonial-name">{t.name}</div>
                <div className="lp-testimonial-role">{t.role}</div>
                <div className="lp-testimonial-quote">{t.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="lp-final-cta">
        <div className="lp-section-label">GET STARTED TODAY</div>
        <h2>
          Ready to modernise
          <br />
          your society?
        </h2>
        <p>
          Sign up during our early access and get the full system completely
          free. No installation required, works instantly in your browser.
        </p>
        <div className="lp-final-cta-btns">
          <button className="lp-btn lp-btn-green lp-btn-lg"
            onClick={() => navigate('/login')}>
            Open maintenance app →
          </button>
          <a href="#workflow" className="lp-btn lp-btn-outline-green lp-btn-lg">
            Read how it works
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "40px 60px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="lp-footer">
          <div className="lp-footer-left">
            <strong style={{ color: "#e5e7eb" }}>AURA-SMS</strong> — Society
            Maintenance Manager &nbsp;·&nbsp; © 2026 All rights reserved.
          </div>
          <div className="lp-footer-links">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#compare">Compare</a>
            <a href="#testimonials">Reviews</a>
          </div>
        </div>
      </div>
    </div>
  );
}

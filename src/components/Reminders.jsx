import React, { useState } from 'react';
import { Send, Phone, MessageSquare, Edit2, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import "../allcss/Reminders.css";

export default function Reminders({ residents, settings, showToast }) {
  const unpaidResidents = residents.filter(r => r.status === 'pending' || r.status === 'overdue');
  
  // Custom message template with placeholders
  const [template, setTemplate] = useState(
    "Hi {name} (Flat {flat}), this is a friendly reminder to pay the monthly maintenance of ₹{amount} for {society}. Please transfer via UPI to our UPI ID: {upi}. Thank you!"
  );
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [tempTemplate, setTempTemplate] = useState(template);

  const saveTemplate = () => {
    setTemplate(tempTemplate);
    setIsEditingTemplate(false);
    showToast('Reminder template updated!', 'success');
  };

  // Helper to compile placeholders
  const compileMessage = (resident) => {
    return template
      .replace('{name}', resident.name)
      .replace('{flat}', resident.flat)
      .replace('{amount}', settings.monthlyAmount)
      .replace('{society}', settings.societyName)
      .replace('{upi}', settings.upiId);
  };

  const handleWhatsApp = (resident) => {
    const message = compileMessage(resident);
    const whatsappUrl = `https://wa.me/91${resident.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast(`WhatsApp reminder initialized for Flat ${resident.flat}`, 'success');
  };

  const handleSMS = (resident) => {
    const message = compileMessage(resident);
    // Standard SMS URL protocol
    const smsUrl = `sms:+91${resident.phone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
    showToast(`SMS reminder initialized for Flat ${resident.flat}`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Message Template Editor Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '2px' }}>
              Reminder Message Template
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Customize the message sent to residents. Use placeholders: <code>{`{name}`}</code>, <code>{`{flat}`}</code>, <code>{`{amount}`}</code>, <code>{`{society}`}</code>, <code>{`{upi}`}</code>
            </p>
          </div>
          {!isEditingTemplate ? (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => {
                setTempTemplate(template);
                setIsEditingTemplate(true);
              }}
            >
              <Edit2 size={13} style={{ marginRight: '4px' }} /> Edit Template
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setIsEditingTemplate(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--success)' }}
                onClick={saveTemplate}
              >
                <Check size={13} style={{ marginRight: '4px' }} /> Save
              </button>
            </div>
          )}
        </div>

        {isEditingTemplate ? (
          <textarea
            className="form-control"
            style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
            value={tempTemplate}
            onChange={(e) => setTempTemplate(e.target.value)}
          />
        ) : (
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-normal)', borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>
            {template}
          </div>
        )}
      </div>

      {/* Unpaid Residents List */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-normal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
            Unpaid Residents ({unpaidResidents.length})
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="badge badge-pending">
              {unpaidResidents.filter(r => r.status === 'pending').length} Pending
            </span>
            <span className="badge badge-overdue">
              {unpaidResidents.filter(r => r.status === 'overdue').length} Overdue
            </span>
          </div>
        </div>

        {unpaidResidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '18px', color: 'var(--success)', fontWeight: '700', marginBottom: '8px' }}>
              ✓ All Clear!
            </div>
            100% of residents have cleared their maintenance for this month.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>House No</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Status</th>
                  <th>Amount Due</th>
                  <th style={{ textAlign: 'right' }}>Send One-Click Reminder</th>
                </tr>
              </thead>
              <tbody>
                {unpaidResidents.map(resident => (
                  <tr key={resident.id}>
                    <td style={{ fontWeight: '700', color: 'white' }}>
                      {resident.flat}
                    </td>
                    <td>
                      <div className="table-avatar-info">
                        <div className="table-avatar" style={{ background: resident.status === 'overdue' ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.2))' : 'inherit' }}>
                          {resident.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="table-name">{resident.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>+91 {resident.phone}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${resident.status}`}>
                        {resident.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'white' }}>
                      ₹{settings.monthlyAmount}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-whatsapp"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                          onClick={() => handleWhatsApp(resident)}
                        >
                          <MessageSquare size={14} /> WhatsApp
                        </button>
                        <button 
                          className="btn btn-sms"
                          style={{ padding: '8px 14px', fontSize: '12px' }}
                          onClick={() => handleSMS(resident)}
                        >
                          <Phone size={14} /> SMS
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

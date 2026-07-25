import React, { useState } from 'react';
import { Save, Download, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import "../allcss/Settings.css"

export default function Settings({ settings, onSaveSettings, onResetDatabase, residents, payments, showToast }) {
  const [societyName, setSocietyName] = useState(settings.societyName);
  const [monthlyAmount, setMonthlyAmount] = useState(settings.monthlyAmount);
  const [upiId, setUpiId] = useState(settings.upiId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!societyName.trim() || !upiId.trim() || monthlyAmount <= 0) {
      showToast('Please enter valid settings values', 'error');
      return;
    }
    onSaveSettings({
      societyName: societyName.trim(),
      monthlyAmount: Number(monthlyAmount),
      upiId: upiId.trim()
    });
    showToast('Society settings updated successfully!', 'success');
  };

  // CSV Generator Helper
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportResidents = () => {
    const headers = ['Resident ID', 'Name', 'Flat No', 'Mobile No', 'Payment Status'];
    const rows = residents.map(r => [r.id, r.name, r.flat, r.phone, r.status]);
    downloadCSV(`${settings.societyName.toLowerCase().replace(/\s+/g, '_')}_residents.csv`, headers, rows);
    showToast('Residents list exported successfully!', 'success');
  };

  const handleExportPayments = () => {
    const headers = ['Payment ID', 'Resident Name', 'Flat No', 'Amount (INR)', 'Payment Date', 'Method', 'Transaction ID', 'Period Month'];
    const rows = payments.map(p => [
      p.id, 
      p.residentName, 
      p.flat, 
      p.amount, 
      new Date(p.date).toLocaleString('en-IN'), 
      p.method, 
      p.txnId, 
      p.month
    ]);
    downloadCSV(`${settings.societyName.toLowerCase().replace(/\s+/g, '_')}_payments.csv`, headers, rows);
    showToast('Payments database exported successfully!', 'success');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Society Settings Form */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
          Society Profile Settings
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Society Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Green Glen Heights Co-Op Society" 
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Monthly Maintenance Amount (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 2000" 
                min="100"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Society UPI ID for Payments</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. greenglen@upi" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Save size={18} /> Save Settings Config
            </button>
          </div>
        </form>
      </div>

      {/* Backup and Maintenance Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* CSV Export Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
            Data Backup & Exports
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Export all residents database configurations and financial payments history ledgers into portable offline CSV sheets.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            <button className="btn btn-secondary" onClick={handleExportResidents} style={{ justifyContent: 'flex-start' }}>
              <Download size={16} /> Export Residents Directory
            </button>
            <button className="btn btn-secondary" onClick={handleExportPayments} style={{ justifyContent: 'flex-start' }}>
              <Download size={16} /> Export Ledger Transactions
            </button>
          </div>
        </div>

        {/* Database Reset Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid rgba(239, 68, 68, 0.15)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldAlert size={18} /> Danger Zone
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            Resetting the database clears custom modifications and restores the original setup with mock default items.
          </p>

          <button 
            className="btn btn-danger"
            style={{ width: '100%', marginTop: '6px' }}
            onClick={() => {
              if (window.confirm("CRITICAL WARNING: This will delete all current updates and restore the system to default mock data. Proceed?")) {
                onResetDatabase();
                showToast("System database restored to demo default!", "success");
              }
            }}
          >
            <RefreshCw size={16} /> Reset to Demo Database
          </button>
        </div>
      </div>

    </div>
  );
}

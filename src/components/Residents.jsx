import React, { useState } from 'react';
import { Search, Plus, Trash2, CheckCircle, Receipt, Share2, X, Check, Copy, QrCode, AlertCircle } from 'lucide-react';
import "../allcss/Residents.css"
export default function Residents({ residents, payments, settings, onAddResident, onDeleteResident, onMarkPaid, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals Control
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  // Form States
  const [newResident, setNewResident] = useState({ name: '', flat: '', phone: '', status: 'pending' });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [txnId, setTxnId] = useState('');

  // Search & Filter Logic
  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || resident.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Action: Add Resident
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newResident.name || !newResident.flat || !newResident.phone) {
      showToast('Please fill all fields', 'error');
      return;
    }
    onAddResident(newResident);
    setNewResident({ name: '', flat: '', phone: '', status: 'pending' });
    setShowAddModal(false);
    showToast('Resident added successfully!', 'success');
  };

  // Action: Mark Paid
  const handleMarkPaidSubmit = (e) => {
    e.preventDefault();
    if (!txnId.trim()) {
      showToast('Please enter a Transaction ID', 'error');
      return;
    }
    onMarkPaid(selectedResident.id, paymentMethod, txnId);
    setShowMarkPaidModal(false);
    setTxnId('');
    showToast(`Payment of ₹${settings.monthlyAmount} recorded for Flat ${selectedResident.flat}`, 'success');
  };

  // Action: View Receipt
  const openReceipt = (resident) => {
    setSelectedResident(resident);
    setShowReceiptModal(true);
  };

  const getReceiptDetails = () => {
    if (!selectedResident) return null;
    // Find the latest payment for this month (or the last payment)
    const residentPayments = payments.filter(p => p.residentId === selectedResident.id);
    const latestPayment = residentPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    return {
      receiptNo: latestPayment ? `REC-${latestPayment.id.slice(-6).toUpperCase()}` : 'REC-PENDING',
      date: latestPayment ? new Date(latestPayment.date).toLocaleString('en-IN') : 'N/A',
      amount: latestPayment ? latestPayment.amount : settings.monthlyAmount,
      method: latestPayment ? latestPayment.method : 'N/A',
      txnId: latestPayment ? latestPayment.txnId : 'N/A',
      monthName: latestPayment ? new Date(latestPayment.date).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Current Month'
    };
  };

  // Action: Share UPI QR Code
  const openShareUPI = (resident) => {
    setSelectedResident(resident);
    setShowShareModal(true);
  };

  const upiUrl = selectedResident 
    ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.societyName)}&am=${settings.monthlyAmount}&cu=INR&tn=Maintenance%20Flat%20${selectedResident.flat}`
    : '';

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header controls */}
      <div className="glass-card search-filter-bar">
        {/* Search */}
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="form-control search-input" 
            placeholder="        Search by name or flat number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-tabs">
            {['all', 'paid', 'pending', 'overdue'].map((tab) => (
              <button
                key={tab}
                className={`filter-tab ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Resident
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
        {filteredResidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
            No residents found matching the criteria.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>House No</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Monthly Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td style={{ fontWeight: '700', color: 'white' }}>
                      {resident.flat}
                    </td>
                    <td>
                      <div className="table-avatar-info">
                        <div className="table-avatar">
                          {resident.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="table-name">{resident.name}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>+91 {resident.phone}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${resident.status}`}>
                        {resident.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {resident.status !== 'paid' ? (
                          <>
                            <button 
                              className="btn btn-success" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => {
                                setSelectedResident(resident);
                                setShowMarkPaidModal(true);
                              }}
                            >
                              <CheckCircle size={14} /> Record Payment
                            </button>
                            <button 
                              className="btn btn-secondary btn-icon-only"
                              title="Share UPI Details"
                              onClick={() => openShareUPI(resident)}
                            >
                              <Share2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--success)' }}
                            onClick={() => openReceipt(resident)}
                          >
                            <Receipt size={14} style={{ marginRight: '4px' }} /> View Receipt
                          </button>
                        )}
                        
                        <button 
                          className="btn btn-danger btn-icon-only"
                          title="Remove Resident"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${resident.name} (House No: ${resident.flat})?`)) {
                              onDeleteResident(resident.id);
                              showToast(`Removed ${resident.name}`, 'success');
                            }
                          }}
                        >
                          <Trash2 size={16} />
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

      {/* MODAL: ADD RESIDENT */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
              <X size={18} />
            </button>
            <h2 className="modal-title">
              <Plus size={20} style={{ color: 'var(--primary)' }} /> Add New Resident
            </h2>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Rahul Sharma" 
                  value={newResident.name}
                  onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">House Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. A-402" 
                    value={newResident.flat}
                    onChange={(e) => setNewResident({...newResident, flat: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    placeholder="10 digit number" 
                    pattern="[0-9]{10}"
                    value={newResident.phone}
                    onChange={(e) => setNewResident({...newResident, phone: e.target.value.replace(/\D/g, '')})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Current Payment Status</label>
                <select 
                  className="form-control form-select"
                  value={newResident.status}
                  onChange={(e) => setNewResident({...newResident, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid (Marked as Received)</option>
                </select>
              </div>

              {newResident.status === 'paid' && (
                <div style={{ border: '1px solid var(--border-normal)', borderRadius: 'var(--radius-sm)', padding: '16px', backgroundColor: 'rgba(255,255,255,0.01)', marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: '600', marginBottom: '12px' }}>
                    Note: Adding a resident directly as "Paid" will auto-generate a cash transaction record.
                  </p>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MARK PAID */}
      {showMarkPaidModal && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowMarkPaidModal(false)}>
              <X size={18} />
            </button>
            <h2 className="modal-title">
              <CheckCircle size={20} style={{ color: 'var(--success)' }} /> Record Maintenance Payment
            </h2>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', padding: '14px', border: '1px solid var(--border-normal)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Resident:</span>
                <span className="table-name" style={{ color: 'white', fontWeight: '700' }}>{selectedResident.name} (House No: {selectedResident.flat})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Maintenance:</span>
                <span style={{ color: 'white', fontWeight: '700' }}>₹{settings.monthlyAmount}</span>
              </div>
            </div>

            <form onSubmit={handleMarkPaidSubmit}>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn ${paymentMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setPaymentMethod('UPI');
                      setTxnId(`UPI${Date.now().toString().slice(-8)}`);
                    }}
                  >
                    UPI Transfer
                  </button>
                  <button
                    type="button"
                    className={`btn ${paymentMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => {
                      setPaymentMethod('Cash');
                      setTxnId(`CSH-${selectedResident.flat}-${new Date().toLocaleDateString('en-IN').replace(/\//g, '')}`);
                    }}
                  >
                    Cash
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction ID / Reference Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter UPI reference or receipt ID" 
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMarkPaidModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }}>
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW RECEIPT */}
      {showReceiptModal && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <button className="modal-close-btn" onClick={() => setShowReceiptModal(false)}>
              <X size={18} />
            </button>
            <h2 className="modal-title">
              <Receipt size={20} style={{ color: 'var(--primary)' }} /> Maintenance Receipt
            </h2>

            {/* Receipt Preview */}
            <div className="receipt-wrapper">
              <div className="receipt-header">
                <div className="receipt-society-name">{settings.societyName}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '0.5px' }}>OFFICIAL MAINTENANCE RECEIPT</div>
                <div className="receipt-title">RECEIPT: {getReceiptDetails()?.receiptNo}</div>
              </div>
              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-label">DATE & TIME:</span>
                  <span className="receipt-value">{getReceiptDetails()?.date}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">RESIDENT:</span>
                  <span className="receipt-value">{selectedResident.name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">HOUSE NO:</span>
                  <span className="receipt-value">House No: {selectedResident.flat}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">PERIOD:</span>
                  <span className="receipt-value">{getReceiptDetails()?.monthName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">METHOD:</span>
                  <span className="receipt-value">{getReceiptDetails()?.method}</span>
                </div>
                <div className="receipt-row" style={{ borderBottom: '1px dotted #9ca3af', paddingBottom: '8px' }}>
                  <span className="receipt-label">TXN REF ID:</span>
                  <span className="receipt-value" style={{ fontSize: '11px' }}>{getReceiptDetails()?.txnId}</span>
                </div>
                
                <div className="receipt-amount-box">
                  ₹{getReceiptDetails()?.amount.toLocaleString('en-IN')}.00
                </div>
              </div>
              <div className="receipt-footer">
                <div>This is a digital signature invoice.</div>
                <div>No physical signature required.</div>
                <div className="receipt-signature-stamp">
                  PAID Verified
                </div>
                <div className="receipt-barcode"></div>
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                Print / Save PDF
              </button>
              <button className="btn btn-primary" onClick={() => setShowReceiptModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHARE UPI DETAILS */}
      {showShareModal && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <button className="modal-close-btn" onClick={() => setShowShareModal(false)}>
              <X size={18} />
            </button>
            <h2 className="modal-title" style={{ justifyContent: 'center' }}>
              <Share2 size={20} style={{ color: 'var(--primary)' }} /> Share Payment Details
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Scan QR code using Google Pay, PhonePe, Paytm, or BHIM to pay
            </p>

            <div className="upi-qr-box">
              <img 
                src={qrImageUrl} 
                alt="UPI QR Code" 
                style={{ width: '180px', height: '180px', display: 'block' }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><rect width="6" height="6" x="7" y="7"/><rect width="6" height="6" x="7" y="11"/><rect width="6" height="6" x="11" y="7"/></svg>';
                }}
              />
            </div>

            <div className="upi-details-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>UPI ID:</span>
                <span style={{ color: 'white', fontWeight: '700' }}>
                  {settings.upiId} 
                  <button 
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginLeft: '6px' }}
                    onClick={() => copyToClipboard(settings.upiId, 'UPI ID copied to clipboard!')}
                  >
                    <Copy size={13} style={{ display: 'inline' }} />
                  </button>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
                <span style={{ color: 'white', fontWeight: '700' }}>₹{settings.monthlyAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => copyToClipboard(upiUrl, 'Payment URL link copied!')}
              >
                Copy Raw UPI Intent Link
              </button>
              
              <button
                className="btn btn-whatsapp"
                onClick={() => {
                  const msg = `Hi ${selectedResident.name}, please complete your monthly maintenance payment of ₹${settings.monthlyAmount} for ${settings.societyName}. \n\nPay via UPI using this link: ${upiUrl} \n\nUPI ID: ${settings.upiId}`;
                  window.open(`https://wa.me/91${selectedResident.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                Share directly via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

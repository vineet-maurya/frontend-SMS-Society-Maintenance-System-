import React, { useState } from 'react';
import { Search, Receipt, Calendar, CreditCard, ChevronDown, ChevronRight } from 'lucide-react';
import "../allcss/Payments.css";

export default function Payments({ payments, settings, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedMonths, setCollapsedMonths] = useState({});

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.residentName.toLowerCase().includes(term) ||
      p.flat.toLowerCase().includes(term) ||
      p.txnId.toLowerCase().includes(term)
    );
  });

  // Group payments by Month
  const groupPaymentsByMonth = () => {
    const groups = {};
    filteredPayments.forEach(p => {
      // p.month is "YYYY-MM"
      if (!groups[p.month]) {
        groups[p.month] = [];
      }
      groups[p.month].push(p);
    });
    
    // Sort months descending (e.g. 2026-07 before 2026-06)
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(monthKey => {
        const date = new Date(monthKey + "-02"); // Add offset day to prevent timezone shift issues
        const monthLabel = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const list = groups[monthKey].sort((a, b) => new Date(b.date) - new Date(a.date));
        const totalAmount = list.reduce((sum, p) => sum + p.amount, 0);
        return {
          key: monthKey,
          label: monthLabel,
          payments: list,
          totalAmount: totalAmount
        };
      });
  };

  const monthlyGroups = groupPaymentsByMonth();

  const toggleMonth = (monthKey) => {
    setCollapsedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
  };

  // Helper to trigger receipt printing for a historical payment
  const printReceipt = (payment) => {
    // Create a temporary element to print and then clean it up, or display a clean alert
    // To make it fully functional and reliable, we'll simulate receipt rendering and print it.
    const printWindow = window.open('', '_blank');
    
    const dateFormatted = new Date(payment.date).toLocaleString('en-IN');
    const receiptNo = `REC-${payment.id.slice(-6).toUpperCase()}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${payment.residentName}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #111827; background-color: white; }
            .receipt-wrapper { border: 1px dashed #d1d5db; max-width: 400px; margin: 0 auto; padding: 24px; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #9ca3af; padding-bottom: 16px; margin-bottom: 16px; }
            .receipt-society-name { font-size: 18px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
            .receipt-title { font-size: 13px; font-weight: bold; color: #4b5563; }
            .receipt-body { display: flex; flex-direction: column; gap: 10px; font-size: 13px; }
            .receipt-row { display: flex; justify-content: space-between; }
            .receipt-label { font-weight: bold; color: #4b5563; }
            .receipt-value { text-align: right; font-weight: bold; }
            .receipt-amount-box { margin: 20px 0; border: 2px solid #111827; padding: 12px; text-align: center; font-size: 20px; font-weight: 800; background-color: #f9fafb; }
            .receipt-footer { margin-top: 20px; border-top: 2px dashed #9ca3af; padding-top: 16px; text-align: center; font-size: 11px; color: #4b5563; }
            .receipt-signature-stamp { margin: 10px auto; border: 2px double #059669; color: #059669; border-radius: 6px; padding: 4px 10px; display: inline-block; font-weight: 800; text-transform: uppercase; transform: rotate(-3deg); }
            .receipt-barcode { height: 30px; margin-top: 12px; background: repeating-linear-gradient(90deg, #111827, #111827 2px, transparent 2px, transparent 6px); }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="receipt-wrapper">
            <div class="receipt-header">
              <div class="receipt-society-name">${settings.societyName}</div>
              <div class="receipt-title">RECEIPT: ${receiptNo}</div>
            </div>
            <div class="receipt-body">
              <div class="receipt-row"><span class="receipt-label">DATE & TIME:</span><span class="receipt-value">${dateFormatted}</span></div>
              <div class="receipt-row"><span class="receipt-label">RESIDENT:</span><span class="receipt-value">${payment.residentName}</span></div>
              <div class="receipt-row"><span class="receipt-label">HOUSE NO:</span><span class="receipt-value">House No: ${payment.flat}</span></div>
              <div class="receipt-row"><span class="receipt-label">METHOD:</span><span class="receipt-value">${payment.method}</span></div>
              <div class="receipt-row"><span class="receipt-label">TXN REF ID:</span><span class="receipt-value">${payment.txnId}</span></div>
              <div class="receipt-amount-box">₹${payment.amount.toLocaleString('en-IN')}.00</div>
            </div>
            <div class="receipt-footer">
              <div>This is a digital signature invoice.</div>
              <div class="receipt-signature-stamp">PAID Verified</div>
              <div class="receipt-barcode"></div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search and Filters */}
      <div className="glass-card search-filter-bar">
        <div className="search-wrapper" style={{ maxWidth: '480px' }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="form-control search-input" 
            placeholder="Search payments by resident name, flat, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
          Showing {filteredPayments.length} transactions
        </div>
      </div>

      {/* Monthly Payments List */}
      {monthlyGroups.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          No transaction history found.
        </div>
      ) : (
        monthlyGroups.map(group => {
          const isCollapsed = collapsedMonths[group.key];
          return (
            <div key={group.key} className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
              {/* Header block */}
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '20px 24px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: isCollapsed ? 'none' : '1px solid var(--border-normal)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => toggleMonth(group.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white', margin: 0 }}>
                      {group.label}
                    </h2>
                  </div>
                  <span className="badge badge-paid" style={{ fontSize: '10px' }}>
                    {group.payments.length} Payments
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Total Collected:</span>
                  <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>
                    ₹{group.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Table section */}
              {!isCollapsed && (
                <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>House No</th>
                        <th>Name</th>
                        <th>Payment Date</th>
                        <th>Method</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th style={{ textAlign: 'right' }}>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td style={{ fontWeight: '700', color: 'white' }}>
                            {payment.flat}
                          </td>
                          <td>
                            <div className="table-avatar-info">
                              <div className="table-avatar">
                                {payment.residentName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="table-name">{payment.residentName}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {new Date(payment.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>
                            <span className={`badge ${payment.method === 'UPI' ? 'badge-paid' : 'badge-pending'}`} style={{ textTransform: 'none' }}>
                              {payment.method}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {payment.txnId}
                          </td>
                          <td style={{ fontWeight: '700', color: 'white' }}>
                            ₹{payment.amount}
                          </td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <button 
                                className="btn btn-secondary btn-icon-only"
                                title="Print Digital Receipt"
                                onClick={() => printReceipt(payment)}
                              >
                                <Receipt size={15} />
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
          );
        })
      )}
    </div>
  );
}

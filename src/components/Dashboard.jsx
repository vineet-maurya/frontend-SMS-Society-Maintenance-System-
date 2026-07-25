import React from 'react';
import { Users, CheckCircle, Clock, IndianRupee, ArrowUpRight, TrendingUp } from 'lucide-react';
import "../allcss/Dashboard.css";

export default function Dashboard({ residents, payments, settings, setActiveTab }) {
  const currentMonthStr = new Date().toISOString().substring(0, 7); // "YYYY-MM"
  
  // Calculations for current month
  const totalResidentsCount = residents.length;
  
  const currentMonthPayments = payments.filter(p => p.month === currentMonthStr);
  const totalCollected = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidCount = residents.filter(r => r.status === 'paid').length;
  const pendingCount = residents.filter(r => r.status === 'pending').length;
  const overdueCount = residents.filter(r => r.status === 'overdue').length;
  
  const targetCollection = totalResidentsCount * settings.monthlyAmount;
  const collectionPercentage = targetCollection > 0 ? Math.round((totalCollected / targetCollection) * 100) : 0;
  
  // Payment methods breakdown
  const upiCollected = currentMonthPayments.filter(p => p.method === 'UPI').reduce((sum, p) => sum + p.amount, 0);
  const cashCollected = currentMonthPayments.filter(p => p.method === 'Cash').reduce((sum, p) => sum + p.amount, 0);
  
  // Get recent 4 payments
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Live Stats Grid */}
      <div className="grid-4">
        <div className="glass-card stat-card stat-total">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Residents</span>
            <span className="stat-value">{totalResidentsCount}</span>
          </div>
        </div>

        <div className="glass-card stat-card stat-paid">
          <div className="stat-icon-wrapper">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Paid (This Month)</span>
            <span className="stat-value">{paidCount}</span>
          </div>
        </div>

        <div className="glass-card stat-card stat-pending">
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending / Overdue</span>
            <span className="stat-value">{pendingCount + overdueCount}</span>
          </div>
        </div>

        <div className="glass-card stat-card stat-collected">
          <div className="stat-icon-wrapper">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Collected (This Month)</span>
            <span className="stat-value">₹{totalCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Target Progress Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
              Collection Target Progress
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Targeting ₹{targetCollection.toLocaleString('en-IN')} from {totalResidentsCount} residents
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '700', fontSize: '18px' }}>
            <TrendingUp size={20} />
            <span>{collectionPercentage}%</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${Math.min(collectionPercentage, 100)}%` }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
          <span>COLLECTED: ₹{totalCollected.toLocaleString('en-IN')}</span>
          <span>REMAINING: ₹{Math.max(0, targetCollection - totalCollected).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Main Two Column Grid */}
      <div className="grid-main">
        {/* Left: Recent Payments */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Recent Payments</h2>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setActiveTab('payments')}
            >
              View All <ArrowUpRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>

          {recentPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
              No payments recorded yet.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>House No</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
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
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <span className={`badge ${payment.method === 'UPI' ? 'badge-paid' : 'badge-pending'}`} style={{ textTransform: 'none' }}>
                          {payment.method}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: 'white' }}>
                        ₹{payment.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Payment Methods & Pending Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Method Distribution */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Method Breakdown</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>UPI Payments</span>
                  <span style={{ color: 'white', fontWeight: '700' }}>₹{upiCollected.toLocaleString('en-IN')}</span>
                </div>
                <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${totalCollected > 0 ? (upiCollected / totalCollected) * 100 : 0}%`,
                      background: 'var(--primary)' 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Cash Payments</span>
                  <span style={{ color: 'white', fontWeight: '700' }}>₹{cashCollected.toLocaleString('en-IN')}</span>
                </div>
                <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${totalCollected > 0 ? (cashCollected / totalCollected) * 100 : 0}%`,
                      background: 'var(--success)' 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Alerts */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Action Required</h2>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--warning)', fontSize: '20px', fontWeight: '800' }}>{pendingCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>PENDING</div>
              </div>
              <div style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
                <div style={{ color: 'var(--danger)', fontSize: '20px', fontWeight: '800' }}>{overdueCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>OVERDUE</div>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => setActiveTab('reminders')}
            >
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

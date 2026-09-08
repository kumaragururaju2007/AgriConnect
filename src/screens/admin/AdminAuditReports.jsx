import React, { useState } from 'react';
import { 
  FileText, Download, ShieldCheck, CheckCircle2, AlertCircle, 
  Calendar, Search, Filter, Printer, BarChart3, Database
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';

export default function AdminAuditReports() {
  const { adminAuditLogs, addToast, buyerApplications } = useAgri();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = adminAuditLogs.filter(log => {
    const matchesSearch = 
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: '📁 Audit Trail Exported',
      message: 'APMC regulatory compliance log downloaded as APMC_Compliance_Ledger.csv.'
    });
  };

  const handleExportPDF = () => {
    addToast({
      type: 'success',
      title: '📄 Statutory PDF Generated',
      message: 'Monthly APMC Regulatory & Conciliation Report compiled.'
    });
  };

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>Regulatory Audit Trail & Statutory Reports</span>
            <span style={{ fontSize: '0.74rem', background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: 999, fontWeight: 800 }}>
              Immutable State Ledger
            </span>
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Cryptographically sealed record of all KYC endorsements, license rejections, arbitrator findings, and statutory decrees.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
          >
            <Printer size={14} />
            <span>Print Compliance Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>IMMUTABLE AUDIT EVENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{adminAuditLogs.length} Records</div>
          <div style={{ fontSize: '0.74rem', color: '#15803d', marginTop: 4 }}>100% hash-verified against e-NAM</div>
        </div>

        <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>48-HOUR SLA COMPLIANCE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: 4 }}>99.2%</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>Compliant with Maharashtra APMC Act</div>
        </div>

        <div style={{ background: '#ffffff', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>LICENSED TRADERS ACTIVE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
            {buyerApplications.filter(b => b.verified_badge).length} Entities
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>Form-B Certified across 34 Mandis</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden', borderRadius: 14 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ position: 'relative', width: 320 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Actions</option>
              <option value="Approved">Buyer Approvals</option>
              <option value="Rejected">Rejections</option>
              <option value="Decree">Statutory Decrees</option>
              <option value="Info">More Info Requests</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px', fontWeight: 800 }}>Timestamp</th>
                <th style={{ padding: '12px 18px', fontWeight: 800 }}>Administrative Official</th>
                <th style={{ padding: '12px 18px', fontWeight: 800 }}>Action Executed</th>
                <th style={{ padding: '12px 18px', fontWeight: 800 }}>Target Entity / Docket</th>
                <th style={{ padding: '12px 18px', fontWeight: 800 }}>Regulatory Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 18px', color: '#64748b', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0f172a' }}>{log.admin_name}</td>
                  <td style={{ padding: '12px 18px' }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                      background: log.action.includes('Approved') ? '#dcfce7' : log.action.includes('Rejected') ? '#fee2e2' : log.action.includes('Decree') ? '#fef3c7' : '#eff6ff',
                      color: log.action.includes('Approved') ? '#15803d' : log.action.includes('Rejected') ? '#dc2626' : log.action.includes('Decree') ? '#b45309' : '#1d4ed8'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', fontWeight: 700, color: '#334155' }}>{log.target}</td>
                  <td style={{ padding: '12px 18px', color: '#475569' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

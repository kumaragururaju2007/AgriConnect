import React, { useState } from 'react';
import { 
  Star, Award, ShieldCheck, CheckCircle2, Search, 
  Filter, Users, Building2, User, Sparkles
} from 'lucide-react';
import { TRANSPORT_REVIEWS, DRIVER_PROFILE } from './driverData';

export default function DriverTrustReviews({ lang = 'en' }) {
  const [reviewFilter, setReviewFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = TRANSPORT_REVIEWS.filter((r) => {
    if (reviewFilter !== 'all' && r.badgeType !== reviewFilter) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = r.reviewer.toLowerCase().includes(q)
        || r.commodity.toLowerCase().includes(q)
        || r.route.toLowerCase().includes(q)
        || r.comment.toLowerCase().includes(q)
        || r.tag.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
        borderRadius: 16,
        padding: '24px 28px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 8px 20px rgba(180, 83, 9, 0.2)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.2)' }}>
              3-WAY VERIFIED APMC REPUTATION
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fef3c7' }}>
              • Consignors • Consignees • Mandi Officers
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
            Transporter Trust & Verified Endorsements
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#fde68a' }}>
            Audited performance testimonials from farmers, licensed mandi traders, and corporate procurement directors.
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '12px 20px',
          borderRadius: 14,
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
            {DRIVER_PROFILE.rating_avg} <Star size={24} fill="#facc15" color="#facc15" />
          </div>
          <div style={{ fontSize: '0.74rem', color: '#fef3c7', fontWeight: 700 }}>
            Based on 84 Trip Clearances
          </div>
        </div>
      </div>

      {/* Trust Pillar Breakdown Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '18px 22px',
        border: '1px solid #e2e8f0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            CARGO INTEGRITY & TARPING
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>
            5.0 / 5.0 ★
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>0 Bag Tears or Transit Bruising</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            PUNCTUALITY & ROUTE SLA
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#2563eb', marginTop: 2 }}>
            4.95 / 5.0 ★
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2563eb' }}>99.4% On-Time Gate Inward</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            WEIGHBRIDGE SCALE ACCURACY
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#7c3aed', marginTop: 2 }}>
            4.98 / 5.0 ★
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>Zero Weight Discrepancy Claims</div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            MANDI LANE DISCIPLINE
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#d97706', marginTop: 2 }}>
            4.90 / 5.0 ★
          </div>
          <div style={{ fontSize: '0.72rem', color: '#d97706' }}>Certified APMC Queue Order</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: 14,
        padding: '16px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Reviews (10)' },
            { id: 'farmer', label: 'Farmers (4)' },
            { id: 'buyer', label: 'Corporate Buyers (4)' },
            { id: 'fpo', label: 'FPO Cooperatives (2)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReviewFilter(tab.id)}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 700,
                border: reviewFilter === tab.id ? '1px solid #d97706' : '1px solid #cbd5e1',
                background: reviewFilter === tab.id ? '#fef3c7' : '#f8fafc',
                color: reviewFilter === tab.id ? '#92400e' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: 10,
          padding: '6px 12px',
          minWidth: 220
        }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search reviews or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.82rem'
            }}
          />
        </div>
      </div>

      {/* Reviews Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredReviews.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    {r.reviewer}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: r.badgeType === 'farmer' ? '#dcfce7' : r.badgeType === 'buyer' ? '#dbeafe' : '#f3e8ff',
                    color: r.badgeType === 'farmer' ? '#15803d' : r.badgeType === 'buyer' ? '#1d4ed8' : '#6b21a8'
                  }}>
                    {r.role}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 2 }}>
                  {r.location} • Trip #{r.tripCode} • {r.date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 12,
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a'
                }}>
                  🏷️ {r.tag}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(r.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
            </div>

            {/* Consignment summary pill */}
            <div style={{
              background: '#f8fafc',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8
            }}>
              <div>
                <strong>Commodity:</strong> {r.commodity}
              </div>
              <div style={{ color: '#64748b' }}>
                Route: {r.route}
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
              "{r.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

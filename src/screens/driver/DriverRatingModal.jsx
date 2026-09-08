import React, { useState } from 'react';
import { Star, X, Check, Award, ShieldCheck } from 'lucide-react';

export default function DriverRatingModal({
  isOpen,
  onClose,
  target,
  onSubmitRating
}) {
  const [stars, setStars] = useState(5);
  const [selectedTag, setSelectedTag] = useState('On-Time Loading');
  const [comment, setComment] = useState('Consignor had gunny sacks neatly weighed, tagged and ready at field gate. Smooth loading with zero delays.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isFarmer = target?.type === 'farmer';

  const tags = isFarmer
    ? ['On-Time Loading', 'Well-Packed Sacks', 'Clear Farm Road', 'Courteous Farmer']
    : ['Quick Dock Entry', 'Accurate Weighbridge', 'Zero Unloading Delay', 'Helpful Staff'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (onSubmitRating) {
        await onSubmitRating({
          target_id: target?.id || 1,
          target_type: target?.type || 'farmer',
          target_name: target?.name || 'Santosh Shinde',
          stars,
          tag: selectedTag,
          comment,
          job_code: target?.jobCode || 'JOB-2024-8841'
        });
      }
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 500);
    } catch (e) {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 20
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 18,
        width: '100%',
        maxWidth: 520,
        padding: '24px 28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
              3-WAY APMC REPUTATION ECOSYSTEM
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0f172a' }}>
              Rate Consignment Experience
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
            REVIEWING {isFarmer ? 'CONSIGNOR (FARMER)' : 'CONSIGNEE (BUYER DOCK)'}
          </div>
          <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
            {target?.name || 'Santosh Bhaurao Shinde'}
          </div>
        </div>

        {/* Stars Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
            SELECT SATISFACTION SCORE
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <Star
                  size={32}
                  fill={star <= stars ? '#f59e0b' : 'none'}
                  color={star <= stars ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#d97706' }}>
            {stars === 5 ? 'Exceptional 5.0 ★' : stars === 4 ? 'Very Good 4.0 ★' : stars === 3 ? 'Average 3.0 ★' : 'Needs Improvement'}
          </div>
        </div>

        {/* Endorsement Tags */}
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
            SELECT KEY APMC PERFORMANCE BADGE
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: selectedTag === tag ? '1px solid #d97706' : '1px solid #cbd5e1',
                  background: selectedTag === tag ? '#fef3c7' : '#f8fafc',
                  color: selectedTag === tag ? '#92400e' : '#475569',
                  cursor: 'pointer'
                }}
              >
                🏷️ {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 4 }}>
            FEEDBACK COMMENTS
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '12px',
            borderRadius: 10,
            background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
          }}
        >
          {isSubmitting ? (
            'Publishing Review to Mandi Ledger...'
          ) : (
            <>
              <Check size={16} /> Publish Verified APMC Review
            </>
          )}
        </button>
      </div>
    </div>
  );
}

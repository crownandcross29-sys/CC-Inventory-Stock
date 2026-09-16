'use client';

import { useState, useEffect } from 'react';

export default function ShippingExchangeTab({ shipping, exchange, onSave, syncing }) {
  const [formData, setFormData] = useState({
    standardFee: 80,
    freeShippingThreshold: 1499,
    metroDeliveryDays: '3-5 Business Days',
    restOfIndiaDeliveryDays: '5-8 Business Days',
    windowDays: '5-7 Days',
    conditions: 'Tags intact, unworn, unwashed, non-customized'
  });

  useEffect(() => {
    setFormData({
      standardFee: shipping?.standardFee ?? 80,
      freeShippingThreshold: shipping?.freeShippingThreshold ?? 1499,
      metroDeliveryDays: shipping?.metroDeliveryDays || '3-5 Business Days',
      restOfIndiaDeliveryDays: shipping?.restOfIndiaDeliveryDays || '5-8 Business Days',
      windowDays: exchange?.windowDays || '5-7 Days',
      conditions: exchange?.conditions || 'Tags intact, unworn, unwashed, non-customized'
    });
  }, [shipping, exchange]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      shipping: {
        standardFee: Number(formData.standardFee) || 0,
        freeShippingThreshold: Number(formData.freeShippingThreshold) || 0,
        metroDeliveryDays: formData.metroDeliveryDays,
        restOfIndiaDeliveryDays: formData.restOfIndiaDeliveryDays
      },
      exchange: {
        windowDays: formData.windowDays,
        conditions: formData.conditions
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Shipping Rates & Meter Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>🚚</span>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Shipping Rules & Free Delivery Meter
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Directly controls the Cart Drawer free shipping progress bar and checkout totals.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Standard Shipping Fee (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.standardFee}
              onChange={(e) => handleChange('standardFee', e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Applied when order subtotal is below the free shipping threshold.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Free Shipping Threshold (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.freeShippingThreshold}
              onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Triggers &quot;Unlocked Free Pan-India Delivery!&quot; celebration meter in the cart drawer.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Metro Cities Delivery Duration
            </label>
            <input
              type="text"
              value={formData.metroDeliveryDays}
              onChange={(e) => handleChange('metroDeliveryDays', e.target.value)}
              placeholder="3-5 Business Days"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Pan-India / Rest of India Delivery Duration
            </label>
            <input
              type="text"
              value={formData.restOfIndiaDeliveryDays}
              onChange={(e) => handleChange('restOfIndiaDeliveryDays', e.target.value)}
              placeholder="5-8 Business Days"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Returns & Exchanges Policy Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>🔄</span>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Sizing Exchange & Returns Policy
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Displayed on PDP trust badges, checkout notes, and the dedicated <code>/returns-policy</code> page.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Exchange Window Duration *
            </label>
            <input
              type="text"
              required
              value={formData.windowDays}
              onChange={(e) => handleChange('windowDays', e.target.value)}
              placeholder="e.g. 5-7 Days"
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Mandatory Exchange Conditions
            </label>
            <textarea
              rows={3}
              value={formData.conditions}
              onChange={(e) => handleChange('conditions', e.target.value)}
              placeholder="Tags intact, unworn, unwashed, non-customized"
              style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Explicit conditions required for customer sizing exchange approval.
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="submit"
          disabled={syncing}
          style={{
            padding: '12px 28px',
            backgroundColor: 'var(--gold-primary)',
            color: '#0e1410',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: syncing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(200, 169, 106, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          {syncing ? 'Saving to JSON...' : '💾 Save Shipping & Exchange Rules'}
        </button>
      </div>
    </form>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.2s'
};

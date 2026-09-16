'use client';

import { useState, useEffect } from 'react';
import { Truck, RotateCcw, Save, Sparkles } from 'lucide-react';

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
      <div className="admin-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(200, 169, 106, 0.15)',
              border: '1px solid rgba(200, 169, 106, 0.3)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--gold-primary)'
            }}
          >
            <Truck size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Shipping Rules & Free Delivery Meter
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Directly controls the Cart Drawer free shipping progress bar and checkout delivery charges.
            </p>
          </div>
        </div>

        {/* Live Free Shipping Meter Preview */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--gold-primary)" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Storefront Cart Drawer Preview
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-primary)' }}>
              Free Pan-India Delivery over ₹{Number(formData.freeShippingThreshold).toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: '70%',
                height: '100%',
                background: 'linear-gradient(90deg, #c8a96a, #22c55e)',
                borderRadius: '999px'
              }}
            />
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
              Charged when cart subtotal is under ₹{formData.freeShippingThreshold}.
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
              Orders at or above this value qualify for free pan-India shipping.
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
              Rest of India Delivery Duration
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
      <div className="admin-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--status-low)'
            }}
          >
            <RotateCcw size={20} />
          </div>
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
            transition: 'all 0.2s',
            opacity: syncing ? 0.7 : 1
          }}
        >
          <Save size={16} />
          {syncing ? 'Saving to JSON...' : 'Save Shipping & Exchange Rules'}
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
  transition: 'border-color 0.2s, box-shadow 0.2s'
};

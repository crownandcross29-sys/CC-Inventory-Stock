'use client';

import { useState, useEffect } from 'react';

export default function BrandSettingsTab({ brand, onSave, syncing }) {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    subTagline: '',
    phone: '',
    email: '',
    location: '',
    upiId: '',
    payeeName: '',
    currency: 'INR',
    currencySymbol: '₹'
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || 'Crown & Cross',
        tagline: brand.tagline || '',
        subTagline: brand.subTagline || '',
        phone: brand.phone || '',
        email: brand.email || '',
        location: brand.location || '',
        upiId: brand.upiId || '',
        payeeName: brand.payeeName || '',
        currency: brand.currency || 'INR',
        currencySymbol: brand.currencySymbol || '₹'
      });
    }
  }, [brand]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Identity Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Brand Identity & Hero Taglines
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Displayed on the storefront navigation, hero banners, and SEO metadata.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Brand / Store Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Primary Hero Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="e.g. Some wear fashion. We wear football."
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Secondary Sub-Tagline / Value Proposition
            </label>
            <input
              type="text"
              value={formData.subTagline}
              onChange={(e) => handleChange('subTagline', e.target.value)}
              placeholder="e.g. Wear Your Club. Wear Your Story."
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Contact & Dispatch Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>💬</span>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Communication & Order Channels
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Used for WhatsApp 1-Click order redirects, estimate inquiry receipts, and customer support.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              WhatsApp & Phone Number (with country code) *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+917695924602"
              style={inputStyle}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Powers the <code>wa.me</code> direct order button on PDP and Cart Drawer.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Official Support Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="crownandcross29@gmail.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Store Headquarters / City
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Chennai, Tamil Nadu"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Payment & UPI Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>💳</span>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
              Payment & UPI Dynamic QR Engine
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              The UPI ID and Payee Name are encoded into dynamic client-side UPI QR codes for zero-gateway instant checkout.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Merchant UPI ID (VPA) *
            </label>
            <input
              type="text"
              required
              value={formData.upiId}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="e.g. jasonclement.jm-1@okhdfcbank"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Registered Payee Name *
            </label>
            <input
              type="text"
              required
              value={formData.payeeName}
              onChange={(e) => handleChange('payeeName', e.target.value)}
              placeholder="Jason Clement"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Currency Code
            </label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              placeholder="INR"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Currency Symbol
            </label>
            <input
              type="text"
              value={formData.currencySymbol}
              onChange={(e) => handleChange('currencySymbol', e.target.value)}
              placeholder="₹"
              style={inputStyle}
            />
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
          {syncing ? 'Saving to JSON...' : '💾 Save Brand & Store Settings'}
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

'use client';

import { useState, useEffect } from 'react';

export default function RawJsonTab({ data, onSave, syncing }) {
  const [jsonString, setJsonString] = useState('');
  const [validationStatus, setValidationStatus] = useState(null); // { valid: boolean, message: string }
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setJsonString(JSON.stringify(data, null, 2));
      setValidationStatus(null);
    }
  }, [data]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonString);
      setJsonString(JSON.stringify(parsed, null, 2));
      setValidationStatus({ valid: true, message: 'Valid JSON format! Beautified successfully.' });
    } catch (err) {
      setValidationStatus({ valid: false, message: `Syntax error: ${err.message}` });
    }
  };

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Root must be an object');
      }
      if (!Array.isArray(parsed.products)) {
        throw new Error('Must contain a "products" array');
      }
      setValidationStatus({
        valid: true,
        message: `Valid! Contains ${parsed.products.length} products, brand "${parsed.brand?.name || 'N/A'}", and ${parsed.categories?.length || 0} categories.`
      });
    } catch (err) {
      setValidationStatus({ valid: false, message: `Validation failed: ${err.message}` });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crown-and-cross-products-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.products)) {
        alert('Invalid JSON structure: Must contain a "products" array at root level.');
        return;
      }
      if (confirm('Are you sure you want to push this raw JSON directly to CC-Hosting-Public/public/data/products.json?')) {
        onSave(jsonString);
      }
    } catch (err) {
      alert(`Cannot save invalid JSON: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Header Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
            Raw JSON Inspector & Emergency Editor
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
            Target: <code>CC-Hosting-Public/public/data/products.json</code> — direct live edits and snapshots.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleFormat}
            style={actionBtnStyle}
          >
            ✨ Format
          </button>

          <button
            type="button"
            onClick={handleValidate}
            style={actionBtnStyle}
          >
            🔍 Validate
          </button>

          <button
            type="button"
            onClick={handleCopy}
            style={actionBtnStyle}
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy All'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            style={actionBtnStyle}
          >
            💾 Download Backup
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={syncing}
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--gold-primary)',
              color: '#0e1410',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: syncing ? 'not-allowed' : 'pointer'
            }}
          >
            {syncing ? 'Pushing...' : '🚀 Push to products.json'}
          </button>
        </div>
      </div>

      {/* Validation Message Banner */}
      {validationStatus && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: validationStatus.valid ? '#143823' : '#7f1d1d',
            border: `1px solid ${validationStatus.valid ? '#22c55e' : '#ef4444'}`,
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{validationStatus.valid ? '✅' : '⚠️'}</span>
          <span>{validationStatus.message}</span>
        </div>
      )}

      {/* Code Editor Box */}
      <div
        style={{
          background: '#090d0a',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            products.json • UTF-8 • {jsonString.length.toLocaleString()} characters
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gold-primary)' }}>
            Editable in-place
          </span>
        </div>

        <textarea
          value={jsonString}
          onChange={(e) => {
            setJsonString(e.target.value);
            setValidationStatus(null);
          }}
          spellCheck={false}
          style={{
            width: '100%',
            height: '620px',
            padding: '18px 20px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#d1fae5',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            whiteSpace: 'pre',
            overflowX: 'auto'
          }}
        />
      </div>
    </div>
  );
}

const actionBtnStyle = {
  padding: '8px 14px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-active)',
  color: 'var(--text-primary)',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s'
};

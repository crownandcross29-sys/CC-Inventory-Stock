'use client';

import { useState, useEffect } from 'react';
import { Tags, Award, Plus, Trash2, Save } from 'lucide-react';

export default function TaxonomyTab({ categories, subCategories, onSave, syncing }) {
  const [catList, setCatList] = useState([]);
  const [subList, setSubList] = useState([]);

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      setCatList(categories);
    }
    if (subCategories && Array.isArray(subCategories)) {
      setSubList(subCategories);
    }
  }, [categories, subCategories]);

  // Categories CRUD
  const handleCatChange = (index, field, value) => {
    setCatList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'name' && (!updated[index].slug || updated[index].slug === slugify(prev[index].name))) {
        updated[index].slug = slugify(value);
      }
      return updated;
    });
  };

  const addCategory = () => {
    setCatList((prev) => [
      ...prev,
      { id: `cat-${Date.now().toString().slice(-4)}`, name: '', slug: '' }
    ]);
  };

  const removeCategory = (index) => {
    if (catList.length <= 1) {
      alert('At least one category is required.');
      return;
    }
    setCatList((prev) => prev.filter((_, i) => i !== index));
  };

  // SubCategories CRUD
  const handleSubChange = (index, field, value) => {
    setSubList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'name' && (!updated[index].id || updated[index].id.startsWith('sub-') || updated[index].id === slugify(prev[index].name))) {
        updated[index].id = slugify(value);
      }
      return updated;
    });
  };

  const addSubCategory = () => {
    setSubList((prev) => [
      ...prev,
      { id: `sub-${Date.now().toString().slice(-4)}`, name: '', description: '' }
    ]);
  };

  const removeSubCategory = (index) => {
    if (subList.length <= 1) {
      alert('At least one quality grade is required.');
      return;
    }
    setSubList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const c of catList) {
      if (!c.name.trim()) {
        alert('All categories must have a valid name.');
        return;
      }
    }
    for (const s of subList) {
      if (!s.name.trim()) {
        alert('All quality sub-categories must have a valid name.');
        return;
      }
    }
    onSave({ categories: catList, subCategories: subList });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Categories Card */}
      <div className="admin-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <Tags size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
                Primary Categories ({catList.length})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                Powers storefront navigation filters, header links, and jersey taxonomies (e.g. Club, Country, Retro).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addCategory}
            style={{
              padding: '9px 16px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-active)',
              color: 'var(--gold-primary)',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {catList.map((cat, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr auto',
                gap: '12px',
                alignItems: 'center',
                background: 'var(--bg-primary)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.2s'
              }}
            >
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  ID
                </label>
                <input
                  type="text"
                  required
                  value={cat.id}
                  onChange={(e) => handleCatChange(index, 'id', e.target.value)}
                  style={tableInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={cat.name}
                  onChange={(e) => handleCatChange(index, 'name', e.target.value)}
                  placeholder="Category Name"
                  style={tableInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={cat.slug}
                  onChange={(e) => handleCatChange(index, 'slug', e.target.value)}
                  placeholder="category-slug"
                  style={tableInputStyle}
                />
              </div>

              <button
                type="button"
                onClick={() => removeCategory(index)}
                title="Remove Category"
                style={{
                  alignSelf: 'flex-end',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  height: '37px',
                  transition: 'background 0.2s'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Sub-Categories Card */}
      <div className="admin-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--gold-primary)', margin: 0 }}>
                Quality Grades & Sub-Categories ({subList.length})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                Displayed as quality badges on jersey cards and explained in PDP specs (e.g. Player Version vs Master Copy).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addSubCategory}
            style={{
              padding: '9px 16px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-active)',
              color: 'var(--gold-primary)',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={14} /> Add Quality Grade
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subList.map((sub, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 220px 1fr auto',
                gap: '12px',
                alignItems: 'center',
                background: 'var(--bg-primary)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.2s'
              }}
            >
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Key / ID
                </label>
                <input
                  type="text"
                  required
                  value={sub.id}
                  onChange={(e) => handleSubChange(index, 'id', e.target.value)}
                  style={tableInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Grade Name
                </label>
                <input
                  type="text"
                  required
                  value={sub.name}
                  onChange={(e) => handleSubChange(index, 'name', e.target.value)}
                  placeholder="e.g. Player Version"
                  style={tableInputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Quality Description
                </label>
                <input
                  type="text"
                  value={sub.description}
                  onChange={(e) => handleSubChange(index, 'description', e.target.value)}
                  placeholder="Specs and fabric explanation..."
                  style={tableInputStyle}
                />
              </div>

              <button
                type="button"
                onClick={() => removeSubCategory(index)}
                title="Remove Grade"
                style={{
                  alignSelf: 'flex-end',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  height: '37px',
                  transition: 'background 0.2s'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
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
          {syncing ? 'Saving to JSON...' : 'Save Categories & Quality Grades'}
        </button>
      </div>
    </form>
  );
}

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

const tableInputStyle = {
  width: '100%',
  padding: '9px 12px',
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '12px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};

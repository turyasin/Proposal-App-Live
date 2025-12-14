import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Building2, User, Mail, Phone, MapPin } from 'lucide-react';

export function CompaniesView({ companies, onSave, onDelete }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Main form data
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        tax_number: '',
        notes: '',
        contacts: [] // Array of { name, title, email, phone }
    });

    // Temporary state for adding a new contact within the form
    const [tempContact, setTempContact] = useState({
        name: '',
        title: '',
        email: '',
        phone: ''
    });

    const handleAddContact = () => {
        if (!tempContact.name || !tempContact.email) {
            alert('Lütfen en az İsim ve E-posta alanlarını doldurun.');
            return;
        }
        setFormData({
            ...formData,
            contacts: [...formData.contacts, tempContact]
        });
        setTempContact({ name: '', title: '', email: '', phone: '' });
    };

    const handleRemoveContact = (index) => {
        const newContacts = formData.contacts.filter((_, i) => i !== index);
        setFormData({ ...formData, contacts: newContacts });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure at least one contact exists or use legacy fields if needed
        // For backward compatibility, we'll map the first contact to the legacy fields if they exist
        const primaryContact = formData.contacts[0] || {};

        const companyData = {
            ...formData,
            // Legacy fields for backward compatibility
            contact_person: primaryContact.name || '',
            contact_title: primaryContact.title || '',
            email: primaryContact.email || '',
            phone: primaryContact.phone || ''
        };

        onSave(companyData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            tax_number: '',
            notes: '',
            contacts: []
        });
        setTempContact({ name: '', title: '', email: '', phone: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const handleEdit = (company) => {
        // If company has legacy fields but no contacts array, migrate it
        let contacts = company.contacts || [];
        if (contacts.length === 0 && company.contact_person) {
            contacts = [{
                name: company.contact_person,
                title: company.contact_title,
                email: company.email,
                phone: company.phone
            }];
        }

        setFormData({
            ...company,
            contacts: contacts
        });
        setEditingId(company.id);
        setShowForm(true);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Firma Yönetimi</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Yeni Firma
                </button>
            </div>

            {showForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Firma Düzenle' : 'Yeni Firma Ekle'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Firma Adı *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Vergi Numarası</label>
                                <input
                                    type="text"
                                    value={formData.tax_number}
                                    onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Adres</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: 'hsl(var(--color-accent))' }}>Yetkili Kişiler</h4>

                            {/* List of Added Contacts */}
                            {formData.contacts.length > 0 && (
                                <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {formData.contacts.map((contact, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <User size={16} />
                                                <span style={{ fontWeight: 'bold' }}>{contact.name}</span>
                                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{contact.title}</span>
                                                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>| {contact.email}</span>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveContact(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add New Contact Inputs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                                <div>
                                    <input placeholder="Ad Soyad" value={tempContact.name} onChange={e => setTempContact({ ...tempContact, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <div>
                                    <input placeholder="Ünvan" value={tempContact.title} onChange={e => setTempContact({ ...tempContact, title: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <div>
                                    <input placeholder="E-posta" value={tempContact.email} onChange={e => setTempContact({ ...tempContact, email: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <div>
                                    <input placeholder="Telefon" value={tempContact.phone} onChange={e => setTempContact({ ...tempContact, phone: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }} />
                                </div>
                                <button type="button" onClick={handleAddContact} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn-primary">{editingId ? 'Güncelle' : 'Kaydet'}</button>
                            <button type="button" onClick={resetForm} style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>İptal</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {companies.map((company) => (
                    <div key={company.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Building2 size={24} style={{ color: 'hsl(var(--color-accent))' }} />
                                <h3 style={{ margin: 0 }}>{company.name}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleEdit(company)} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                <button onClick={() => { if (confirm('Silmek istediğinize emin misiniz?')) onDelete(company.id); }} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                            {/* Contacts hidden in list view */}

                            {company.address && (
                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.5rem' }}>
                                    <MapPin size={16} style={{ marginTop: '2px' }} />
                                    <span>{company.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

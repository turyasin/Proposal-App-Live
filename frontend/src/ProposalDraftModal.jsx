import React, { useState } from 'react';
import { X, Building2, FileText, User, Calendar, ChevronDown, Check } from 'lucide-react';

export function ProposalDraftModal({
    isOpen,
    onClose,
    product,
    calculation,
    params,
    companies,
    onSave,
    basket, // Receive basket prop
    initialData, // Receive initial data for editing
    onCancel, // Receive onCancel handler
    productCustomizations, // Receive customizations for proposal number
    senderCompanies // Receive sender sender companies
}) {
    const [formData, setFormData] = useState({
        senderCompanyId: initialData?.senderCompany?.id || '',
        companyId: '',
        contactIndex: '',
        paymentTerms: '30 gün içinde ödeme',
        preparedBy: initialData?.preparer || '', // Initialize from existing proposal if editing
        preparedByTitle: '',
        preparedByEmail: '',
        preparedByPhone: '',
        validityDays: 30,
        notes: '',
        proposalNo: '',
        version: 'v1.0'
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Populate form data when initialData is provided
    React.useEffect(() => {
        if (initialData) {
            // Find contact index if possible
            const company = companies.find(c => c.id === initialData.company.id);
            let contactIdx = '';
            if (company && company.contacts) {
                const idx = company.contacts.findIndex(c => c.name === initialData.company.contact_person);
                if (idx !== -1) contactIdx = idx;
            }

            // Calculate next version if editing
            const currentVersion = initialData.version || 'v1.0';
            const versionMatch = currentVersion.match(/v(\d+)\.(\d+)/);
            let nextVersion = 'v1.1';
            if (versionMatch) {
                const major = parseInt(versionMatch[1]);
                const minor = parseInt(versionMatch[2]);
                nextVersion = `v${major}.${minor + 1}`;
            }

            setFormData({
                senderCompanyId: initialData.senderCompany?.id || (senderCompanies && senderCompanies.length > 0 ? senderCompanies[0].id : ''),
                companyId: initialData.company.id || '',
                contactIndex: contactIdx,
                paymentTerms: initialData.paymentTerms || '30 gün içinde ödeme',
                preparedBy: initialData.preparedBy?.name || initialData.preparer || '',
                preparedByTitle: initialData.preparedBy?.title || '',
                preparedByEmail: initialData.preparedBy?.email || '',
                preparedByPhone: initialData.preparedBy?.phone || '',
                validityDays: initialData.validityDays || 30,
                notes: initialData.notes || '',
                proposalNo: initialData.proposalNo || '',
                version: nextVersion
            });
        } else {
            // Reset form if no initialData (new proposal)
            // Use custom proposal number from basket if available
            const customNo = productCustomizations?.customProposalNo || '';
            setFormData({
                senderCompanyId: senderCompanies && senderCompanies.length > 0 ? senderCompanies[0].id : '',
                companyId: '',
                contactIndex: '',
                paymentTerms: '30 gün içinde ödeme',
                preparedBy: '',
                preparedByTitle: '',
                preparedByEmail: '',
                preparedByPhone: '',
                validityDays: 30,
                notes: '',
                proposalNo: customNo,
                version: 'v1.0'
            });
        }
    }, [initialData, companies, isOpen, productCustomizations, senderCompanies]);

    if (!isOpen) return null;

    // Calculate total price from basket or single product
    const totalPrice = basket && basket.length > 0
        ? basket.reduce((sum, item) => sum + (item.calculation.suggested_price * (item.quantity || 1)), 0)
        : (calculation?.suggested_price || 0);

    const totalPriceTry = basket && basket.length > 0
        ? basket.reduce((sum, item) => sum + (item.calculation.price_try * (item.quantity || 1)), 0)
        : (calculation?.price_try || 0);

    const selectedCompany = companies.find(c => c.id === parseInt(formData.companyId));

    // Prepare contacts list for the selected company
    let companyContacts = selectedCompany?.contacts || [];
    // Legacy support: if no contacts array but legacy fields exist, create a temporary contact
    if (selectedCompany && companyContacts.length === 0 && selectedCompany.contact_person) {
        companyContacts = [{
            name: selectedCompany.contact_person,
            title: selectedCompany.contact_title,
            email: selectedCompany.email,
            phone: selectedCompany.phone
        }];
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedContact = companyContacts[parseInt(formData.contactIndex)] || {};

        // Merge selected contact info into company data for the proposal
        // This ensures the PDF template uses the selected contact person
        const finalCompanyData = {
            ...selectedCompany,
            contact_person: selectedContact.name || selectedCompany.contact_person,
            contact_title: selectedContact.title || selectedCompany.contact_title,
            email: selectedContact.email || selectedCompany.email,
            phone: selectedContact.phone || selectedCompany.phone
        };

        // Prepare items list
        const items = basket && basket.length > 0
            ? basket
            : [{ product, calculation }];

        // Generate proposal number if not provided
        const finalProposalNo = formData.proposalNo.trim() || `PR-${Date.now().toString().slice(-6)}`;

        // Get selected sender company
        const selectedSenderCompany = senderCompanies ? senderCompanies.find(c => c.id === parseInt(formData.senderCompanyId)) : null;

        const proposalData = {
            senderCompany: selectedSenderCompany, // Add selected sender company
            proposalNo: finalProposalNo,
            version: formData.version,
            date: new Date().toISOString(),
            items: items, // Save all items
            product: items[0].product, // Keep main product for legacy support if needed
            calculation: items[0].calculation, // Keep main calc for legacy support
            totalPrice: totalPrice,
            totalPriceTry: totalPriceTry,
            company: finalCompanyData,
            paymentTerms: formData.paymentTerms,
            preparedBy: {
                name: formData.preparedBy,
                title: formData.preparedByTitle,
                email: formData.preparedByEmail,
                phone: formData.preparedByPhone
            },
            preparer: formData.preparedBy, // For filtering in archive
            validityDays: formData.validityDays,
            notes: formData.notes
        };

        onSave(proposalData);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Teklif Oluştur</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sender Company Selection */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'hsl(var(--color-accent))' }}>
                            <Building2 size={20} />
                            Teklif Veren Firma
                        </h3>
                        {senderCompanies && senderCompanies.length > 0 ? (
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'hsl(var(--color-text-secondary))' }}>Firma Seçin</label>

                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {formData.senderCompanyId ? (
                                        (() => {
                                            const selected = senderCompanies.find(c => c.id == formData.senderCompanyId);
                                            return selected ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    {selected.logo ? (
                                                        <img src={selected.logo} alt={selected.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'white', borderRadius: '4px', padding: '2px' }} />
                                                    ) : (
                                                        <div style={{ width: '40px', height: '40px', background: 'hsl(var(--color-accent))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                            {selected.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{selected.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--color-text-muted))' }}>{selected.city || 'Konum yok'}</div>
                                                    </div>
                                                </div>
                                            ) : <span>Seçiniz</span>
                                        })()
                                    ) : (
                                        <span style={{ color: 'hsl(var(--color-text-muted))' }}>Firma Seçiniz...</span>
                                    )}
                                    <ChevronDown size={20} />
                                </button>

                                {isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '0.5rem',
                                        background: '#1e293b',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        zIndex: 10,
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                        overflow: 'hidden'
                                    }}>
                                        {senderCompanies.map(company => (
                                            <div
                                                key={company.id}
                                                onClick={() => {
                                                    setFormData({ ...formData, senderCompanyId: company.id });
                                                    setIsDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    background: formData.senderCompanyId == company.id ? 'rgba(57, 100, 250, 0.1)' : 'transparent',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = formData.senderCompanyId == company.id ? 'rgba(57, 100, 250, 0.1)' : 'transparent'}
                                            >
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'white', borderRadius: '4px', padding: '2px' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', background: 'hsl(var(--color-accent))', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {company.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{company.name}</div>
                                                </div>
                                                {formData.senderCompanyId == company.id && <Check size={20} style={{ color: 'hsl(var(--color-accent))' }} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ color: 'hsl(var(--color-warning))', padding: '0.5rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '4px' }}>
                                ⚠️ Kayıtlı firma bulunamadı. Lütfen ayarlardan firma ekleyin.
                            </div>
                        )}
                    </div>

                    {/* Product Summary */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--color-accent))' }}>
                            <FileText size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Teklif İçeriği
                        </h3>

                        {basket && basket.length > 0 ? (
                            <div>
                                <div style={{ marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                                    {basket.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span>{idx + 1}. {item.product.name} <span style={{ color: 'hsl(var(--color-accent))' }}>(x{item.quantity || 1})</span></span>
                                            <span>${(item.calculation.suggested_price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontWeight: 'bold' }}>
                                    <span>Toplam Tutar:</span>
                                    <span style={{ color: 'hsl(var(--color-success))', fontSize: '1.2rem' }}>
                                        ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                <div>
                                    <span style={{ color: 'hsl(var(--color-text-muted))' }}>Ürün:</span>
                                    <div style={{ fontWeight: 'bold' }}>{product?.name}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'hsl(var(--color-text-muted))' }}>Fiyat:</span>
                                    <div style={{ fontWeight: 'bold', color: 'hsl(var(--color-success))' }}>
                                        ${calculation?.suggested_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Company Selection */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <Building2 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Firma Seçin *
                                </label>
                                <select
                                    required
                                    value={formData.companyId}
                                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value, contactIndex: '' })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1e293b', // Fixed dark background
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="" style={{ background: '#1e293b', color: 'white' }}>Firma seçin...</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id} style={{ background: '#1e293b', color: 'white' }}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Yetkili Kişi *
                                </label>
                                <select
                                    required
                                    disabled={!formData.companyId}
                                    value={formData.contactIndex}
                                    onChange={(e) => setFormData({ ...formData, contactIndex: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1e293b', // Fixed dark background
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        cursor: formData.companyId ? 'pointer' : 'not-allowed',
                                        opacity: formData.companyId ? 1 : 0.5
                                    }}
                                >
                                    <option value="" style={{ background: '#1e293b', color: 'white' }}>Yetkili seçin...</option>
                                    {companyContacts.map((contact, idx) => (
                                        <option key={idx} value={idx} style={{ background: '#1e293b', color: 'white' }}>
                                            {contact.name} {contact.title ? `(${contact.title})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Proposal Number and Version */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Teklif Numarası
                                </label>
                                <input
                                    type="text"
                                    value={formData.proposalNo}
                                    onChange={(e) => setFormData({ ...formData, proposalNo: e.target.value })}
                                    placeholder="Otomatik oluşturulacak"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Versiyon
                                </label>
                                <input
                                    type="text"
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                Ödeme Şartları
                            </label>
                            <input
                                type="text"
                                value={formData.paymentTerms}
                                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Validity */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Geçerlilik Süresi (Gün)
                            </label>
                            <input
                                type="number"
                                value={formData.validityDays}
                                onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Prepared By Section */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginTop: '1rem'
                        }}>
                            <h4 style={{ marginBottom: '1rem', color: 'hsl(var(--color-accent))' }}>
                                <User size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Teklifi Hazırlayan
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                        Ad Soyad *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.preparedBy}
                                        onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                        Ünvan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.preparedByTitle}
                                        onChange={(e) => setFormData({ ...formData, preparedByTitle: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.preparedByEmail}
                                        onChange={(e) => setFormData({ ...formData, preparedByEmail: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.preparedByPhone}
                                        onChange={(e) => setFormData({ ...formData, preparedByPhone: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.65rem',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                Notlar
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                            Teklifi Tamamla ve Kaydet
                        </button>
                        <button
                            type="button"
                            onClick={onCancel || onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

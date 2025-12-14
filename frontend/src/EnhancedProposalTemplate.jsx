import React from 'react';

export const EnhancedProposalTemplate = ({ proposal, companyBranding }) => {
    const today = new Date(proposal.date).toLocaleDateString('tr-TR');
    const validUntil = new Date(new Date(proposal.date).getTime() + proposal.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR');

    // Helper to get total price
    const getTotalPrice = () => {
        if (proposal.totalPrice) return proposal.totalPrice;
        if (proposal.calculation && proposal.calculation.suggested_price) return proposal.calculation.suggested_price;
        return 0;
    };

    const getTotalPriceTry = () => {
        if (proposal.totalPriceTry) return proposal.totalPriceTry;
        if (proposal.calculation && proposal.calculation.price_try) return proposal.calculation.price_try;
        return 0;
    };

    // Header Component
    const Header = () => (
        <div style={{ borderBottom: '2px solid #000000', paddingBottom: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {companyBranding?.company_logo && (
                        <img
                            src={companyBranding.company_logo}
                            alt="Logo"
                            style={{
                                maxHeight: '50px',
                                maxWidth: '120px',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    <div>
                        <h1 style={{ margin: 0, color: '#000000', fontSize: '24px' }}>
                            {companyBranding?.company_name || 'Şirket Adı'}
                        </h1>
                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '11px' }}>
                            {companyBranding?.company_address || 'Şirket Adresi'}
                        </p>
                    </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                    {companyBranding?.company_email && <div>{companyBranding.company_email}</div>}
                    {companyBranding?.company_phone && <div>{companyBranding.company_phone}</div>}
                    {companyBranding?.company_tax_number && <div>Vergi No: {companyBranding.company_tax_number}</div>}
                </div>
            </div>
        </div>
    );

    // Footer Component
    const Footer = () => (
        <div style={{
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center'
        }}>
            {companyBranding?.company_name || 'Şirket Adı'} {companyBranding?.company_tax_number && `| Vergi No: ${companyBranding.company_tax_number}`} | Gizli ve Ticari Sır İçerir
        </div>
    );

    return (
        <div id="enhanced-proposal-template" style={{
            width: '210mm',
            background: 'white',
            padding: '10mm',
            fontFamily: 'Arial, sans-serif',
            color: '#000',
            boxSizing: 'border-box'
        }}>
            {/* Print Styles for Table Header/Footer Repetition */}
            <style>{`
                @media print {
                    @page {
                        margin: 10mm;
                        size: A4;
                    }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    body { -webkit-print-color-adjust: exact; }
                    tr { page-break-inside: avoid; }
                    .no-break { page-break-inside: avoid; }
                }
            `}</style>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {/* THEAD: Repeats on every page */}
                <thead>
                    <tr>
                        <td>
                            <Header />
                            {/* Spacer to prevent content overlap */}
                            <div style={{ height: '10px' }}></div>
                        </td>
                    </tr>
                </thead>

                {/* TFOOT: Repeats on every page */}
                <tfoot>
                    <tr>
                        <td>
                            {/* Spacer */}
                            <div style={{ height: '20px' }}></div>
                            <Footer />
                        </td>
                    </tr>
                </tfoot>

                {/* TBODY: Main Content */}
                <tbody>
                    <tr>
                        <td>
                            {/* Title & Info Grid */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                                <div>
                                    <h2 style={{
                                        fontSize: '26px',
                                        color: '#000000',
                                        margin: '0 0 15px 0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        FIYAT TEKLIFI
                                    </h2>
                                    {/* Company Info */}
                                    {proposal.company && (
                                        <div style={{ fontSize: '13px', color: '#334155' }}>
                                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Sayin {proposal.company.contact_person}</p>
                                            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#000000' }}>{proposal.company.name}</p>
                                            <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>
                                                {proposal.company.email}
                                                {proposal.company.phone && ` | ${proposal.company.phone}`}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    minWidth: '200px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#64748b' }}>Teklif No:</span>
                                        <span style={{ fontWeight: 'bold' }}>{proposal.proposalNo}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#64748b' }}>Tarih:</span>
                                        <span style={{ fontWeight: 'bold' }}>{today}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#64748b' }}>Gecerlilik:</span>
                                        <span style={{ fontWeight: 'bold' }}>{validUntil}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Introduction */}
                            <p style={{ margin: '0 0 25px 0', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
                                Asagida teknik detaylari sunulan urun/urunler icin teklifimizi bilgilerinize sunariz.
                            </p>

                            {/* Product Loop */}
                            {proposal.items && proposal.items.length > 0 ? (
                                proposal.items.map((item, index) => (
                                    <div key={index} style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
                                        <h3 style={{
                                            background: '#f3f3f3',
                                            padding: '8px 12px',
                                            margin: '0 0 15px 0',
                                            color: '#000000',
                                            borderLeft: '4px solid #000000',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>{index + 1}. {item.product.name}</span>
                                            <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#666' }}>{item.product.id}</span>
                                        </h3>

                                        {/* Specs Table */}
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '15px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '6px', width: '25%', color: '#64748b' }}>Boyutlar</td>
                                                    <td style={{ padding: '6px', fontWeight: '600' }}>{item.product.specs.dimensions_raw}</td>
                                                    <td style={{ padding: '6px', width: '25%', color: '#64748b' }}>Kapasite</td>
                                                    <td style={{ padding: '6px', fontWeight: '600' }}>{item.product.specs.payload_capacity_kg} kg</td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '6px', color: '#64748b' }}>Govde Capi</td>
                                                    <td style={{ padding: '6px', fontWeight: '600' }}>{item.product.specs.diameter_mm} mm</td>
                                                    <td style={{ padding: '6px', color: '#64748b' }}>Voltaj</td>
                                                    <td style={{ padding: '6px', fontWeight: '600' }}>{item.product.specs.voltage}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* Item Price */}
                                        <div style={{ textAlign: 'right', fontSize: '13px', marginTop: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                                                <div>
                                                    <span style={{ color: '#64748b', marginRight: '5px' }}>Birim Fiyat:</span>
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        ${item.calculation.suggested_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#64748b', marginRight: '5px' }}>Miktar:</span>
                                                    <span style={{ fontWeight: 'bold' }}>{item.quantity || 1}</span>
                                                </div>
                                                <div>
                                                    <span style={{ color: '#64748b', marginRight: '5px' }}>Tutar:</span>
                                                    <span style={{ fontWeight: 'bold', color: '#000000' }}>
                                                        ${(item.calculation.suggested_price * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Fallback for Single Product */
                                <div style={{ margin: '0 0 30px 0', pageBreakInside: 'avoid' }}>
                                    <h3 style={{
                                        background: '#f3f3f3',
                                        padding: '10px 15px',
                                        margin: '0 0 10px 0',
                                        color: '#000000',
                                        borderLeft: '4px solid #000000',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        URUN BILGILERI: {proposal.product?.name}
                                    </h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                        <tbody>
                                            {[
                                                ['Urun Kodu', proposal.product?.id],
                                                ['Kesit Sayisi', proposal.product?.specs.sections],
                                                ['Boyutlar', proposal.product?.specs.dimensions_raw],
                                                ['Govde Capi', `${proposal.product?.specs.diameter_mm} mm`],
                                                ['Yuk Kapasitesi', `${proposal.product?.specs.payload_capacity_kg} kg`],
                                                ['Voltaj', proposal.product?.specs.voltage]
                                            ].map(([label, value], idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '8px 12px', width: '35%', color: '#64748b' }}>{label}</td>
                                                    <td style={{ padding: '8px 12px', fontWeight: '600', color: '#0f172a' }}>{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Total Pricing Section */}
                            <div style={{ margin: '20px 0 30px 0', pageBreakInside: 'avoid' }}>
                                <div style={{
                                    background: '#f8fafc',
                                    border: '2px solid #000000',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: '0 0 8px 0', color: '#000000', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        GENEL TOPLAM (KDV Haric)
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                                            ${getTotalPrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                                        (₺{getTotalPriceTry().toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                                    </p>
                                </div>
                            </div>

                            {/* Payment Terms & Notes */}
                            <div style={{ pageBreakInside: 'avoid' }}>
                                {proposal.paymentTerms && (
                                    <div style={{ margin: '0 0 15px 0', padding: '12px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '6px', fontSize: '12px' }}>
                                        <strong style={{ color: '#b45309' }}>Odeme Sartlari:</strong> <span style={{ color: '#78350f' }}>{proposal.paymentTerms}</span>
                                    </div>
                                )}

                                {proposal.notes && (
                                    <div style={{ margin: '0 0 30px 0', fontSize: '12px', background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>Notlar:</strong>
                                        <p style={{ margin: 0, color: '#334155', lineHeight: '1.6' }}>{proposal.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Signature Section */}
                            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', pageBreakInside: 'avoid' }}>
                                {/* Prepared By */}
                                {proposal.preparedBy && (
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Teklifi Hazirlayan</div>
                                        <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 'bold' }}>{proposal.preparedBy.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{proposal.preparedBy.title}</div>
                                        <div style={{ marginTop: '30px', borderTop: '1px solid #cbd5e1', paddingTop: '5px', fontSize: '11px', color: '#94a3b8' }}>
                                            Imza
                                        </div>
                                    </div>
                                )}

                                {/* Company Approval */}
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Firma Onay</div>
                                    <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 'bold' }}>{proposal.company?.name || '_________________'}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Yetkili: {proposal.company?.contact_person || '_________________'}</div>
                                    <div style={{ marginTop: '30px', borderTop: '1px solid #cbd5e1', paddingTop: '5px', fontSize: '11px', color: '#94a3b8' }}>
                                        Imza ve Kaşe
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

import React, { useState } from 'react';
import { Search, Filter, Download, Trash2, FileText, Calendar, DollarSign, Building2, FileDown, Edit2, Mail } from 'lucide-react';

export function ArchiveView({ proposals, companies, onDelete, onExport, onEdit, onUpdateStatus }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterPreparer, setFilterPreparer] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Extract unique preparers from proposals
    const preparers = [...new Set(proposals.map(p => p.preparer).filter(Boolean))];

    const filteredProposals = proposals.filter(proposal => {
        const matchesSearch = !searchTerm ||
            proposal.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proposal.proposalNo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCompany = !filterCompany || proposal.company?.id === parseInt(filterCompany);
        const matchesPreparer = !filterPreparer || proposal.preparer === filterPreparer;
        const matchesStatus = !filterStatus || (proposal.status || 'Bekliyor') === filterStatus;

        return matchesSearch && matchesCompany && matchesPreparer && matchesStatus;
    });

    const getCompanyName = (proposal) => {
        // First try to find by ID (handling string/number mismatch)
        if (proposal.companyId) {
            const company = companies.find(c => c.id == proposal.companyId); // Use loose equality for string/number match
            if (company) return company.name;
        }
        // Fallback to embedded company object name if available
        if (proposal.company && proposal.company.name) return proposal.company.name;

        return 'Firma Belirtilmemiş';
    };

    const exportFunnel = () => {
        // Define CSV Headers
        const headers = [
            "Teklif No", "Versiyon", "Tarih", "Geçerlilik Tarihi", "Teklif Durumu", "Firma", "İlgili Kişi",
            "Hazırlayan", "Ürün", "Miktar", "Birim Fiyat ($)", "Kalem Tutarı ($)",
            "Teklif Toplamı ($)", "Kalem Tutarı (TL)", "Teklif Toplamı (TL)", "Kur", "Kar Marjı (%)"
        ];

        // Map filtered proposals to CSV rows (flatMap to create multiple rows per proposal)
        const rows = filteredProposals.flatMap(p => {
            // Handle old single item structure vs new multi-item structure
            const items = p.items && p.items.length > 0 ? p.items : [{
                product: p.product,
                quantity: p.quantity || 1,
                calculation: p.calculation,
                // If it's a single item legacy proposal, use total price as item price
                price: p.totalPrice || p.calculation?.suggested_price || 0
            }];

            const validUntil = new Date(new Date(p.date).getTime() + p.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR');
            const totalProposalPrice = p.totalPrice || p.calculation?.suggested_price || 0;
            const totalProposalPriceTry = p.totalPriceTry || p.calculation?.price_try || 0;
            const companyName = getCompanyName(p);

            // Create a row for each item
            return items.map(item => {
                const productName = item.product?.name || 'Ürün Belirtilmemiş';
                const qty = item.quantity || 1;

                // Calculate item prices
                // If item has a specific price (new structure), use it. Fallback to total/qty or calculation
                let itemUnitTestPrice = 0;
                let itemTotalPrice = 0;

                if (item.calculation?.suggested_price) {
                    itemTotalPrice = item.calculation.suggested_price;
                    itemUnitTestPrice = itemTotalPrice / qty;
                } else if (p.items && p.items.length > 0) {
                    // If we are in multi-item but calculation is missing on item level (shouldn't happen but safe guard)
                    // Estimate from total? No, better to show 0 if data missing
                } else {
                    // Legacy single item
                    itemTotalPrice = totalProposalPrice;
                    itemUnitTestPrice = itemTotalPrice / qty;
                }

                // TRY values
                const rate = item.calculation?.currency_rate || p.calculation?.currency_rate || 0;
                const margin = item.calculation?.profit_margin || p.calculation?.profit_margin || 0;
                const itemTotalPriceTry = itemTotalPrice * (rate || 1); // Fallback to 1 if rate missing to avoid NaN

                return [
                    p.proposalNo,
                    p.version || 'v1.0',
                    new Date(p.date).toLocaleDateString('tr-TR'),
                    validUntil,
                    p.status || 'Bekliyor', // Teklif Durumu column moved here
                    companyName,
                    p.company?.contact_person || '',
                    p.preparer || '',
                    productName,
                    qty,
                    itemUnitTestPrice.toFixed(2),
                    itemTotalPrice.toFixed(2),
                    totalProposalPrice.toFixed(2), // Proposal Total (Repeated for context)
                    itemTotalPriceTry.toFixed(2),
                    totalProposalPriceTry.toFixed(2), // Proposal Total TRY
                    rate,
                    margin
                ].map(cell => `"${cell}"`).join(',');
            });
        });

        // Combine headers and rows
        const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n'); // Add BOM for Excel UTF-8

        // Download logic
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Teklif_Funnel_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Teklif Arşivi</h2>
                <button
                    onClick={exportFunnel}
                    style={{
                        padding: '0.6rem 1.2rem',
                        background: '#10b981', // Emerald green
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <Download size={18} />
                    Funnel İndir
                </button>
            </div>

            {/* Filters Bar */}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--color-text-muted))' }}>
                    <Filter size={20} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Filtrele:</span>
                </div>

                <div style={{ position: 'relative', minWidth: '250px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--color-text-muted))' }} />
                    <input
                        type="text"
                        placeholder="Teklif No veya Ürün Ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            color: 'white'
                        }}
                    />
                </div>

                <select
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        background: '#1e293b', // Dark theme fix
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: 'white',
                        minWidth: '150px'
                    }}
                >
                    <option value="">Tüm Firmalar</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={filterPreparer}
                    onChange={(e) => setFilterPreparer(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        background: '#1e293b', // Dark theme fix
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: 'white',
                        minWidth: '150px'
                    }}
                >
                    <option value="">Tüm Teklif Verenler</option>
                    {preparers.map((p, index) => (
                        <option key={index} value={p}>{p}</option>
                    ))}
                </select>

                {(searchTerm || filterCompany || filterPreparer) && (
                    <button
                        onClick={() => { setSearchTerm(''); setFilterCompany(''); setFilterPreparer(''); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        <Trash2 size={14} /> Temizle
                    </button>
                )}
            </div>

            {/* Proposals List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredProposals.map((proposal) => (
                    <div key={proposal.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '2rem', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-muted))', marginBottom: '0.25rem' }}>
                                    Teklif No
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {proposal.proposalNo}
                                    {proposal.version && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            background: 'rgba(14, 99, 156, 0.2)',
                                            color: 'hsl(var(--color-accent))',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            fontWeight: 'bold'
                                        }}>
                                            {proposal.version}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {new Date(proposal.date).toLocaleDateString('tr-TR')}
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <select
                                        value={proposal.status || 'Bekliyor'}
                                        onChange={(e) => onUpdateStatus(proposal.id, e.target.value)}
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            border: 'none',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            backgroundColor:
                                                proposal.status === 'Kazanıldı' ? 'rgba(34, 197, 94, 0.2)' :
                                                    proposal.status === 'Kaybedildi' ? 'rgba(239, 68, 68, 0.2)' :
                                                        proposal.status === 'İptal Edildi' ? 'rgba(100, 116, 139, 0.2)' :
                                                            proposal.status === 'Teklif Gönderildi' ? 'rgba(59, 130, 246, 0.2)' :
                                                                'rgba(234, 179, 8, 0.2)', // Bekliyor (Yellow)
                                            color:
                                                proposal.status === 'Kazanıldı' ? '#22c55e' :
                                                    proposal.status === 'Kaybedildi' ? '#ef4444' :
                                                        proposal.status === 'İptal Edildi' ? '#94a3b8' :
                                                            proposal.status === 'Teklif Gönderildi' ? '#3b82f6' :
                                                                '#eab308',
                                            outline: 'none'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="Bekliyor" style={{ backgroundColor: '#1e293b', color: '#eab308' }}>Bekliyor</option>
                                        <option value="Teklif Gönderildi" style={{ backgroundColor: '#1e293b', color: '#3b82f6' }}>Teklif Gönderildi</option>
                                        <option value="Kazanıldı" style={{ backgroundColor: '#1e293b', color: '#22c55e' }}>Kazanıldı</option>
                                        <option value="Kaybedildi" style={{ backgroundColor: '#1e293b', color: '#ef4444' }}>Kaybedildi</option>
                                        <option value="İptal Edildi" style={{ backgroundColor: '#1e293b', color: '#94a3b8' }}>İptal Edildi</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-muted))', marginBottom: '0.25rem' }}>
                                    Firma
                                </div>
                                <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building2 size={16} style={{ color: 'hsl(var(--color-accent))' }} />
                                    {getCompanyName(proposal)}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.25rem' }}>
                                    {proposal.items && proposal.items.length > 1
                                        ? `Çoklu Ürün (${proposal.items.length} Kalem)`
                                        : proposal.product.name}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-muted))', marginBottom: '0.25rem' }}>
                                    Teklif Tutarı
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'hsl(var(--color-success))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <DollarSign size={18} />
                                    ${(proposal.totalPrice || proposal.calculation.suggested_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--color-text-secondary))', marginTop: '0.25rem' }}>
                                    ₺{(proposal.totalPriceTry || proposal.calculation.price_try).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button
                                    onClick={() => onEdit(proposal)}
                                    className="btn-secondary"
                                    style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    <Edit2 size={16} />
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => {
                                        const companyEmail = proposal.company?.email || '';
                                        const subject = `Teklif: ${proposal.proposalNo} ${proposal.version || ''}`;
                                        const body = `Sayın ${proposal.company?.contact_person || 'Yetkili'},\n\nEk'te ${proposal.proposalNo} ${proposal.version || ''} numaralı teklifimizi bulabilirsiniz.\n\nTeklif Özeti:\n- Teklif No: ${proposal.proposalNo} ${proposal.version || ''}\n- Tarih: ${new Date(proposal.date).toLocaleDateString('tr-TR')}\n- Tutar: $${(proposal.totalPrice || proposal.calculation.suggested_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\nSorularınız için lütfen bizimle iletişime geçin.\n\nSaygılarımızla,\n${proposal.preparedBy?.name || proposal.preparer || ''}`;
                                        window.location.href = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                    }}
                                    style={{
                                        padding: '0.65rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.85rem',
                                        background: 'rgba(34, 197, 94, 0.2)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '8px',
                                        color: '#22c55e',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Mail size={16} />
                                    Email
                                </button>
                                <button
                                    onClick={() => onExport(proposal, 'pdf')}
                                    className="btn-warning"
                                    style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                >
                                    <FileDown size={16} />
                                    PDF
                                </button>
                                <button
                                    onClick={() => onExport(proposal, 'word')}
                                    className="btn-primary"
                                    style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                >
                                    <FileDown size={16} />
                                    Word
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
                                            onDelete(proposal.id);
                                        }
                                    }}
                                    style={{
                                        padding: '0.65rem 1rem',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProposals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--color-text-muted))' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>
                        {proposals.length === 0
                            ? 'Henüz teklif oluşturulmamış.'
                            : 'Filtrelere uygun teklif bulunamadı.'}
                    </p>
                </div>
            )}

            {filteredProposals.length > 0 && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', color: 'hsl(var(--color-text-secondary))' }}>
                    Toplam {filteredProposals.length} teklif gösteriliyor
                </div>
            )}
        </div>
    );
}

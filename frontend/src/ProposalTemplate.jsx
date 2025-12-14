import React from 'react';

export const ProposalTemplate = ({ product, calculation, params, proposalNo }) => {
    const today = new Date().toLocaleDateString('tr-TR');

    return (
        <div id="proposal-template" style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            background: 'white',
            color: '#000',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Header */}
            <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '15px', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px' }}>CoreMind Teknoloji A.Ş.</h1>
                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '12px' }}>
                    Teknopark Istanbul, Pendik | Istanbul, Turkiye | info@coremind.com
                </p>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <h2 style={{
                    fontSize: '32px',
                    color: '#0f172a',
                    margin: '0 0 10px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                }}>
                    FIYAT TEKLIFI
                </h2>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                    <p style={{ margin: '5px 0' }}>Teklif No: <strong>{proposalNo}</strong></p>
                    <p style={{ margin: '5px 0' }}>Tarih: <strong>{today}</strong></p>
                    <p style={{ margin: '5px 0' }}>Gecerlilik: <strong>30 Gun</strong></p>
                </div>
            </div>

            {/* Product Info */}
            <div style={{ margin: '30px 0' }}>
                <h3 style={{
                    background: '#f1f5f9',
                    padding: '12px 15px',
                    margin: '0 0 15px 0',
                    color: '#0f172a',
                    borderLeft: '4px solid #0ea5e9'
                }}>
                    Urun Bilgileri
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', width: '40%', color: '#64748b' }}>Urun Kodu</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.id}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', color: '#64748b' }}>Kesit Sayisi</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.specs.sections}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', color: '#64748b' }}>Boyutlar</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.specs.dimensions_raw}</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', color: '#64748b' }}>Govde Capi</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.specs.diameter_mm} mm</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px', color: '#64748b' }}>Yuk Kapasitesi</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.specs.payload_capacity_kg} kg</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '12px', color: '#64748b' }}>Voltaj</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{product.specs.voltage}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Pricing */}
            <div style={{ margin: '40px 0' }}>
                <h3 style={{
                    background: '#f1f5f9',
                    padding: '12px 15px',
                    margin: '0 0 15px 0',
                    color: '#0f172a',
                    borderLeft: '4px solid #0ea5e9'
                }}>
                    Fiyat Bilgileri
                </h3>
                <div style={{
                    background: '#ecfeff',
                    border: '2px solid #06b6d4',
                    borderRadius: '8px',
                    padding: '25px',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>
                        Onerilen Satis Fiyati (KDV Haric)
                    </p>
                    <p style={{ margin: '0', fontSize: '36px', fontWeight: 'bold', color: '#0891b2' }}>
                        ${calculation.suggested_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '18px', color: '#64748b' }}>
                        (₺{calculation.price_try.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                position: 'absolute',
                bottom: '20mm',
                left: '20mm',
                right: '20mm',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '15px',
                fontSize: '11px',
                color: '#94a3b8',
                textAlign: 'center'
            }}>
                <p style={{ margin: 0 }}>
                    CoreMind Teknoloji A.S. | www.coremind.com | Gizli ve Ticari Sir Icerir
                </p>
            </div>
        </div>
    );
};

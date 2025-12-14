import React from 'react';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom/client';
import { EnhancedProposalTemplate } from './EnhancedProposalTemplate';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export async function exportProposalAsPDF(proposal, globalBranding = {}) {
    // Determine branding to use (proposal specific or global fallback)
    const companyBranding = proposal.senderCompany ? {
        company_name: proposal.senderCompany.name,
        company_address: proposal.senderCompany.address,
        company_email: proposal.senderCompany.email,
        company_phone: proposal.senderCompany.phone,
        company_logo: proposal.senderCompany.logo,
        company_tax_number: proposal.senderCompany.tax_number
    } : globalBranding;

    try {
        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // Render the proposal template
        const root = ReactDOM.createRoot(tempDiv);
        root.render(<EnhancedProposalTemplate proposal={proposal} companyBranding={companyBranding} />);

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500)); // Increased timeout for better rendering

        // Generate PDF
        const element = tempDiv.querySelector('#enhanced-proposal-template');
        const opt = {
            margin: 0,
            filename: `Teklif-${proposal.proposalNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        await html2pdf().set(opt).from(element).save();

        // Cleanup
        // document.body.removeChild(tempDiv); // Keep for debugging if needed, or remove
        setTimeout(() => document.body.removeChild(tempDiv), 1000);

        return true;
    } catch (error) {
        console.error("PDF Export Error:", error);
        throw error;
    }
}

export async function exportProposalAsWord(proposal, globalBranding = {}) {
    // Determine branding to use (proposal specific or global fallback)
    const companyBranding = proposal.senderCompany ? {
        company_name: proposal.senderCompany.name,
        company_address: proposal.senderCompany.address,
        company_email: proposal.senderCompany.email,
        company_phone: proposal.senderCompany.phone,
        company_logo: proposal.senderCompany.logo,
        company_tax_number: proposal.senderCompany.tax_number
    } : globalBranding;

    try {
        const today = new Date(proposal.date).toLocaleDateString('tr-TR');
        const validUntil = new Date(new Date(proposal.date).getTime() + proposal.validityDays * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR');

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Header
                    new Paragraph({
                        text: companyBranding?.company_name || "Şirket Adı",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph({
                        text: `${companyBranding?.company_address || 'Şirket Adresi'} | ${companyBranding?.company_email || 'email@sirket.com'}${companyBranding?.company_tax_number ? ` | Vergi No: ${companyBranding.company_tax_number}` : ''}`,
                        spacing: { after: 400 }
                    }),

                    // Title
                    new Paragraph({
                        text: "FIYAT TEKLIFI",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 200 }
                    }),

                    // Proposal Info
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Teklif No: ", bold: false }),
                            new TextRun({ text: proposal.proposalNo, bold: true })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tarih: ", bold: false }),
                            new TextRun({ text: today, bold: true })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Gecerlilik: ", bold: false }),
                            new TextRun({ text: validUntil, bold: true })
                        ],
                        spacing: { after: 400 }
                    }),

                    // Company Info
                    ...(proposal.company ? [
                        new Paragraph({
                            text: `Sayin ${proposal.company.contact_person}`,
                            bold: true,
                            spacing: { before: 200 }
                        }),
                        new Paragraph({ text: proposal.company.name }),
                        ...(proposal.company.address ? [new Paragraph({ text: proposal.company.address })] : []),
                        ...(proposal.company.email ? [new Paragraph({ text: `E-posta: ${proposal.company.email}` })] : []),
                        ...(proposal.company.phone ? [new Paragraph({ text: `Tel: ${proposal.company.phone}`, spacing: { after: 400 } })] : []),
                    ] : []),

                    // Introduction
                    new Paragraph({
                        text: `Asagida teknik detaylari sunulan ${proposal.product.name} urunu icin teklifimizi sunmaktan mutluluk duyariz.`,
                        spacing: { before: 200, after: 400 }
                    }),

                    // Product Specifications Header
                    new Paragraph({
                        text: "Urun Bilgileri",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),

                    // Product Table
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Urun Kodu")] }),
                                    new TableCell({ children: [new Paragraph(proposal.product.id)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Kesit Sayisi")] }),
                                    new TableCell({ children: [new Paragraph(String(proposal.product.specs.sections))] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Boyutlar")] }),
                                    new TableCell({ children: [new Paragraph(proposal.product.specs.dimensions_raw)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Govde Capi")] }),
                                    new TableCell({ children: [new Paragraph(`${proposal.product.specs.diameter_mm} mm`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Yuk Kapasitesi")] }),
                                    new TableCell({ children: [new Paragraph(`${proposal.product.specs.payload_capacity_kg} kg`)] })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph("Voltaj")] }),
                                    new TableCell({ children: [new Paragraph(proposal.product.specs.voltage)] })
                                ]
                            })
                        ]
                    }),

                    // Pricing
                    new Paragraph({
                        text: "Fiyat Bilgileri",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }),
                    new Paragraph({
                        text: "Onerilen Satis Fiyati (KDV Haric)",
                        alignment: AlignmentType.CENTER
                    }),
                    new Paragraph({
                        text: `$${proposal.calculation.suggested_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        text: `(₺${proposal.calculation.price_try.toLocaleString('tr-TR', { minimumFractionDigits: 2 })})`,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),

                    // Payment Terms
                    ...(proposal.paymentTerms ? [
                        new Paragraph({
                            children: [
                                new TextRun({ text: "Odeme Sartlari: ", bold: true }),
                                new TextRun({ text: proposal.paymentTerms })
                            ],
                            spacing: { before: 200, after: 200 }
                        })
                    ] : []),

                    // Notes
                    ...(proposal.notes ? [
                        new Paragraph({
                            text: "Notlar:",
                            bold: true,
                            spacing: { before: 200 }
                        }),
                        new Paragraph({
                            text: proposal.notes,
                            spacing: { after: 400 }
                        })
                    ] : []),

                    // Signature Section
                    new Paragraph({
                        text: "Teklifi Hazirlayan:",
                        bold: true,
                        spacing: { before: 600 }
                    }),
                    ...(proposal.preparedBy ? [
                        new Paragraph({ text: proposal.preparedBy.name }),
                        ...(proposal.preparedBy.title ? [new Paragraph({ text: proposal.preparedBy.title })] : []),
                        ...(proposal.preparedBy.email ? [new Paragraph({ text: proposal.preparedBy.email })] : []),
                        ...(proposal.preparedBy.phone ? [new Paragraph({ text: proposal.preparedBy.phone })] : []),
                    ] : []),

                    new Paragraph({
                        text: "_____________________",
                        spacing: { before: 400 }
                    }),
                    new Paragraph({
                        text: "Imza",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 }
                    }),

                    // Footer
                    new Paragraph({
                        text: `${companyBranding?.company_name || 'Şirket Adı'}${companyBranding?.company_tax_number ? ` | Vergi No: ${companyBranding.company_tax_number}` : ''} | Gizli ve Ticari Sır İçerir`,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 600 }
                    })
                ]
            }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Teklif-${proposal.proposalNo}.docx`);

        return true;
    } catch (error) {
        console.error("Word Export Error:", error);
        throw error;
    }
}

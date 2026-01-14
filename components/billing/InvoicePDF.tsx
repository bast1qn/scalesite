import type { FC } from 'react';
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Invoice, LineItem } from './InvoiceList';
import { formatCurrency, formatDateShort } from '../../lib/utils';

/**
 * InvoicePDF Component
 *
 * Generates professional PDF invoices using jsPDF and html2canvas
 *
 * @param invoice - Invoice to generate PDF for
 * @param companyInfo - Company information for the invoice header
 * @param onGenerated - Callback when PDF is generated
 * @param className - Additional CSS classes (hidden, used for PDF generation)
 */

export interface CompanyInfo {
    name: string;
    address: string;
    email: string;
    phone: string;
    taxId?: string;
    website?: string;
    logo?: string;
}

export interface InvoicePDFProps {
    invoice: Invoice;
    companyInfo?: CompanyInfo;
    onGenerated?: (pdfBlob: Blob) => void;
    className?: string;
}

// Default company info
const defaultCompanyInfo: CompanyInfo = {
    name: 'ScaleSite',
    address: 'Musterstraße 123, 12345 Musterstadt',
    email: 'info@scalesite.de',
    phone: '+49 123 4567890',
    taxId: 'DE123456789',
    website: 'https://scalesite.de'
};

const InvoicePDF = forwardRef<HTMLDivElement, InvoicePDFProps>(({
    invoice,
    companyInfo = defaultCompanyInfo,
    onGenerated,
    className = ''
}, ref) => {
    const pdfRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    // Get status label
    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            draft: 'Entwurf',
            sent: 'Gesendet',
            paid: 'Bezahlt',
            overdue: 'Überfällig',
            cancelled: 'Storniert'
        };
        return statusMap[status] || status;
    };

    // Generate PDF
    const generatePDF = async () => {
        if (!pdfRef.current || generating) return;

        setGenerating(true);

        try {
            // Create canvas from HTML
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Calculate dimensions
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Get blob
            const pdfBlob = pdf.output('blob');

            // Trigger download
            pdf.save(`Rechnung_${invoice.invoiceNumber}.pdf`);

            // Callback
            onGenerated?.(pdfBlob);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setGenerating(false);
        }
    };

    // Expose generate function via ref
    useImperativeHandle(ref, () => ({
        generatePDF
    }));

    return (
        <>
            {/* Hidden PDF Template */}
            <div className={`print-only ${className}`} style={{ display: 'none' }}>
                <div
                    ref={pdfRef}
                    className="pdf-template"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm',
                        backgroundColor: '#ffffff',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '10pt',
                        lineHeight: '1.5',
                        color: '#1e293b'
                    }}
                >
                    {/* Header */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            {/* Company Info */}
                            <div>
                                <h1 style={{ fontSize: '24pt', fontWeight: 'bold', color: '#7c3aed', marginBottom: '10px' }}>
                                    {companyInfo.name}
                                </h1>
                                <p style={{ margin: '2px 0', color: '#64748b' }}>{companyInfo.address}</p>
                                <p style={{ margin: '2px 0', color: '#64748b' }}>{companyInfo.email}</p>
                                <p style={{ margin: '2px 0', color: '#64748b' }}>{companyInfo.phone}</p>
                                {companyInfo.website && (
                                    <p style={{ margin: '2px 0', color: '#64748b' }}>{companyInfo.website}</p>
                                )}
                                {companyInfo.taxId && (
                                    <p style={{ margin: '2px 0', color: '#64748b', fontSize: '9pt' }}>
                                        Steuernummer: {companyInfo.taxId}
                                    </p>
                                )}
                            </div>

                            {/* Invoice Number & Date */}
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ fontSize: '18pt', fontWeight: 'bold', marginBottom: '10px' }}>
                                    RECHNUNG
                                </h2>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Rechnungsnummer:</strong> {invoice.invoiceNumber}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Datum:</strong> {formatDateShort(invoice.date)}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Fällig am:</strong> {formatDateShort(invoice.dueDate)}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <strong>Status:</strong> {getStatusLabel(invoice.status)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Client Info */}
                    {invoice.clientInfo && (
                        <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#334155' }}>
                                Rechnungsempfänger
                            </h3>
                            <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{invoice.clientInfo.name}</p>
                            {invoice.clientInfo.company && (
                                <p style={{ margin: '2px 0' }}>{invoice.clientInfo.company}</p>
                            )}
                            <p style={{ margin: '2px 0', color: '#64748b' }}>{invoice.clientInfo.email}</p>
                        </div>
                    )}

                    {/* Description */}
                    {invoice.description && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '5px', color: '#334155' }}>
                                Betreff
                            </h3>
                            <p style={{ margin: '0', color: '#475569' }}>{invoice.description}</p>
                        </div>
                    )}

                    {/* Line Items */}
                    {invoice.lineItems && invoice.lineItems.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                                        <th style={{
                                            padding: '10px',
                                            textAlign: 'left',
                                            fontSize: '9pt',
                                            fontWeight: 'bold',
                                            color: '#475569',
                                            borderBottom: '2px solid #cbd5e1'
                                        }}>
                                            Beschreibung
                                        </th>
                                        <th style={{
                                            padding: '10px',
                                            textAlign: 'center',
                                            fontSize: '9pt',
                                            fontWeight: 'bold',
                                            color: '#475569',
                                            borderBottom: '2px solid #cbd5e1'
                                        }}>
                                            Menge
                                        </th>
                                        <th style={{
                                            padding: '10px',
                                            textAlign: 'right',
                                            fontSize: '9pt',
                                            fontWeight: 'bold',
                                            color: '#475569',
                                            borderBottom: '2px solid #cbd5e1'
                                        }}>
                                            Einzelpreis
                                        </th>
                                        <th style={{
                                            padding: '10px',
                                            textAlign: 'right',
                                            fontSize: '9pt',
                                            fontWeight: 'bold',
                                            color: '#475569',
                                            borderBottom: '2px solid #cbd5e1'
                                        }}>
                                            Gesamtpreis
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.lineItems.map((item, index) => (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid #e2e8f0',
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                                        }}>
                                            <td style={{ padding: '10px', color: '#1e293b' }}>
                                                {item.description}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'center', color: '#1e293b' }}>
                                                {item.quantity}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'right', color: '#1e293b' }}>
                                                {formatCurrency(item.unitPrice, invoice.currency)}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#1e293b' }}>
                                                {formatCurrency(item.total, invoice.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10pt' }}>
                                <span style={{ color: '#64748b' }}>Zwischensumme:</span>
                                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                    {formatCurrency(invoice.subtotal, invoice.currency)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10pt' }}>
                                <span style={{ color: '#64748b' }}>MwSt. (19%):</span>
                                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px 0',
                                borderTop: '2px solid #cbd5e1',
                                marginTop: '10px'
                            }}>
                                <span style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1e293b' }}>Gesamtbetrag:</span>
                                <span style={{ fontSize: '14pt', fontWeight: 'bold', color: '#7c3aed' }}>
                                    {formatCurrency(invoice.total, invoice.currency)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20mm',
                        left: '20mm',
                        right: '20mm',
                        padding: '15px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        fontSize: '9pt',
                        color: '#64748b'
                    }}>
                        <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#475569' }}>Zahlungsinformationen</p>
                        <p style={{ margin: '2px 0' }}>Bank: Musterbank</p>
                        <p style={{ margin: '2px 0' }}>IBAN: DE89 3704 0044 0532 0130 00</p>
                        {/* Demo BIC - replace with real bank data in production */}
                        <p style={{ margin: '2px 0' }}>BIC: COBADEFFXXX</p>
                        <p style={{ margin: '10px 0 0 0', fontSize: '8pt' }}>
                            Diese Rechnung wurde automatisch erstellt. Bei Fragen kontaktieren Sie uns unter {companyInfo.email}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Generate Button (for external use) */}
            <button
                onClick={generatePDF}
                disabled={generating}
                className="hidden"
                aria-hidden="true"
            >
                Generate PDF
            </button>
        </>
    );
});

InvoicePDF.displayName = 'InvoicePDF';

export default InvoicePDF;

// Helper function to generate PDF programmatically
export const generateInvoicePDF = async (
    invoice: Invoice,
    companyInfo?: CompanyInfo
): Promise<Blob | null> => {
    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    try {
        // This would need to be implemented differently for programmatic use
        // For now, return null
        return null;
    } finally {
        document.body.removeChild(container);
    }
};

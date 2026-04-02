import React from 'react';

const QR_BANK_ID = "970418";
const QR_ACC_NO = "8608393979";
const QR_ACC_NAME = "CONG TY CO PHAN CANG SAI GON";

export interface A4Row {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  containerQty: number;
  startDate: string;
  endDate: string;
  lineTotal: number;
}

interface PdfStrings {
  company: string;
  companyAddr: string;
  phone: string;
  title: string;
  vat: string;
  thNo: string; thService: string; thUnit: string; thQty: string; thPrice: string; thAmount: string;
  totalPayment: string;
  inWords: string;
  paymentInfo: string;
  bank: string; accountName: string; accountNo: string;
  noteTitle: string;
  notes: string;
}

interface Props {
  a4Ref: React.RefObject<HTMLDivElement>;
  quoteNo: string;
  quoteDate: string;
  customerName: string;
  taxCode: string;
  address: string;
  phone: string;
  notes: string;
  rows: A4Row[];
  grand: number;
  inWords: string;
  dong: string;
  storageKw: string;
  powerKw: string;
  logoBase64: string;
  pdf: PdfStrings;
}

export default function QuotationA4Template({
  a4Ref, quoteNo, quoteDate, customerName, taxCode, address, phone, notes,
  rows, grand, inWords, dong, storageKw, powerKw, logoBase64, pdf
}: Props) {
  return (
    <div
      ref={a4Ref}
      style={{
        position: 'absolute', left: '-9999px', top: 0,
        background: 'white', width: '210mm', minHeight: '297mm',
        padding: '15mm', boxSizing: 'border-box',
        fontFamily: "'Roboto', sans-serif", fontSize: '11pt', color: '#333'
      }}
    >
      {/* Header */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', verticalAlign: 'middle', paddingRight: 12 }}>
              {logoBase64
                ? <img src={logoBase64} alt="Logo" style={{ maxWidth: 90, height: 'auto', display: 'block' }} />
                : <div style={{ width: 90, height: 60, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>Logo</div>
              }
            </td>
            <td style={{ verticalAlign: 'middle' }}>
              <strong style={{ fontSize: 13 }}>{pdf.company}</strong><br />
              <span style={{ fontSize: 10 }}>{pdf.phone}: 02838728546</span><br />
              <span style={{ fontSize: 10 }}>{pdf.companyAddr}</span><br />
              <span style={{ fontSize: 10 }}>Email: cms.cont@tanthuan.com.vn</span>
            </td>
            <td style={{ width: '30%', textAlign: 'right', verticalAlign: 'middle', fontSize: 11 }}>
              <div><strong>Số: </strong>{quoteNo}</div>
              <div><strong>Ngày: </strong>{quoteDate}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{pdf.title}</h1>
        <p style={{ margin: '4px 0 0', fontStyle: 'italic', fontSize: 12 }}>{pdf.vat}</p>
      </div>

      {/* Customer info */}
      <table style={{ width: '100%', fontSize: 11, marginBottom: '0.8rem' }}>
        <tbody>
          <tr><td style={{ width: '22%', fontWeight: 700, paddingBottom: 4 }}>Tên khách hàng:</td><td>{customerName}</td></tr>
          <tr><td style={{ fontWeight: 700, paddingBottom: 4 }}>Mã số thuế:</td><td>{taxCode}</td></tr>
          <tr><td style={{ fontWeight: 700, paddingBottom: 4 }}>Địa chỉ:</td><td>{address}</td></tr>
          <tr><td style={{ fontWeight: 700, paddingBottom: 4 }}>Điện thoại:</td><td>{phone}</td></tr>
          {notes && <tr><td style={{ fontWeight: 700, paddingBottom: 4 }}>Ghi chú:</td><td>{notes}</td></tr>}
        </tbody>
      </table>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginBottom: '1rem' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center', width: 36 }}>{pdf.thNo}</th>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'left' }}>{pdf.thService}</th>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center', width: 50 }}>{pdf.thUnit}</th>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center', width: 44 }}>{pdf.thQty}</th>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'right', width: 90 }}>{pdf.thPrice}</th>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'right', width: 100 }}>{pdf.thAmount}</th>
          </tr>
        </thead>
        <tbody>
          {rows.filter(r => r.name).map((r, i) => {
            const isStorage = r.name.toLowerCase().includes(storageKw);
            const isPower = r.name.toLowerCase().includes(powerKw);
            let detail = '';
            if (isStorage && r.startDate && r.endDate) {
              const days = Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000) || r.quantity;
              detail = ` (SL: ${r.containerQty} cont x ${days} ngày)`;
            } else if (isPower) {
              detail = ` (SL: ${r.containerQty} cont x ${r.quantity} giờ)`;
            }
            return (
              <tr key={r.id}>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center' }}>{i + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>{r.name}{detail}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center' }}>{r.unit}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center' }}>{r.quantity}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'right' }}>{r.price.toLocaleString()}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'right' }}>{r.lineTotal.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Total */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, border: '1px solid #ccc' }}>
        <tbody>
          <tr>
            <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', width: '65%' }}>{pdf.totalPayment}</td>
            <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>{grand.toLocaleString()} đ</td>
          </tr>
          <tr style={{ background: '#f9f9f9' }}>
            <td colSpan={2} style={{ padding: '6px 8px' }}>
              <strong>{pdf.inWords} </strong><em>{inWords} {dong}.</em>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Notes */}
      <div style={{ marginTop: 16, fontSize: 10, border: '1px solid #ddd', padding: '10px 14px', borderRadius: 5, background: '#fafafa' }}>
        <strong>{pdf.noteTitle}</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }} dangerouslySetInnerHTML={{ __html: pdf.notes }} />
      </div>

      {/* Payment info + QR */}
      <table style={{ width: '100%', marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', fontSize: 11 }}>
              <strong>{pdf.paymentInfo}</strong><br /><br />
              {pdf.bank}: <strong>BIDV - Chau Thanh Sai Gon</strong><br />
              {pdf.accountName}: <strong>CONG TY CO PHAN CANG SAI GON</strong><br />
              {pdf.accountNo}: <strong style={{ color: '#d0021b' }}>8608393979</strong>
            </td>
            <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
              <img
                src={`https://img.vietqr.io/image/${QR_BANK_ID}-${QR_ACC_NO}-compact.png?amount=${grand}&addInfo=${encodeURIComponent('Thanh toan bao gia ' + quoteNo)}&accountName=${encodeURIComponent(QR_ACC_NAME)}`}
                alt="QR"
                style={{ width: 160, height: 160 }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

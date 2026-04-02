import React from 'react';
import { QuotationHistoryItem } from '../../types';

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', fontSize: 14, fontWeight: 700,
  color: '#6c757d', textTransform: 'uppercase', border: '1px solid #dee2e6'
};
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', border: '1px solid #dee2e6', verticalAlign: 'middle'
};

interface Props {
  quotations: QuotationHistoryItem[];
  onLoad: (q: QuotationHistoryItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function QuotationHistoryModal({ quotations, onLoad, onDelete, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, width: '90%', maxWidth: 800, maxHeight: '80vh', overflow: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Lịch sử báo giá</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6c757d' }}>×</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={thStyle}>Số BG</th>
              <th style={thStyle}>Ngày</th>
              <th style={thStyle}>Khách hàng</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tổng tiền</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {[...quotations].reverse().map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={tdStyle}>{q.quotationNo}</td>
                <td style={tdStyle}>{q.date}</td>
                <td style={tdStyle}>{q.customerName}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{q.total.toLocaleString()} đ</td>
                <td style={{ ...tdStyle, display: 'flex', gap: 8 }}>
                  <button onClick={() => onLoad(q)}
                    style={{ background: '#4361ee', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                    Xem
                  </button>
                  <button onClick={() => onDelete(q.id)}
                    style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#adb5bd' }}>Chưa có báo giá nào được lưu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: '#495057', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #ced4da', borderRadius: 4, padding: '10px 12px', fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#fff', marginBottom: 0 };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#6c757d', textTransform: 'uppercase', border: '1px solid #dee2e6' };
const tdStyle: React.CSSProperties = { padding: '10px 12px', border: '1px solid #dee2e6', verticalAlign: 'middle' };

export interface TariffItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

interface Props {
  tariffList: TariffItem[];
  tariffForm: { name: string; unit: string; price: number };
  tariffEditId: string | null;
  onFormChange: (patch: Partial<{ name: string; unit: string; price: number }>) => void;
  onSave: () => void;
  onEdit: (item: TariffItem) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportExcel: () => void;
  onClose: () => void;
}

export default function QuotationTariffModal({
  tariffList, tariffForm, tariffEditId,
  onFormChange, onSave, onEdit, onDelete, onCancelEdit,
  onImportExcel, onExportExcel, onClose
}: Props) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'auto', padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>📋 Quản lý phương án (Tariff)</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6c757d' }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <label style={{ background: '#28a745', color: '#fff', padding: '8px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            📥 Import Excel
            <input type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={onImportExcel} />
          </label>
          <button onClick={onExportExcel} style={{ background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            📤 Export Excel
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end', marginBottom: 20, padding: 16, background: '#f8f9fa', borderRadius: 8 }}>
          <div style={{ flex: '1 1 200px', minWidth: 160 }}>
            <label style={labelStyle}>Tên phương án</label>
            <input style={inputStyle} placeholder="Tên phương án" value={tariffForm.name}
              onChange={e => onFormChange({ name: e.target.value })} />
          </div>
          <div style={{ flex: '0 0 80px' }}>
            <label style={labelStyle}>ĐVT</label>
            <input style={{ ...inputStyle, width: 80 }} placeholder="cont" value={tariffForm.unit}
              onChange={e => onFormChange({ unit: e.target.value })} />
          </div>
          <div style={{ flex: '0 0 130px' }}>
            <label style={labelStyle}>Đơn giá</label>
            <input type="number" min={0} style={{ ...inputStyle, width: 130, textAlign: 'right' }} value={tariffForm.price}
              onChange={e => onFormChange({ price: Number(e.target.value) })} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onSave}
              style={{ background: '#4361ee', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 14 }}>
              {tariffEditId ? '💾 Cập nhật' : '➕ Lưu'}
            </button>
            {tariffEditId && (
              <button onClick={onCancelEdit}
                style={{ background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                Hủy
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#e9ecef' }}>
                <th style={{ ...thStyle }}>Tên</th>
                <th style={{ ...thStyle, width: 54, textAlign: 'center' }}>ĐVT</th>
                <th style={{ ...thStyle, width: 110, textAlign: 'right' }}>Đơn giá</th>
                <th style={{ ...thStyle, width: 72, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {tariffList.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', background: tariffEditId === item.id ? '#fff3cd' : undefined }}>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.unit}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{item.price.toLocaleString()} đ</td>
                  <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => onEdit(item)} title="Sửa"
                      style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffc107', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 15, lineHeight: 1, marginRight: 4 }}>
                      ✏️
                    </button>
                    <button onClick={() => onDelete(item.id)} title="Xóa"
                      style={{ background: '#f8d7da', color: '#842029', border: '1px solid #f5c2c7', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 15, lineHeight: 1 }}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {tariffList.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#adb5bd' }}>Chưa có phương án nào. Hãy thêm mới hoặc Import từ Excel.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

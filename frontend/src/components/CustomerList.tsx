import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Trash2, Edit2, X, Save, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logiStorage } from '../lib/storage';
import { Customer } from '../types';
import { useAppContext } from '../context/AppContext';
import * as S from '../styles/CustomerList.styles';
import { motionFadeUp, motionFadeIn, motionScaleIn } from '../styles/shared';

interface CustomerListProps {
  onCustomerToQuote?: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ onCustomerToQuote }) => {
  const { customers, setCustomers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '', email: '', phone: '', address: '', taxCode: '', status: 'active'
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.taxCode.includes(searchTerm)
  );

  const handleOpenForm = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, taxCode: customer.taxCode, status: customer.status });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '', taxCode: '', status: 'active' });
    }
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.taxCode) return;
    const newCustomer: Customer = { id: editingCustomer ? editingCustomer.id : Date.now().toString(), ...formData };
    logiStorage.saveCustomer(newCustomer);
    setCustomers(logiStorage.getCustomers());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      logiStorage.deleteCustomer(id);
      setCustomers(logiStorage.getCustomers());
    }
  };

  return (
    <div className={S.wrapper}>
      <div className={S.headerRow}>
        <div className={S.headerCol}>
          <h1 className={S.title}>Danh sách</h1>
          <p className={S.subtitle}>Lưu trữ và quản lý thông tin</p>
        </div>
        <button onClick={() => handleOpenForm()} className={S.addBtn}>
          <Plus className="w-5 h-5" /> Thêm
        </button>
      </div>

      <div className={S.searchBar}>
        <div className={S.searchWrap}>
          <Search className={S.searchIcn} />
          <input type="text" placeholder="Tìm kiếm theo tên, mã số thuế..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={S.searchInp} />
        </div>
      </div>

      <div className={S.grid}>
        {filteredCustomers.map((customer, i) => (
          <motion.div key={customer.id} {...motionFadeUp} transition={{ delay: i * 0.05 }} className={S.customerCard}>
            <div className={S.cardTop}>
              <div className={S.cardTopLeft}>
                <div className={S.cardIconBox}><Users className={S.cardIcon} /></div>
                <div>
                  <h3 className={S.cardName}>{customer.name}</h3>
                  <p className={S.cardTax}>MST: {customer.taxCode}</p>
                </div>
              </div>
              <div className={S.cardBadgeRow}>
                <span className={S.cardBadge(customer.status === 'active')}>{customer.status}</span>
              </div>
            </div>

            <div className={S.contactBlock}>
              <div className={S.contactRow}><Mail className={S.contactIcon} />{customer.email || '—'}</div>
              <div className={S.contactRow}><Phone className={S.contactIcon} />{customer.phone || '—'}</div>
              <div className={S.addressRow}><MapPin className={S.addressIcon} /><span>{customer.address || '—'}</span></div>
            </div>

            <div className={S.actionRow}>
              {onCustomerToQuote && (
                <button onClick={() => onCustomerToQuote(customer)} className={S.quoteBtn}>
                  <FileText className={S.smallIcon} /> Tạo báo giá
                </button>
              )}
              <button onClick={() => handleOpenForm(customer)} className={S.editBtn}>
                <Edit2 className={S.smallIcon} /> Sửa
              </button>
              <button onClick={() => handleDelete(customer.id)} className={S.deleteBtn}>
                <Trash2 className={S.deleteIcon} />
              </button>
            </div>
          </motion.div>
        ))}
        {filteredCustomers.length === 0 && <div className={S.empty}>Không tìm thấy khách hàng nào.</div>}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div {...motionFadeIn} className={S.modalBg}>
            <motion.div {...motionScaleIn} className={S.modalBox}>
              <div className={S.modalHead}>
                <h3 className={S.modalTtl}>{editingCustomer ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng mới'}</h3>
                <button onClick={() => setShowForm(false)} className={S.modalCloseBtn}><X className="w-5 h-5" /></button>
              </div>
              <div className={S.modalBody}>
                <form id="customerForm" onSubmit={handleSave} className="space-y-6">
                  <div className={S.formGrid}>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Tên đơn vị / Khách hàng *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Mã số thuế *</label>
                      <input type="text" required value={formData.taxCode} onChange={e => setFormData({...formData, taxCode: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Số điện thoại</label>
                      <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroupFull}>
                      <label className={S.fieldLabel}>Địa chỉ xuất hóa đơn</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Trạng thái</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'active'|'inactive'})} className={S.fieldSelect}>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Đã ngừng giao dịch</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className={S.modalFoot}>
                <button type="button" onClick={() => setShowForm(false)} className={S.cancelBtn}>Hủy bỏ</button>
                <button type="submit" form="customerForm" className={S.saveBtn}><Save className="w-4 h-4" /> Lưu thông tin</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerList;

import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Tag, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logiStorage } from '../lib/storage';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import * as S from '../styles/ServiceCatalog.styles';
import { motionFadeIn, motionScaleIn } from '../styles/shared';

const ServiceCatalog: React.FC = () => {
  const { services, setServices, userRole, isAdminMode } = useAppContext();
  const canEdit = isAdminMode && userRole !== 'guest';
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Product | null>(null);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({ name: '', unit: '', price: 0, category: '' });

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenForm = (service?: Product) => {
    if (service) {
      setEditingService(service);
      setFormData({ name: service.name, unit: service.unit, price: service.price, category: service.category || '' });
    } else {
      setEditingService(null);
      setFormData({ name: '', unit: '', price: 0, category: '' });
    }
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.unit) return;
    const newService: Product = { id: editingService?.id || Date.now().toString(), ...formData, price: Number(formData.price) };
    logiStorage.saveService(newService);
    setServices(logiStorage.getServices());
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      logiStorage.deleteService(id);
      setServices(logiStorage.getServices());
    }
  };

  return (
    <div className={S.wrapper}>
      <div className={S.headerRow}>
        <div className={S.headerCol}>
          <h1 className={S.title}>Danh mục</h1>
          <p className={S.subtitle}>Quản lý bảng giá và phương án</p>
        </div>
        {canEdit && <button onClick={() => handleOpenForm()} className={S.addBtn}>
          <Plus className="w-5 h-5" /> Thêm dịch vụ
        </button>}
      </div>

      <div className={S.searchBar}>
        <div className={S.searchWrap}>
          <Search className={S.searchIcn} />
          <input type="text" placeholder="Tìm kiếm dịch vụ, danh mục..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={S.searchInp} />
        </div>
      </div>

      <div className={S.tableCard}>
        <div className={S.tableScroll}>
          <table className={S.table}>
            <thead>
              <tr className={S.thead}>
                <th className={S.thFirst}>Tên dịch vụ</th>
                <th className={S.th}>Danh mục</th>
                <th className={S.th}>Đơn vị</th>
                <th className={S.thRight}>Đơn giá (VND)</th>
                <th className={S.thAction}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, i) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={S.rowBase}
                >
                  <td className={S.tdFirst}>
                    <div className={S.tdNameRow}>
                      <div className={S.tdNameIcon}><Package className="w-5 h-5" /></div>
                      <span className={S.tdNameText}>{service.name}</span>
                    </div>
                  </td>
                  <td className={S.td}>
                    <span className={S.tdCategory}><Tag className="w-3 h-3" /> {service.category || 'Chung'}</span>
                  </td>
                  <td className={S.td}><span className={S.tdUnit}>{service.unit}</span></td>
                  <td className={S.td}>
                    <div className={S.tdPriceRow}>{service.price.toLocaleString('vi-VN')} đ</div>
                  </td>
                  <td className={S.tdAction}>
                    {canEdit && <div className={S.actionRow}>
                      <button onClick={() => handleOpenForm(service)} className={S.editBtnIcon}><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => service.id && handleDelete(service.id)} className={S.deleteBtnIcon}><Trash2 className="w-4 h-4" /></button>
                    </div>}
                  </td>
                </motion.tr>
              ))}
              {filteredServices.length === 0 && (
                <tr><td colSpan={5} className={S.empty}>Không có dịch vụ nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div {...motionFadeIn} className={S.modalBg}>
            <motion.div {...motionScaleIn} className={S.modalBox}>
              <div className={S.modalHead}>
                <h3 className={S.modalTtl}>{editingService ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ mới'}</h3>
                <button onClick={() => setShowForm(false)} className={S.modalCloseBtn}><X className="w-5 h-5" /></button>
              </div>
              <div className={S.modalBody}>
                <form id="serviceForm" onSubmit={handleSave} className={S.formSpace}>
                  <div className={S.fieldGroup}>
                    <label className={S.fieldLabel}>Tên dịch vụ *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={S.fieldInput} />
                  </div>
                  <div className={S.fieldRow}>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Danh mục</label>
                      <input type="text" placeholder="Vận tải, Kho bãi..." value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={S.fieldInput} />
                    </div>
                    <div className={S.fieldGroup}>
                      <label className={S.fieldLabel}>Đơn vị tính *</label>
                      <input type="text" required placeholder="cont, chuyến, tấn..." value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className={S.fieldInput} />
                    </div>
                  </div>
                  <div className={S.fieldGroup}>
                    <label className={S.fieldLabel}>Đơn giá (VND) *</label>
                    <input type="number" required min="0" step="1000" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className={`${S.fieldInput} font-mono`} />
                  </div>
                </form>
              </div>
              <div className={S.modalFoot}>
                <button type="button" onClick={() => setShowForm(false)} className={S.cancelBtn}>Hủy bỏ</button>
                <button type="submit" form="serviceForm" className={S.saveBtn}><Save className="w-4 h-4" /> Lưu thông tin</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceCatalog;

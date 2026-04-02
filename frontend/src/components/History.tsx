import React, { useState } from 'react';
import { Search, FileText, Download, Calendar, Eye, Trash2, Filter, User } from 'lucide-react';
import { motion } from 'motion/react';
import { logiStorage } from '../lib/storage';
import { useAppContext } from '../context/AppContext';
import * as S from '../styles/History.styles';

const History: React.FC = () => {
  const { quotations, setQuotations } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = quotations.filter(q =>
    (q.quotationNo && q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (q.customerName && q.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa báo giá này?')) {
      logiStorage.deleteQuotation(id);
      setQuotations(logiStorage.getQuotations());
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'sent') return S.badgeInfo;
    if (status === 'approved') return S.badgeSuccess;
    if (status === 'rejected') return S.badgeDanger;
    return S.badgeDefault;
  };

  return (
    <div className={S.wrapper}>
      <div className={S.headerRow}>
        <div className={S.headerCol}>
          <h1 className={S.title}>Lịch sử</h1>
          <p className={S.subtitle}>Quản lý và theo dõi các báo giá đã phát hành</p>
        </div>
        <button className={S.exportBtn}><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className={S.searchBar}>
        <div className={S.searchWrap}>
          <Search className={S.searchIcn} />
          <input type="text" placeholder="Tìm kiếm theo số báo giá, tên khách hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={S.searchInp} />
        </div>
        <button className={S.filterBtn}><Filter className="w-4 h-4" /> Bộ lọc</button>
      </div>

      <div className={S.tableCard}>
        <div className={S.tableScroll}>
          <table className={S.table}>
            <thead>
              <tr className={S.thead}>
                <th className={S.th}>Số Báo giá</th>
                <th className={S.th}>Khách hàng</th>
                <th className={S.th}>Ngày</th>
                <th className={S.thRight}>Tổng</th>
                <th className={S.thCenter}>Trạng thái</th>
                <th className={S.thCenter}>Thao tác</th>
              </tr>
            </thead>
            <tbody className={S.tbody}>
              {filtered.map((q, i) => (
                <motion.tr
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={S.row}
                >
                  <td className={S.tdQuoteNo}>
                    <div className={S.quoteNoRow}>
                      <div className={S.quoteNoIcon}><FileText className="w-4 h-4" /></div>
                      <span className={S.quoteNoText}>{q.quotationNo}</span>
                    </div>
                  </td>
                  <td className={S.tdCustomer}>
                    <p className={S.customerName}>{q.customerName || '—'}</p>
                    <p className={S.customerCreator}><User className="w-3 h-3" /> {q.createdBy || 'System'}</p>
                  </td>
                  <td className={S.tdDate}>
                    <span className={S.dateText}>
                      <Calendar className={S.dateIcon} />
                      {q.date ? new Date(q.date).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </td>
                  <td className={S.tdTotal}>
                    <span className={S.totalText}>{q.totalAmount ? q.totalAmount.toLocaleString() : '0'}</span>
                  </td>
                  <td className={S.tdStatus}>
                    <div className={S.statusCenter}>
                      <span className={statusBadge(q.status)}>
                        {q.status === 'draft' && 'Nháp'}
                        {q.status === 'sent' && 'Đã gửi'}
                        {q.status === 'approved' && 'Chấp nhận'}
                        {q.status === 'rejected' && 'Từ chối'}
                      </span>
                    </div>
                  </td>
                  <td className={S.tdActions}>
                    <div className={S.actionRow}>
                      <button className={S.viewBtn}><Eye className="w-4 h-4" /></button>
                      <button className={S.downloadBtn}><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(q.id)} className={S.deleteBtn}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className={S.emptyWrapper}>
                      <div className={S.emptyIconBox}><FileText className={S.emptyIcon} /></div>
                      <h3 className={S.emptyTitle}>Chưa có báo giá nào</h3>
                      <p className={S.emptyText}>Tạo báo giá từ trang Quotation Module để bắt đầu.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      lang: 'VI',
      dashboard: {
        title: "TỔNG QUAN",
        subtitle: "Tổng quan công việc",
        revenue: "Doanh thu ước tính",
        quotesCreated: "Báo giá đã tạo",
        customers: "Khách hàng",
        winRate: "Tỷ lệ chốt",
        surcharge: "Phụ thu (DO)",
        services: "Dịch vụ khác",
        thisMonth: "Trọng số tháng này",
        chartTitle: "Diễn biến giá dầu",
        historyTitle: "Báo Giá Gần Đây",
        newQuotation: "Tạo Báo Giá",
        priceList: "Bảng Giá DO",
        search: "Tìm kiếm...",
        logout: "Đăng xuất",
        noData: "Chưa có dữ liệu"
      },
      nav: {
          dashboard: "Trang chủ",
        calculator: "Tính phụ thu",
        quotation: "Báo giá dịch vụ",
        registration: "Đăng ký dịch vụ",
        customers: "Khách hàng",
        services: "Danh mục dịch vụ",
        history: "Lịch sử",
        reconciliation: "Đối soát",
        admin: "Cấu hình hệ thống",
        login: "Đăng nhập"
      },
      common: {
        save: "Lưu",
        cancel: "Hủy",
        delete: "Xóa",
        edit: "Sửa",
        add: "Thêm",
        close: "Đóng",
        confirm: "Xác nhận",
        loading: "Đang tải...",
        error: "Lỗi",
        success: "Thành công",
        search: "Tìm kiếm",
        noResults: "Không có kết quả"
      }
    }
  },
  en: {
    translation: {
      lang: 'EN',
      dashboard: {
        title: "OVERVIEW",
        subtitle: "Work overview",
        revenue: "Estimated revenue",
        quotesCreated: "Quotes created",
        customers: "Customers",
        winRate: "Win rate",
        surcharge: "Fuel surcharge",
        services: "Other services",
        thisMonth: "This month weight",
        chartTitle: "Fuel Price Trend",
        historyTitle: "Recent Quotations",
        newQuotation: "New Quotation",
        priceList: "Fuel Price List",
        search: "Search...",
        logout: "Log out",
        noData: "No data yet"
      },
      nav: {
        dashboard: "Dashboard",
        calculator: "Surcharge Calc",
        quotation: "Service Quotation",
        registration: "Service Registration",
        customers: "Customers",
        services: "Service Catalog",
        history: "History",
        reconciliation: "Reconciliation",
        admin: "System Config",
        login: "Log in"
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        close: "Close",
        confirm: "Confirm",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        search: "Search",
        noResults: "No results"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('logipro_lang') || 'vi',
    fallbackLng: 'vi',
    interpolation: { escapeValue: false }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('logipro_lang', lng);
});

export default i18n;

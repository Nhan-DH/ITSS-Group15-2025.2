import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format số tiền sang chuẩn Việt Nam Đồng
 * @param {number} price 
 * @returns {string} Ví dụ: 100.000 ₫
 */
export const formatPriceVND = (price) => {
  if (price === null || price === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

/**
 * Format số điện thoại có dấu cách dễ nhìn
 * @param {string|number} phoneNumberString 
 * @returns {string} Ví dụ: 090 123 4567
 */
export const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return "";
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phoneNumberString;
};

/**
 * Format chuỗi ngày tháng theo chuẩn Việt Nam
 * @param {string|Date} dateInput 
 * @param {string} dateFormat Định dạng mong muốn (mặc định dd/MM/yyyy)
 * @returns {string} Ví dụ: 22/03/2026
 */
export const formatDateToVietnamese = (dateInput, dateFormat = "dd/MM/yyyy") => {
  if (!dateInput) return "Chưa cập nhật";
  const date = new Date(dateInput);
  if (!isValid(date)) return "Ngày không hợp lệ";
  return format(date, dateFormat, { locale: vi });
};

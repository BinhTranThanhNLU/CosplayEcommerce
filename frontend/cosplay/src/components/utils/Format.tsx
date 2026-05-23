// Hàm định dạng tiền tệ nội bộ sang dạng VND (Ví dụ: 850000 -> 850.000 ₫)
// Định nghĩa kiểu dữ liệu nhận vào là number, null hoặc undefined và trả về một string
export const formatPrice = (price: number | null | undefined): string => {
  if (!price) return "";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
};
export const formatNumberWithDot = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
}
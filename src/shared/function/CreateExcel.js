import { createNotification } from "../Config/Notifications";
import * as XLSX from 'xlsx';

export const convertExcelFile = (data, filename) => {
  try {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set the header styles (e.g., background color)
    const headerCellStyle = {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFF00" }, // Màu nền vàng
      },
      font: {
        bold: true,
        color: { rgb: "000000" }, // Màu chữ đen
      },
    };

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Lấy phạm vi ô

    // Apply styles to header cells (row 0)
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Hàng đầu tiên cho header
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = {}; // Tạo ô mới nếu chưa tồn tại
      }
      worksheet[cellAddress].s = headerCellStyle; // Áp dụng kiểu cho ô tiêu đề
    }

    // Tự động điều chỉnh chiều rộng các cột
    const colWidth = data.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        const cellValue = String(row[key]);
        const cellLength = cellValue.length;

        if (!acc[key] || cellLength > acc[key]) {
          acc[key] = cellLength;
        }
      });
      return acc;
    }, {});

    // Thiết lập chiều rộng cho từng cột
    worksheet['!cols'] = Object.keys(colWidth).map(key => ({ wpx: colWidth[key] * 10 })); // Điều chỉnh chiều rộng

    // Tạo một workbook và thêm worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Tạo file và tải về
    const fileName = filename + '.xlsx';
    XLSX.writeFile(workbook, fileName);
    createNotification('success', "Excel data fetched", "Data has been fetched successfully")();
  } catch (error) {
    console.error("Error generating Excel file:", error); // Ghi lỗi để gỡ lỗi
    createNotification('error', "Fetch error", "Failed to fetch Excel data")();
  }
};

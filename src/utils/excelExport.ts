import * as XLSX from "xlsx";

export interface ExportLoanScheduleParams {
  projectName: string;
  unitLabel: string;
  unitArea: string;
  totalPriceWithVat: number;
  loanAmount: number;
  loanPercent: number;
  ratePerYear: number;
  years: number;
  startDay: number;
  startMonth: number;
  startYear: number;
  rows: Array<{
    seq: number;
    date: string;
    balance: number;
    principal: number;
    interest: number;
    total: number;
    isEvent?: boolean;
    eventLabel?: string;
    eventAmt?: number;
    isFinal?: boolean;
  }>;
  totalInterest: number;
  totalPayment: number;
}

export function exportLoanScheduleToExcel(params: ExportLoanScheduleParams) {
  const wb = XLSX.utils.book_new();

  // Tạo cấu trúc dữ liệu AOA đẹp mắt, rõ ràng
  const sheetData: (string | number)[][] = [
    ["K-HOME ĐỒNG NAI — BẢNG TÍNH LỊCH TRẢ NỢ VAY MUA NHÀ Ở XÃ HỘI", "", "", "", "", "", ""],
    ["Chương trình vay vốn ưu đãi Ngân hàng Chính sách Xã hội (Lãi suất 5,4%/năm — Thời hạn 25 năm)", "", "", "", "", "", ""],
    [],
    ["I. THÔNG TIN CĂN HỘ & KHOẢN VAY VỐN", "", "", "", "", "", ""],
    ["Dự án", params.projectName, "", "Tỷ lệ vay ngân hàng", `${params.loanPercent}% giá trị căn hộ`],
    ["Loại căn hộ", `${params.unitLabel} (Diện tích: ${params.unitArea})`, "", "Lãi suất ưu đãi", `${params.ratePerYear}% / năm`],
    ["Tổng giá căn hộ (đã gồm 5% VAT)", params.totalPriceWithVat, "", "Thời hạn vay", `${params.years} năm (${params.years * 12} tháng / kỳ)`],
    ["Số tiền vay ngân hàng (75%)", params.loanAmount, "", "Ngày bắt đầu trả nợ", `${String(params.startDay).padStart(2, "0")}/${String(params.startMonth).padStart(2, "0")}/${params.startYear}`],
    ["Vốn tự có khách hàng (25%)", params.totalPriceWithVat - params.loanAmount, "", "Tổng lãi toàn kỳ", params.totalInterest],
    ["Tổng thanh toán (Gốc + Lãi)", params.totalPayment, "", "Kỳ đầu trả (ước tính)", params.rows.find(r => !r.isEvent)?.total ?? 0],
    [],
    ["II. LỊCH GIẢI NGÂN & TRẢ NỢ CHI TIẾT THEO TỪNG KỲ", "", "", "", "", "", ""],
    [
      "KỲ",
      "NGÀY TRẢ",
      "DƯ NỢ ĐẦU KỲ (VNĐ)",
      "TIỀN GỐC (VNĐ)",
      "TIỀN LÃI (VNĐ)",
      "TỔNG THANH TOÁN (VNĐ)",
      "TIẾN ĐỘ / GHI CHÚ"
    ]
  ];

  const headerRowCount = sheetData.length;

  params.rows.forEach(r => {
    if (r.isEvent) {
      sheetData.push([
        "—",
        r.date,
        Math.round(r.balance),
        0,
        0,
        0,
        `🏦 ${r.eventLabel || "Giải ngân theo tiến độ"} (+${Math.round(r.eventAmt || 0).toLocaleString("vi-VN")} đ)`
      ]);
    } else if (r.isFinal) {
      sheetData.push([
        r.seq,
        r.date,
        0,
        0,
        0,
        0,
        "✅ ĐÃ TẤT TOÁN TOÀN BỘ KHOẢN VAY"
      ]);
    } else {
      sheetData.push([
        r.seq,
        r.date,
        Math.round(r.balance),
        Math.round(r.principal),
        Math.round(r.interest),
        Math.round(r.total),
        ""
      ]);
    }
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Set column widths rộng rãi, thoáng đẹp
  ws["!cols"] = [
    { wch: 10 },  // A: Kỳ
    { wch: 16 },  // B: Ngày trả
    { wch: 25 },  // C: Dư nợ đầu kỳ
    { wch: 20 },  // D: Tiền gốc
    { wch: 20 },  // E: Tiền lãi
    { wch: 25 },  // F: Tổng thanh toán
    { wch: 48 },  // G: Ghi chú
  ];

  // Set row heights
  ws["!rows"] = [
    { hpt: 28 }, // Row 1 Title
    { hpt: 20 }, // Row 2 Subtitle
    { hpt: 12 }, // Row 3 Empty
    { hpt: 22 }, // Row 4 Section 1
    { hpt: 20 },
    { hpt: 20 },
    { hpt: 20 },
    { hpt: 20 },
    { hpt: 20 },
    { hpt: 20 },
    { hpt: 14 },
    { hpt: 22 }, // Section 2
    { hpt: 26 }, // Table header
  ];

  // Thêm Merges cho các tiêu đề chính
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Subtitle
    { s: { r: 3, c: 0 }, e: { r: 3, c: 6 } }, // Section I
    { s: { r: 11, c: 0 }, e: { r: 11, c: 6 } }, // Section II
  ];

  // Áp dụng định dạng số (Number Format) phân cách hàng nghìn cho các ô số tiền
  // Format: #,##0 "đ" hoặc #,##0
  const moneyFormat = '#,##0 "đ"';

  // Format các ô thông tin tổng quan
  const infoCells = ["B7", "B8", "B9", "B10", "E9", "E10"];
  infoCells.forEach(cellRef => {
    if (ws[cellRef] && typeof ws[cellRef].v === "number") {
      ws[cellRef].z = moneyFormat;
    }
  });

  // Format toàn bộ các cột số tiền trong bảng lịch trả nợ (Cột C, D, E, F)
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:G350");
  for (let R = headerRowCount; R <= range.e.r; ++R) {
    for (let C = 2; C <= 5; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (cell && typeof cell.v === "number") {
        cell.z = moneyFormat;
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Lịch Trả Nợ Chi Tiết");

  const cleanProjectName = params.projectName.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Bang_Tinh_Tra_Gop_${cleanProjectName}_${params.unitLabel}.xlsx`;
  XLSX.writeFile(wb, filename);
}

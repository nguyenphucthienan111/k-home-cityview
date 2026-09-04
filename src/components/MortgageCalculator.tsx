import React, { useState, useMemo, startTransition, useRef } from "react";
import ReactDOM from "react-dom";
import { Calculator, Coins, Percent, ArrowRight, Phone, Download } from "lucide-react";
import { exportLoanScheduleToExcel } from "../utils/excelExport";

// ─── Config dữ liệu từng dự án ───────────────────────────────────────────────
interface CalcUnit {
  label: string; area: string; price: number;
  priceMin: number; priceMax: number; priceLabel: string;
}
interface CalcConfig {
  name: string; loanYears: number; loanPercent: number; policyRate: number;
  units: CalcUnit[];
  policySchedule: { dot: string; pct: string; note: string }[];
  cashSchedule: { dot: string; pct: string; note: string }[];
}

const CALC_CONFIG: Record<string, CalcConfig> = {
  "k-home-cityview-ho-nai": {
    name: "K-Home CityView Hố Nai", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "1PN+A", area: "47,3m²", price: 0.95, priceMin: 0.95, priceMax: 1.08, priceLabel: "950tr – 1,08 tỷ" },
      { label: "1PN+B", area: "62,4m²", price: 1.20, priceMin: 1.20, priceMax: 1.40, priceLabel: "1,20 – 1,40 tỷ" },
      { label: "2PN",   area: "70,4m²", price: 1.50, priceMin: 1.50, priceMax: 1.70, priceLabel: "1,50 – 1,70 tỷ" },
      { label: "3PN",   area: "84,4m²", price: 1.80, priceMin: 1.80, priceMax: 2.00, priceLabel: "1,80 – 2,00 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "5%",                  note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
      { dot: "Đợt 4",    pct: "45% (NH giải ngân)",  note: "45 ngày sau ký HĐMB, Ngân hàng giải ngân lần 1" },
      { dot: "Đợt 5",    pct: "25% (NH giải ngân)",  note: "15 ngày kể từ thông báo bàn giao nhà, NH giải ngân lần 2 + KH đóng 2% phí bảo trì" },
      { dot: "Đợt 6",    pct: "5% (NH giải ngân)",   note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "10%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "5%",                   note: "60 ngày kể từ ngày đến hạn đợt 2" },
      { dot: "Đợt 4",    pct: "5%",                   note: "90 ngày kể từ ngày đến hạn đợt 3" },
      { dot: "Đợt 5–14", pct: "3%/đợt (10 đợt)",      note: "Mỗi đợt cách nhau 30 ngày theo tiến độ thi công" },
      { dot: "Đợt 15",   pct: "5%",                   note: "30 ngày kể từ ngày đến hạn đợt 14" },
      { dot: "Đợt 16",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao nhà" },
      { dot: "Đợt 17",   pct: "5%",                   note: "15 ngày kể từ thông báo nhận GCNQSHCH (Sổ hồng)" },
    ],
  },
  "k-home-avenue-nhon-trach": {
    name: "K-Home Avenue Nhơn Trạch", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "37,7m²", price: 0.75, priceMin: 0.75, priceMax: 0.85, priceLabel: "Từ 750 triệu" },
      { label: "1PN+",   area: "46,6m²", price: 0.99, priceMin: 0.99, priceMax: 1.10, priceLabel: "Từ 990 triệu" },
      { label: "2PN-S",  area: "65,7m²", price: 1.23, priceMin: 1.23, priceMax: 1.39, priceLabel: "1,23 – 1,39 tỷ" },
      { label: "2PN-L",  area: "69,5m²", price: 1.40, priceMin: 1.40, priceMax: 1.47, priceLabel: "1,40 – 1,47 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "5%",                  note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
      { dot: "Đợt 4",    pct: "45% (NH giải ngân)",  note: "45 ngày sau ký HĐMB, Ngân hàng giải ngân lần 1" },
      { dot: "Đợt 5",    pct: "25% (NH giải ngân)",  note: "15 ngày kể từ thông báo bàn giao nhà, NH giải ngân lần 2 + KH đóng 2% phí bảo trì" },
      { dot: "Đợt 6",    pct: "5% (NH giải ngân)",   note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2–5",  pct: "5%/đợt (4 đợt)",       note: "Mỗi đợt cách nhau 30–60 ngày" },
      { dot: "Đợt 6–15", pct: "3%/đợt (10 đợt)",      note: "Mỗi đợt cách nhau 30 ngày theo tiến độ tầng" },
      { dot: "Đợt 16",   pct: "5%",                   note: "30 ngày kể từ ngày đến hạn đợt 15" },
      { dot: "Đợt 17",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao nhà" },
      { dot: "Đợt 18",   pct: "5%",                   note: "15 ngày kể từ thông báo nhận GCNQSHCH (Sổ hồng)" },
    ],
  },
  "k-home-midtown-trang-bom": {
    name: "K-Home Midtown Trảng Bom", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "36,1m²", price: 0.75, priceMin: 0.75, priceMax: 0.85, priceLabel: "Từ 750 triệu" },
      { label: "1PN+A",  area: "47,0m²", price: 0.99, priceMin: 0.99, priceMax: 1.10, priceLabel: "Từ 990 triệu" },
      { label: "1PN+B",  area: "55,1m²", price: 1.20, priceMin: 1.20, priceMax: 1.35, priceLabel: "Từ 1,20 tỷ" },
      { label: "2PN",    area: "68,8m²", price: 1.50, priceMin: 1.50, priceMax: 1.65, priceLabel: "Từ 1,50 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "10%",                 note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "45% (NH giải ngân)",  note: "Ngân hàng giải ngân lần 1" },
      { dot: "Đợt 4",    pct: "25% (NH giải ngân)",  note: "15 ngày kể từ thông báo bàn giao nhà, NH giải ngân lần 2 + KH đóng 100% phí bảo trì" },
      { dot: "Đợt 5",    pct: "5% (NH giải ngân)",   note: "Nhận GCNQSHCH (Sổ hồng)" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "10%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3–11", pct: "5%/đợt (9 đợt)",       note: "Mỗi đợt cách nhau 30–60 ngày theo tiến độ thi công" },
      { dot: "Đợt 12",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ thông báo bàn giao nhà" },
      { dot: "Đợt 13",   pct: "5%",                   note: "15 ngày kể từ thông báo nhận GCNQSHCH (Sổ hồng)" },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatVND(billion: number): string {
  if (billion < 1) return `${Math.round(billion * 1000)} triệu`;
  if (billion === Math.floor(billion)) return `${billion} tỷ`;
  return `${billion.toFixed(2).replace(/\.?0+$/, "")} tỷ`;
}

// Chuyển số tiền VNĐ thành chuỗi đọc tiếng Việt chuẩn (hỗ trợ đến hàng trăm tỷ)
function numberToVietnameseWords(n: number): string {
  if (!n || isNaN(n) || n <= 0) return "";
  const num = Math.round(n);
  const ones = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  
  function readTriple(t: number, hasHigher: boolean): string {
    const h = Math.floor(t / 100);
    const ten = Math.floor((t % 100) / 10);
    const o = t % 10;
    let res = "";
    if (h > 0 || hasHigher) {
      res += ones[h] + " trăm ";
    }
    if (ten > 1) {
      res += ones[ten] + " mươi ";
      if (o === 1) res += "mốt ";
      else if (o === 4) res += "tư ";
      else if (o === 5) res += "lăm ";
      else if (o > 0) res += ones[o] + " ";
    } else if (ten === 1) {
      res += "mười ";
      if (o === 5) res += "lăm ";
      else if (o > 0) res += ones[o] + " ";
    } else if (ten === 0 && o > 0) {
      if (h > 0 || hasHigher) res += "lẻ ";
      res += ones[o] + " ";
    }
    return res;
  }

  const ty = Math.floor(num / 1_000_000_000);
  const trieu = Math.floor((num % 1_000_000_000) / 1_000_000);
  const nghin = Math.floor((num % 1_000_000) / 1_000);
  const dong = num % 1_000;

  let str = "";
  if (ty > 0) {
    str += readTriple(ty, false).trim() + " tỷ ";
  }
  if (trieu > 0) {
    str += readTriple(trieu, ty > 0).trim() + " triệu ";
  }
  if (nghin > 0) {
    str += readTriple(nghin, ty > 0 || trieu > 0).trim() + " nghìn ";
  }
  if (dong > 0) {
    str += readTriple(dong, ty > 0 || trieu > 0 || nghin > 0).trim() + " ";
  }
  
  str = str.trim() + " đồng";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDaysInMonth(monthIdx: number, startYear: number): number {
  const year = startYear + Math.floor(monthIdx / 12);
  const mo = monthIdx % 12;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  return mo === 1 ? (isLeap ? 29 : 28) : [31,28,31,30,31,30,31,31,30,31,30,31][mo];
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  slug: string;           // slug của dự án — tự động chọn đúng config
  onContact: () => void;  // callback scroll/navigate tới form liên hệ
}

export default function MortgageCalculator({ slug, onContact }: Props) {
  const cfg = CALC_CONFIG[slug];
  if (!cfg) return null;

  const [unitIdx, setUnitIdx]           = useState(0);
  const [price, setPrice]               = useState(cfg.units[0].priceMin); // tỷ
  const [method, setMethod]             = useState<"" | "cash" | "policy">("");
  const [rawInput, setRawInput]         = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [modalPage, setModalPage]       = useState(0);
  const [modalStartYear, setModalStartYear] = useState(2026);
  const [modalStartMonth, setModalStartMonth] = useState(1);
  const [modalStartDay, setModalStartDay]   = useState(24);
  const [openDayDrop, setOpenDayDrop]       = useState(false);
  const [openMonthDrop, setOpenMonthDrop]   = useState(false);
  const [openYearDrop, setOpenYearDrop]     = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const unit = cfg.units[unitIdx];

  // ── Tổng giá gồm 5% VAT (chuẩn HĐMB NOXH) ─────────────────────────────────
  const priceWithVat = useMemo(() => price * 1.05, [price]);
  const downPayment = parseFloat((priceWithVat * (100 - cfg.loanPercent) / 100).toFixed(2));
  const loanAmount  = parseFloat((priceWithVat * cfg.loanPercent / 100).toFixed(2));

  // ── Trả góp — mô hình giải ngân 3 đợt chuẩn theo file Excel (rYear / 12) ───────
  const disbResult = useMemo(() => {
    if (method !== "policy") return { firstMonthly: 0, totalInterest: 0 };
    const fullPriceWithVatVnd = Math.round(priceWithVat * 1_000_000_000); // VNĐ
    const rYear = cfg.policyRate / 100;
    const n = cfg.loanYears * 12; // 300 tháng
    const d1_val = fullPriceWithVatVnd * 0.45;
    const d2_val = fullPriceWithVatVnd * 0.25;
    const d3_val = fullPriceWithVatVnd * 0.05;

    let prevBal = 0;
    let prevGoc = 0;
    let firstMonthly = 0;
    let totalInterest = 0;

    for (let m = 1; m <= n; m++) {
      let bal = 0;
      let goc = 0;
      let lai = 0;

      if (m === 1) {
        bal = d1_val;
        goc = bal / n;
        lai = bal * rYear / 12;
        firstMonthly = goc + lai;
      } else {
        const remBefore = prevBal - prevGoc;
        let extra = 0;
        if (m === 16) extra += d2_val;
        if (m === 26) extra += d3_val;
        bal = remBefore + extra;
        const remMonths = n - m + 1;
        goc = bal / remMonths;
        lai = remBefore * rYear / 12;
      }

      totalInterest += lai;
      prevBal = bal;
      prevGoc = goc;
    }

    return { firstMonthly, totalInterest };
  }, [priceWithVat, method, cfg]);

  // ── Parse số tiền từ chuỗi % ────────────────────────────────────────────────
  const parseAmt = (pct: string, dot: string): string => {
    const p = Math.round(priceWithVat * 1_000_000_000); // tính trên tổng giá gồm 5% VAT (VNĐ)
    if (pct === "30.000.000đ") return "30.000.000 đ";
    if (dot === "Đợt 1" && pct === "15%") {
      const net = p * 0.15 - 30_000_000;
      return `${Math.round(net).toLocaleString("vi-VN")} đ (đã trừ cọc)`;
    }
    if (pct.includes("%") && !pct.includes("phí") && !pct.includes("BT")) {
      const num = parseFloat(pct);
      if (!isNaN(num)) return `${Math.round(p * num / 100).toLocaleString("vi-VN")} đ`;
    }
    if (pct.includes("3%/đợt")) return `${Math.round(p * 0.03).toLocaleString("vi-VN")} đ/đợt`;
    if (pct.includes("5%/đợt")) return `${Math.round(p * 0.05).toLocaleString("vi-VN")} đ/đợt`;
    if (pct.includes("25% + phí bảo trì 2%") || pct.includes("25% + 100% phí bảo trì")) {
      const v25 = Math.round(p * 0.25).toLocaleString("vi-VN");
      const bt = Math.round(p * 0.02).toLocaleString("vi-VN");
      return `${v25} đ + ${bt} đ (PBT)`;
    }
    return "—";
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Tính Trả Góp Mua Nhà Ở Xã Hội</h2>
          <p className="text-xs text-slate-500 mt-0.5">Chọn loại căn và phương thức để xem lịch đóng tiền & trả góp hàng tháng</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 md:p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full pointer-events-none" />

        {/* Bước 1 — Chọn loại căn */}
        <div className="space-y-3 relative z-10">
          <p className="text-sm font-semibold text-slate-700">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">01</span>
            Chọn loại căn hộ:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cfg.units.map((u, i) => (
              <button key={i} type="button"
                onClick={() => {
                  setUnitIdx(i);
                  setPrice(u.priceMin);
                  setRawInput(Math.round(u.priceMin * 1_000_000_000).toLocaleString("vi-VN"));
                  setMethod("");
                }}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${unitIdx === i ? "border-amber-500 bg-amber-50 shadow-sm" : "border-slate-200 hover:border-amber-300 bg-white"}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mb-2 ${unitIdx === i ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                <span className="block text-base font-extrabold text-slate-800">{u.label}</span>
                <span className="text-xs text-slate-500 block">{u.area}</span>
                <span className="text-xs font-bold text-amber-600 block mt-1">{u.priceLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bước 2 — Nhập giá căn hộ */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">02</span>
              Nhập giá trị căn hộ dự tính:
            </p>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{unit.label} · {unit.area}</span>
          </div>

          {(() => {
            const minVnd = Math.round(unit.priceMin * 1_000_000_000);
            const maxVnd = Math.round(unit.priceMax * 1_000_000_000);
            const currentVnd = Math.round(price * 1_000_000_000); // Giá chưa VAT
            const isOutOfRange = currentVnd > 0 && (currentVnd < minVnd || currentVnd > maxVnd);
            const vatVnd = Math.round(currentVnd * 0.05); // 5% VAT NOXH
            const totalVnd = currentVnd + vatVnd; // Tổng giá gồm VAT
            const words = numberToVietnameseWords(totalVnd);

            return (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-slate-600 px-1 font-semibold">
                    <span>Giá Bán Chưa VAT:</span>
                    <span className="text-slate-400 font-normal">
                      Khoảng hợp lệ: <strong className="text-amber-600">{minVnd.toLocaleString("vi-VN")} đ</strong> – <strong className="text-amber-600">{maxVnd.toLocaleString("vi-VN")} đ</strong>
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-slate-400 font-bold text-sm pointer-events-none">
                      🏷️
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={`Ví dụ: ${minVnd.toLocaleString("vi-VN")}`}
                      value={rawInput || (currentVnd > 0 ? currentVnd.toLocaleString("vi-VN") : "")}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        if (digitsOnly === "") {
                          setRawInput("");
                          return;
                        }
                        const num = parseInt(digitsOnly, 10);
                        if (!isNaN(num)) {
                          setRawInput(num.toLocaleString("vi-VN"));
                          setPrice(num / 1_000_000_000);
                        }
                      }}
                      onBlur={() => {
                        const digitsOnly = (rawInput || "").replace(/\D/g, "");
                        let num = parseInt(digitsOnly, 10);
                        if (isNaN(num) || num <= 0 || num < minVnd) {
                          num = minVnd;
                        } else if (num > maxVnd) {
                          num = maxVnd;
                        }
                        setRawInput(num.toLocaleString("vi-VN"));
                        setPrice(num / 1_000_000_000);
                      }}
                      className={`w-full pl-11 pr-20 py-3.5 sm:py-4 bg-slate-50 hover:bg-white focus:bg-white border-2 rounded-2xl text-xl sm:text-2xl font-extrabold text-slate-800 outline-none transition-all shadow-inner tracking-wide ${
                        isOutOfRange
                          ? "border-rose-400 bg-rose-50/50 focus:border-rose-500"
                          : "border-slate-200 focus:border-amber-500"
                      }`}
                    />
                    <div className="absolute right-4 text-sm font-extrabold text-amber-600 pointer-events-none bg-amber-50 px-2.5 py-1 rounded-lg">
                      VNĐ
                    </div>
                  </div>
                  {isOutOfRange && (
                    <p className="text-xs text-rose-500 font-semibold px-1 flex items-center gap-1 mt-1">
                      ⚠️ Giá nhập ({currentVnd.toLocaleString("vi-VN")} đ) ngoài khoảng {unit.label} ({minVnd.toLocaleString("vi-VN")} – {maxVnd.toLocaleString("vi-VN")} đ). Tự động điều chỉnh khi rời ô nhập.
                    </p>
                  )}
                </div>

                {/* Breakdown 3 ô: Giá Chưa VAT + Thuế VAT 5% (NOXH) = TỔNG GIÁ KÝ HĐMB */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[11px] text-slate-500 block font-medium">1. Giá chưa VAT</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-700 block mt-0.5">{currentVnd.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[11px] text-emerald-600 block font-bold">+ 5% Thuế VAT (NOXH)</span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-600 block mt-0.5">+{vatVnd.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="bg-amber-500/15 p-2.5 rounded-xl border border-amber-500/40 shadow-sm">
                    <span className="text-[11px] text-amber-900 block font-extrabold">TỔNG GIÁ CĂN HỘ (GỒM VAT)</span>
                    <span className="text-base sm:text-lg font-black text-amber-800 block mt-0.5">{totalVnd.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>

                {/* Đọc số tiền bằng chữ + Khoảng giá tham chiếu */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-1 text-xs">
                  <div className="text-amber-800 font-medium flex items-center gap-1.5 flex-1">
                    <span className="text-amber-600 font-bold shrink-0">💬 Tổng giá bằng chữ:</span>
                    <span className="italic line-clamp-1">{words || "Chưa nhập số tiền"}</span>
                  </div>
                  <div className="text-slate-400 shrink-0 font-mono text-[11px]">
                    Giá tham khảo: <strong className="text-slate-600">{formatVND(unit.priceMin)}</strong> – <strong className="text-slate-600">{formatVND(unit.priceMax)}</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bước 3 — Phương thức */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-700">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">03</span>
            Phương thức thanh toán:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "cash" as const,   title: "Bằng vốn tự có",           sub: `Thanh toán theo ${cfg.cashSchedule.length} đợt, không vay NH` },
              { key: "policy" as const, title: "Bằng vốn vay ngân hàng",   sub: `Vay tối đa ${cfg.loanPercent}% · ${cfg.policyRate}%/năm · ${cfg.loanYears} năm` },
            ]).map(opt => (
              <button key={opt.key} type="button" onClick={() => setMethod(opt.key)}
                className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${method === opt.key ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 hover:border-amber-300 bg-white"}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${method === opt.key ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                  {method === opt.key && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <span className="block text-base font-extrabold text-slate-800">{opt.title}</span>
                <span className="text-xs text-slate-500 block mt-1">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bước 4 — Bảng tiến độ */}
        {method && (
          <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-700">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">04</span>
              Lịch đóng tiền — {method === "cash" ? "Vốn tự có" : "Vốn vay ngân hàng"}:
            </p>
            <div className="rounded-2xl border border-slate-100 overflow-hidden text-xs shadow-sm">
              <div className="grid grid-cols-4 bg-amber-500 text-white font-bold px-3 py-2.5">
                <span>Đợt</span><span className="text-center">%</span>
                <span className="text-center font-extrabold">Số tiền</span>
                <span className="text-right text-[10px]">Ghi chú</span>
              </div>
              {(method === "cash" ? cfg.cashSchedule : cfg.policySchedule).map((row, i) => (
                <div key={i} className={`grid grid-cols-4 px-3 py-2.5 border-b border-slate-50 items-center ${i % 2 === 0 ? "bg-amber-50/40" : "bg-white"}`}>
                  <span className="font-semibold text-slate-700">{row.dot}</span>
                  <span className="text-center font-bold text-amber-700">{row.pct}</span>
                  <span className="text-center font-extrabold text-emerald-700 text-[11px]">{parseAmt(row.pct, row.dot)}</span>
                  <span className="text-right text-slate-500 leading-snug text-[10px]">{row.note}</span>
                </div>
              ))}
            </div>

            {method === "policy" && (
              <div className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-slate-800">NH Chính Sách Xã Hội</span>
                  <span className="text-sm text-amber-600 font-bold block mt-0.5">{cfg.policyRate}%/năm · {cfg.loanYears} năm</span>
                  <span className="text-xs text-slate-500 block mt-1">Gói vay ưu đãi dành riêng cho người mua NOXH – Ngân hàng Chính sách xã hội tỉnh Đồng Nai</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kết quả */}
        {method && (
          <div className="relative z-10 pt-2 border-t border-slate-100">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-tl-full pointer-events-none" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-100 bg-white/15 border border-white/10 px-3 py-1 rounded-full inline-block mb-5">
                KẾT QUẢ DỰ TÍNH — {unit.label} · {unit.area} · Tổng giá: {Math.round(priceWithVat * 1_000_000_000).toLocaleString("vi-VN")} đ (đã gồm 5% VAT)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 items-stretch">
                <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                  <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                    <Coins className="w-4 h-4 text-yellow-300 shrink-0" /> Vốn tự có ({100 - cfg.loanPercent}%):
                  </span>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white font-sans tabular-nums tracking-tight whitespace-nowrap">
                      {Math.round(priceWithVat * (100 - cfg.loanPercent) / 100 * 1_000_000_000).toLocaleString("vi-VN")} đ
                    </div>
                    <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">~{formatVND(downPayment)} · Đóng theo nhiều đợt</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                  <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                    <Percent className="w-4 h-4 text-yellow-300 shrink-0" /> Khoản vay ({cfg.loanPercent}%):
                  </span>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tabular-nums tracking-tight whitespace-nowrap">
                      {method === "cash" ? "—" : `${Math.round(priceWithVat * cfg.loanPercent / 100 * 1_000_000_000).toLocaleString("vi-VN")} đ`}
                    </div>
                    <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">
                      {method === "policy" ? `~${formatVND(loanAmount)} · Lãi ${cfg.policyRate}%/năm (${cfg.loanYears} năm)` : "Không vay"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                  <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                    <Calculator className="w-4 h-4 text-yellow-300 shrink-0" /> Tổng lãi phải trả:
                  </span>
                  <div>
                    {method === "cash" ? (
                      <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tracking-tight">Không vay</div>
                    ) : (
                      <>
                        <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tabular-nums tracking-tight whitespace-nowrap">
                          {Math.round(disbResult.totalInterest).toLocaleString("vi-VN")} đ
                        </div>
                        <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">
                          Kỳ đầu trả: ~{Math.round(disbResult.firstMonthly).toLocaleString("vi-VN")} đ/tháng
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="space-y-1.5 text-xs text-amber-100/90">
                  <p className="font-bold text-white text-sm">📋 Điều kiện mua NOXH:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {[
                      "Thu nhập < 25tr/tháng (độc thân)",
                      "Thu nhập < 35tr/tháng (đơn thân nuôi con)",
                      "Thu nhập < 50tr/tháng (vợ chồng)",
                      "Chưa có nhà ở tại Đồng Nai",
                      "Chưa từng mua NOXH ở Việt Nam",
                      "Có đất / nhà tỉnh khác vẫn được mua",
                    ].map((c, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />{c}
                      </span>
                    ))}
                  </div>
                  <p className="text-yellow-200 font-semibold pt-1">
                    <Phone className="w-3 h-3 inline mr-1" />Hỗ trợ hồ sơ miễn phí: <a href="tel:0937587438" className="underline hover:text-white">0937.587.438</a>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={onContact}
                    className="shrink-0 bg-white hover:bg-amber-50 text-amber-800 font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg">
                    Tư Vấn Miễn Phí <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {method === "policy" && (
                    <button onClick={() => { setShowModal(true); setModalPage(0); }}
                      className="shrink-0 bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold py-3 px-5 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2">
                      📊 Lịch Trả Nợ Chi Tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Modal lịch trả nợ ── */}
      {showModal && method === "policy" && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative bg-white w-full sm:rounded-3xl shadow-2xl sm:max-w-2xl max-h-[95vh] sm:max-h-[88vh] flex flex-col z-10 rounded-t-3xl" onClick={e => e.stopPropagation()} style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1)" }}>
            <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0"><div className="w-10 h-1 bg-slate-200 rounded-full" /></div>
            <div className="px-5 py-3.5 flex items-start justify-between shrink-0 border-b border-slate-100">
              <div className="pr-4">
                <h3 className="text-slate-900 font-extrabold text-base flex items-center gap-2"><span className="text-lg">📊</span> Lịch Trả Nợ Chi Tiết</h3>
                <p className="text-slate-500 text-xs mt-0.5">Lãi tính theo số ngày thực tế / 365 — chuẩn ngân hàng VN</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer text-lg shrink-0 mt-0.5">✕</button>
            </div>

            {/* Thông số */}
            <div className="px-4 sm:px-6 py-3 space-y-2 shrink-0 bg-slate-50/60 border-b border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Tổng giá gồm VAT", val: Math.round(priceWithVat * 1000000000).toLocaleString("vi-VN") + " đ", highlight: true },
                  { label: "Khoản vay (" + cfg.loanPercent + "%)", val: Math.round(loanAmount * 1000000000).toLocaleString("vi-VN") + " đ" },
                  { label: "Lãi suất ưu đãi", val: cfg.policyRate + "% / năm" },
                  { label: "Thời hạn vay", val: cfg.loanYears + " năm (" + (cfg.loanYears * 12) + " kỳ)" },
                ].map(f => (
                  <div key={f.label} className={`${f.highlight ? "bg-amber-50/80 border-amber-200" : "bg-white border-slate-200"} border rounded-xl p-2.5 shadow-sm`}>
                    <label className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${f.highlight ? "text-amber-700" : "text-slate-500"}`}>{f.label}</label>
                    <div className={`text-xs sm:text-sm font-extrabold truncate ${f.highlight ? "text-amber-800" : "text-slate-700"}`}>
                      {f.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary + bảng */}
            {(() => {
              const loanVnd = Math.round(priceWithVat * 1000000000 * (cfg.loanPercent / 100));
              const lp = cfg.loanPercent / 100;
              const contractVal = loanVnd / lp;
              const rYear = cfg.policyRate / 100;
              const n = cfg.loanYears * 12;
              const startOffset = modalStartMonth - 1;
              const calcDate = (kyCur: number) => {
                const totalMonthIdx = startOffset + (kyCur - 1);
                const year = modalStartYear + Math.floor(totalMonthIdx / 12);
                const mo = totalMonthIdx % 12;
                const maxDays = new Date(year, mo + 1, 0).getDate();
                const d = Math.min(modalStartDay, maxDays);
                return { date: `${String(d).padStart(2, "0")}/${String(mo + 1).padStart(2, "0")}/${year}`, year, mo };
              };

              const d1Val = contractVal * 0.45;
              const d2Val = contractVal * 0.25;
              const d3Val = contractVal * 0.05;

              type DRow = { seq: number; date: string; balance: number; principal: number; interest: number; total: number; isEvent?: boolean; eventLabel?: string; eventAmt?: number; disbMonth?: number; isFinal?: boolean };
              const rows: DRow[] = [];
              let prevBal = 0;
              let prevGoc = 0;
              let firstTotal = 0;
              let lastTotal = 0;
              let totalInt = 0;

              for (let m = 1; m <= n; m++) {
                const { date } = calcDate(m);
                let bal = 0;
                let goc = 0;
                let lai = 0;

                if (m === 1) {
                  bal = d1Val;
                  goc = bal / n;
                  lai = bal * rYear / 12;
                  rows.push({ seq: m, date, balance: bal, principal: 0, interest: 0, total: 0, isEvent: true, eventLabel: "Đợt 4 – Giải ngân 45%", eventAmt: d1Val, disbMonth: m });
                } else {
                  const remBefore = prevBal - prevGoc;
                  let extra = 0;
                  if (m === 16) {
                    extra += d2Val;
                    rows.push({ seq: m, date, balance: remBefore + extra, principal: 0, interest: 0, total: 0, isEvent: true, eventLabel: "Đợt 5 – Giải ngân 25%", eventAmt: d2Val, disbMonth: m });
                  }
                  if (m === 26) {
                    extra += d3Val;
                    rows.push({ seq: m, date, balance: remBefore + extra, principal: 0, interest: 0, total: 0, isEvent: true, eventLabel: "Đợt 6 – Giải ngân 5%", eventAmt: d3Val, disbMonth: m });
                  }
                  bal = remBefore + extra;
                  const remMonths = n - m + 1;
                  goc = bal / remMonths;
                  lai = remBefore * rYear / 12;
                }

                const total = goc + lai;
                if (firstTotal === 0) firstTotal = total;
                lastTotal = total;
                totalInt += lai;

                rows.push({ seq: m, date, balance: bal, principal: goc, interest: lai, total });
                prevBal = bal;
                prevGoc = goc;
              }

              // Dòng tất toán
              {
                const { date } = calcDate(n + 1);
                rows.push({ seq: n + 1, date, balance: 0, principal: 0, interest: 0, total: 0, isFinal: true });
              }

              const PAGE = 24;
              const payRows = rows.filter(r => !r.isEvent && !r.isFinal);
              const totalP = Math.ceil(payRows.length / PAGE);
              const ps = modalPage * PAGE;
              const pe = Math.min(ps + PAGE, payRows.length);
              const seqS = payRows[ps]?.seq ?? 1;
              const seqE = payRows[pe - 1]?.seq ?? n;
              const isLastPage = modalPage === totalP - 1;

              const paged = rows.filter(r => {
                if (r.isFinal) return isLastPage;
                if (r.isEvent) return (r.disbMonth ?? 0) >= seqS && (r.disbMonth ?? 0) <= seqE;
                return r.seq >= seqS && r.seq <= seqE;
              });

              return (<>
                <div className="px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 shrink-0">
                  {[{label:"Kỳ 1 trả",val:Math.round(firstTotal).toLocaleString("vi-VN") + " đ",sub:"kỳ đầu",bg:"bg-amber-50 border-amber-200",tx:"text-amber-700"},
                    {label:"Kỳ cuối trả",val:Math.round(lastTotal).toLocaleString("vi-VN") + " đ",sub:`kỳ ${n}`,bg:"bg-emerald-50 border-emerald-200",tx:"text-emerald-700"},
                    {label:"Tổng lãi toàn kỳ",val:Math.round(totalInt).toLocaleString("vi-VN") + " đ",sub:`${n} tháng`,bg:"bg-rose-50 border-rose-200",tx:"text-rose-600"},
                    {label:"Tổng gốc + lãi",val:Math.round(loanVnd+totalInt).toLocaleString("vi-VN") + " đ",sub:"toàn bộ khoản vay",bg:"bg-slate-50 border-slate-200",tx:"text-slate-700"},
                  ].map(c=>(<div key={c.label} className={`${c.bg} border rounded-2xl px-3 sm:px-4 py-2.5 text-center shadow-sm`}><p className="text-[10px] font-semibold text-slate-500 mb-0.5">{c.label}</p><p className={`text-xs sm:text-sm font-extrabold ${c.tx}`}>{c.val}</p><p className="text-[9px] text-slate-400 mt-0.5">{c.sub}</p></div>))}
                </div>
                <div className="px-6 pt-3 pb-2 flex items-center gap-2 shrink-0 flex-wrap">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-sm">🏦 Giải ngân theo tiến độ xây dựng</span>
                  {/* Dropdown Ngày + Tháng + Năm */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    <span className="text-[10px] text-slate-500 font-semibold shrink-0">📅 Bắt đầu:</span>

                    {/* Ngày */}
                    <div className="relative">
                      <button onClick={e=>{e.stopPropagation();setOpenDayDrop(v=>!v);setOpenMonthDrop(false);setOpenYearDrop(false);}}
                        className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-2.5 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[68px] justify-between">
                        <span>Ngày {modalStartDay}</span>
                        <span className="text-slate-500 text-[10px]">{openDayDrop?"▴":"▾"}</span>
                      </button>
                      {openDayDrop&&(
                        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-48 max-h-56 overflow-y-auto p-1.5">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({length:31},(_,i)=>i+1).map(d=>(
                              <button key={d} onClick={()=>{setModalStartDay(d);setOpenDayDrop(false);}}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${d===modalStartDay?"bg-amber-500 text-white shadow-sm":"text-slate-600 hover:bg-amber-50 hover:text-amber-600"}`}>
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tháng */}
                    <div className="relative">
                      <button onClick={e=>{e.stopPropagation();setOpenMonthDrop(v=>!v);setOpenDayDrop(false);setOpenYearDrop(false);}}
                        className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[72px] justify-between">
                        <span>Tháng {modalStartMonth}</span>
                        <span className="text-slate-500 text-[10px]">{openMonthDrop?"▴":"▾"}</span>
                      </button>
                      {openMonthDrop&&(
                        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-32 overflow-hidden">
                          <div className="grid grid-cols-3 gap-0.5 p-1.5">
                            {Array.from({length:12},(_,i)=>i+1).map(m=>(
                              <button key={m} onClick={()=>{setModalStartMonth(m);setModalPage(0);setOpenMonthDrop(false);}}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${m===modalStartMonth?"bg-amber-500 text-white shadow-sm":"text-slate-600 hover:bg-amber-50 hover:text-amber-600"}`}>
                                T.{m}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Năm */}
                    <div className="relative">
                      <button onClick={e=>{e.stopPropagation();setOpenYearDrop(v=>!v);setOpenDayDrop(false);setOpenMonthDrop(false);}}
                        className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[64px] justify-between">
                        <span>{modalStartYear}</span>
                        <span className="text-slate-500 text-[10px]">{openYearDrop?"▴":"▾"}</span>
                      </button>
                      {openYearDrop&&(
                        <div className="absolute top-full mt-1 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-28 max-h-48 overflow-y-auto">
                          <div className="py-1">
                            {Array.from({length:12},(_,i)=>2024+i).map(y=>(
                              <button key={y} onClick={()=>{setModalStartYear(y);setModalPage(0);setOpenYearDrop(false);}}
                                className={`w-full text-left px-4 py-2 text-xs font-bold transition-all cursor-pointer ${y===modalStartYear?"bg-amber-500 text-white":"text-slate-600 hover:bg-amber-50 hover:text-amber-600"}`}>
                                {y}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div ref={modalScrollRef} className="overflow-y-auto flex-1 px-4 sm:px-6 pb-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700">
                      <strong>Giải ngân 3 đợt theo tiến độ:</strong> 45% ký HĐMB · 25% bàn giao nhà · 5% nhận GCN. Tổng = 75% giá căn = {Math.round(loanVnd).toLocaleString("vi-VN")} đ. Ô <span className="bg-rose-100 text-rose-600 px-1 rounded font-bold">đỏ</span> = NH giải ngân thêm, dư nợ tăng theo đợt.
                    </div>
                    <table className="w-full text-[11px]">
                      <thead><tr className="border-b-2 border-slate-200">
                        <th className="pb-1.5 text-left text-[10px] font-bold text-slate-500 uppercase">Kỳ</th>
                        <th className="pb-1.5 text-left text-[10px] font-bold text-slate-500 uppercase">Ngày trả</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-slate-500 uppercase hidden sm:table-cell">Dư nợ đầu kỳ</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-emerald-600 uppercase">Gốc</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-rose-500 uppercase">Lãi</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-amber-600 uppercase">Tổng thanh toán</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {paged.map((r,i)=>r.isEvent?(
                          <tr key={`e${i}`} className="bg-rose-50 border-y-2 border-rose-300">
                            <td colSpan={2} className="py-2 px-1 font-extrabold text-rose-700 text-[10px]">🏦 {r.eventLabel} +{Math.round(r.eventAmt ?? 0).toLocaleString("vi-VN")} đ</td>
                            <td className="py-2 text-right font-extrabold text-rose-700 hidden sm:table-cell">→ {Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                            <td colSpan={3} className="py-2 text-right font-extrabold text-rose-700">→ {Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                          </tr>
                        ):r.isFinal?(
                          <tr key="final" className="bg-emerald-50 border-t-2 border-emerald-400">
                            <td className="py-2 font-extrabold text-emerald-700 text-[10px]">✅ Tất toán</td>
                            <td className="py-2 text-emerald-600 text-[10px] font-bold">{r.date}</td>
                            <td colSpan={4} className="py-2 text-right font-extrabold text-emerald-700">Dư nợ: 0 đ</td>
                          </tr>
                        ):(
                          <tr key={r.seq} className={`${r.seq%2===0?"bg-slate-50/40":""} hover:bg-amber-50 transition-colors`}>
                            <td className="py-1.5 font-bold text-slate-700 tabular-nums">{r.seq}</td>
                            <td className="py-1.5 text-slate-400 text-[10px]">{r.date}</td>
                            <td className="py-1.5 text-right text-slate-500 tabular-nums hidden sm:table-cell">{Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                            <td className="py-1.5 text-right text-emerald-600 font-semibold tabular-nums">{Math.round(r.principal).toLocaleString("vi-VN")} đ</td>
                            <td className="py-1.5 text-right text-rose-500 tabular-nums">{Math.round(r.interest).toLocaleString("vi-VN")} đ</td>
                            <td className="py-1.5 text-right font-extrabold text-amber-600 tabular-nums">{Math.round(r.total).toLocaleString("vi-VN")} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {totalP>1&&(<div className="flex items-center justify-center gap-3 mt-3">
                      <button disabled={modalPage===0} onClick={()=>{setModalPage(p=>p-1);modalScrollRef.current?.scrollTo({top:0,behavior:"smooth"});}} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer">← Trước</button>
                      <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg">{modalPage+1}/{totalP}</span>
                      <button disabled={modalPage===totalP-1} onClick={()=>{setModalPage(p=>p+1);modalScrollRef.current?.scrollTo({top:0,behavior:"smooth"});}} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer">Sau →</button>
                    </div>)}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 gap-3">
                  <p className="text-xs text-slate-400 hidden sm:block">Hotline: <a href="tel:0937587438" className="font-bold text-amber-600">0937.587.438</a></p>
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <button
                      onClick={() => {
                        exportLoanScheduleToExcel({
                          projectName: cfg.name,
                          unitLabel: unit.label,
                          unitArea: unit.area,
                          totalPriceWithVat: Math.round(priceWithVat * 1_000_000_000),
                          loanAmount: Math.round(loanVnd),
                          loanPercent: cfg.loanPercent,
                          ratePerYear: cfg.policyRate,
                          years: cfg.loanYears,
                          startDay: modalStartDay,
                          startMonth: modalStartMonth,
                          startYear: modalStartYear,
                          rows: rows,
                          totalInterest: Math.round(totalInt),
                          totalPayment: Math.round(loanVnd + totalInt),
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Xuất Excel (.xlsx)
                    </button>
                    <button onClick={()=>setShowModal(false)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md">Đóng</button>
                  </div>
                </div>
              </>);
            })()}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

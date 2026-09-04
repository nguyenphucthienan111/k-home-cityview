import React, { useEffect, useState, useRef, useMemo, useCallback, memo, startTransition } from "react";
import ReactDOM from "react-dom";
import { 
  ArrowRight, 
  Star, 
  MapPin, 
  Sparkles, 
  Building, 
  Landmark, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Coins, 
  Percent, 
  ChevronRight, 
  Search, 
  Award, 
  Eye, 
  Compass,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Info,
  X,
  Send,
  CheckCircle,
  Download
} from "lucide-react";
import { Project } from "../types";
import { imgUrl } from "../utils/imageUrl";
import { exportLoanScheduleToExcel } from "../utils/excelExport";

// ─── Memoized sub-components để tránh re-render khi HomeView state thay đổi ───

const ProjectCard = memo(function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: (path: string) => void;
}) {
  const progressMap: Record<string, { label: string; rate: string }> = {
    "k-home-cityview-ho-nai":   { label: "Tiến độ thi công",    rate: "35%" },
    "k-home-avenue-nhon-trach": { label: "Đã đăng ký giữ chỗ", rate: "60%" },
    "k-home-midtown-trang-bom": { label: "Tiến độ thi công",    rate: "20%" },
  };
  const progress = progressMap[project.slug] ?? { label: "Đã đăng ký", rate: "50%" };

  return (
    <a
      href={`/${project.slug}`}
      onClick={(e) => { e.preventDefault(); onClick(`/${project.slug}`); }}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-500/20 transition-[transform,box-shadow,border-color] duration-500 group flex flex-col h-full cursor-pointer relative no-underline"
    >
      <div className="relative h-72 overflow-hidden bg-slate-200">
        <img
          src={imgUrl(project.image)}
          alt={`${project.title} - Phối cảnh dự án nhà ở xã hội K-Home tại Đồng Nai`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 transition-opacity duration-300"
          loading="lazy"
          width="600"
          height="288"
          style={{ backgroundColor: "#e2e8f0" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
          {project.type}
        </div>
        <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md ${
          project.status === "Đang bốc thăm" ? "bg-amber-400 text-slate-900"
          : project.status === "Đã công bố" ? "bg-sky-300 text-slate-900"
          : project.status === "Đã công bố"  ? "bg-emerald-300 text-slate-900"
          : "bg-white/90 text-slate-800"
        }`}>
          {project.status}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(project.rating) ? "fill-amber-500" : "opacity-30"}`} />
            ))}
            <span className="text-slate-500 text-[11px] font-semibold ml-1">({project.rating})</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors leading-tight line-clamp-1 font-display">
            {project.title}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-light">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="line-clamp-1">{project.location.split(",").slice(-2).join(", ")}</span>
          </div>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{project.description}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">{progress.label}</span>
            <span className="text-amber-600 font-bold">{progress.rate}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" style={{ width: progress.rate }} />
          </div>
        </div>
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-sm mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Quy mô diện tích</span>
            <span className="font-bold text-slate-700 block text-xs sm:text-sm mt-0.5">{project.area}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Giá từ</span>
            <span className="block text-lg font-extrabold text-amber-600 mt-0.5">{project.price}</span>
          </div>
        </div>
      </div>
    </a>
  );
});

const CoreValueCard = memo(function CoreValueCard({
  icon, title, subtitle, description,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-2xl hover:border-amber-500/30 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-100 group-hover:text-amber-700 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
        <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
      </div>
      <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest block mb-1">{subtitle}</span>
      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    </div>
  );
});

const TestimonialCard = memo(function TestimonialCard({
  quote, author, role, rating, avatar,
}: {
  quote: string; author: string; role: string; rating: number; avatar: string;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100/80 p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between space-y-8 relative overflow-hidden">
      <span className="absolute -top-4 -left-2 text-amber-100/50 font-serif text-[180px] leading-none pointer-events-none select-none opacity-40">"</span>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-1">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
          ))}
        </div>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">"{quote}"</p>
      </div>
      <div className="border-t border-slate-100 pt-6 relative z-10 flex items-center gap-4">
        <img
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30 shadow-inner bg-slate-200"
          loading="lazy"
          width="48"
          height="48"
          referrerPolicy="no-referrer"
        />
        <div>
          <h4 className="font-extrabold text-slate-800 text-sm">{author}</h4>
          <p className="text-slate-400 text-[11px] mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
});

// ─── Static config — đặt ngoài component để không recreate mỗi render ───

type CalcUnit = { label: string; area: string; price: number; priceMin: number; priceMax: number; priceLabel: string };
type CalcScheduleRow = { dot: string; pct: string; note: string; group?: "own" | "bank" };
type CalcProjectConfig = {
  name: string; loanYears: number; loanPercent: number; policyRate: number;
  units: CalcUnit[];
  policySchedule: CalcScheduleRow[];
  cashSchedule: CalcScheduleRow[];
};

const PROJECT_CALC_CONFIG: Record<string, CalcProjectConfig> = {
  "k-home-cityview-ho-nai": {
    name: "K-Home CityView Hố Nai",
    loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "1PN+A", area: "47,3m²",  price: 0.95,  priceMin: 0.95,  priceMax: 1.08,  priceLabel: "950tr – 1,08 tỷ" },
      { label: "1PN+B", area: "62,4m²",  price: 1.20,  priceMin: 1.20,  priceMax: 1.40,  priceLabel: "1,20 – 1,40 tỷ" },
      { label: "2PN",   area: "70,4m²",  price: 1.50,  priceMin: 1.50,  priceMax: 1.70,  priceLabel: "1,50 – 1,70 tỷ" },
      { label: "3PN",   area: "84,4m²",  price: 1.80,  priceMin: 1.80,  priceMax: 2.00,  priceLabel: "1,80 – 2,00 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",    pct: "30.000.000đ",       note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",  pct: "15%",               note: "7 ngày kể từ ngày cọc, khách thanh toán đợt 1 và ký HĐDVTV", group: "own" },
      { dot: "Đợt 2",  pct: "5%",                note: "30 ngày kể từ ngày đến hạn thanh toán đợt 1", group: "own" },
      { dot: "Đợt 3",  pct: "5%",                note: "15 ngày kể từ ngày nhận thông báo ký HĐMB", group: "own" },
      { dot: "Đợt 4",  pct: "45% (NH giải ngân)", note: "45 ngày sau ký HĐMB, Ngân hàng giải ngân lần 1", group: "bank" },
      { dot: "Đợt 5",  pct: "25% (NH giải ngân)", note: "15 ngày kể từ thông báo BG nhà, NH giải ngân 25% + KH đóng 2% phí bảo trì", group: "bank" },
      { dot: "Đợt 6",  pct: "5% (NH giải ngân)",  note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)", group: "bank" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, Ký HĐDVTV", group: "own" },
      { dot: "Đợt 2",    pct: "10%",                  note: "30 ngày kể từ ngày đến hạn đợt 1", group: "own" },
      { dot: "Đợt 3",    pct: "5%",                   note: "60 ngày kể từ ngày đến hạn đợt 2", group: "own" },
      { dot: "Đợt 4",    pct: "5%",                   note: "90 ngày kể từ ngày đến hạn đợt 3", group: "own" },
      { dot: "Đợt 5–14", pct: "3%/đợt (10 đợt)",      note: "Mỗi đợt cách nhau 30 ngày theo tiến độ thi công", group: "own" },
      { dot: "Đợt 15",   pct: "5%",                   note: "30 ngày kể từ ngày đến hạn đợt 14", group: "own" },
      { dot: "Đợt 16",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ ngày nhận thông báo bàn giao nhà", group: "own" },
      { dot: "Đợt 17",   pct: "5%",                   note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)", group: "own" },
    ],
  },
  "k-home-avenue-nhon-trach": {
    name: "K-Home Avenue Nhơn Trạch",
    loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "37,7m²", price: 0.75, priceMin: 0.75,  priceMax: 0.85,  priceLabel: "Từ 750 triệu" },
      { label: "1PN+",   area: "46,6m²", price: 0.99, priceMin: 0.99,  priceMax: 1.10,  priceLabel: "Từ 990 triệu" },
      { label: "2PN-S",  area: "65,7m²", price: 1.23, priceMin: 1.23,  priceMax: 1.39,  priceLabel: "1,23 – 1,39 tỷ" },
      { label: "2PN-L",  area: "69,5m²", price: 1.40, priceMin: 1.40,  priceMax: 1.47,  priceLabel: "1,40 – 1,47 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",    pct: "30.000.000đ",       note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",  pct: "15%",               note: "7 ngày kể từ ngày cọc, khách TT đợt 1 và ký HĐDVTV", group: "own" },
      { dot: "Đợt 2",  pct: "5%",                note: "30 ngày kể từ ngày đến hạn TT đợt 1", group: "own" },
      { dot: "Đợt 3",  pct: "5%",                note: "15 ngày kể từ ngày nhận thông báo ký HĐMB", group: "own" },
      { dot: "Đợt 4",  pct: "45% (NH giải ngân)", note: "45 ngày sau ký HĐMB, Ngân hàng giải ngân lần 1", group: "bank" },
      { dot: "Đợt 5",  pct: "25% (NH giải ngân)", note: "15 ngày kể từ thông báo BG nhà, NH giải ngân 25% + KH đóng 2% phí bảo trì", group: "bank" },
      { dot: "Đợt 6",  pct: "5% (NH giải ngân)",  note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)", group: "bank" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, ký HĐDVTV", group: "own" },
      { dot: "Đợt 2–5",  pct: "5%/đợt (4 đợt)",       note: "Mỗi đợt cách nhau 30–60 ngày", group: "own" },
      { dot: "Đợt 6–15", pct: "3%/đợt (10 đợt)",      note: "Mỗi đợt cách nhau 30 ngày theo tiến độ tầng", group: "own" },
      { dot: "Đợt 16",   pct: "5%",                   note: "30 ngày kể từ ngày đến hạn đợt 15", group: "own" },
      { dot: "Đợt 17",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ ngày nhận thông báo bàn giao nhà", group: "own" },
      { dot: "Đợt 18",   pct: "5%",                   note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)", group: "own" },
    ],
  },
  "k-home-midtown-trang-bom": {
    name: "K-Home Midtown Trảng Bom",
    loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "36,1m²", price: 0.75, priceMin: 0.75, priceMax: 0.85, priceLabel: "Từ 750 triệu" },
      { label: "1PN+A",  area: "47,0m²", price: 0.99, priceMin: 0.99, priceMax: 1.10, priceLabel: "Từ 990 triệu" },
      { label: "1PN+B",  area: "55,1m²", price: 1.20, priceMin: 1.20, priceMax: 1.35, priceLabel: "Từ 1,20 tỷ" },
      { label: "2PN",    area: "68,8m²", price: 1.50, priceMin: 1.50, priceMax: 1.65, priceLabel: "Từ 1,50 tỷ" },
    ],
    policySchedule: [
      { dot: "Cọc",    pct: "30.000.000đ",       note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",  pct: "15%",               note: "7 ngày kể từ ngày cọc, ký HĐDVTV", group: "own" },
      { dot: "Đợt 2",  pct: "10%",               note: "30 ngày kể từ ngày đến hạn đợt 1", group: "own" },
      { dot: "Đợt 3",  pct: "45% (NH giải ngân)", note: "Ngân hàng giải ngân lần 1", group: "bank" },
      { dot: "Đợt 4",  pct: "25% (NH giải ngân)", note: "15 ngày kể từ thông báo BG nhà, NH giải ngân 25% + KH đóng 100% phí bảo trì", group: "bank" },
      { dot: "Đợt 5",  pct: "5% (NH giải ngân)",  note: "Nhận GCNQSHCH (Sổ hồng)", group: "bank" },
    ],
    cashSchedule: [
      { dot: "Cọc",      pct: "30.000.000đ",         note: "Ngay khi ký Phiếu xác nhận cọc", group: "own" },
      { dot: "Đợt 1",    pct: "15%",                  note: "7 ngày kể từ ngày cọc, ký HĐDVTV", group: "own" },
      { dot: "Đợt 2",    pct: "10%",                  note: "30 ngày kể từ ngày đến hạn đợt 1", group: "own" },
      { dot: "Đợt 3–11", pct: "5%/đợt (9 đợt)",       note: "Mỗi đợt cách nhau 30–60 ngày theo tiến độ thi công", group: "own" },
      { dot: "Đợt 12",   pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ ngày nhận thông báo bàn giao nhà", group: "own" },
      { dot: "Đợt 13",   pct: "5%",                   note: "15 ngày kể từ ngày nhận thông báo nhận GCNQSHCH (Sổ hồng)", group: "own" },
    ],
  },
};

// Helper format tiền VNĐ — dưới 1 tỷ hiển thị triệu, từ 1 tỷ trở lên hiển thị tỷ
function formatVND(billion: number): string {
  if (billion < 1) {
    const tr = Math.round(billion * 1000);
    return `${tr} triệu`;
  }
  if (billion === Math.floor(billion)) {
    return `${billion} tỷ`;
  }
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
  } else if (ty > 0 && (nghin > 0 || dong > 0)) {
    // không cần đọc nếu trống
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

// Helper: số ngày tháng m (0-indexed) tính từ năm startYear
// Xử lý năm nhuận đúng: tháng 2 = 29 ngày nếu là năm nhuận
function getDaysInMonth(monthIndex: number, startYear: number = 2026): number {
  const year = startYear + Math.floor(monthIndex / 12);
  const month = monthIndex % 12; // 0=Jan, 1=Feb, ...
  if (month === 1) { // February
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeap ? 29 : 28;
  }
  return [31,28,31,30,31,30,31,31,30,31,30,31][month];
}

// Pure function — tính toán kết quả calculator theo phương pháp giảm dần (dư nợ × ngày/365 hoặc 366)
// Đồng nhất với modal lịch trả nợ chi tiết
function calcResults(
  investmentValue: number,
  paymentOption: string,
  selectedCalcProject: string,
  startYear: number = 2026,
) {
  const cfg = PROJECT_CALC_CONFIG[selectedCalcProject];
  const loanPercent = paymentOption === "cash" ? 0 : cfg.loanPercent;
  const interestRate = cfg.policyRate;
  const loanYears = paymentOption === "cash" ? 0 : cfg.loanYears;
  const downPayment = investmentValue * (100 - loanPercent) / 100;
  const loanAmount  = investmentValue * loanPercent / 100;

  const n = loanYears * 12;
  const L = loanAmount * 1000; // triệu
  let monthlyPayment = 0;
  let totalInterest = 0;

  if (L > 0 && n > 0) {
    const principalPerMonth = L / n;
    let balance = L;
    const rYear = interestRate / 100;
    for (let m = 0; m < n; m++) {
      const year = startYear + Math.floor(m / 12);
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const daysInYear = isLeapYear ? 366 : 365;
      const days = getDaysInMonth(m, startYear);
      const interest = balance * rYear * days / daysInYear;
      if (m === 0) monthlyPayment = principalPerMonth + interest;
      totalInterest += interest;
      balance -= principalPerMonth;
    }
  }

  return {
    unitPrice: investmentValue.toFixed(2),
    downPayment: downPayment.toFixed(2),
    loanAmount: loanAmount.toFixed(2),
    monthlyPayment: monthlyPayment.toFixed(1),
    totalInterest: totalInterest.toFixed(0),
    loanYears,
    loanPercent,
  };
}

interface HomeViewProps {
  onNavigate: (hash: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hero Slideshow States
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);

  const homeNavSections = [
    { id: "hero", label: "Hero" },
    { id: "featured-cityview", label: "K-Home CityView" },
    { id: "featured-projects", label: "Dự Án" },
    { id: "vi-tri", label: "Vị Trí" },
    { id: "mat-bang", label: "Mặt Bằng" },
    { id: "nha-mau", label: "Nhà Mẫu" },
    { id: "amenities", label: "Tiện Ích" },
    { id: "calculator", label: "Tính Toán" },
    { id: "dieu-kien-noxh", label: "Điều Kiện" },
    { id: "phap-ly", label: "Pháp Lý" },
    { id: "chu-dau-tu", label: "Chủ Đầu Tư" },
    { id: "lai-suat-noxh", label: "Lãi Suất" },
    { id: "tin-tuc", label: "Tin Tức" },
  ];

  const heroProjects = useMemo(() => [
    {
      name: "K-Home CityView Biên Hòa",
      image: "/k-home cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2.webp",
      location: "Đường Điều Xiển, P. Hố Nai, TP. Biên Hòa, Đồng Nai",
      scale: "2,85 hecta",
      product: "1.328 căn hộ NOXH và 39 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, CDC Jsc, K-City",
      status: "Đang bốc thăm",
      statusColor: "#f59e0b",
    },
    {
      name: "K-Home Midtown Trảng Bom",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp",
      location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
      scale: "13,97 hecta",
      product: "542 căn hộ NOXH và 20 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, NAGECCO, K-City",
      status: "Đã công bố",
      statusColor: "#6ee7b7",
    },
    {
      name: "K-Home Avenue Nhơn Trạch",
      image: "/k-home avenue/PC02-TT-10K_2-min.jpg.webp",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      scale: "5,3 hecta",
      product: "1.022 căn hộ NOXH và 82 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Surbana Jurong, Global Vireon Studio, Handong, Coninco, K-City",
      status: "Đã công bố",
      statusColor: "#7dd3fc",
    },
  ], []);

  // Quick Hero Filter states
  const [heroProject, setHeroProject] = useState<string>("all");
  const [heroBedrooms, setHeroBedrooms] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<"project" | "bedrooms" | null>(null);

  // Interactive Showroom Active Tab
  const [activeShowroomTab, setActiveShowroomTab] = useState<number>(0);

  // Project Carousel (right panel of amenities section)
  const [activeProjectTab, setActiveProjectTab] = useState<number>(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState<boolean>(false);

  // Popup lead form state
  const [showPopup, setShowPopup] = useState(false);

  // Lightbox for homepage images
  const [homeLightbox, setHomeLightbox] = useState<{ imgs: string[]; alts: string[]; idx: number } | null>(null);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [popupPhone, setPopupPhone] = useState("");
  const [popupProject, setPopupProject] = useState("k-home-cityview-ho-nai");
  const [popupSubmitting, setPopupSubmitting] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);

  // Inline consultation form state
  const [ctaName, setCtaName] = useState("");
  const [ctaPhone, setCtaPhone] = useState("");
  const [ctaProject, setCtaProject] = useState("k-home-cityview-ho-nai");
  const [ctaSubmitting, setCtaSubmitting] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [ctaError, setCtaError] = useState("");

  const projectCarousel = useMemo(() => [
    {
      slug: "k-home-cityview-ho-nai",
      name: "K-Home CityView Hố Nai",
      tag: "Nhà ở xã hội · Biên Hòa",
      location: "Đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa, Đồng Nai",
      price: "Từ 950 triệu",
      scale: "2,85 ha · 4 Block · 1.816 căn",
      badge: "Đang bốc thăm",
      badgeColor: "#f59e0b",
      image: "/k-home cityview/V11_TH_EXT_NOTM_POOL_2.webp"
    },
    {
      slug: "k-home-avenue-nhon-trach",
      name: "K-Home Avenue Nhơn Trạch",
      tag: "Nhà ở xã hội · Nhơn Trạch",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      price: "Từ 750 triệu",
      scale: "84 ha · 4 Block 12 tầng · 1.104 căn",
      badge: "Đã công bố",
      badgeColor: "#7dd3fc",
      image: "/k-home avenue/PC01-TT-copy_2_2-min.jpg.webp"
    },
    {
      slug: "k-home-midtown-trang-bom",
      name: "K-Home Midtown Trảng Bom",
      tag: "Nhà ở xã hội · Trảng Bom",
      location: "KDC Bàu Xéo, huyện Trảng Bom, tỉnh Đồng Nai",
      price: "Trả góp 3,5 – 4,5tr/tháng",
      scale: "13,97 ha · 15 tầng · 562 căn",
      badge: "Đã công bố",
      badgeColor: "#6ee7b7",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-ho-boi-view-2-2048x1150.webp"
    }
  ], []);

  // Investment Calculator States
  const [investmentValue, setInvestmentValue] = useState<number>(1.0);
  const [paymentOption, setPaymentOption] = useState<string>("policy");
  const [selectedCalcProject, setSelectedCalcProject] = useState<string>("k-home-cityview-ho-nai");
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [showLoanModal, setShowLoanModal] = useState<boolean>(false);
  const [modalLoan, setModalLoan] = useState<number>(700);
  const [modalLoanPct, setModalLoanPct] = useState<number>(75); // % vay trên giá căn
  const [modalRate, setModalRate] = useState<number>(5.4);
  const [modalYears, setModalYears] = useState<number>(25);
  const [modalMonthPage, setModalMonthPage] = useState<number>(0);
  const [modalStartDay, setModalStartDay] = useState<number>(24);
  const [modalStartMonth, setModalStartMonth] = useState<number>(1);
  const [modalStartYear, setModalStartYear] = useState<number>(2026);
  const [openDayDrop, setOpenDayDrop] = useState(false);
  const [openMonthDrop, setOpenMonthDrop] = useState(false);
  const [openYearDrop, setOpenYearDrop] = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [priceInputMode, setPriceInputMode] = useState<"slider"|"input">("slider");
  const [priceInputRaw, setPriceInputRaw] = useState<string>("");

  // Scroll Tracking State
  const [activeSection, setActiveSection] = useState<string>("hero");
  // Stats counter animation
  const [statsVisible, setStatsVisible] = useState<boolean>(false);
  const [statsDone, setStatsDone] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Counter values (animated) — gộp thành 1 state object để chỉ trigger 1 re-render/tick
  const [counts, setCounts] = useState({ v15: 0, v12: 0, v10: 0, v98: 0 });

  const projectsSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const ids = ["hero", "featured-cityview", "featured-projects", "vi-tri", "mat-bang", "nha-mau", "amenities", "calculator", "dieu-kien-noxh", "phap-ly", "chu-dau-tu", "lai-suat-noxh", "tin-tuc"];
    const handleScroll = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate project carousel every 4 seconds — dừng khi hover
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setInterval(() => {
      // startTransition: carousel rotation là non-urgent, không block user interaction
      startTransition(() => {
        setActiveProjectTab((prev) => (prev + 1) % 3);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isCarouselHovered]);

  // Stats counter: trigger once when section enters viewport, persist via sessionStorage
  useEffect(() => {
    const alreadyRan = sessionStorage.getItem("statsAnimated");
    if (alreadyRan) {
      setCounts({ v15: 15, v12: 12, v10: 10, v98: 98 });
      setStatsDone(true);
      return;
    }

    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsDone) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible || statsDone) return;

    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = ease(step / steps);
      // 1 setState = 1 re-render thay vì 4
      setCounts({
        v15: Math.round(progress * 15),
        v12: Math.round(progress * 12),
        v10: Math.round(progress * 10),
        v98: Math.round(progress * 98),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({ v15: 15, v12: 12, v10: 10, v98: 98 });
        setStatsDone(true);
        sessionStorage.setItem("statsAnimated", "1");
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible]);

  // Definition of Sections for Floating Sidebar Dot Navigation
  const homeSections = [
    // Nhóm 1: Dự án
    { id: "hero",              label: "Tổng quan dự án",    group: "Dự Án" },
    { id: "featured-projects", label: "Danh mục dự án",     group: "Dự Án" },
    { id: "featured-cityview", label: "K-Home CityView",    group: "Dự Án" },
    { id: "vi-tri",            label: "Vị trí kết nối",     group: "Dự Án" },
    { id: "mat-bang",          label: "Mặt bằng căn hộ",    group: "Dự Án" },
    { id: "nha-mau",           label: "Nhà mẫu thực tế",    group: "Dự Án" },
    { id: "amenities",         label: "Tiện ích nội khu",   group: "Dự Án" },
    { id: "calculator",        label: "Kế hoạch tài chính", group: "Dự Án" },
    // Nhóm 2: Thông tin
    { id: "dieu-kien-noxh",    label: "Điều kiện NOXH",     group: "Thông Tin" },
    { id: "phap-ly",           label: "Pháp lý dự án",      group: "Thông Tin" },
    { id: "chu-dau-tu",        label: "Chủ đầu tư",         group: "Thông Tin" },
    { id: "giai-thuong",       label: "Giải thưởng",        group: "Thông Tin" },
    { id: "lai-suat-noxh",     label: "Lãi suất NOXH",      group: "Thông Tin" },
    { id: "tin-tuc",           label: "Tin tức & Bài viết", group: "Thông Tin" },
    { id: "philosophy",        label: "Giá trị cốt lõi",    group: "Thông Tin" },
    { id: "testimonials",      label: "Chia sẻ cư dân",     group: "Thông Tin" },
    { id: "seo-content",       label: "Thông tin chi tiết", group: "Thông Tin" },
    { id: "consultation",      label: "Đăng ký tư vấn",     group: "Thông Tin" },
  ];

  // Auto-advance hero slideshow every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      startTransition(() => {
        setActiveHeroSlide((prev) => (prev + 1) % heroProjects.length);
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [heroProjects.length]);

  // Popup timer — show after 8 seconds, only once per session
  // Click outside to close month/year dropdowns in modal
  useEffect(() => {
    if (!openMonthDrop && !openYearDrop) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-modal-drop]")) {
        setOpenMonthDrop(false);
        setOpenYearDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openMonthDrop, openYearDrop]);
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popupShown");
    if (alreadySeen) return;
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("popupShown", "1");
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "K-Home Đồng Nai | Nhà Ở Xã Hội Kim Oanh Land – CityView, Midtown, Avenue";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Trang thông tin chính thức 3 dự án nhà ở xã hội K-Home tại Đồng Nai: K-Home CityView Hố Nai, K-Home Midtown Trảng Bom, K-Home Avenue Nhơn Trạch. Giá từ 750 triệu, lãi suất 5,4%/năm. Kim Oanh Land.");
    }

    // Schema FAQPage
    const existingFAQ = document.getElementById("schema-faq");
    if (existingFAQ) existingFAQ.remove();
    const faq = document.createElement("script");
    faq.id = "schema-faq";
    faq.type = "application/ld+json";
    faq.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "K-Home CityView Biên Hòa giá bao nhiêu?",
          "acceptedAnswer": { "@type": "Answer", "text": "K-Home CityView Biên Hòa có giá từ 950 triệu đến 2 tỷ/căn tùy loại. Căn 1PN+A từ 950 triệu, căn 1PN+B từ 1,20 tỷ, căn 2PN từ 1,50 tỷ, căn 3PN từ 1,80 tỷ. Bàn giao full nội thất, pháp lý đầy đủ." }
        },
        {
          "@type": "Question",
          "name": "Điều kiện mua nhà ở xã hội K-Home Đồng Nai là gì?",
          "acceptedAnswer": { "@type": "Answer", "text": "Người mua cần đáp ứng điều kiện: chưa có nhà ở hoặc diện tích nhà ở dưới 10m²/người, có thu nhập thuộc đối tượng NOXH theo quy định Nhà nước, hộ khẩu hoặc tạm trú tại Đồng Nai. Vay được lãi suất ưu đãi 5,4%/năm từ ngân hàng chính sách." }
        },
        {
          "@type": "Question",
          "name": "K-Home Midtown Trảng Bom ở đâu?",
          "acceptedAnswer": { "@type": "Answer", "text": "K-Home Midtown tọa lạc tại trung tâm huyện Trảng Bom, giao giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, Phường Trảng Bom, Đồng Nai. Giá từ 750 triệu/căn." }
        },
        {
          "@type": "Question",
          "name": "K-Home Avenue Nhơn Trạch có những loại căn hộ nào?",
          "acceptedAnswer": { "@type": "Answer", "text": "K-Home Avenue Nhơn Trạch có 4 loại: Studio 37,7m² từ 750 triệu, 1 Phòng ngủ 46,6m² từ 990 triệu, 2 Phòng ngủ nhỏ 65,7m² từ 1,23 tỷ, 2 Phòng ngủ lớn 69,5m² từ 1,40 tỷ. Tất cả bàn giao full nội thất." }
        },
        {
          "@type": "Question",
          "name": "Lãi suất vay mua nhà ở xã hội K-Home là bao nhiêu?",
          "acceptedAnswer": { "@type": "Answer", "text": "Người mua đủ điều kiện nhà ở xã hội được vay với lãi suất ưu đãi 5,4%/năm từ các ngân hàng quốc doanh như Vietinbank, BIDV, Vietcombank, Agribank theo chính sách hỗ trợ nhà ở xã hội quốc gia." }
        }
      ]
    });
    document.head.appendChild(faq);

    // Schema BreadcrumbList trang chủ
    const existingBC = document.getElementById("schema-breadcrumb-home");
    if (existingBC) existingBC.remove();
    const bc = document.createElement("script");
    bc.id = "schema-breadcrumb-home";
    bc.type = "application/ld+json";
    bc.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://k-homedongnai.com.vn/" }
      ]
    });
    document.head.appendChild(bc);

    return () => {
      document.getElementById("schema-faq")?.remove();
      document.getElementById("schema-breadcrumb-home")?.remove();
    };
  }, []);

  useEffect(() => {
    // Stale-while-revalidate — hiện cache ngay, fetch mới ngầm
    const CACHE_KEY = "khome_projects_v3";
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const list = JSON.parse(cached);
        setAllProjects(list);
        setFilteredProjects(list);
        setLoading(false);
      } catch {}
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        setAllProjects(list);
        setFilteredProjects(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects on Home:", err);
        if (!cached) { setAllProjects([]); setFilteredProjects([]); }
        setLoading(false);
      });
  }, []);

  // IntersectionObserver & Custom Scroll spying to highlight dots
  useEffect(() => {
    let rafId: number | null = null;

    // Cache offsetTop mỗi khi layout thay đổi — tránh forced reflow trong rAF
    const sectionCache: { id: string; top: number; height: number }[] = [];
    const rebuildCache = () => {
      sectionCache.length = 0;
      for (const section of homeSections) {
        const el = document.getElementById(section.id);
        if (el) sectionCache.push({ id: section.id, top: el.offsetTop, height: el.offsetHeight });
      }
    };
    rebuildCache();

    // Rebuild khi resize (layout có thể thay đổi)
    const resizeObserver = new ResizeObserver(rebuildCache);
    resizeObserver.observe(document.documentElement);

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
          startTransition(() => setActiveSection("consultation"));
          return;
        }

        for (const s of sectionCache) {
          if (scrollPosition >= s.top && scrollPosition < s.top + s.height) {
            startTransition(() => setActiveSection(s.id));
            break;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [allProjects]);

  // Handle hero quick search — navigate sang /projects với query params đúng
  const handleHeroSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroProject !== "all") params.set("project", heroProject);
    if (heroBedrooms !== "all") params.set("bedrooms", heroBedrooms);
    const query = params.toString();
    onNavigate(query ? `/san-pham?${query}` : "/san-pham");
  }, [heroProject, heroBedrooms, onNavigate]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setHeroProject("all");
    setHeroBedrooms("all");
  }, []);

  // Submit inline CTA form
  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtaError("");
    if (!ctaName.trim() || !ctaPhone.trim()) {
      setCtaError("Vui lòng điền Họ tên và Số điện thoại.");
      return;
    }
    setCtaSubmitting(true);
    const projectNameMap: Record<string, string> = {
      "k-home-cityview-ho-nai":   "K-Home CityView Biên Hòa",
      "k-home-midtown-trang-bom": "K-Home Midtown Trảng Bom",
      "k-home-avenue-nhon-trach": "K-Home Avenue Nhơn Trạch",
    };
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ctaName.trim(),
        phone: ctaPhone.trim(),
        email: "",
        projectSlug: ctaProject,
        projectName: projectNameMap[ctaProject] ?? ctaProject,
        message: "Đăng ký tư vấn từ banner trang chủ."
      })
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setCtaSuccess(true); setCtaSubmitting(false); })
      .catch(() => { setCtaError("Có lỗi xảy ra. Vui lòng thử lại."); setCtaSubmitting(false); });
  };

  // Submit popup form
  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupName.trim() || !popupPhone.trim()) return;
    setPopupSubmitting(true);
    const projectNameMap: Record<string, string> = {
      "k-home-cityview-ho-nai":   "K-Home CityView Biên Hòa",
      "k-home-midtown-trang-bom": "K-Home Midtown Trảng Bom",
      "k-home-avenue-nhon-trach": "K-Home Avenue Nhơn Trạch",
    };
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: popupName.trim(),
        phone: popupPhone.trim(),
        email: "",
        projectSlug: popupProject,
        projectName: projectNameMap[popupProject] ?? popupProject,
        message: "Đăng ký tư vấn từ popup tự động."
      })
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setPopupSuccess(true); setPopupSubmitting(false); })
      .catch(() => { setPopupSubmitting(false); });
  };

  // Calculate for NOXH — dùng pure function ngoài component trên tổng giá gồm 5% VAT
  const priceWithVat = useMemo(() => investmentValue * 1.05, [investmentValue]);

  const calcResult = useMemo(
    () => calcResults(priceWithVat, paymentOption, selectedCalcProject),
    [priceWithVat, paymentOption, selectedCalcProject]
  );

  // Tính trả góp kỳ 1 và tổng lãi theo công thức chuẩn của file Excel (rYear/12, giải ngân đợt 5 ở kỳ 16, đợt 6 ở kỳ 26)
  const disbCalcResult = useMemo(() => {
    if (paymentOption === "cash") return { firstMonthly: 0, totalInterest: 0 };
    const cfg = PROJECT_CALC_CONFIG[selectedCalcProject];
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
  }, [priceWithVat, paymentOption, selectedCalcProject]);

  const coreValues = useMemo(() => [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Vị Trí Thuận Tiện",
    subtitle: "Gần Khu Công Nghiệp & Trung Tâm",
    description: "Các dự án tọa lạc tại những vị trí kết nối thuận lợi với khu công nghiệp lớn, đường vành đai và trung tâm hành chính, giúp cư dân tiết kiệm thời gian di chuyển hàng ngày."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Tiện Ích Đầy Đủ",
    subtitle: "Sống Tiện Nghi Ngay Trong Khuôn Viên",
    description: "Hồ bơi, sân chơi trẻ em, khu thể dục ngoài trời, vườn cảnh quan và nhà sinh hoạt cộng đồng được quy hoạch đồng bộ, phục vụ nhu cầu thiết thực của gia đình mỗi ngày."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Pháp Lý Rõ Ràng",
    subtitle: "An Tâm Sở Hữu Lâu Dài",
    description: "Hồ sơ pháp lý đầy đủ, được bảo lãnh bởi ngân hàng, sở hữu lâu dài theo quy định nhà ở xã hội. Hỗ trợ hoàn thiện thủ tục từ A đến Z miễn phí."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Giá Trị Ổn Định",
    subtitle: "Tài Sản Thiết Thực Cho Tương Lai",
    description: "Giá thành hợp lý theo khung nhà ở xã hội, chính sách vay ưu đãi 5,4%/năm giúp gia đình dễ dàng tiếp cận. Tài sản có thanh khoản tốt và giá trị gia tăng theo hạ tầng xung quanh."
  }
  ], []);

  const showroomGallery = useMemo(() => [
    {
      title: "Hồ Bơi Người Lớn & Trẻ Em",
      tag: "Tiện ích nội khu",
      desc: "Hệ thống hồ bơi tiêu chuẩn dành cho cả người lớn và trẻ em, được trang bị tại cả 3 dự án K-Home — mang đến không gian thư giãn và vui chơi ngay trong khuôn viên chỉ dành cho cư dân.",
      images: ["/cityview.jpg", "/avenue.jpg", "/midtown.jpg"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Sân Chơi Trẻ Em",
      tag: "Giáo dục & Gia đình",
      desc: "Trường học và sân chơi trẻ em được quy hoạch ngay trong khu dân cư, giúp các gia đình an tâm về môi trường học tập và vui chơi an toàn cho con em ngay tại nơi ở.",
      images: ["/cityview1.jpg", "/avenue1.jpg", "/midtown1.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Khu Thể Dục Ngoài Trời",
      tag: "Sức khỏe cư dân",
      desc: "Phòng tập gym và khu thể dục ngoài trời được bố trí trong khuôn viên dự án, đáp ứng nhu cầu rèn luyện thể chất hàng ngày của cư dân mà không cần ra ngoài khu.",
      images: ["/cityview2.jpg", "/avenue2.png", "/midtown2.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Sky Garden & Vườn Cảnh Quan",
      tag: "Không gian xanh",
      desc: "Vườn cảnh quan, Sky Garden và nhà sinh hoạt cộng đồng tạo nên không gian gắn kết hàng xóm, nghỉ ngơi cuối tuần và thư giãn giữa thiên nhiên ngay trong lòng khu đô thị.",
      images: ["/cityview3.jpg", "/avenue3.jpg", "/midtown3.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: "Tôi mua căn 2PN tại K-Home CityView Hố Nai vì giá hợp lý và thủ tục hồ sơ NOXH được hỗ trợ tận tình từ đầu đến cuối. Lãi suất 5,4%/năm giúp tôi an tâm hơn rất nhiều về kế hoạch tài chính.",
      author: "Chị Nguyễn Thị Lan",
      role: "Giáo viên THPT, Biên Hòa",
      rating: 5,
      avatar: "https://hthaostudio.com/wp-content/uploads/2020/07/%E1%BA%A2nh-%C3%A1o-d%C3%A0i-hoa-sen-22.jpg"
    },
    {
      quote: "Gia đình tôi chọn K-Home Avenue Nhơn Trạch vì vị trí thuận tiện và môi trường sống xanh. Đội ngũ Kim Oanh Land hỗ trợ hồ sơ miễn phí, rất chuyên nghiệp và nhiệt tình.",
      author: "Anh Trần Văn Hùng",
      role: "Kỹ sư, KCN Long Thành",
      rating: 5,
      avatar: "https://images.pexels.com/photos/35107772/pexels-photo-35107772/free-photo-of-chang-trai-tr-t-tin-trong-trang-ph-c-cong-s-trang-tr-ng.jpeg?cs=tinysrgb&dpr=1&w=500"
    },
    {
      quote: "K-Home Midtown Trảng Bom là lựa chọn đúng đắn của tôi. Tiêu chuẩn xanh EDGE tiết kiệm điện nước rõ rệt, tiến độ thi công đúng hẹn, pháp lý sở hữu lâu dài rất yên tâm.",
      author: "Chị Phạm Thị Hoa",
      role: "Nhân viên văn phòng, Trảng Bom",
      rating: 5,
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe5bgvBMjwmB--wJxT-wGk3q5w9zjRToatkA8wfeCcNwR9QZXPY0pkyrA&s=10"
    }
  ], []);

  return (
    <div className="space-y-24 pb-24 bg-gradient-to-b from-amber-50/20 via-white to-slate-50 overflow-hidden relative">
      {/* ── Mobile: Side Dot Navigation for Home Page ── */}
      {isMobile && (
      <div style={{
        position: 'fixed',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
      }}
      >
        {/* Top line */}
        <div style={{
          width: '2px',
          height: '16px',
          background: 'linear-gradient(to bottom, transparent, #cbd5e1)',
          marginBottom: '8px'
        }} />

        {/* Dots container */}
        {homeNavSections.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            title={s.label}
            style={{
              width: activeSection === s.id ? '20px' : '12px',
              height: activeSection === s.id ? '20px' : '12px',
              borderRadius: '50%',
              border: activeSection === s.id ? '2px solid #dc2626' : '2px solid #cbd5e1',
              backgroundColor: activeSection === s.id ? '#fca5a5' : '#f1f5f9',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 'bold',
              color: activeSection === s.id ? '#dc2626' : '#94a3b8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fed7d7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = activeSection === s.id ? '#fca5a5' : '#f1f5f9';
            }}
          >
            {idx + 1}
          </button>
        ))}

        {/* Bottom line */}
        <div style={{
          width: '2px',
          height: '16px',
          background: 'linear-gradient(to top, transparent, #cbd5e1)',
          marginTop: '8px'
        }} />
      </div>
      )}

      {/* H1 cho SEO — visually hidden, Googlebot đọc được */}
      <h1 className="sr-only">K-Home Đồng Nai – Nhà Ở Xã Hội Kim Oanh Land tại Đồng Nai</h1>

      {/* =========== MODAL LỊCH TRẢ NỢ CHI TIẾT =========== */}
      {showLoanModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setShowLoanModal(false)}>
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative bg-white w-full sm:rounded-3xl shadow-2xl sm:max-w-2xl max-h-[95vh] sm:max-h-[88vh] flex flex-col z-10 rounded-t-3xl" onClick={e => e.stopPropagation()} style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1)" }}>
            <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {/* Drag handle for mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0"><div className="w-10 h-1 bg-slate-200 rounded-full" /></div>
            {/* Header */}
            <div className="px-5 py-3.5 flex items-start justify-between shrink-0 border-b border-slate-100">
              <div className="pr-4">
                <h3 className="text-slate-900 font-extrabold text-base flex items-center gap-2"><span className="text-lg">📊</span> Lịch Trả Nợ Chi Tiết</h3>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">Lãi tính theo số ngày thực tế / 365 — chuẩn ngân hàng VN</p>
              </div>
              <button onClick={() => setShowLoanModal(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer text-lg shrink-0 mt-0.5">✕</button>
            </div>
            {/* Inputs — 2 hàng responsive */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2 shrink-0 bg-slate-50/60 border-b border-slate-100">
              {/* Hàng 1 & 2: Thông số (readonly) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Tổng giá gồm VAT", val: Math.round(modalLoan / (modalLoanPct / 100)).toLocaleString("vi-VN") + " đ", highlight: true },
                  { label: "Khoản vay (" + modalLoanPct + "%)", val: Math.round(modalLoan).toLocaleString("vi-VN") + " đ" },
                  { label: "Lãi suất ưu đãi", val: modalRate + "% / năm" },
                  { label: "Thời hạn vay", val: modalYears + " năm (" + (modalYears * 12) + " kỳ)" },
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
            {(() => {
              // Tính cho summary cards & bảng — chuẩn theo file Excel (rYear / 12, giải ngân kỳ 1, 16, 26)
              const rYear2 = modalRate / 100;
              const n2 = Math.max(1, modalYears) * 12;
              const L2 = Math.max(1, modalLoan); // đã là VNĐ chuẩn
              const lp2 = Math.max(1, Math.min(100, modalLoanPct)) / 100;
              const contractValue2 = L2 / lp2;
              const startOffset2 = modalStartMonth - 1;
              const calcDate = (kyCur: number) => {
                const totalMonthIdx = startOffset2 + (kyCur - 1);
                const year = modalStartYear + Math.floor(totalMonthIdx / 12);
                const mo = totalMonthIdx % 12;
                const maxDays = new Date(year, mo + 1, 0).getDate();
                const d = Math.min(modalStartDay, maxDays);
                return { date: `${String(d).padStart(2, "0")}/${String(mo + 1).padStart(2, "0")}/${year}`, year, mo };
              };

              const d1Val = contractValue2 * 0.45;
              const d2Val = contractValue2 * 0.25;
              const d3Val = contractValue2 * 0.05;

              type DRow = { seq: number; date: string; balance: number; principal: number; interest: number; total: number; isEvent?: boolean; eventLabel?: string; eventAmt?: number; disbMonth?: number; isFinal?: boolean };
              const rows: DRow[] = [];
              let prevBal = 0;
              let prevGoc = 0;
              let firstKy = { total: 0 };
              let lastKy = { total: 0 };
              let totalInt2 = 0;

              for (let m = 1; m <= n2; m++) {
                const { date } = calcDate(m);
                let bal = 0;
                let goc = 0;
                let lai = 0;

                if (m === 1) {
                  bal = d1Val;
                  goc = bal / n2;
                  lai = bal * rYear2 / 12;
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
                  const remMonths = n2 - m + 1;
                  goc = bal / remMonths;
                  lai = remBefore * rYear2 / 12;
                }

                const total = goc + lai;
                if (firstKy.total === 0) firstKy = { total };
                lastKy = { total };
                totalInt2 += lai;

                rows.push({ seq: m, date, balance: bal, principal: goc, interest: lai, total });
                prevBal = bal;
                prevGoc = goc;
              }

              // Dòng tất toán
              {
                const { date } = calcDate(n2 + 1);
                rows.push({ seq: n2 + 1, date, balance: 0, principal: 0, interest: 0, total: 0, isFinal: true });
              }

              const totalPay2 = L2 + totalInt2;

              const PAGE = 24;
              const payRows = rows.filter(r => !r.isEvent && !r.isFinal);
              const totalP = Math.ceil(payRows.length / PAGE);
              const ps = modalMonthPage * PAGE;
              const pe = Math.min(ps + PAGE, payRows.length);
              const seqStart = payRows[ps]?.seq ?? 1;
              const seqEnd = payRows[pe-1]?.seq ?? n2;
              const isLastPage = modalMonthPage === totalP - 1;

              const paged = rows.filter(r => {
                if (r.isFinal) return isLastPage;
                if (r.isEvent) return (r.disbMonth ?? 0) >= seqStart && (r.disbMonth ?? 0) <= seqEnd;
                return r.seq >= seqStart && r.seq <= seqEnd;
              });

              return (
                <>
                  <div className="px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 shrink-0">
                    {[
                      { label: "Kỳ 1 trả", val: Math.round(firstKy.total).toLocaleString("vi-VN") + " đ", sub: "kỳ đầu", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
                      { label: "Kỳ cuối trả", val: Math.round(lastKy.total).toLocaleString("vi-VN") + " đ", sub: "kỳ 300", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
                      { label: "Tổng lãi toàn kỳ", val: Math.round(totalInt2).toLocaleString("vi-VN") + " đ", sub: `${n2} tháng`, bg: "bg-rose-50 border-rose-200", text: "text-rose-600" },
                      { label: "Tổng gốc + lãi", val: Math.round(totalPay2).toLocaleString("vi-VN") + " đ", sub: "toàn bộ khoản vay", bg: "bg-slate-50 border-slate-200", text: "text-slate-700" },
                    ].map(c => (
                      <div key={c.label} className={`${c.bg} border rounded-2xl px-3 sm:px-4 py-2.5 text-center shadow-sm`}>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">{c.label}</p>
                        <p className={`text-xs sm:text-sm font-extrabold ${c.text}`}>{c.val}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{c.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pt-3 pb-2 flex items-center gap-2 shrink-0 flex-wrap">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-sm">
                      🏦 Giải ngân theo tiến độ xây dựng
                    </span>
                    {/* Ngày + Tháng + Năm bắt đầu vay — custom dropdown */}
                    <div className="flex items-center gap-2 ml-auto flex-wrap">
                      <span className="text-[10px] text-slate-500 font-semibold shrink-0">📅 Bắt đầu:</span>

                      {/* Dropdown Ngày */}
                      <div className="relative" data-modal-drop>
                        <button
                          onClick={e => { e.stopPropagation(); setOpenDayDrop(v => !v); setOpenMonthDrop(false); setOpenYearDrop(false); }}
                          className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-2.5 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[68px] justify-between"
                        >
                          <span>Ngày {modalStartDay}</span>
                          <span className="text-slate-500 text-[10px]">{openDayDrop ? "▴" : "▾"}</span>
                        </button>
                        {openDayDrop && (
                          <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-48 max-h-56 overflow-y-auto p-1.5">
                            <div className="grid grid-cols-5 gap-1">
                              {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                                <button
                                  key={d}
                                  onClick={() => { setModalStartDay(d); setOpenDayDrop(false); }}
                                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    d === modalStartDay
                                      ? "bg-amber-500 text-white shadow-sm"
                                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                  }`}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Tháng */}
                      <div className="relative" data-modal-drop>
                        <button
                          onClick={e => { e.stopPropagation(); setOpenMonthDrop(v => !v); setOpenDayDrop(false); setOpenYearDrop(false); }}
                          className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[72px] justify-between"
                        >
                          <span>Tháng {modalStartMonth}</span>
                          <span className="text-slate-500 text-[10px]">{openMonthDrop ? "▴" : "▾"}</span>
                        </button>
                        {openMonthDrop && (
                          <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden w-32">
                            <div className="grid grid-cols-3 gap-0.5 p-1.5">
                              {Array.from({length:12},(_,i)=>i+1).map(m => (
                                <button
                                  key={m}
                                  onClick={() => { setModalStartMonth(m); setModalMonthPage(0); setOpenMonthDrop(false); }}
                                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    m === modalStartMonth
                                      ? "bg-amber-500 text-white shadow-sm"
                                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                  }`}
                                >
                                  T.{m}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Năm */}
                      <div className="relative" data-modal-drop>
                        <button
                          onClick={e => { e.stopPropagation(); setOpenYearDrop(v => !v); setOpenDayDrop(false); setOpenMonthDrop(false); }}
                          className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-1.5 bg-white transition-all shadow-sm cursor-pointer min-w-[72px] justify-between"
                        >
                          <span>{modalStartYear}</span>
                          <span className="text-slate-500 text-[10px]">{openYearDrop ? "▴" : "▾"}</span>
                        </button>
                        {openYearDrop && (
                          <div className="absolute top-full mt-1 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl w-28 max-h-48 overflow-y-auto">
                            <div className="py-1">
                              {Array.from({length:12},(_,i)=>2024+i).map(y => (
                                <button
                                  key={y}
                                  onClick={() => { setModalStartYear(y); setModalMonthPage(0); setOpenYearDrop(false); }}
                                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                                    y === modalStartYear
                                      ? "bg-amber-500 text-white"
                                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                  }`}
                                >
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
                        <strong>Giải ngân 3 đợt theo tiến độ:</strong> 45% ký HĐMB · 25% bàn giao nhà · 5% nhận GCN. Tổng = 75% giá căn = {Math.round(L2).toLocaleString("vi-VN")} đ. Ô <span className="bg-rose-100 text-rose-600 px-1 rounded font-bold">đỏ</span> = NH giải ngân thêm, dư nợ tăng theo đợt.
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
                          {paged.map((r, idx) => r.isEvent ? (
                            <tr key={`e${idx}`} className="bg-rose-50 border-y-2 border-rose-300">
                              <td colSpan={2} className="py-2 px-1 font-extrabold text-rose-700 text-[10px]">
                                🏦 {r.eventLabel} +{Math.round(r.eventAmt ?? 0).toLocaleString("vi-VN")} đ
                              </td>
                              <td className="py-2 text-right font-extrabold text-rose-700 hidden sm:table-cell">→ {Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                              <td colSpan={3} className="py-2 text-right font-extrabold text-rose-700">→ {Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                            </tr>
                          ) : r.isFinal ? (
                            <tr key="final" className="bg-emerald-50 border-t-2 border-emerald-400">
                              <td className="py-2 font-extrabold text-emerald-700">{r.seq}</td>
                              <td className="py-2 text-emerald-600 text-[10px] font-bold">{r.date}</td>
                              <td className="py-2 text-right font-extrabold text-emerald-700 hidden sm:table-cell">0 đ</td>
                              <td className="py-2 text-right text-emerald-600 font-semibold">—</td>
                              <td className="py-2 text-right text-emerald-600">—</td>
                              <td className="py-2 text-right font-extrabold text-emerald-700">✅ Tất toán</td>
                            </tr>
                          ) : (
                            <tr key={`r${r.seq}`} className={`${r.seq%2===0?"bg-slate-50/40":""} hover:bg-amber-50 transition-colors`}>
                              <td className="py-1.5 font-bold text-slate-700 tabular-nums">{r.seq}</td>
                              <td className="py-1.5 text-slate-500 text-[10px]">{r.date}</td>
                              <td className="py-1.5 text-right text-slate-500 tabular-nums hidden sm:table-cell">{Math.round(r.balance).toLocaleString("vi-VN")} đ</td>
                              <td className="py-1.5 text-right text-emerald-600 font-semibold tabular-nums">{Math.round(r.principal).toLocaleString("vi-VN")} đ</td>
                              <td className="py-1.5 text-right text-rose-500 tabular-nums">{Math.round(r.interest).toLocaleString("vi-VN")} đ</td>
                              <td className="py-1.5 text-right font-extrabold text-amber-600 tabular-nums">{Math.round(r.total).toLocaleString("vi-VN")} đ</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {totalP > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-3">
                          <button disabled={modalMonthPage===0} onClick={() => { setModalMonthPage(p=>p-1); modalScrollRef.current?.scrollTo({top:0,behavior:"smooth"}); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer">← Trước</button>
                          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg">{modalMonthPage+1}/{totalP}</span>
                          <button disabled={modalMonthPage===totalP-1} onClick={() => { setModalMonthPage(p=>p+1); modalScrollRef.current?.scrollTo({top:0,behavior:"smooth"}); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer">Sau →</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 gap-3">
                    <p className="text-xs text-slate-400 hidden sm:block">Hotline: <span className="font-bold text-amber-600">0937.587.438</span></p>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <button
                        onClick={() => {
                          exportLoanScheduleToExcel({
                            projectName: PROJECT_CALC_CONFIG[selectedCalcProject].name,
                            unitLabel: PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].label,
                            unitArea: PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].area,
                            totalPriceWithVat: Math.round(priceWithVat * 1_000_000_000),
                            loanAmount: Math.round(L2),
                            loanPercent: modalLoanPct,
                            ratePerYear: modalRate,
                            years: modalYears,
                            startDay: modalStartDay,
                            startMonth: modalStartMonth,
                            startYear: modalStartYear,
                            rows: rows,
                            totalInterest: Math.round(totalInt2),
                            totalPayment: Math.round(totalPay2),
                          });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Xuất Excel (.xlsx)
                      </button>
                      <button onClick={() => setShowLoanModal(false)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md shadow-amber-500/25">Đóng</button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      , document.body)}

      {/* =========================================================
          FLOATING DOT NAVIGATION (LEFT SIDEBAR) — 2 nhóm
          ========================================================= */}
      <div className="fixed left-3 lg:left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-4 rounded-2xl shadow-2xl border border-amber-100/60 transition-all">
        {/* Nhóm 1: Dự Án */}
        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Dự Án</span>
        {homeSections.filter(s => s.group === "Dự Án").map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => { const el = document.getElementById(section.id); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="relative group flex items-center justify-center w-5 h-5 focus:outline-none cursor-pointer"
            >
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 z-10 ${
                isActive ? "bg-amber-500 border-amber-500 scale-125 shadow-md shadow-amber-500/40" : "bg-white border-amber-300 group-hover:border-amber-500 group-hover:scale-110"
              }`} />
              <div className="absolute left-7 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-[10px] font-bold whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl border border-slate-800">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block mr-1" />{section.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-slate-900" />
              </div>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-4 h-px bg-amber-200 my-1.5 rounded-full" />

        {/* Nhóm 2: Thông Tin */}
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Thông Tin</span>
        {homeSections.filter(s => s.group === "Thông Tin").map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => { const el = document.getElementById(section.id); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              className="relative group flex items-center justify-center w-5 h-5 focus:outline-none cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full border-2 transition-all duration-300 z-10 ${
                isActive ? "bg-slate-600 border-slate-600 scale-125 shadow-md shadow-slate-400/40" : "bg-white border-slate-300 group-hover:border-slate-500 group-hover:scale-110"
              }`} />
              <div className="absolute left-7 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-[10px] font-bold whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl border border-slate-800">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block mr-1" />{section.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-slate-900" />
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          1. LUXURIOUS HERO SECTION (BRIGHT / SUNSET LUXURY RESORT STYLE)
          ========================================================= */}
      <section 
        id="hero" 
        className="relative w-full flex flex-col justify-center items-center pt-24 pb-8 lg:py-24"
        style={{ minHeight: "100svh" }}
      >
        {/* Background — picture element với responsive images để tối ưu LCP trên mobile */}
        <picture className="absolute inset-0 -z-0 pointer-events-none w-full h-full">
          {/* Mobile ≤768px: WebP 768×500, 63KB thay vì 844KB */}
          <source
            media="(max-width: 768px)"
            srcSet="/hero-background-mobile.webp"
            type="image/webp"
          />
          {/* Desktop: ảnh gốc */}
          <img
            src="/hero-background.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            width="1920"
            height="1080"
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />
        </picture>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        {/* Diagonal Wave Lines for Premium Texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Content Container (Grid Layout inspired by premium screenshot) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col justify-center h-full gap-6 sm:gap-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Editorial Typography & Custom Spec Sheet Card */}
            <div className="lg:col-span-5 space-y-6 text-white text-left">
              {/* Brand Elite Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-extrabold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                ĐỊNH HÌNH CHẤT SỐNG SINGAPORE
              </div>

              {/* Serif/Sans Luxury Title */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none text-white">
                  Tổng quan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-200 to-amber-200 font-serif italic font-normal">
                    DỰ ÁN K-HOME
                  </span>
                </h1>
              </div>

              {/* Spec Sheet Table - Dynamic theo slide đang active */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/30 space-y-2 sm:space-y-4 shadow-xl">
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Vị trí</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].location}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Quy mô</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].scale}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Sản phẩm</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].product}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Phát triển</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].developer}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Đối tác</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].partner}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => {
                    const featuredEl = document.getElementById("featured-projects");
                    if (featuredEl) {
                      featuredEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-white hover:bg-amber-100 text-amber-800 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-103"
                >
                  Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("/lien-he")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
                >
                  Nhận Báo Giá Đợt 1
                </button>
              </div>
            </div>

            {/* Right Side: Project Slideshow Carousel */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              
              {/* Carousel Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 h-[220px] sm:h-[300px] lg:h-[450px] w-full">
                {/* Blur Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl filter blur-xl opacity-30 pointer-events-none" />
                
                {/* Slides */}
                {heroProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === activeHeroSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={imgUrl(project.image, "card")}
                      alt={`${project.name} - ${project.location} | K-Home Đồng Nai`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      width="900"
                      height="450"
                    />
                    
                    {/* Floating Info Card - Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-max">
                      <div className="bg-white/20 backdrop-blur-lg rounded-tr-2xl px-4 py-3 shadow-xl border border-white/30 flex flex-col gap-2 text-center">
                        <div>
                          <span className="text-[8px] text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-lg">Dự án bàn giao chuẩn</span>
                          <span className="text-base font-extrabold text-white block mt-0.5 drop-shadow-lg">{project.name}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border drop-shadow-lg mx-auto"
                          style={{ backgroundColor: project.statusColor + "33", borderColor: project.statusColor + "99", color: project.statusColor }}>
                          <Activity className="w-3 h-3 animate-pulse" style={{ color: project.statusColor }} /> {project.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots Navigation - outside carousel, full clickable */}
              <div className="flex items-center justify-center gap-3 py-1 z-10">
                {heroProjects.map((project, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroSlide(idx)}
                    style={{ cursor: "pointer" }}
                    className={`transition-all duration-300 rounded-full border-0 outline-none focus:outline-none ${
                      idx === activeHeroSlide
                        ? "w-6 h-2.5 bg-amber-400 shadow-lg shadow-amber-400/50"
                        : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Chuyển sang ${project.name}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* =========================================================
              QUICK FILTER SEARCH PANEL (INTEGRATED BRIGHT LUXURY STYLE)
              ========================================================= */}
          <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-amber-100 rounded-3xl p-4 sm:p-8 shadow-2xl relative z-20 mb-4 sm:mb-0">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            <form onSubmit={handleHeroSearch} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:items-end">
              {/* 2 dropdowns cạnh nhau trên mobile */}
              <div className="grid grid-cols-2 gap-3 sm:contents">

                {/* Filter 1: Chọn Dự Án — custom dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Chọn Dự Án</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "project" ? null : "project")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 flex items-center justify-between gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <span className="truncate text-left">
                        {heroProject === "all" ? "Tất cả dự án"
                          : heroProject === "k-home-cityview-ho-nai" ? "K-Home CityView Biên Hòa"
                          : heroProject === "k-home-midtown-trang-bom" ? "K-Home Midtown Trảng Bom"
                          : "K-Home Avenue Nhơn Trạch"}
                      </span>
                      <svg className={`w-4 h-4 shrink-0 text-amber-500 transition-transform ${openDropdown === "project" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openDropdown === "project" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                        {[
                          { value: "all", label: "Tất cả dự án" },
                          { value: "k-home-cityview-ho-nai", label: "K-Home CityView Biên Hòa" },
                          { value: "k-home-midtown-trang-bom", label: "K-Home Midtown Trảng Bom" },
                          { value: "k-home-avenue-nhon-trach", label: "K-Home Avenue Nhơn Trạch" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setHeroProject(opt.value); setHeroBedrooms("all"); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2.5 ${
                              heroProject === opt.value
                                ? "bg-amber-500 text-white font-semibold"
                                : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                            }`}
                          >
                            {heroProject === opt.value
                              ? <span className="w-5 h-5 rounded-md bg-amber-500 border-2 border-amber-500 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                              : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                            }
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter 2: Loại Căn Hộ — custom dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Loại Căn Hộ</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "bedrooms" ? null : "bedrooms")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 flex items-center justify-between gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <span className="truncate text-left">
                        {heroBedrooms === "all" ? "Tất cả loại căn"
                          : heroBedrooms === "studio" ? "Studio"
                          : heroBedrooms === "1pn" ? "Căn 1 Phòng Ngủ"
                          : heroBedrooms === "2pn" ? "Căn 2 Phòng Ngủ"
                          : "Căn 3 Phòng Ngủ"}
                      </span>
                      <svg className={`w-4 h-4 shrink-0 text-amber-500 transition-transform ${openDropdown === "bedrooms" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openDropdown === "bedrooms" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                        {[
                          { value: "all", label: "Tất cả loại căn", show: true },
                          { value: "studio", label: "Studio", show: heroProject !== "k-home-cityview-ho-nai" },
                          { value: "1pn", label: "Căn 1 Phòng Ngủ", show: true },
                          { value: "2pn", label: "Căn 2 Phòng Ngủ", show: true },
                          { value: "3pn", label: "Căn 3 Phòng Ngủ", show: heroProject === "all" || heroProject === "k-home-cityview-ho-nai" },
                        ].filter(o => o.show).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setHeroBedrooms(opt.value); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2.5 ${
                              heroBedrooms === opt.value
                                ? "bg-amber-500 text-white font-semibold"
                                : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                            }`}
                          >
                            {heroBedrooms === opt.value
                              ? <span className="w-5 h-5 rounded-md bg-amber-500 border-2 border-amber-500 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                              : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                            }
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={() => setOpenDropdown(null)}
                  className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Xem Rổ Hàng
                </button>
                {(heroProject !== "all" || heroBedrooms !== "all") && (
                  <button
                    type="button"
                    onClick={() => { resetFilters(); setOpenDropdown(null); }}
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-3 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
            </form>

            {/* Đóng dropdown khi click ra ngoài */}
            {openDropdown && (
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 text-center font-medium border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> Cam kết giá gốc chủ đầu tư</span>
              <span className="hidden sm:inline-block text-slate-200">|</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Sổ hồng sở hữu lâu dài</span>
              <span className="hidden sm:inline-block text-slate-200">|</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Lãi suất ưu đãi NOXH 5,4%/năm</span>
            </div>
          </div>
        </div>
      </section>

    
      {/* =========================================================
          2. DANH MỤC KIỆT TÁC — FEATURED PROJECTS (moved after hero)
          ========================================================= */}
      <section id="featured-projects" className="bg-slate-50 py-24 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3 py-1.5 rounded-full inline-block">3 Dự án đang triển khai</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                Dự Án Nổi Bật
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("/san-pham")}
                className="text-amber-700 font-bold text-sm hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-slate-200 hover:border-amber-400/30 shadow-sm"
              >
                Xem Toàn Bộ Dự Án ({allProjects.length ? allProjects.length : "..."}) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                  {/* Image placeholder */}
                  <div className="h-72 bg-slate-200" />
                  {/* Content placeholder */}
                  <div className="p-8 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded-full bg-slate-200" />)}
                    </div>
                    <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                    <div className="h-4 bg-slate-100 rounded-lg w-full" />
                    <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
                    <div className="h-1.5 bg-slate-100 rounded-full w-full mt-4" />
                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-6 bg-amber-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 space-y-4 max-w-xl mx-auto shadow-sm">
                  <div className="text-slate-400 text-4xl">🔍</div>
                  <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án phù hợp</h3>
                  <p className="text-slate-500 text-sm px-6">Vui lòng đặt lại bộ lọc để xem các dự án đang triển khai.</p>
                  <button
                    onClick={resetFilters}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-5 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Xem Tất Cả Dự Án
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={onNavigate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          1.5. FEATURED CITYHOME — EDITORIAL LINKS FOR LINK EQUITY
          ========================================================= */}
      <section id="featured-cityview" className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Section Title with Editorial Link */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              <a 
                href="/k-home-cityview-ho-nai" 
                onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai"); }}
                className="hover:text-amber-600 transition-colors"
              >
                K-Home CityView Hố Nai Biên Hòa
              </a>
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
              Dự án nhà ở xã hội chuẩn Singapore tại TP. Biên Hòa, Đồng Nai. Vị trí chiến lược, 
              <a 
                href="/k-home-cityview-ho-nai#mat-bang" 
                onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai#mat-bang"); }}
                className="text-amber-600 hover:text-amber-700 font-semibold mx-1"
              >
                mặt bằng căn hộ
              </a>
              tiện nghi, pháp lý đầy đủ, và
              <a 
                href="/k-home-cityview-ho-nai#calculator" 
                onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai#calculator"); }}
                className="text-amber-600 hover:text-amber-700 font-semibold mx-1"
              >
                lãi suất ưu đãi 5,4%/năm
              </a>
              cho cư dân.
            </p>
          </div>

          {/* 3-Column Grid with Linked CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Column 1: Bảng Giá */}
            <a 
              href="/k-home-cityview-ho-nai#gia-ban" 
              onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai#gia-ban"); }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-amber-400/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Bảng Giá & Sản Phẩm</h4>
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-600 text-sm">
                Khám phá chi tiết các loại căn hộ từ 1PN+A đến 3PN với giá từ 950 triệu.
              </p>
            </a>

            {/* Column 2: Mặt Bằng & Layout */}
            <a 
              href="/k-home-cityview-ho-nai#mat-bang" 
              onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai#mat-bang"); }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-amber-400/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Mặt Bằng & Layout</h4>
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-600 text-sm">
                Xem chi tiết các bản vẽ mặt bằng căn hộ, hệ thống tiện ích và quy hoạch dự án.
              </p>
            </a>

            {/* Column 3: Điều Kiện Mua */}
            <a 
              href="/k-home-cityview-ho-nai#dieu-kien-mua" 
              onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai#dieu-kien-mua"); }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-amber-400/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Điều Kiện Mua & Thủ Tục</h4>
                <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-slate-600 text-sm">
                Tìm hiểu điều kiện mua nhà ở xã hội, thủ tục pháp lý và hỗ trợ tài chính.
              </p>
            </a>
          </div>

          {/* Main CTA Button */}
          <div className="text-center">
            <a 
              href="/k-home-cityview-ho-nai" 
              onClick={(e) => { e.preventDefault(); onNavigate("/k-home-cityview-ho-nai"); }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Khám Phá K-Home CityView Hố Nai
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          VỊ TRÍ KẾT NỐI — 3 DỰ ÁN
          ========================================================= */}
      <section id="vi-tri" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 cv-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Vị trí chiến lược</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Vị Trí Kết Nối – 3 Dự Án K-Home Đồng Nai</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Cả 3 dự án nhà ở xã hội K-Home đều tọa lạc tại các vị trí chiến lược, gần khu công nghiệp lớn và thuận tiện kết nối giao thông liên vùng tại tỉnh Đồng Nai.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={imgUrl("/k-home cityview/mat-bang/vi-tri-k-home-dong-nai-kim-oanh-1-scaled.jpg.webp", "thumbnail")}
                alt="Vị trí dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa Đồng Nai – gần KCN Amata Biên Hòa 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width="600"
                height="208"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-xs font-bold">K-Home CityView – Hố Nai, Biên Hòa</span>
            </div>
            <div className="p-5 bg-white space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">K-Home CityView – Đường Điểu Xiển, Hố Nai</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Cách trung tâm TP. Biên Hòa 3km. Gần KCN Amata, KCN Biên Hòa 2, KCN Hố Nai và Long Bình. Kết nối Quốc lộ 1A và cao tốc TP.HCM – Long Thành – Dầu Giây.</p>
              <a href="/k-home-cityview-ho-nai" className="text-amber-600 text-xs font-semibold hover:underline">Xem chi tiết vị trí →</a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={imgUrl("/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp", "thumbnail")}
                alt="Vị trí dự án K-Home Midtown Trảng Bom Đồng Nai – trung tâm huyện Trảng Bom giao 4 tuyến đường lớn"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width="600"
                height="208"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-xs font-bold">K-Home Midtown – Trảng Bom, Đồng Nai</span>
            </div>
            <div className="p-5 bg-white space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">K-Home Midtown – Trung tâm huyện Trảng Bom</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Giao điểm 4 tuyến đường: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành. Gần KCN Bàu Xéo, KCN Hố Nai. Cách TP.HCM 40km qua cao tốc.</p>
              <a href="/k-home-midtown-trang-bom" className="text-teal-600 text-xs font-semibold hover:underline">Xem chi tiết vị trí →</a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="relative h-52 overflow-hidden">
              <img
                src={imgUrl("/k-home avenue/PC02-TT-10K_2-min.jpg.webp", "thumbnail")}
                alt="Vị trí dự án K-Home Avenue Nhơn Trạch Đồng Nai – gần sân bay Long Thành đường 25C"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width="600"
                height="208"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-xs font-bold">K-Home Avenue – Nhơn Trạch, Đồng Nai</span>
            </div>
            <div className="p-5 bg-white space-y-2">
              <h3 className="font-bold text-slate-800 text-sm">K-Home Avenue – Đường 25C, Nhơn Trạch</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Mặt tiền đường Nguyễn Ái Quốc (25C). Cách sân bay Long Thành 10 phút. Kết nối Vành đai 3, cao tốc Bến Lức – Long Thành và metro Thủ Thiêm.</p>
              <a href="/k-home-avenue-nhon-trach" className="text-emerald-600 text-xs font-semibold hover:underline">Xem chi tiết vị trí →</a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MẶT BẰNG CĂN HỘ ĐIỂN HÌNH
          ========================================================= */}
      <section id="mat-bang" className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Thiết kế căn hộ</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Mặt Bằng Căn Hộ Điển Hình K-Home</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Các loại căn hộ nhà ở xã hội K-Home được thiết kế tối ưu không gian theo tiêu chuẩn Singapore, đảm bảo 100% căn hộ có cửa sổ đón sáng và thông gió tự nhiên.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Mặt Bằng K-Home CityView Hố Nai</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer" onClick={() => onNavigate("/k-home-cityview-ho-nai")}>
                  <img src={imgUrl("/k-home cityview/mat-bang/mat-bang-k-home-cityview-tang-12A-22.jpg.webp", "thumbnail")} alt="Mặt bằng tầng điển hình 12A-22 căn hộ NOXH K-Home CityView Hố Nai Biên Hòa" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="144" />
                  <p className="text-[10px] text-center py-1.5 bg-white font-semibold text-slate-600">Tầng 12A–22</p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer" onClick={() => onNavigate("/k-home-cityview-ho-nai")}>
                  <img src={imgUrl("/k-home cityview/mat-bang/thiet-ke-can-ho-layout-khome-city-view-2048x764.jpg.webp", "thumbnail")} alt="Layout thiết kế căn hộ 1PN 2PN 3PN NOXH K-Home CityView Kim Oanh Land Đồng Nai" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="144" />
                  <p className="text-[10px] text-center py-1.5 bg-white font-semibold text-slate-600">Layout căn hộ</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">K-Home CityView có 4 loại căn: <strong>1PN+A (47,3m²)</strong> từ 950 triệu, <strong>1PN+B (62,4m²)</strong> từ 1,20 tỷ, <strong>2PN (70,4m²)</strong> từ 1,50 tỷ và <strong>3PN (84,4m²)</strong> từ 1,80 tỷ.</p>
              <a href="/k-home-cityview-ho-nai" className="text-amber-600 text-xs font-semibold hover:underline inline-flex items-center gap-1">Xem mặt bằng chi tiết K-Home CityView →</a>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Mặt Bằng K-Home Avenue & Midtown</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer" onClick={() => onNavigate("/k-home-avenue-nhon-trach")}>
                  <img src={imgUrl("/k-home avenue/layout-can-ho-khome-avenue-nhon-trach.jpg", "thumbnail")} alt="Mặt bằng layout căn hộ K-Home Avenue Nhơn Trạch Studio 1PN 2PN nhà ở xã hội Kim Oanh" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="144" />
                  <p className="text-[10px] text-center py-1.5 bg-white font-semibold text-slate-600">Layout K-Home Avenue</p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer" onClick={() => onNavigate("/k-home-midtown-trang-bom")}>
                  <img src={imgUrl("/k-home midtown/k-home-midtown-mat-bang-can-ho-tang-dien-hinh.jpg.webp", "thumbnail")} alt="Mặt bằng tầng điển hình K-Home Midtown Trảng Bom Studio 1PN 2PN nhà ở xã hội Đồng Nai" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="144" />
                  <p className="text-[10px] text-center py-1.5 bg-white font-semibold text-slate-600">Layout K-Home Midtown</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">K-Home Avenue có Studio từ 37,7m², 1PN từ 46,6m², 2PN từ 65,7m². K-Home Midtown có Studio 36,1m², 1PN từ 47m², 2PN 68,8m². Tất cả bàn giao full nội thất.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a href="/k-home-avenue-nhon-trach" onClick={(e) => { e.preventDefault(); onNavigate("/k-home-avenue-nhon-trach"); }} className="flex-1 text-center bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-emerald-100 transition-colors no-underline">
                  Mặt bằng K-Home Avenue →
                </a>
                <a href="/k-home-midtown-trang-bom" onClick={(e) => { e.preventDefault(); onNavigate("/k-home-midtown-trang-bom"); }} className="flex-1 text-center bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-teal-100 transition-colors no-underline">
                  Mặt bằng K-Home Midtown →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          NHÀ MẪU THỰC TẾ
          ========================================================= */}
      <section id="nha-mau" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Nội thất thực tế</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Nhà Mẫu Căn Hộ K-Home – Bàn Giao Full Nội Thất</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Căn hộ nhà ở xã hội K-Home được bàn giao hoàn thiện full nội thất gồm tủ bếp, sofa, bàn ăn, giường ngủ, tủ quần áo và sàn gỗ theo tiêu chuẩn Singapore. Cư dân chỉ cần mang đồ cá nhân là có thể dọn vào ở ngay.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { src: "/k-home cityview/Can-1PN-A/khome-cityview-nha-mau-can-ho-1PN-1.jpg", alt: "Nhà mẫu căn hộ 1 phòng ngủ A NOXH K-Home CityView Hố Nai Biên Hòa Kim Oanh Land", label: "1PN+A – CityView", slug: "/k-home-cityview-ho-nai/can-ho-1-phong-ngu-a" },
            { src: "/k-home cityview/Can-2PN/khome-cityview-nha-mau-can-ho-2PN-1.jpg", alt: "Nhà mẫu căn hộ 2 phòng ngủ NOXH K-Home CityView Hố Nai Biên Hòa full nội thất", label: "2PN – CityView", slug: "/k-home-cityview-ho-nai/can-ho-2-phong-ngu" },
            { src: "/k-home midtown/Can-Studio/k-home-midtown-studio-1.jpg", alt: "Nhà mẫu căn Studio K-Home Midtown Trảng Bom nhà ở xã hội full nội thất Kim Oanh", label: "Studio – Midtown", slug: "/k-home-midtown-trang-bom/can-ho-studio" },
            { src: "/k-home avenue/Can-Studio/layout-can-ho-khome-avenue-studio.jpg", alt: "Nhà mẫu căn Studio K-Home Avenue Nhơn Trạch nhà ở xã hội full nội thất Kim Oanh Land", label: "Studio – Avenue", slug: "/k-home-avenue-nhon-trach/can-ho-studio" },
          ].map((item, i) => (
            <a key={i} href={item.slug} onClick={(e) => { e.preventDefault(); onNavigate(item.slug); }} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer hover:shadow-lg transition-all no-underline">
              <img src={imgUrl(item.src, "thumbnail")} alt={item.alt} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width="400" height="160" />
              <div className="p-3 bg-white">
                <p className="text-xs font-bold text-slate-700">{item.label}</p>
                <p className="text-[10px] text-amber-500 font-semibold mt-0.5 group-hover:text-amber-600">Xem chi tiết →</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. LUXURY VIRTUAL SHOWROOM (BRIGHT THEMED CAROUSEL)
          ========================================================= */}
      <section
        id="amenities" 
        className="bg-gradient-to-b from-amber-50/50 via-white to-amber-50/50 text-slate-800 py-24 relative overflow-hidden border-y border-amber-100/50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Tab Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/60 border border-amber-200/50 px-3.5 py-1.5 rounded-full inline-block">
                Tiện ích nội khu 3 dự án
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight text-slate-900">
                Hành Trình <br />Trải Nghiệm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                  Sống Tiện Nghi
                </span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Cả 3 dự án K-Home tại Đồng Nai đều được quy hoạch đầy đủ tiện ích nội khu thiết yếu — từ hồ bơi, trường học đến vườn cảnh quan và trạm sạc xe điện, đáp ứng trọn vẹn nhu cầu sống của gia đình.
              </p>

              {/* Indicator Controls */}
              <div className="space-y-3 pt-4">
                {showroomGallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveShowroomTab(idx); setActiveProjectTab(0); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                      activeShowroomTab === idx
                        ? "bg-amber-500/10 border-amber-400 text-slate-900 shadow-sm font-semibold"
                        : "bg-white/70 border-slate-200/60 text-slate-500 hover:bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeShowroomTab === idx ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-bold">{item.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      activeShowroomTab === idx ? "translate-x-1.5 text-amber-600" : "text-slate-400 group-hover:text-slate-600"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Project Carousel */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main carousel */}
              <div
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                onClick={() => onNavigate(`/${projectCarousel[activeProjectTab].slug}`)}
                className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[220px] sm:h-[300px] lg:h-[450px] bg-slate-100 cursor-pointer"
              >
                {/* Images — crossfade với ease-in-out */}
                {projectCarousel.map((project, idx) => (
                  <div
                    key={project.slug}
                    className="absolute inset-0"
                    style={{
                      opacity: activeProjectTab === idx ? 1 : 0,
                      transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: activeProjectTab === idx ? 1 : 0,
                    }}
                  >
                    <img
                      src={imgUrl(showroomGallery[activeShowroomTab].images[idx], "card")}
                      alt={`${project.name} - ${showroomGallery[activeShowroomTab].title} | Tiện ích nội khu K-Home`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="900"
                      height="450"
                      style={{
                        transform: activeProjectTab === idx ? "scale(1.03)" : "scale(1)",
                        transition: "transform 5s ease-out",
                      }}
                    />
                  </div>
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent z-10" />

                {/* Badge */}
                <div
                  className="absolute top-4 left-4 z-20 text-slate-900 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md"
                  style={{ backgroundColor: projectCarousel[activeProjectTab].badgeColor, transition: "background-color 0.4s ease" }}
                >
                  {projectCarousel[activeProjectTab].badge}
                </div>

                {/* Hover hint */}
                <div
                  className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ opacity: isCarouselHovered ? 1 : 0, transition: "opacity 0.3s ease" }}
                >
                  Xem dự án <ArrowUpRight className="w-3 h-3" />
                </div>

                {/* Info overlay — fade khi đổi slide */}
                {projectCarousel.map((project, idx) => (
                  <div
                    key={`info-${project.slug}`}
                    className="absolute bottom-5 left-5 right-5 z-20 space-y-1.5"
                    style={{
                      opacity: activeProjectTab === idx ? 1 : 0,
                      transform: activeProjectTab === idx ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                  >
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">{project.tag}</span>
                    <h3 className="text-lg sm:text-2xl font-bold font-display text-white leading-tight">{project.name}</h3>
                    <p className="text-slate-300 text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {project.location}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="bg-white/15 border border-white/20 rounded-lg px-2.5 py-1 text-[11px] font-bold text-amber-200">{project.price}</div>
                      <div className="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-slate-300">{project.scale}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center justify-center gap-3">
                {projectCarousel.map((project, idx) => (
                  <button
                    key={project.slug}
                    onClick={() => { setActiveProjectTab(idx); }}
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      width: activeProjectTab === idx ? "5rem" : "4rem",
                      height: activeProjectTab === idx ? "3.5rem" : "3rem",
                      opacity: activeProjectTab === idx ? 1 : 0.5,
                      border: activeProjectTab === idx ? "2px solid #f59e0b" : "2px solid transparent",
                      boxShadow: activeProjectTab === idx ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
                      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    aria-label={project.name}
                  >
                    <img src={imgUrl(showroomGallery[activeShowroomTab].images[idx], "thumbnail")} alt={`${project.name} - ${showroomGallery[activeShowroomTab].title} thumbnail`} className="w-full h-full object-cover" />
                    {activeProjectTab === idx && <div className="absolute inset-0 bg-amber-500/20" />}
                  </button>
                ))}
              </div>

              {/* Progress bar — dùng scaleX thay width để tránh non-composited animation */}
              <div className="flex gap-2 px-1">
                {projectCarousel.map((_, idx) => (
                  <div key={idx} className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full origin-left"
                      style={{
                        transform: activeProjectTab === idx ? "scaleX(1)" : activeProjectTab > idx ? "scaleX(1)" : "scaleX(0)",
                        transition: activeProjectTab === idx && !isCarouselHovered
                          ? "transform 4000ms linear"
                          : "transform 0ms",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          5. CALCULATOR – KẾ HOẠCH TÀI CHÍNH MUA NHÀ Ở XÃ HỘI
          ========================================================= */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cv-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Công cụ tài chính NOXH</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Tính Trả Góp Mua Nhà Ở Xã Hội
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Chọn dự án, mức giá và phương thức thanh toán để xem lịch đóng tiền và số tiền trả góp hàng tháng.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-12 shadow-xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-br-full" />

          {/* ── BƯỚC 1: Chọn dự án ── */}
          <div className="space-y-4 relative z-10">
            <p className="text-sm font-semibold text-slate-700">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">01</span>
              Chọn dự án bạn quan tâm:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(PROJECT_CALC_CONFIG).map(([slug, cfg]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => { setSelectedCalcProject(slug); setSelectedUnitIndex(0); setPaymentOption(""); }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedCalcProject === slug
                      ? "border-amber-500 bg-amber-50 shadow-sm"
                      : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mb-2 ${selectedCalcProject === slug ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                  <span className="font-bold text-sm text-slate-800 block">{cfg.name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Vay {cfg.loanPercent}% · {cfg.loanYears} năm · {cfg.policyRate}%/năm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── BƯỚC 2: Chọn loại căn hộ ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">02</span>
                Chọn loại căn hộ:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROJECT_CALC_CONFIG[selectedCalcProject].units.map((unit, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedUnitIndex(idx);
                      setInvestmentValue(unit.priceMin);
                      setPriceInputRaw(Math.round(unit.priceMin * 1_000_000_000).toLocaleString("vi-VN"));
                    }}
                    className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      selectedUnitIndex === idx
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-slate-200 hover:border-amber-300 bg-white"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mb-2 ${selectedUnitIndex === idx ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                    <span className="block text-base font-extrabold text-slate-800">{unit.label}</span>
                    <span className="text-xs text-slate-400 block">{unit.area}</span>
                    <span className="text-xs font-bold text-amber-600 block mt-1">{unit.priceLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── BƯỚC 3: Nhập giá trị căn hộ ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">03</span>
                  Nhập giá trị căn hộ dự tính:
                </p>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].label} · {PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].area}
                </span>
              </div>

              {(() => {
                const cfg = PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex];
                const minVnd = Math.round(cfg.priceMin * 1_000_000_000);
                const maxVnd = Math.round(cfg.priceMax * 1_000_000_000);
                const currentVnd = Math.round(investmentValue * 1_000_000_000); // Giá chưa VAT
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
                          value={priceInputRaw || (currentVnd > 0 ? currentVnd.toLocaleString("vi-VN") : "")}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "");
                            if (digitsOnly === "") {
                              setPriceInputRaw("");
                              return;
                            }
                            const num = parseInt(digitsOnly, 10);
                            if (!isNaN(num)) {
                              setPriceInputRaw(num.toLocaleString("vi-VN"));
                              setInvestmentValue(num / 1_000_000_000);
                            }
                          }}
                          onBlur={() => {
                            const digitsOnly = (priceInputRaw || "").replace(/\D/g, "");
                            let num = parseInt(digitsOnly, 10);
                            if (isNaN(num) || num <= 0 || num < minVnd) {
                              num = minVnd;
                            } else if (num > maxVnd) {
                              num = maxVnd;
                            }
                            setPriceInputRaw(num.toLocaleString("vi-VN"));
                            setInvestmentValue(num / 1_000_000_000);
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
                          ⚠️ Giá nhập ({currentVnd.toLocaleString("vi-VN")} đ) ngoài khoảng {cfg.label} ({minVnd.toLocaleString("vi-VN")} – {maxVnd.toLocaleString("vi-VN")} đ). Tự động điều chỉnh khi rời ô nhập.
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
                        Giá tham khảo: <strong className="text-slate-600">{formatVND(cfg.priceMin)}</strong> – <strong className="text-slate-600">{formatVND(cfg.priceMax)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── BƯỚC 4: Chọn phương thức thanh toán ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">04</span>
                Phương thức thanh toán:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vốn tự có */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("cash")}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    paymentOption === "cash" ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${paymentOption === "cash" ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                    {paymentOption === "cash" && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="block text-base font-extrabold text-slate-800">Bằng vốn tự có</span>
                  <span className="text-xs text-slate-500 block mt-1">Thanh toán theo {PROJECT_CALC_CONFIG[selectedCalcProject].cashSchedule.length} đợt, không cần vay NH</span>
                </button>

                {/* Vay ngân hàng */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("policy")}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    paymentOption === "policy" ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${paymentOption === "policy" ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                    {paymentOption === "policy" && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="block text-base font-extrabold text-slate-800">Bằng vốn vay ngân hàng</span>
                  <span className="text-xs text-slate-500 block mt-1">Vay tối đa {PROJECT_CALC_CONFIG[selectedCalcProject].loanPercent}% · 25% trả dần theo đợt</span>
                </button>
              </div>
            </div>
          )}

          {/* ── BẢNG TIẾN ĐỘ (hiện ngay sau khi chọn phương thức) ── */}
          {paymentOption && (
            <div className="relative z-10 pt-2 border-t border-slate-100 space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">05</span>
                Lịch đóng tiền — Phương thức {paymentOption === "cash" ? "bằng vốn tự có" : "bằng vốn vay ngân hàng"}:
              </p>

              {/* Bảng tiến độ */}
              <div className="rounded-2xl border border-slate-100 overflow-hidden text-xs shadow-sm">
                <div className="grid grid-cols-4 bg-amber-500 text-white font-bold px-3 py-2.5">
                  <span>Đợt</span>
                  <span className="text-center">%</span>
                  <span className="text-center font-extrabold">Số tiền</span>
                  <span className="text-right text-[10px]">Thời gian / Ghi chú</span>
                </div>
                {(() => {
                  const price = Math.round(investmentValue * 1.05 * 1_000_000_000); // tổng giá gồm 5% VAT (VNĐ)
                  const parseAmount = (pct: string, dot: string): string => {
                    if (pct === "30.000.000đ") return "30.000.000 đ";
                    // Đợt 1: trừ 30 triệu tiền cọc đã đặt
                    if (dot === "Đợt 1" && (pct === "15%" || pct.includes("15%"))) {
                      const gross = price * 0.15;
                      const net = gross - 30_000_000; // trừ 30 triệu cọc
                      return `${Math.round(net).toLocaleString("vi-VN")} đ (đã trừ cọc)`;
                    }
                    if (pct.includes("%") && !pct.includes("phí") && !pct.includes("BT")) {
                      const num = parseFloat(pct);
                      if (!isNaN(num)) return `${Math.round(price * num / 100).toLocaleString("vi-VN")} đ`;
                    }
                    if (pct.includes("3%/đợt")) return `${Math.round(price * 0.03).toLocaleString("vi-VN")} đ/đợt`;
                    if (pct.includes("25% + phí bảo trì 2%") || pct.includes("25% + phí BT") || pct.includes("25% + 2% PBT")) {
                      const v25 = Math.round(price * 0.25).toLocaleString("vi-VN");
                      const bt = Math.round(price * 0.02).toLocaleString("vi-VN");
                      return `${v25} đ + ${bt} đ (PBT)`;
                    }
                    return "—";
                  };

                  const cfg = PROJECT_CALC_CONFIG[selectedCalcProject];
                  const rows = paymentOption === "cash" ? cfg.cashSchedule : cfg.policySchedule;

                  // Tính số tiền thực tế cho từng dòng (VNĐ)
                  const getAmountNum = (pct: string, dot: string): number | null => {
                    if (pct === "30.000.000đ") return 30_000_000;
                    if (dot === "Đợt 1" && (pct === "15%" || pct.includes("15%"))) return price * 0.15 - 30_000_000;
                    if (pct.includes("3%/đợt (10 đợt)")) return price * 0.03 * 10;
                    if (pct.includes("25% + phí bảo trì 2%") || pct.includes("25% + phí BT") || pct.includes("25% + 2% PBT")) return price * 0.25;
                    const num = parseFloat(pct);
                    if (!isNaN(num) && pct.includes("%")) return price * num / 100;
                    return null;
                  };

                  const ownRows = rows.filter(r => r.group === "own");
                  const bankRows = rows.filter(r => r.group === "bank");
                  const ownTotal = ownRows.reduce((s, r) => s + (getAmountNum(r.pct, r.dot) ?? 0), 0);
                  const bankTotal = bankRows.reduce((s, r) => s + (getAmountNum(r.pct, r.dot) ?? 0), 0);

                  const elements: React.ReactNode[] = [];
                  let prevGroup = "";
                  rows.forEach((row, i) => {
                    // Insert total row before bank group starts
                    if (paymentOption !== "cash" && row.group === "bank" && prevGroup === "own") {
                      elements.push(
                        <div key="total-own" className="grid grid-cols-4 px-3 py-2.5 bg-amber-500/10 border-t-2 border-amber-400 items-center">
                          <span className="font-extrabold text-amber-800 col-span-2">TỔNG VỐN TỰ CÓ</span>
                          <span className="text-center font-extrabold text-amber-800 text-[11px] sm:text-xs">{Math.round(ownTotal).toLocaleString("vi-VN")} đ</span>
                          <span className="text-right text-[10px] text-amber-700">25% vốn tự có</span>
                        </div>
                      );
                    }
                    elements.push(
                      <div key={i} className={`grid grid-cols-4 px-3 py-2.5 border-b border-slate-50 items-center ${i % 2 === 0 ? "bg-amber-50/40" : "bg-white"}`}>
                        <span className="font-semibold text-slate-700">{row.dot}</span>
                        <span className="text-center font-bold text-amber-700">{row.pct}</span>
                        <span className="text-center font-extrabold text-emerald-700 text-[11px] sm:text-xs">{parseAmount(row.pct, row.dot)}</span>
                        <span className="text-right text-slate-500 leading-snug text-[10px]">{row.note}</span>
                      </div>
                    );
                    prevGroup = row.group;
                  });

                  // Total row at end
                  if (paymentOption === "cash") {
                    elements.push(
                      <div key="total-own-cash" className="grid grid-cols-4 px-3 py-2.5 bg-amber-500/10 border-t-2 border-amber-400 items-center">
                        <span className="font-extrabold text-amber-800 col-span-2">TỔNG VỐN TỰ CÓ</span>
                        <span className="text-center font-extrabold text-amber-800 text-[11px] sm:text-xs">{Math.round(ownTotal).toLocaleString("vi-VN")} đ</span>
                        <span className="text-right text-[10px] text-amber-700">100% vốn tự có</span>
                      </div>
                    );
                  } else {
                    elements.push(
                      <div key="total-bank" className="grid grid-cols-4 px-3 py-2.5 bg-blue-500/10 border-t-2 border-blue-400 items-center">
                        <span className="font-extrabold text-blue-800 col-span-2">TỔNG VỐN VAY</span>
                        <span className="text-center font-extrabold text-blue-800 text-[11px] sm:text-xs">{Math.round(bankTotal).toLocaleString("vi-VN")} đ</span>
                        <span className="text-right text-[10px] text-blue-700">75% vốn vay NH</span>
                      </div>
                    );
                  }

                  return elements;
                })()}
              </div>

              {/* Bước 5b: Nếu vay NH → chỉ 1 gói NH Chính sách */}
              {paymentOption === "policy" && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-slate-700">Gói vay áp dụng:</p>
                  <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <span className="block text-base font-extrabold text-slate-800">NH Chính Sách Xã Hội</span>
                        <span className="text-sm text-amber-600 font-bold block mt-0.5">
                          {PROJECT_CALC_CONFIG[selectedCalcProject].policyRate}%/năm · {PROJECT_CALC_CONFIG[selectedCalcProject].loanYears} năm
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">Gói vay ưu đãi dành riêng cho người mua Nhà Ở Xã Hội — Ngân hàng Chính sách xã hội tỉnh Đồng Nai</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── KẾT QUẢ (chỉ hiện khi đã chọn đủ) ── */}
          {paymentOption && (
            <div className="relative z-10 pt-2 border-t border-slate-100">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-tl-full" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-100 bg-white/15 border border-white/10 px-3 py-1 rounded-full inline-block mb-5">
                  KẾT QUẢ DỰ TÍNH — {PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].label} · {PROJECT_CALC_CONFIG[selectedCalcProject].units[selectedUnitIndex].area} · Tổng giá: {Math.round(priceWithVat * 1_000_000_000).toLocaleString("vi-VN")} đ (đã gồm 5% VAT)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10 items-stretch">
                  {/* Vốn tự có */}
                  <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                    <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                      <Coins className="w-4 h-4 text-yellow-300 shrink-0" /> Vốn tự có ({100 - calcResult.loanPercent}%):
                    </span>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white font-sans tabular-nums tracking-tight whitespace-nowrap">
                        {Math.round(priceWithVat * (100 - calcResult.loanPercent) / 100 * 1_000_000_000).toLocaleString("vi-VN")} đ
                      </div>
                      <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">~{formatVND(parseFloat(calcResult.downPayment))} · Đóng theo nhiều đợt</p>
                    </div>
                  </div>

                  {/* Khoản vay */}
                  <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                    <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                      <Percent className="w-4 h-4 text-yellow-300 shrink-0" /> Khoản vay ({calcResult.loanPercent}%):
                    </span>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tabular-nums tracking-tight whitespace-nowrap">
                        {paymentOption === "cash" ? "—" : `${Math.round(priceWithVat * calcResult.loanPercent / 100 * 1_000_000_000).toLocaleString("vi-VN")} đ`}
                      </div>
                      <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">
                        {paymentOption === "policy"
                          ? `~${formatVND(parseFloat(calcResult.loanAmount))} · Lãi ${PROJECT_CALC_CONFIG[selectedCalcProject].policyRate}%/năm (${calcResult.loanYears} năm)`
                          : "Không vay"}
                      </p>
                    </div>
                  </div>

                  {/* Tổng lãi */}
                  <div className="flex flex-col justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5">
                    <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 mb-2">
                      <Calculator className="w-4 h-4 text-yellow-300 shrink-0" /> Tổng lãi phải trả:
                    </span>
                    <div>
                      {paymentOption === "cash" ? (
                        <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tracking-tight">Không vay</div>
                      ) : (
                        <>
                          <div className="text-xl sm:text-2xl font-black text-yellow-100 font-sans tabular-nums tracking-tight whitespace-nowrap">
                            {Math.round(disbCalcResult.totalInterest).toLocaleString("vi-VN")} đ
                          </div>
                          <p className="text-[11px] text-amber-100/80 mt-1.5 font-medium">
                            Kỳ đầu trả: ~{Math.round(disbCalcResult.firstMonthly).toLocaleString("vi-VN")} đ/tháng
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-2 text-xs text-amber-100/90">
                    <p className="font-bold text-white text-sm">📋 Điều kiện mua Nhà Ở Xã Hội:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 25tr/tháng (độc thân)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 35tr/tháng (đơn thân nuôi con)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 50tr/tháng (vợ chồng)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Chưa có nhà ở tại Đồng Nai</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Chưa từng mua NOXH ở Việt Nam</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Có đất / nhà tỉnh khác vẫn được mua</span>
                    </div>
                    <p className="text-yellow-200 font-semibold pt-1">📞 Hỗ trợ hồ sơ miễn phí: 0937.587.438</p>
                  </div>
                  <button
                    onClick={() => onNavigate("#contact")}
                    className="shrink-0 bg-white hover:bg-amber-50 text-amber-800 font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    Tư Vấn Miễn Phí <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {paymentOption !== "cash" && (
                    <button
                      onClick={() => {
                        const cfg = PROJECT_CALC_CONFIG[selectedCalcProject];
                        const fullPriceWithVatVnd = Math.round(priceWithVat * 1_000_000_000);
                        const exactLoanVnd = Math.round(fullPriceWithVatVnd * (cfg.loanPercent / 100));
                        setModalLoan(exactLoanVnd);
                        setModalLoanPct(cfg.loanPercent);
                        setModalRate(cfg.policyRate);
                        setModalYears(cfg.loanYears);
                        setShowLoanModal(true);
                      }}
                      className="shrink-0 bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold py-3 px-5 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
                    >
                      📊 Lịch trả nợ chi tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          ĐIỀU KIỆN MUA NHÀ Ở XÃ HỘI
          ========================================================= */}
      <section id="dieu-kien-noxh" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Đối tượng thụ hưởng</span>
            <h2 className="text-3xl font-display font-bold text-slate-900">Điều Kiện Mua Nhà Ở Xã Hội K-Home Đồng Nai</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Để đăng ký mua nhà ở xã hội K-Home tại Đồng Nai, người mua cần đáp ứng các tiêu chí theo <strong>Luật Nhà ở 2023</strong> và quy định của UBND tỉnh Đồng Nai.</p>
            <div className="space-y-3">
              {[
                { title: "Chưa có nhà ở", desc: "Chưa đứng tên sổ hồng nhà ở tại tỉnh Đồng Nai hoặc diện tích bình quân dưới 10m²/người" },
                { title: "Thu nhập đáp ứng quy định", desc: "Vợ chồng dưới 50 triệu/tháng · Đơn thân nuôi con dưới 35 triệu · Cá nhân độc thân dưới 25 triệu/tháng" },
                { title: "Chưa từng mua NOXH", desc: "Chưa từng mua hoặc thuê mua nhà ở xã hội tại bất kỳ tỉnh thành nào trên cả nước" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber-500 text-white rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm">Không chắc mình đủ điều kiện?</p>
                <p className="text-amber-100 text-xs mt-0.5">Gọi ngay để được kiểm tra miễn phí trong 5 phút</p>
              </div>
              <a href="tel:0937587438" className="shrink-0 bg-white text-amber-600 font-bold text-xs px-4 py-2 rounded-xl hover:bg-amber-50 transition-colors">0937 587 438</a>
            </div>
          </div>
          <div className="space-y-4">
            <img
              src={imgUrl("/k-home cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.webp", "thumbnail")}
              alt="Dự án nhà ở xã hội K-Home CityView Hố Nai Biên Hòa Đồng Nai Kim Oanh Land phối cảnh tổng thể"
              className="w-full rounded-2xl object-cover h-64 shadow-md"
              loading="lazy"
              width="800"
              height="256"
            />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { value: "5,4%", label: "Lãi suất NOXH/năm" },
                { value: "25 năm", label: "Kỳ hạn vay tối đa" },
                { value: "3,5tr", label: "Trả góp từ/tháng" },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-lg font-bold text-amber-600">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PHÁP LÝ DỰ ÁN
          ========================================================= */}
      <section id="phap-ly" className="bg-slate-900 py-16 cv-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-400/10 px-3.5 py-1.5 rounded-full inline-block border border-amber-400/20">Pháp lý minh bạch</span>
              <h2 className="text-3xl font-display font-bold text-white">Pháp Lý Dự Án K-Home – Đầy Đủ & Công Khai</h2>
              <p className="text-slate-400 text-sm leading-relaxed">Chuỗi dự án K-Home Đồng Nai được triển khai với đầy đủ hồ sơ pháp lý theo quy định nhà ở xã hội, đảm bảo người mua được cấp <strong className="text-white">sổ hồng sở hữu lâu dài</strong>.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Giấy chứng nhận đăng ký đầu tư",
                  "Phê duyệt quy hoạch chi tiết 1/500",
                  "Chuyển đổi mục đích sử dụng đất",
                  "Giấy phép xây dựng đầy đủ",
                  "Sổ hồng sở hữu lâu dài",
                  "Hỗ trợ pháp lý hoàn toàn miễn phí",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-slate-300 text-xs">
                    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setHomeLightbox({
                  imgs: [
                    "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-19",
                    "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-20",
                  ],
                  alts: [
                    "Hồ sơ pháp lý dự án NOXH K-Home CityView Hố Nai Biên Hòa Kim Oanh Land",
                    "Giấy chứng nhận đầu tư phê duyệt quy hoạch 1/500 K-Home CityView Kim Oanh",
                  ],
                  idx: 0
                })}
                className="relative group rounded-2xl overflow-hidden cursor-zoom-in w-full"
              >
                <img src="https://res.cloudinary.com/dthv0nsq/image/upload/w_900,q_auto:good,f_auto/slide-k-home-cityview/slide-19" alt="Hồ sơ pháp lý dự án NOXH K-Home CityView Hố Nai Biên Hòa Kim Oanh Land" className="rounded-2xl object-cover h-48 w-full shadow-md group-hover:scale-105 transition-transform duration-300" loading="lazy" width="900" height="192" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-2xl">
                  <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                  </span>
                </div>
              </button>
              <button
                onClick={() => setHomeLightbox({
                  imgs: [
                    "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-19",
                    "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-20",
                  ],
                  alts: [
                    "Hồ sơ pháp lý dự án NOXH K-Home CityView Hố Nai Biên Hòa Kim Oanh Land",
                    "Giấy chứng nhận đầu tư phê duyệt quy hoạch 1/500 K-Home CityView Kim Oanh",
                  ],
                  idx: 1
                })}
                className="relative group rounded-2xl overflow-hidden cursor-zoom-in w-full"
              >
                <img src="https://res.cloudinary.com/dthv0nsq/image/upload/w_900,q_auto:good,f_auto/slide-k-home-cityview/slide-20" alt="Giấy chứng nhận đầu tư phê duyệt quy hoạch 1/500 K-Home CityView Kim Oanh Land" className="rounded-2xl object-cover h-48 w-full shadow-md group-hover:scale-105 transition-transform duration-300" loading="lazy" width="900" height="192" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-2xl">
                  <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHỦ ĐẦU TƯ KIM OANH LAND
          ========================================================= */}
      <section id="chu-dau-tu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 cv-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 order-2 lg:order-1">
            <img src={imgUrl("/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp", "full")} alt="Top 10 nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 Kim Oanh Land giải thưởng PropertyGuru" className="w-full rounded-2xl object-cover shadow-md" loading="lazy" width="800" height="450" />
          </div>
          <div className="space-y-5 order-1 lg:order-2">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Chủ đầu tư uy tín</span>
            <h2 className="text-3xl font-display font-bold text-slate-900">Kim Oanh Land – Tiên Phong Nhà Ở Xã Hội Đồng Nai</h2>
            <p className="text-slate-600 text-sm leading-relaxed"><strong>Kim Oanh Land</strong> (thành viên Tập đoàn Kim Oanh Group) là đơn vị tiên phong trong phát triển nhà ở xã hội tại Đồng Nai với hơn 20 năm kinh nghiệm. Công ty đã được vinh danh <strong>Top 10 nhà phát triển NOXH hàng đầu Việt Nam</strong> và nhận giải thưởng <strong>PropertyGuru Vietnam Property Awards 2025 – Best Affordable Housing Development</strong>.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "40.000+", label: "Căn NOXH dự kiến 2028" },
                { value: "3 dự án", label: "Tại Đồng Nai đang triển khai" },
                { value: "20+ năm", label: "Kinh nghiệm phát triển BĐS" },
                { value: "Top 10", label: "NOXH hàng đầu Việt Nam 2024" },
              ].map((s, i) => (
                <div key={i} className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <p className="text-base font-bold text-amber-600">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          GIẢI THƯỞNG & CÔNG NHẬN
          ========================================================= */}
      <section id="giai-thuong" className="py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Uy tín được công nhận</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Giải Thưởng & Công Nhận Uy Tín Của Kim Oanh Land</h2>
          </div>

          {/* Layout: ảnh lớn bên trái + 2 ảnh nhỏ bên phải */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Ảnh lớn — PropertyGuru */}
            <button
              onClick={() => setHomeLightbox({
                imgs: [
                  "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-15",
                  imgUrl("/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp", "full"),
                  "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-16",
                ],
                alts: [
                  "PropertyGuru Vietnam Property Awards 2025 Kim Oanh Land Best Affordable Housing Development",
                  "Top 10 nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 Kim Oanh Land",
                  "Giải thưởng kiến trúc xanh bền vững EDGE 2024 Kim Oanh Land K-Home Đồng Nai",
                ],
                idx: 0
              })}
              className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-amber-100 shadow-sm hover:shadow-lg transition-all w-full bg-amber-50"
            >
              <img
                src="https://res.cloudinary.com/dthv0nsq/image/upload/w_900,q_auto:good,f_auto/slide-k-home-cityview/slide-15"
                alt="PropertyGuru Vietnam Property Awards 2025 Kim Oanh Land Best Affordable Housing Development"
                className="w-full object-contain group-hover:scale-105 transition-transform duration-300"
                width="900"
                height="560"
                style={{ height: "280px", backgroundColor: "#fffbeb" }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Xem chi tiết</span>
              </div>
              <div className="p-4 text-left">
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">2025</span>
                <h3 className="font-bold text-slate-800 text-sm mt-2">PropertyGuru Vietnam Property Awards – Best Affordable Housing Development</h3>
              </div>
            </button>

            {/* 2 ảnh nhỏ xếp dọc */}
            <div className="grid grid-rows-2 gap-6">
              {[
                {
                  img: imgUrl("/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp", "card"),
                  alt: "Top 10 nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 Kim Oanh Land Đồng Nai",
                  year: "2024", title: "Top 10 Nhà Phát Triển NOXH Hàng Đầu Việt Nam", idx: 1,
                },
                {
                  img: "https://res.cloudinary.com/dthv0nsq/image/upload/w_800,q_auto:good,f_auto/slide-k-home-cityview/slide-16",
                  alt: "Giải thưởng kiến trúc xanh bền vững EDGE 2024 Kim Oanh Land K-Home CityView Đồng Nai",
                  year: "2024", title: "Giải Thưởng Kiến Trúc Xanh Bền Vững – Hội KTS Việt Nam", idx: 2,
                },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => setHomeLightbox({
                    imgs: [
                      "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-15",
                      imgUrl("/k-home cityview/mat-bang/top-10-nha-phat-trien-nha-o-xa-hoi-viet-nam-2024.jpg.webp", "full"),
                      "https://res.cloudinary.com/dthv0nsq/image/upload/w_1600,q_auto:best,f_auto/slide-k-home-cityview/slide-16",
                    ],
                    alts: [
                      "PropertyGuru Vietnam Property Awards 2025 Kim Oanh Land Best Affordable Housing Development",
                      "Top 10 nhà phát triển nhà ở xã hội hàng đầu Việt Nam 2024 Kim Oanh Land",
                      "Giải thưởng kiến trúc xanh bền vững EDGE 2024 Kim Oanh Land K-Home Đồng Nai",
                    ],
                    idx: a.idx
                  })}
                  className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-slate-100 shadow-sm hover:shadow-lg transition-all w-full flex items-center gap-4 bg-white p-3 text-left"
                >
                  <img
                    src={a.img}
                    alt={a.alt}
                    className="w-28 h-24 object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300"
                    width="112"
                    height="96"
                    style={{ backgroundColor: "#f8fafc" }}
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{a.year}</span>
                    <h3 className="font-bold text-slate-800 text-sm mt-1.5 leading-snug">{a.title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-2xl" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* =========================================================
          LÃI SUẤT NOXH & CHÍNH SÁCH VAY
          ========================================================= */}
      <section id="lai-suat-noxh" className="bg-slate-50 py-14 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Chính sách tài chính</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Lãi Suất Vay Mua Nhà Ở Xã Hội K-Home Đồng Nai</h2>
              <p className="text-slate-600 text-sm leading-relaxed">Người mua đủ điều kiện NOXH được vay từ <strong>Ngân hàng Chính sách Xã hội</strong> với lãi suất ưu đãi <strong>5,4%/năm cố định trong 25 năm</strong> — thấp hơn nhiều so với lãi suất thị trường thông thường (9-12%/năm).</p>
              <div className="space-y-3">
                {[
                  { label: "Lãi suất NOXH", value: "5,4%/năm", note: "Cố định suốt 25 năm" },
                  { label: "Mức vay tối đa", value: "75–80%", note: "Giá trị căn hộ" },
                  { label: "Kỳ hạn vay", value: "25 năm", note: "Trả góp đều hàng tháng" },
                  { label: "Trả góp từ", value: "3,5 tr/tháng", note: "Căn Studio từ 750 triệu" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-sm text-slate-600 font-medium">{row.label}</span>
                    <div className="text-right">
                      <span className="text-base font-bold text-amber-600 block">{row.value}</span>
                      <span className="text-[10px] text-slate-400">{row.note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-amber-700">Ví dụ tính toán:</strong> Mua căn 1PN+A giá 950 triệu, vay 75% = 712,5 triệu trong 25 năm với lãi suất 5,4%/năm → trả góp khoảng <strong>4,3 triệu/tháng</strong>.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-base">So Sánh: Mua K-Home vs Thuê Trọ</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="text-left px-4 py-3 font-bold">Tiêu chí</th>
                      <th className="text-center px-4 py-3 font-bold text-amber-300">Mua K-Home</th>
                      <th className="text-center px-4 py-3 font-bold text-slate-300">Thuê trọ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-50">
                    {[
                      ["Chi phí/tháng", "3,5–4,5 tr", "4–7 tr"],
                      ["Sau 25 năm", "Sở hữu tài sản", "Mất trắng"],
                      ["Ổn định", "Không lo bị đuổi", "Phụ thuộc chủ nhà"],
                      ["Lãi suất", "5,4%/năm", "Không áp dụng"],
                    ].map(([label, buy, rent], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-amber-50/20" : ""}>
                        <td className="px-4 py-2.5 font-semibold text-slate-700">{label}</td>
                        <td className="px-4 py-2.5 text-center text-green-700 font-bold">{buy}</td>
                        <td className="px-4 py-2.5 text-center text-slate-400">{rent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a href="/lien-he" onClick={(e) => { e.preventDefault(); onNavigate("/lien-he"); }} className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors no-underline">
                Tính Toán Ngay – Tư Vấn Miễn Phí
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TIN TỨC & BÀI VIẾT LIÊN QUAN
          ========================================================= */}
      <section id="tin-tuc" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 cv-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Cập nhật mới nhất</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai</h2>
          </div>
          <a href="/tin-tuc" onClick={(e) => { e.preventDefault(); onNavigate("/tin-tuc"); }} className="text-amber-600 font-semibold text-sm hover:text-amber-700 flex items-center gap-1.5 no-underline shrink-0">
            Xem tất cả bài viết →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              slug: "/tin-tuc/dieu-kien-mua-nha-o-xa-hoi-dong-nai-2026",
              img: "https://res.cloudinary.com/dthv0nsq/image/upload/w_600,h_400,c_fill,q_auto:good,f_auto/news/news-1",
              cat: "Chính sách",
              title: "Điều Kiện Mua Nhà Ở Xã Hội Đồng Nai 2026: Nới Lỏng Thu Nhập, Bỏ Sổ Hộ Khẩu",
              date: "27/07/2026",
              excerpt: "Quy định 2026 đã nới lỏng thu nhập và bãi bỏ yêu cầu sổ hộ khẩu — cơ hội lớn cho người lao động tại Biên Hòa, Nhơn Trạch, Trảng Bom.",
            },
            {
              slug: "/tin-tuc/danh-gia-du-an-k-home-cityview-bien-hoa-2026",
              img: "https://res.cloudinary.com/dthv0nsq/image/upload/w_600,h_400,c_fill,q_auto:good,f_auto/k-home-cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2",
              cat: "Đánh giá dự án",
              title: "Đánh Giá Chi Tiết Dự Án K-Home CityView Biên Hòa: Vị Trí, Thiết Kế & Giá Bán",
              date: "28/07/2026",
              excerpt: "Tìm hiểu chi tiết dự án NOXH K-Home CityView Biên Hòa: vị trí Hố Nai, quy mô 1.816 căn, tiện ích chuẩn xanh EDGE và giá bán mới nhất.",
            },
            {
              slug: "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac",
              img: "https://res.cloudinary.com/dthv0nsq/image/upload/w_600,h_400,c_fill,q_auto:good,f_auto/slide-k-home-cityview/slide-25",
              cat: "Đánh giá dự án",
              title: "Vị Trí K-Home CityView Biên Hòa Có Gì Nổi Bật So Với Các Dự Án NOXH Khác?",
              date: "31/07/2026",
              excerpt: "Khám phá vị trí K-Home CityView Biên Hòa, lợi thế kết nối KCN, tiện ích xung quanh và lý do dự án nổi bật giữa các NOXH tại Đồng Nai.",
            },
          ].map((article, i) => (
            <a
              key={i}
              href={article.slug}
              onClick={(e) => { e.preventDefault(); onNavigate(article.slug); }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all no-underline cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={article.img} alt={`${article.title} – tin tức nhà ở xã hội K-Home Đồng Nai`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="176" />
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{article.cat}</span>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-500">{article.date}</p>
                <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                <span className="text-[11px] text-amber-500 font-semibold group-hover:text-amber-600">Đọc tiếp →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* =========================================================
          6. CORE PHILOSOPHY
          ========================================================= */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Giá trị cốt lõi K-Home</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Cam Kết Đồng Hành Cùng Cư Dân
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            K-Home Đồng Nai được xây dựng với mục tiêu mang đến không gian sống chất lượng, pháp lý minh bạch và chi phí hợp lý, giúp người lao động có cơ hội sở hữu nhà ở ổn định lâu dài.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, idx) => (
            <CoreValueCard key={idx} {...value} />
          ))}
        </div>
      </section>

      {/* =========================================================
          7. PREMIUM TESTIMONIALS (AMBER DECORATED STYLE)
          ========================================================= */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Ý kiến cư dân</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Khách Hàng Nói Gì Về K-Home?
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Những chia sẻ chân thực từ người đã và đang sở hữu căn hộ tại các dự án K-Home Đồng Nai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>
      </section>

      {/* =========================================================
          SEO TEXT SECTION — Nội dung text dài cho Googlebot
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="seo-content">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 space-y-8">

          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
              K-Home Đồng Nai – Chuỗi Dự Án Nhà Ở Xã Hội Uy Tín Của Kim Oanh Land
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>K-Home Đồng Nai</strong> là chuỗi dự án <strong>nhà ở xã hội (NOXH)</strong> do <strong>Kim Oanh Land</strong> – thành viên của Tập đoàn Kim Oanh Group – phát triển tại tỉnh Đồng Nai. Gồm 3 dự án trọng điểm: <strong>K-Home CityView Hố Nai (Biên Hòa)</strong>, <strong>K-Home Midtown Trảng Bom</strong> và <strong>K-Home Avenue Nhơn Trạch</strong>, chuỗi dự án này hướng đến giải pháp an cư bền vững cho người lao động, công nhân viên chức và gia đình trẻ tại Đồng Nai với mức giá phù hợp và chính sách vay ưu đãi lãi suất <strong>5,4%/năm</strong> từ Ngân hàng Chính sách Xã hội.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CityView */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                <a href="/k-home-cityview-ho-nai" className="hover:text-amber-600 transition-colors">
                  Nhà Ở Xã Hội K-Home CityView Hố Nai Biên Hòa
                </a>
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong>K-Home CityView</strong> tọa lạc tại đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa. Quy mô 2,85 ha với 4 block cao 22 tầng, cung cấp <strong>1.328 căn hộ NOXH</strong> và 39 căn shophouse. Các loại căn hộ gồm: <strong>1 phòng ngủ từ 47m²</strong>, 2 phòng ngủ từ 62m² đến 70m² và <strong>3 phòng ngủ 84m²</strong> – loại căn hộ 3PN hiếm có trong phân khúc NOXH tại Đồng Nai. Giá bán từ <strong>950 triệu đồng</strong>, bàn giao full nội thất, pháp lý sổ hồng sở hữu lâu dài. Dự án đạt tiêu chuẩn công trình xanh <strong>EDGE</strong>, thiết kế theo chuẩn Singapore do Global Vireon Studio và Kiến Trúc Việt đảm nhận.
              </p>
              <a href="/k-home-cityview-ho-nai" className="text-amber-600 text-xs font-semibold hover:text-amber-700 flex items-center gap-1">
                Xem bảng giá K-Home CityView →
              </a>
            </div>

            {/* Midtown */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0" />
                <a href="/k-home-midtown-trang-bom" className="hover:text-teal-600 transition-colors">
                  Nhà Ở Xã Hội K-Home Midtown Trảng Bom
                </a>
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong>K-Home Midtown</strong> tọa lạc tại trung tâm huyện Trảng Bom, giao điểm 4 tuyến đường lớn: 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành. Quy mô 13,97 ha với 1 block cao 15 tầng, cung cấp <strong>542 căn hộ NOXH</strong> và 20 căn shophouse. Các loại căn: <strong>Studio từ 36m²</strong>, 1 phòng ngủ từ 47m², 2 phòng ngủ 68m². Giá từ <strong>750 triệu đồng</strong>, trả góp chỉ từ 3,5 triệu/tháng. Vị trí thuận tiện kết nối đến KCN Bàu Xéo, KCN Hố Nai và TP. Biên Hòa, phù hợp cho công nhân và người lao động khu vực Trảng Bom.
              </p>
              <a href="/k-home-midtown-trang-bom" className="text-teal-600 text-xs font-semibold hover:text-teal-700 flex items-center gap-1">
                Xem bảng giá K-Home Midtown →
              </a>
            </div>

            {/* Avenue */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                <a href="/k-home-avenue-nhon-trach" className="hover:text-emerald-600 transition-colors">
                  Nhà Ở Xã Hội K-Home Avenue Nhơn Trạch
                </a>
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong>K-Home Avenue</strong> tọa lạc tại đường Nguyễn Ái Quốc (Tỉnh lộ 25C), xã Nhơn Trạch – tuyến đường kết nối trực tiếp đến <strong>Sân bay Quốc tế Long Thành</strong>. Quy mô 5,3 ha với 4 block cao 12 tầng, cung cấp <strong>1.022 căn hộ NOXH</strong> và 82 căn shophouse. Các loại căn: <strong>Studio từ 37,7m²</strong>, 1 phòng ngủ 46,6m², 2 phòng ngủ từ 65,7m² đến 69,5m². Giá từ <strong>750 triệu đồng</strong>. Khu vực Nhơn Trạch đang phát triển mạnh nhờ hạ tầng sân bay Long Thành, Vành đai 3 và cầu Nhơn Trạch đang thi công.
              </p>
              <a href="/k-home-avenue-nhon-trach" className="text-emerald-600 text-xs font-semibold hover:text-emerald-700 flex items-center gap-1">
                Xem bảng giá K-Home Avenue →
              </a>
            </div>

          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-base font-bold text-slate-800">Điều Kiện Mua Nhà Ở Xã Hội K-Home Đồng Nai</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Để mua <strong>nhà ở xã hội K-Home tại Đồng Nai</strong>, người mua cần đáp ứng các điều kiện theo quy định của Nhà nước: (1) Chưa có nhà ở hoặc diện tích nhà ở bình quân dưới 10m²/người tại tỉnh Đồng Nai; (2) Thu nhập đáp ứng quy định – hộ gia đình vợ chồng dưới 50 triệu/tháng, đơn thân nuôi con dưới 35 triệu/tháng, cá nhân độc thân dưới 25 triệu/tháng; (3) Có hộ khẩu hoặc đang tạm trú tại tỉnh Đồng Nai từ 1 năm trở lên. Người đủ điều kiện được hỗ trợ vay từ <strong>Ngân hàng Chính sách Xã hội</strong> với lãi suất ưu đãi <strong>5,4%/năm</strong> cố định trong 25 năm. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện toàn bộ hồ sơ miễn phí. Liên hệ hotline <strong>0937 587 438</strong> để được tư vấn chi tiết.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          8. CONSULTATION BANNER CTA (COMPLETELY LIGHT / GOLDEN BASE STYLE)
          ========================================================= */}
      <section id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden border border-amber-400/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)]" />

          {/* Top row: title + button */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
                Hỗ trợ hồ sơ NOXH miễn phí — Hotline 0937.587.438
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">
                Tư Vấn Mua Nhà Ở Xã Hội <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">
                  Lãi Suất Chỉ 5,4%/Năm
                </span>
              </h2>
              <p className="text-amber-50 text-xs sm:text-sm font-light leading-relaxed">
                Đội ngũ tư vấn Kim Oanh Land hỗ trợ toàn bộ hồ sơ miễn phí — từ kiểm tra điều kiện, chuẩn bị giấy tờ đến kết nối ngân hàng chính sách xã hội tỉnh Đồng Nai.
              </p>
            </div>
            <div className="shrink-0 w-full lg:w-auto text-center">
              <button
                onClick={() => onNavigate("/lien-he")}
                className="w-full lg:w-auto bg-white hover:bg-amber-100 text-amber-800 px-10 py-5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-orange-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                Đăng Ký Tư Vấn Miễn Phí <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-amber-100/90 mt-3 font-medium">Hotline Kim Oanh Land: 0937.587.438</p>
            </div>
          </div>

          {/* ── Inline CTA Form ── */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 relative z-10">
            {ctaSuccess ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-bold text-sm">Đã nhận thông tin!</p>
                <p className="text-amber-100 text-xs">Chuyên viên sẽ liên hệ bạn trong vòng 15 phút.</p>
              </div>
            ) : (
              <form onSubmit={handleCtaSubmit} className="space-y-3">
                <p className="text-white font-bold text-sm text-center mb-2">Để lại thông tin — nhận tư vấn ngay</p>
                {ctaError && <p className="text-red-200 text-xs text-center">{ctaError}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên *"
                    value={ctaName}
                    onChange={e => setCtaName(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm outline-none focus:bg-white/30 transition-all"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại *"
                    value={ctaPhone}
                    onChange={e => setCtaPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm outline-none focus:bg-white/30 transition-all"
                  />
                  <select
                    value={ctaProject}
                    onChange={e => setCtaProject(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white text-sm outline-none focus:bg-white/30 transition-all cursor-pointer"
                  >
                    <option value="k-home-cityview-ho-nai" className="text-slate-800">K-Home CityView Biên Hòa</option>
                    <option value="k-home-midtown-trang-bom" className="text-slate-800">K-Home Midtown Trảng Bom</option>
                    <option value="k-home-avenue-nhon-trach" className="text-slate-800">K-Home Avenue Nhơn Trạch</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={ctaSubmitting}
                  className="w-full py-3 bg-white hover:bg-amber-50 text-amber-700 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
                >
                  {ctaSubmitting
                    ? <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" /> Nhận Tư Vấn Miễn Phí Ngay</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Homepage Lightbox ── */}
      {homeLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center select-none"
          onClick={() => setHomeLightbox(null)}
        >
          <button onClick={(e) => { e.stopPropagation(); setHomeLightbox(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full z-20">
            <X className="w-5 h-5" />
          </button>
          {homeLightbox.imgs.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setHomeLightbox(p => p ? { ...p, idx: (p.idx - 1 + p.imgs.length) % p.imgs.length } : null); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 cursor-pointer text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full z-20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setHomeLightbox(p => p ? { ...p, idx: (p.idx + 1) % p.imgs.length } : null); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 cursor-pointer text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full z-20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center px-20 pt-16 pb-16 pointer-events-none z-10">
            <img
              src={homeLightbox.imgs[homeLightbox.idx]}
              alt={homeLightbox.alts[homeLightbox.idx]}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl pointer-events-auto"
              style={{ cursor: "default" }}
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center z-20" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold text-white">Hình {homeLightbox.idx + 1} / {homeLightbox.imgs.length}</p>
            <p className="text-xs text-slate-400 mt-1">{homeLightbox.alts[homeLightbox.idx]}</p>
            <p className="text-[10px] text-slate-600 mt-1">Click ngoài ảnh để đóng</p>
          </div>
        </div>
      )}

      {/* =========================================================
          POPUP LEAD FORM — xuất hiện sau 8 giây
          ========================================================= */}
      {showPopup && !popupDismissed && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <button
              onClick={() => setPopupDismissed(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 space-y-5">
              {popupSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Gửi Thành Công!</h3>
                  <p className="text-slate-500 text-sm">Chuyên viên K-Home sẽ liên hệ bạn trong vòng 15 phút.</p>
                  <button
                    onClick={() => setPopupDismissed(true)}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1.5">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Ưu đãi đặc biệt</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Nhận Tư Vấn K-Home<br/>Hoàn Toàn Miễn Phí</h3>
                    <p className="text-slate-400 text-xs">Chuyên viên sẽ gọi lại trong 15 phút — hỗ trợ hồ sơ NOXH từ A→Z</p>
                  </div>

                  <form onSubmit={handlePopupSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label htmlFor="popup-name" className="text-xs font-semibold text-slate-600">Họ và tên *</label>
                      <input
                        id="popup-name"
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={popupName}
                        onChange={e => setPopupName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="popup-phone" className="text-xs font-semibold text-slate-600">Số điện thoại *</label>
                      <input
                        id="popup-phone"
                        type="tel"
                        required
                        placeholder="0933 354 093"
                        value={popupPhone}
                        onChange={e => setPopupPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="popup-project" className="text-xs font-semibold text-slate-600">Dự án quan tâm</label>
                      <select
                        id="popup-project"
                        value={popupProject}
                        onChange={e => setPopupProject(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all cursor-pointer"
                      >
                        <option value="k-home-cityview-ho-nai">K-Home CityView Biên Hòa</option>
                        <option value="k-home-midtown-trang-bom">K-Home Midtown Trảng Bom</option>
                        <option value="k-home-avenue-nhon-trach">K-Home Avenue Nhơn Trạch</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={popupSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {popupSubmitting
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><Send className="w-4 h-4" /> Nhận Tư Vấn Miễn Phí</>
                      }
                    </button>
                    <p className="text-center text-xs text-slate-500">
                      Thông tin của bạn được bảo mật tuyệt đối.{" "}
                      <button type="button" onClick={() => setPopupDismissed(true)} className="underline hover:text-slate-600 cursor-pointer">
                        Bỏ qua
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

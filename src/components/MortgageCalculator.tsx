import React, { useState, useMemo, startTransition, useRef } from "react";
import ReactDOM from "react-dom";
import { Calculator, Coins, Percent, ArrowRight, Phone } from "lucide-react";

// ─── Config dữ liệu từng dự án ───────────────────────────────────────────────
interface CalcUnit {
  label: string; area: string; price: number;
  priceMin: number; priceMax: number; priceLabel: string;
}
interface CalcConfig {
  name: string; loanYears: number; loanPercent: number; policyRate: number;
  units: CalcUnit[];
  schedule: { dot: string; pct: string; note: string }[];
}

const CALC_CONFIG: Record<string, CalcConfig> = {
  "k-home-cityview-ho-nai": {
    name: "K-Home CityView Hố Nai", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "1PN+A", area: "47,3m²", price: 1.0,  priceMin: 0.95, priceMax: 1.08, priceLabel: "950tr – 1,08 tỷ" },
      { label: "1PN+B", area: "62,4m²", price: 1.3,  priceMin: 1.20, priceMax: 1.40, priceLabel: "1,20 – 1,40 tỷ" },
      { label: "2PN",   area: "70,4m²", price: 1.60, priceMin: 1.50, priceMax: 1.70, priceLabel: "1,50 – 1,70 tỷ" },
      { label: "3PN",   area: "84,4m²", price: 1.9,  priceMin: 1.80, priceMax: 2.00, priceLabel: "1,80 – 2,00 tỷ" },
    ],
    schedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 2" },
      { dot: "Đợt 4",    pct: "75% (NH giải ngân)",  note: "Ngân hàng giải ngân" },
      { dot: "Bàn giao", pct: "Phí bảo trì 2%",     note: "15 ngày kể từ thông báo bàn giao" },
    ],
  },
  "k-home-avenue-nhon-trach": {
    name: "K-Home Avenue Nhơn Trạch", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "38m²",    price: 0.75, priceMin: 0.75, priceMax: 0.85, priceLabel: "Từ 750 triệu" },
      { label: "1PN+",   area: "47m²",    price: 0.95, priceMin: 0.95, priceMax: 1.05, priceLabel: "950 triệu" },
      { label: "2PN-S",  area: "65m²",    price: 1.4,  priceMin: 1.40, priceMax: 1.50, priceLabel: "Từ 1,4 tỷ" },
      { label: "2PN-L",  area: "69,5m²",  price: 1.5,  priceMin: 1.50, priceMax: 1.60, priceLabel: "1,5 tỷ" },
    ],
    schedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "5%",                  note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
      { dot: "Đợt 4",    pct: "75% (NH giải ngân)",  note: "Ngân hàng giải ngân" },
      { dot: "Bàn giao", pct: "Phí bảo trì 2%",     note: "15 ngày kể từ thông báo bàn giao" },
    ],
  },
  "k-home-midtown-trang-bom": {
    name: "K-Home Midtown Trảng Bom", loanYears: 25, loanPercent: 75, policyRate: 5.4,
    units: [
      { label: "Studio", area: "~35m²", price: 0.8, priceMin: 0.80, priceMax: 0.90, priceLabel: "Từ ~800 triệu" },
      { label: "1PN+A",  area: "~47m²", price: 1.0, priceMin: 1.00, priceMax: 1.15, priceLabel: "Từ ~1,0 tỷ" },
      { label: "1PN+B",  area: "~55m²", price: 1.2, priceMin: 1.20, priceMax: 1.35, priceLabel: "Từ ~1,2 tỷ" },
      { label: "2PN",    area: "~65m²", price: 1.4, priceMin: 1.40, priceMax: 1.55, priceLabel: "Từ ~1,4 tỷ" },
    ],
    schedule: [
      { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
      { dot: "Đợt 1",    pct: "15%",                 note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
      { dot: "Đợt 2",    pct: "5%",                  note: "30 ngày kể từ ngày đến hạn đợt 1" },
      { dot: "Đợt 3",    pct: "10%",                 note: "30 ngày kể từ ngày đến hạn đợt 2" },
      { dot: "Đợt 4",    pct: "75% (NH giải ngân)",  note: "Ngân hàng giải ngân" },
      { dot: "Bàn giao", pct: "Phí bảo trì 2%",     note: "15 ngày kể từ thông báo bàn giao" },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatVND(billion: number): string {
  if (billion < 1) return `${Math.round(billion * 1000)} triệu`;
  if (billion === Math.floor(billion)) return `${billion} tỷ`;
  return `${billion.toFixed(2).replace(/\.?0+$/, "")} tỷ`;
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
  const [inputMode, setInputMode]       = useState<"slider" | "input">("slider");
  const [rawInput, setRawInput]         = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [modalPage, setModalPage]       = useState(0);
  const [modalStartYear, setModalStartYear] = useState(2026);
  const [modalStartMonth, setModalStartMonth] = useState(1);
  const [openMonthDrop, setOpenMonthDrop] = useState(false);
  const [openYearDrop, setOpenYearDrop]   = useState(false);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const unit = cfg.units[unitIdx];

  // ── Vốn tự có / Khoản vay — đơn vị tỷ, làm tròn 2 chữ số thập phân như HomeView ──
  const downPayment = parseFloat((price * (100 - cfg.loanPercent) / 100).toFixed(2));
  const loanAmount  = parseFloat((price * cfg.loanPercent / 100).toFixed(2));

  // ── Trả góp — mô hình giải ngân 3 đợt (giống HomeView disbCalcResult) ───────
  const disbResult = useMemo(() => {
    if (method !== "policy") return { firstMonthly: 0, totalInterest: 0 };
    // Dùng cùng contractValue như modal: loanMil / lp — giống HomeView
    const loanMilExact = Math.round(price * cfg.loanPercent / 100 * 1000 * 10) / 10;
    const contractValue = loanMilExact / (cfg.loanPercent / 100);
    const rYear = cfg.policyRate / 100;
    const n = cfg.loanYears * 12;
    const sy = 2026;
    const disbEvents = [
      { atMonth: 1,  pct: 0.45 },
      { atMonth: 13, pct: 0.25 },
      { atMonth: 25, pct: 0.05 },
    ];
    let bal = 0, firstMonthly = 0, totalInterest = 0;
    for (let m = 1; m <= n; m++) {
      const d = disbEvents.find(e => e.atMonth === m);
      if (d) bal += contractValue * d.pct;
      if (bal <= 0) continue;
      const rem    = n - m + 1;
      const prin   = bal / rem;
      const mIdx   = m - 1;
      const year   = sy + Math.floor(mIdx / 12);
      const mo     = mIdx % 12;
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const days   = mo === 1 ? (isLeap ? 29 : 28) : [31,28,31,30,31,30,31,31,30,31,30,31][mo];
      const interest = bal * rYear * days / (isLeap ? 366 : 365);
      if (firstMonthly === 0) firstMonthly = prin + interest;
      totalInterest += interest;
      bal -= prin;
      if (bal < 0.001) bal = 0;
    }
    return { firstMonthly, totalInterest };
  }, [price, method, cfg]);

  // ── Parse số tiền từ chuỗi % ────────────────────────────────────────────────
  const parseAmt = (pct: string, dot: string): string => {
    const p = price * 1000;
    if (pct === "30.000.000đ") return "30 triệu";
    if (dot === "Đợt 1" && pct === "15%") return `${formatVND((p * 0.15 - 30) / 1000)} (đã trừ cọc)`;
    const num = parseFloat(pct);
    if (!isNaN(num) && pct.includes("%")) return formatVND((p * num / 100) / 1000);
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
                onClick={() => { setUnitIdx(i); setPrice(u.priceMin); setInputMode("slider"); setRawInput(""); setMethod(""); }}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${unitIdx === i ? "border-amber-500 bg-amber-50 shadow-sm" : "border-slate-200 hover:border-amber-300 bg-white"}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 mb-2 ${unitIdx === i ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                <span className="block text-base font-extrabold text-slate-800">{u.label}</span>
                <span className="text-xs text-slate-400 block">{u.area}</span>
                <span className="text-xs font-bold text-amber-600 block mt-1">{u.priceLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bước 2 — Slider / nhập giá */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">02</span>
              Chọn mức giá cụ thể:
            </p>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(["slider", "input"] as const).map(m => (
                <button key={m} type="button" onClick={() => setInputMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${inputMode === m ? "bg-white text-amber-600 shadow-sm" : "text-slate-500"}`}>
                  {m === "slider" ? "🎚 Kéo thả" : "✏️ Nhập số"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">{unit.label} · {unit.area}</span>
            <span className="text-xl font-extrabold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-xl">{formatVND(price)}</span>
          </div>
          {inputMode === "slider" ? (
            <>
              <input type="range" min={unit.priceMin} max={unit.priceMax} step={0.01} value={price}
                onChange={e => { startTransition(() => setPrice(parseFloat(e.target.value))); }}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{formatVND(unit.priceMin)} (thấp nhất)</span>
                <span>{formatVND(unit.priceMax)} (cao nhất)</span>
              </div>
            </>
          ) : (
            <div className="flex gap-2 items-center">
              <input type="number" step={10}
                min={Math.round(unit.priceMin * 1000)} max={Math.round(unit.priceMax * 1000)}
                placeholder={`${Math.round(unit.priceMin * 1000)} – ${Math.round(unit.priceMax * 1000)}`}
                value={rawInput}
                onChange={e => {
                  setRawInput(e.target.value);
                  const n = parseFloat(e.target.value);
                  if (!isNaN(n) && n >= unit.priceMin * 1000 && n <= unit.priceMax * 1000) {
                    setPrice(parseFloat((n / 1000).toFixed(3)));
                  }
                }}
                onBlur={() => {
                  const n = parseFloat(rawInput);
                  if (isNaN(n) || rawInput === "") { setRawInput(String(Math.round(unit.priceMin * 1000))); setPrice(unit.priceMin); }
                  else if (n < unit.priceMin * 1000) { setRawInput(String(Math.round(unit.priceMin * 1000))); setPrice(unit.priceMin); }
                  else if (n > unit.priceMax * 1000) { setRawInput(String(Math.round(unit.priceMax * 1000))); setPrice(unit.priceMax); }
                }}
                className="flex-1 border-2 border-amber-200 focus:border-amber-500 rounded-xl px-4 py-3 text-base font-extrabold text-slate-800 outline-none text-center" />
              <span className="text-sm font-bold text-slate-500 shrink-0">triệu đồng</span>
            </div>
          )}
        </div>

        {/* Bước 3 — Phương thức */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-700">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">03</span>
            Phương thức thanh toán:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "cash" as const,   title: "Bằng vốn tự có",           sub: `Thanh toán theo ${cfg.schedule.length} đợt, không vay NH` },
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
              {cfg.schedule.map((row, i) => (
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
                KẾT QUẢ DỰ TÍNH — {unit.label} · {unit.area} · {unit.priceLabel}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                <div className="space-y-1">
                  <span className="text-xs text-amber-100 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-yellow-200" /> Vốn tự có ({100 - cfg.loanPercent}%):
                  </span>
                  <div className="text-2xl font-extrabold text-white font-display">{formatVND(downPayment)}</div>
                  <p className="text-[10px] text-amber-100/70">Đóng theo nhiều đợt</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-amber-100 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-yellow-200" /> Khoản vay ({cfg.loanPercent}%):
                  </span>
                  <div className="text-2xl font-extrabold text-yellow-100 font-display">
                    {method === "cash" ? "—" : formatVND(loanAmount)}
                  </div>
                  <p className="text-[10px] text-amber-100/70">
                    {method === "policy" ? `${cfg.policyRate}%/năm · ${cfg.loanYears} năm` : "Không vay"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-amber-100 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-yellow-200" /> Tổng lãi phải trả:
                  </span>
                  {method === "cash"
                    ? <div className="text-2xl font-extrabold text-yellow-100">Không vay</div>
                    : <>
                        <div className="text-2xl font-extrabold text-yellow-100 font-display">
                          ~{Math.round(disbResult.totalInterest).toLocaleString("vi")} <span className="text-xs font-normal text-white/80">triệu</span>
                        </div>
                        <p className="text-[10px] text-amber-100/70">
                          Trong {cfg.loanYears} năm · lãi {cfg.policyRate}%/năm
                        </p>
                      </>
                  }
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
                <p className="text-slate-400 text-[11px] mt-0.5">Lãi tính theo số ngày thực tế / 365 — chuẩn ngân hàng VN</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer text-lg shrink-0 mt-0.5">✕</button>
            </div>

            {/* Thông số */}
            <div className="px-4 sm:px-6 py-3 space-y-2 shrink-0 bg-slate-50/60 border-b border-slate-100">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Khoản vay (triệu)", val: Math.round(loanAmount * 1000) },
                  { label: "Lãi suất (%/năm)", val: cfg.policyRate },
                  { label: "Thời hạn (năm)", val: cfg.loanYears },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{f.label}</label>
                    <div className="border-2 border-slate-100 bg-slate-50 rounded-xl px-2 py-2 text-sm font-extrabold text-slate-500 text-center">{f.val}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Tỷ lệ vay (%)</label>
                  <div className="border-2 border-slate-100 bg-slate-50 rounded-xl px-2 py-2 text-sm font-extrabold text-slate-500 text-center">{cfg.loanPercent}</div>
                </div>
                  <div>
                  <label className="text-[9px] font-bold text-amber-500 uppercase block mb-1">Giá căn (triệu)</label>
                  <div className="border-2 border-amber-200 bg-amber-50 rounded-xl px-2 py-2 text-sm font-extrabold text-amber-700 text-center">{Math.round(price * 1000)}</div>
                </div>
              </div>
            </div>

            {/* Summary + bảng */}
            {(() => {
              const loanMil = Math.round(price * cfg.loanPercent / 100 * 1000 * 10) / 10; // giữ 1 chữ số thập phân, giống HomeView
              const lp = cfg.loanPercent / 100;
              const contractVal = loanMil / lp;
              const rYear = cfg.policyRate / 100;
              const n = cfg.loanYears * 12;
              const sy = modalStartYear;
              const startOffset = modalStartMonth - 1; // 0-indexed offset trong năm sy
              const disbEvts = [{atMonth:1,pct:0.45,label:"Đợt 4 – Giải ngân 45%"},{atMonth:13,pct:0.25,label:"Đợt 5 – Giải ngân 25%"},{atMonth:25,pct:0.05,label:"Đợt 6 – Giải ngân 5%"}];
              const getDays = (m: number) => {
                const totalMonthIdx = startOffset + (m - 1);
                const yr = sy + Math.floor(totalMonthIdx / 12);
                const mo = totalMonthIdx % 12;
                const isL = (yr%4===0&&yr%100!==0)||yr%400===0;
                return {days:mo===1?(isL?29:28):[31,28,31,30,31,30,31,31,30,31,30,31][mo],year:yr,mo,isLeap:isL};
              };
              let bal=0,firstTotal=0,lastTotal=0,firstDays=0,totalInt=0;
              type DRow={seq:number;date:string;balance:number;principal:number;interest:number;total:number;isEvent?:boolean;eventLabel?:string;eventAmt?:number;disbMonth?:number;isFinal?:boolean};
              const rows:DRow[]=[];
              for(let m=1;m<=n;m++){
                const d=disbEvts.find(e=>e.atMonth===m);
                if(d){bal+=contractVal*d.pct;const {year,mo}=getDays(m);rows.push({seq:m,date:`01/${String(mo+1).padStart(2,"0")}/${year}`,balance:bal,principal:0,interest:0,total:0,isEvent:true,eventLabel:d.label,eventAmt:contractVal*d.pct,disbMonth:m});}
                if(bal<=0)continue;
                const rem=n-m+1,prin=bal/rem,{days,year,mo,isLeap}=getDays(m),interest=bal*rYear*days/(isLeap?366:365),total=prin+interest;
                if(firstTotal===0){firstTotal=total;firstDays=days;}lastTotal=total;
                totalInt+=interest;rows.push({seq:m,date:`01/${String(mo+1).padStart(2,"0")}/${year}`,balance:bal,principal:prin,interest,total});
                bal-=prin;if(bal<0.001)bal=0;
              }
              // Dòng tất toán
              {const {year,mo}=getDays(n+1);rows.push({seq:n+1,date:`01/${String(mo+1).padStart(2,"0")}/${year}`,balance:0,principal:0,interest:0,total:0,isFinal:true});}
              const PAGE=24,payRows=rows.filter(r=>!r.isEvent&&!r.isFinal),totalP=Math.ceil(payRows.length/PAGE);
              const ps=modalPage*PAGE,pe=Math.min(ps+PAGE,payRows.length);
              const seqS=payRows[ps]?.seq??1,seqE=payRows[pe-1]?.seq??n;
              const isLastPage=modalPage===totalP-1;
              const paged=rows.filter(r=>{
                if(r.isFinal)return isLastPage;
                if(r.isEvent)return((r.disbMonth??0)>=seqS&&(r.disbMonth??0)<=seqE);
                return r.seq>=seqS&&r.seq<=seqE;
              });
              return (<>
                <div className="px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-100 shrink-0">
                  {[{label:"Kỳ 1 trả",val:firstTotal.toFixed(2),sub:`${firstDays} ngày`,bg:"bg-amber-50 border-amber-200",tx:"text-amber-700"},
                    {label:"Kỳ cuối",val:lastTotal.toFixed(2),sub:"kỳ cuối",bg:"bg-emerald-50 border-emerald-200",tx:"text-emerald-700"},
                    {label:"Tổng lãi",val:totalInt.toFixed(1),sub:"phải trả",bg:"bg-rose-50 border-rose-200",tx:"text-rose-600"},
                    {label:"Tổng gốc+lãi",val:(loanMil+totalInt).toFixed(1),sub:"toàn bộ",bg:"bg-slate-50 border-slate-200",tx:"text-slate-700"},
                  ].map(c=>(<div key={c.label} className={`${c.bg} border rounded-2xl px-3 py-2 text-center`}><p className="text-[10px] font-semibold text-slate-500 mb-1">{c.label}</p><p className={`text-base font-extrabold ${c.tx}`}>{c.val} <span className="text-xs font-normal">tr</span></p><p className="text-[9px] text-slate-400">{c.sub}</p></div>))}
                </div>
                <div className="px-6 pt-3 pb-2 flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white">🏦 Giải ngân theo đợt</span>
                  {/* Dropdown Tháng + Năm */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    <span className="text-[10px] text-slate-500 font-semibold shrink-0">📅 Bắt đầu:</span>
                    {/* Tháng */}
                    <div className="relative">
                      <button onClick={e=>{e.stopPropagation();setOpenMonthDrop(v=>!v);setOpenYearDrop(false);}}
                        className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-2 bg-white transition-all shadow-sm cursor-pointer min-w-[72px] justify-between">
                        <span>Tháng {modalStartMonth}</span>
                        <span className="text-slate-400 text-[10px]">{openMonthDrop?"▴":"▾"}</span>
                      </button>
                      {openMonthDrop&&(
                        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden w-32">
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
                      <button onClick={e=>{e.stopPropagation();setOpenYearDrop(v=>!v);setOpenMonthDrop(false);}}
                        className="flex items-center gap-1.5 border-2 border-slate-200 hover:border-amber-400 rounded-xl text-xs font-extrabold text-slate-700 px-3 py-2 bg-white transition-all shadow-sm cursor-pointer min-w-[64px] justify-between">
                        <span>{modalStartYear}</span>
                        <span className="text-slate-400 text-[10px]">{openYearDrop?"▴":"▾"}</span>
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
                <div ref={modalScrollRef} className="overflow-y-auto flex-1 px-6 pb-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700">
                      <strong>Giải ngân 3 đợt (% trên giá căn):</strong> 45% ký HĐMB · 25% bàn giao nhà · 5% nhận GCN. Ô <span className="bg-rose-100 text-rose-600 px-1 rounded font-bold">đỏ</span> = NH giải ngân thêm, dư nợ tăng đột biến.
                    </div>
                    <table className="w-full text-[11px]">
                      <thead><tr className="border-b-2 border-slate-200">
                        <th className="pb-1.5 text-left text-[10px] font-bold text-slate-400 uppercase">Kỳ</th>
                        <th className="pb-1.5 text-left text-[10px] font-bold text-slate-400 uppercase">Ngày</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-slate-400 uppercase hidden sm:table-cell">Dư nợ (tr)</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-emerald-600 uppercase">Gốc</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-rose-500 uppercase">Lãi</th>
                        <th className="pb-1.5 text-right text-[10px] font-bold text-amber-600 uppercase">Tổng</th>
                      </tr></thead>
                      <tbody className="divide-y divide-slate-100">
                        {paged.map((r,i)=>r.isEvent?(
                          <tr key={`e${i}`} className="bg-rose-50 border-y-2 border-rose-300">
                            <td colSpan={2} className="py-2 px-1 font-extrabold text-rose-700 text-[10px]">🏦 {r.eventLabel} +{r.eventAmt?.toFixed(1)} tr</td>
                            <td className="py-2 text-right font-extrabold text-rose-700 hidden sm:table-cell">→ {r.balance.toFixed(1)} tr</td>
                            <td colSpan={3} className="py-2 text-right font-extrabold text-rose-700">→ {r.balance.toFixed(1)} tr</td>
                          </tr>
                        ):r.isFinal?(
                          <tr key="final" className="bg-emerald-50 border-t-2 border-emerald-400">
                            <td className="py-2 font-extrabold text-emerald-700 text-[10px]">✅ Tất toán</td>
                            <td className="py-2 text-emerald-600 text-[10px]">{r.date}</td>
                            <td colSpan={4} className="py-2 text-right font-extrabold text-emerald-700">Dư nợ: 0</td>
                          </tr>
                        ):(
                          <tr key={r.seq} className={`${r.seq%2===0?"bg-slate-50/40":""} hover:bg-amber-50 transition-colors`}>
                            <td className="py-1.5 font-bold text-slate-700 tabular-nums">{r.seq}</td>
                            <td className="py-1.5 text-slate-400 text-[10px]">{r.date}</td>
                            <td className="py-1.5 text-right text-slate-500 tabular-nums hidden sm:table-cell">{r.balance.toFixed(2)}</td>
                            <td className="py-1.5 text-right text-emerald-600 font-semibold tabular-nums">{r.principal.toFixed(2)}</td>
                            <td className="py-1.5 text-right text-rose-500 tabular-nums">{r.interest.toFixed(2)}</td>
                            <td className="py-1.5 text-right font-extrabold text-amber-600 tabular-nums">{r.total.toFixed(2)}</td>
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
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                  <p className="text-xs text-slate-400">Hotline: <a href="tel:0937587438" className="font-bold text-amber-600">0937.587.438</a></p>
                  <button onClick={()=>setShowModal(false)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase transition-all cursor-pointer shadow-md">Đóng</button>
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

import React, { useEffect, useState } from "react";
import { News } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsViewProps {
  onNavigate: (hash: string) => void;
}

const CATEGORIES = ["Tất cả", "Tin tức dự án", "Chính sách", "Đánh giá dự án", "So sánh & Tư vấn", "Hỏi đáp / FAQ"];

const PROJECTS = [
  { key: "tat-ca",   label: "Tất cả" },
  { key: "cityview", label: "CityView" },
  { key: "avenue",   label: "Avenue" },
  { key: "midtown",  label: "Midtown" },
];

const PROJECT_ACCENT: Record<string, string> = {
  cityview: "#d97706",
  avenue:   "#059669",
  midtown:  "#0284c7",
  chung:    "#7c3aed",
};

const PAGE_SIZE = 10;

export default function NewsView({ onNavigate }: NewsViewProps) {
  const [news, setNews]               = useState<News[]>([]);
  const [filtered, setFiltered]       = useState<News[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("Tất cả");
  const [project, setProject]         = useState("tat-ca");
  const [page, setPage]               = useState(1);

  useEffect(() => {
    document.title = "Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai | Cập Nhật Mới Nhất";
    fetch("/api/news?v=" + Date.now())
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        // Dedup by slug to prevent duplicates
        const seen = new Set<string>();
        const unique = list.filter(n => {
          if (seen.has(n.slug)) return false;
          seen.add(n.slug);
          return true;
        });
        setNews(unique);
        setFiltered(unique);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = [...news];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q));
    }
    if (category !== "Tất cả") r = r.filter(n => n.category === category);
    if (project  !== "tat-ca")  r = r.filter(n => (n.project ?? "chung") === project);
    setFiltered(r);
    setPage(1); // reset về trang 1 khi filter thay đổi
  }, [search, category, project, news]);

  const countFor = (key: string) =>
    key === "tat-ca" ? news.length : news.filter(n => (n.project ?? "chung") === key).length;

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart   = (page - 1) * PAGE_SIZE;
  const pageItems   = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const featured    = pageItems[0] ?? null;
  const rest        = pageItems.slice(1);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero header ─────────────────────────────────────────── */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
            K-Home · Tin tức & Thị trường
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-950 leading-tight max-w-2xl">
            Cập nhật mới nhất về dự án K-Home Đồng Nai
          </h1>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Row 1 — Project tabs */}
          <div className="flex items-center gap-0 border-b border-slate-100 overflow-x-auto scrollbar-hide">
            <span className="flex-shrink-0 text-[11px] font-semibold text-slate-400 uppercase tracking-widest pr-4 border-r border-slate-100 mr-2 py-3.5 whitespace-nowrap">
              Dự án
            </span>
            {PROJECTS.map(p => {
              const active = project === p.key;
              const count  = countFor(p.key);
              return (
                <button
                  key={p.key}
                  onClick={() => setProject(p.key)}
                  className={`relative flex-shrink-0 px-5 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap ${
                    active ? "text-amber-600" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {p.label}
                  {count > 0 && (
                    <span className={`ml-1.5 text-[10px] font-semibold ${active ? "text-amber-500" : "text-slate-300"}`}>
                      {count}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Spacer + Search */}
            <div className="ml-auto flex-shrink-0 py-2 pl-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-44 md:w-56 px-3.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-amber-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2 — Category pills */}
          <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 px-3.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  category === c
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                {c}
              </button>
            ))}

            {/* Clear */}
            {(project !== "tat-ca" || category !== "Tất cả" || search) && (
              <button
                onClick={() => { setProject("tat-ca"); setCategory("Tất cả"); setSearch(""); }}
                className="flex-shrink-0 ml-auto text-[11px] font-semibold text-amber-600 hover:underline cursor-pointer whitespace-nowrap"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-64" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-4xl font-bold text-slate-100 mb-4">0</p>
            <p className="text-slate-400 text-sm">Không tìm thấy bài viết phù hợp.</p>
            <button
              onClick={() => { setProject("tat-ca"); setCategory("Tất cả"); setSearch(""); }}
              className="mt-6 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="space-y-14">

            {/* ── Featured (first article) ── */}
            {featured && (
              <div
                onClick={() => onNavigate(`/tin-tuc/${featured.slug}`)}
                className="group cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-72 md:h-auto overflow-hidden bg-slate-200">
                  <img
                    src={featured.image.includes("cloudinary")
                      ? featured.image.replace("/upload/", "/upload/w_800,q_auto:good,f_auto/")
                      : featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                    fetchPriority="high"
                    width="800"
                    height="288"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/10" />
                  {featured.project && featured.project !== "chung" && (
                    <span
                      className="absolute top-5 left-5 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                      style={{ backgroundColor: PROJECT_ACCENT[featured.project] ?? "#d97706" }}
                    >
                      {featured.project === "cityview" ? "CityView" : featured.project === "avenue" ? "Avenue" : "Midtown"}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="bg-white p-8 md:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
                        {featured.category}
                      </span>
                      <span className="text-xs text-slate-400">{featured.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-950 leading-tight group-hover:text-amber-700 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                    Đọc bài viết
                    <span className="w-5 h-0.5 bg-amber-600 group-hover:w-8 transition-all duration-300 inline-block" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Rest: 3-column grid ── */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(article => {
                  const accent = article.project ? (PROJECT_ACCENT[article.project] ?? "#94a3b8") : "#94a3b8";
                  return (
                    <div
                      key={article.id}
                      onClick={() => onNavigate(`/tin-tuc/${article.slug}`)}
                      className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-amber-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={article.image.includes("cloudinary")
                            ? article.image.replace("/upload/", "/upload/w_400,q_auto:good,f_auto/")
                            : article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          width="400"
                          height="208"
                        />
                        {/* Category pill */}
                        <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {article.category}
                        </span>
                        {/* Project dot */}
                        {article.project && article.project !== "chung" && (
                          <span
                            className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ backgroundColor: accent }}
                          >
                            {article.project === "cityview" ? "CityView" : article.project === "avenue" ? "Avenue" : "Midtown"}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-400 font-medium">{article.date}</p>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Accent line CTA */}
                        <div className="flex items-center gap-2">
                          <span
                            className="h-0.5 w-4 group-hover:w-7 transition-all duration-300 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                            Đọc tiếp
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
                {/* Prev */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                  // Hiển thị: trang đầu, cuối, xung quanh trang hiện tại, dấu ...
                  const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                  const isEllipsisBefore = p === 2 && page > 4;
                  const isEllipsisAfter  = p === totalPages - 1 && page < totalPages - 3;
                  if (!show && !isEllipsisBefore && !isEllipsisAfter) return null;
                  if (isEllipsisBefore || isEllipsisAfter) {
                    return (
                      <span key={p} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-medium">
                        …
                      </span>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        p === page
                          ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                          : "border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

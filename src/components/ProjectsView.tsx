import React, { useEffect, useState, useMemo } from "react";
import { Search, MapPin, SlidersHorizontal, BedDouble, Bath, Sofa, ChevronRight } from "lucide-react";
import { Project, UnitType } from "../types";
import { imgUrl } from "../utils/imageUrl";

interface ProjectsViewProps {
  onNavigate: (hash: string) => void;
  initialProject?: string;
  initialBedrooms?: string;
}

interface UnitCardData {
  project: Project;
  unit: UnitType;
}

const BEDROOM_FILTERS = [
  { label: "Tất cả", value: "all" as const },
  { label: "Studio", value: 0 as const },
  { label: "1 Phòng ngủ", value: 1 as const },
  { label: "2 Phòng ngủ", value: 2 as const },
  { label: "3 Phòng ngủ", value: 3 as const },
];

const PROJECT_COLORS: Record<string, string> = {
  "k-home-cityview-ho-nai":   "#7c3aed",
  "k-home-midtown-trang-bom": "#0891b2",
  "k-home-avenue-nhon-trach": "#b45309",
};

const STATUS_COLORS: Record<string, string> = {
  "Đang mở bán":   "#059669",
  "Đang bốc thăm": "#f59e0b",
  "Đã công bố":    "#059669",
  "Đang thi công": "#2563eb",
  "Sắp mở bán":    "#2563eb",
  "Sắp công bố":   "#f59e0b",
};

export default function ProjectsView({ onNavigate, initialProject = "all", initialBedrooms = "all" }: ProjectsViewProps) {
  const [allUnits, setAllUnits] = useState<UnitCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | "all">(
    initialBedrooms === "studio" ? 0 :
    initialBedrooms === "1pn" ? 1 :
    initialBedrooms === "2pn" ? 2 :
    initialBedrooms === "3pn" ? 3 : "all"
  );
  const [selectedProject, setSelectedProject]   = useState(initialProject);
  const [selectedSort, setSelectedSort]         = useState("default");
  const [openFilter, setOpenFilter]             = useState<"project" | "sort" | null>(null);

  useEffect(() => {
    document.title = "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 3 Dự Án NOXH Kim Oanh";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Xem chi tiết từng loại căn hộ của 3 dự án K-Home tại Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch. Bảng giá, diện tích và hình ảnh thực tế từng loại căn.");
    }

    // Stale-while-revalidate: hiện cache ngay, fetch mới ngầm
    const CACHE_KEY = "khome_projects_v2";
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const list: Project[] = JSON.parse(cached);
        const units: UnitCardData[] = [];
        list.forEach((project) => {
          (project.unitTypes || []).forEach((unit) => units.push({ project, unit }));
        });
        setAllUnits(units);
        setLoading(false);
        // Preload ảnh 6 card đầu ngay khi có cache
        units.slice(0, 6).forEach(({ unit }) => {
          if (unit.images[0]) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = unit.images[0].split("/").map(s => s.replace(/ /g, "%20")).join("/");
            document.head.appendChild(link);
          }
        });
      } catch {}
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const list = Array.isArray(data) ? data : [];
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        const units: UnitCardData[] = [];
        list.forEach((project) => {
          (project.unitTypes || []).forEach((unit) => units.push({ project, unit }));
        });
        setAllUnits(units);
        setLoading(false);
        // Preload ảnh 6 card đầu
        units.slice(0, 6).forEach(({ unit }) => {
          if (unit.images[0]) {
            const img = new Image();
            img.src = unit.images[0].split("/").map((s: string) => s.replace(/ /g, "%20")).join("/");
          }
        });
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  const projects = useMemo(() => {
    const seen = new Set<string>();
    return allUnits
      .map((u) => u.project)
      .filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
  }, [allUnits]);

  const filteredUnits = useMemo(() => {
    let result = [...allUnits];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        ({ project, unit }) =>
          project.title.toLowerCase().includes(q) ||
          project.location.toLowerCase().includes(q) ||
          unit.name.toLowerCase().includes(q)
      );
    }

    if (selectedBedrooms !== "all") {
      result = result.filter(({ unit }) => unit.bedrooms === selectedBedrooms);
    }

    if (selectedProject !== "all") {
      result = result.filter(({ project }) => project.slug === selectedProject);
    }

    if (selectedSort === "price-asc") {
      result.sort((a, b) => a.unit.priceNumber - b.unit.priceNumber);
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => b.unit.priceNumber - a.unit.priceNumber);
    } else if (selectedSort === "area-asc") {
      result.sort((a, b) =>
        parseFloat(a.unit.constructionArea) - parseFloat(b.unit.constructionArea)
      );
    } else if (selectedSort === "area-desc") {
      result.sort((a, b) =>
        parseFloat(b.unit.constructionArea) - parseFloat(a.unit.constructionArea)
      );
    }

    return result;
  }, [allUnits, searchQuery, selectedBedrooms, selectedProject, selectedSort]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBedrooms("all");
    setSelectedProject("all");
    setSelectedSort("default");
  };

  const isFiltered =
    searchQuery !== "" ||
    selectedBedrooms !== "all" ||
    selectedProject !== "all" ||
    selectedSort !== "default";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-8 space-y-3">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">K-Home Đồng Nai</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
          Danh Sách Loại Căn Hộ
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          Xem chi tiết từng loại căn của 3 dự án K-Home tại Đồng Nai — diện tích thực tế, bảng giá và hình ảnh riêng cho từng loại.
        </p>
      </div>

      {/* 2. Filter Panel */}
      <div className="bg-white border border-slate-100 p-4 sm:p-6 rounded-2xl shadow-sm space-y-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo tên căn, dự án, vị trí..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
          />
        </div>

        {/* Dự án + Sắp xếp — 2 cột trên mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
          {/* Custom dropdown: Dự án */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenFilter(openFilter === "project" ? null : "project")}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all cursor-pointer ${
                selectedProject !== "all"
                  ? "bg-amber-50 border-amber-400 text-amber-700 font-semibold"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300"
              }`}
            >
              <span className="truncate">
                {selectedProject === "all" ? "Tất cả dự án"
                  : projects.find(p => p.slug === selectedProject)?.title ?? "Dự án"}
              </span>
              <svg className={`w-4 h-4 shrink-0 transition-transform ${openFilter === "project" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {openFilter === "project" && (
              <div className="absolute top-full left-0 mt-2 w-[min(16rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                {[{ id: "all", slug: "all", title: "Tất cả dự án" }, ...projects].map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => { setSelectedProject(p.slug); setOpenFilter(null); }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all ${
                      selectedProject === p.slug
                        ? "bg-amber-500 text-white font-semibold"
                        : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                    }`}
                  >
                    {selectedProject === p.slug
                      ? <span className="w-5 h-5 rounded-md bg-white/30 border-2 border-white flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                      : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                    }
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom dropdown: Sắp xếp */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenFilter(openFilter === "sort" ? null : "sort")}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all cursor-pointer ${
                selectedSort !== "default"
                  ? "bg-amber-50 border-amber-400 text-amber-700 font-semibold"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300"
              }`}
            >
              <span className="truncate">
                {selectedSort === "default" ? "Sắp xếp"
                  : selectedSort === "price-asc" ? "Giá: Thấp → Cao"
                  : selectedSort === "price-desc" ? "Giá: Cao → Thấp"
                  : selectedSort === "area-asc" ? "DT: Nhỏ → Lớn"
                  : "DT: Lớn → Nhỏ"}
              </span>
              <svg className={`w-4 h-4 shrink-0 transition-transform ${openFilter === "sort" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {openFilter === "sort" && (
              <div className="absolute top-full right-0 mt-2 w-[min(13rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                {[
                  { value: "default", label: "Sắp xếp mặc định" },
                  { value: "price-asc", label: "Giá: Thấp → Cao" },
                  { value: "price-desc", label: "Giá: Cao → Thấp" },
                  { value: "area-asc", label: "Diện tích: Nhỏ → Lớn" },
                  { value: "area-desc", label: "Diện tích: Lớn → Nhỏ" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setSelectedSort(opt.value); setOpenFilter(null); }}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all ${
                      selectedSort === opt.value
                        ? "bg-amber-500 text-white font-semibold"
                        : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                    }`}
                  >
                    {selectedSort === opt.value
                      ? <span className="w-5 h-5 rounded-md bg-white/30 border-2 border-white flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                      : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                    }
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bedroom chips — scroll ngang trên mobile */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0">
            <BedDouble className="w-3.5 h-3.5" /> Loại căn:
          </span>
          <div className="flex gap-2 flex-nowrap">
            {BEDROOM_FILTERS.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setSelectedBedrooms(value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  selectedBedrooms === value
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="ml-auto shrink-0 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all cursor-pointer whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Click outside to close */}
        {openFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenFilter(null)} />
        )}
      </div>

      {/* 3. Result count */}
      {!loading && (
        <div className="text-sm text-slate-500">
          Hiển thị <span className="font-bold text-slate-800">{filteredUnits.length}</span> loại căn
          {isFiltered && " (đang lọc)"}
        </div>
      )}

      {/* 4. Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-52 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="flex gap-3">
                  <div className="flex-1 h-12 bg-slate-100 rounded-lg" />
                  <div className="flex-1 h-12 bg-slate-100 rounded-lg" />
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <div className="h-5 bg-amber-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUnits.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Không tìm thấy loại căn phù hợp</h3>
          <p className="text-slate-400 text-sm mt-1">Thử điều chỉnh bộ lọc để xem thêm kết quả.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map(({ project, unit }, index) => (
            <div
              key={`${project.id}-${unit.slug}`}
              onClick={() => onNavigate(`/${project.slug}/${unit.slug}`)}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-slate-200">
                <img
                  src={imgUrl(unit.images[0])}
                  alt={`${unit.name} tại ${project.title} - Căn hộ nhà ở xã hội ${project.location.split(",").slice(-2).join(", ")}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 3 ? "high" : "auto"}
                  style={{ backgroundColor: "#e2e8f0" }}
                />
                {/* Project badge top-left */}
                <div
                  className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow"
                  style={{ backgroundColor: PROJECT_COLORS[project.slug] ?? "#475569" }}
                >
                  {project.title.replace("K-Home ", "")}
                </div>
                {/* Status badge top-right */}
                <div
                  className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow"
                  style={{ backgroundColor: STATUS_COLORS[project.status] ?? "#475569" }}
                >
                  {project.status}
                </div>
                {/* Bedroom + bathroom badges bottom */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <BedDouble className="w-3 h-3" />
                    {unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} PN`}
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    {unit.bathrooms} NVS
                  </div>
                </div>
                {/* Furnished badge bottom-right */}
                {unit.furnished && (
                  <div className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sofa className="w-3 h-3" /> Full Nội Thất
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{project.location}</span>
                  </p>
                </div>

                {/* Area specs */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">DT xây dựng</span>
                    <span className="text-sm font-bold text-slate-700">{unit.constructionArea}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-center border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">DT sử dụng</span>
                    <span className="text-sm font-bold text-slate-700">{unit.usableArea}</span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá bán</span>
                    <span className="text-base font-bold text-amber-600">{unit.price}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                    Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

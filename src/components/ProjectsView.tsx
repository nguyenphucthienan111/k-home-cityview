import React, { useEffect, useState, useMemo } from "react";
import { Search, MapPin, SlidersHorizontal, BedDouble, Bath, Sofa, ChevronRight } from "lucide-react";
import { Project, UnitType } from "../types";

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

  useEffect(() => {
    document.title = "Danh Sách Căn Hộ K-Home Đồng Nai | Bảng Giá Chi Tiết Từng Loại Căn";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Xem chi tiết từng loại căn hộ của 3 dự án K-Home tại Đồng Nai: CityView Biên Hòa, Midtown Trảng Bom, Avenue Nhơn Trạch. Bảng giá, diện tích và hình ảnh thực tế từng loại căn.");
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const units: UnitCardData[] = [];
        data.forEach((project) => {
          (project.unitTypes || []).forEach((unit) => {
            units.push({ project, unit });
          });
        });
        setAllUnits(units);
        setLoading(false);
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
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">

        {/* Row 1: Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo tên căn, dự án, vị trí..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
            />
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-sm outline-none appearance-none cursor-pointer min-w-52"
          >
            <option value="all">Tất cả dự án</option>
            {projects.map((p) => (
              <option key={p.id} value={p.slug}>{p.title}</option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-sm outline-none appearance-none cursor-pointer min-w-44"
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
            <option value="area-asc">Diện tích: Nhỏ → Lớn</option>
            <option value="area-desc">Diện tích: Lớn → Nhỏ</option>
          </select>
        </div>

        {/* Row 2: Bedroom filter chips */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <BedDouble className="w-3.5 h-3.5" /> Loại căn:
          </span>
          {BEDROOM_FILTERS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setSelectedBedrooms(value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedBedrooms === value
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-amber-600"
              }`}
            >
              {label}
            </button>
          ))}

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
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
            <div key={n} className="bg-white rounded-2xl h-[360px] animate-pulse border border-slate-200" />
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
          {filteredUnits.map(({ project, unit }) => (
            <div
              key={`${project.id}-${unit.slug}`}
              onClick={() => onNavigate(`/projects/${project.slug}/${unit.slug}`)}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={unit.images[0]}
                  alt={unit.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

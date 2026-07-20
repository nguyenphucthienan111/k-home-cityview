import React, { useEffect, useState } from "react";
import { Search, MapPin, Grid, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Project } from "../types";

interface ProjectsViewProps {
  onNavigate: (hash: string) => void;
}

export default function ProjectsView({ onNavigate }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Tất cả");
  const [selectedBudget, setSelectedBudget] = useState("Tất cả");
  const [selectedSort, setSelectedSort] = useState("default");

  useEffect(() => {
    document.title = "Danh Sách Dự Án K-Home Cityview | Bảng Giá & Giỏ Hàng Mới Nhất";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Khám phá danh sách các dự án căn hộ, biệt thự, penthouse và shophouse từ chủ đầu tư Kim Oanh Group. Cập nhật bảng giá bán đợt 1, thiết kế mặt bằng chi tiết của K-Home Cityview.");
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects list:", err);
        setLoading(false);
      });
  }, []);

  // Handle Filtering and Sorting
  useEffect(() => {
    let result = [...projects];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Property Type filter
    if (selectedType !== "Tất cả") {
      result = result.filter((p) => p.type === selectedType);
    }

    // Budget filter based on priceNumber
    if (selectedBudget !== "Tất cả") {
      if (selectedBudget === "under-5") {
        result = result.filter((p) => p.priceNumber < 5);
      } else if (selectedBudget === "5-15") {
        result = result.filter((p) => p.priceNumber >= 5 && p.priceNumber <= 15);
      } else if (selectedBudget === "over-15") {
        result = result.filter((p) => p.priceNumber > 15);
      }
    }

    // Sorting
    if (selectedSort === "price-asc") {
      result.sort((a, b) => a.priceNumber - b.priceNumber);
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => b.priceNumber - a.priceNumber);
    } else if (selectedSort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedType, selectedBudget, selectedSort, projects]);

  const propertyTypes = ["Tất cả", "Căn hộ chung cư", "Biệt thự nghỉ dưỡng", "Căn hộ Penthouse", "Nhà phố thương mại"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-8 space-y-3">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">K-Home Portfolio</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
          Danh Sách Dự Án Bất Động Sản
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          Khám phá bộ sưu tập các dự án chung cư cao cấp, biệt thự biển, và shophouse thương mại hàng đầu được quy hoạch đồng bộ, hiện đại bởi K-Home Group.
        </p>
      </div>

      {/* 2. Filter & Controls Panel */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Box */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm dự án theo tên, vị trí, tiện ích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
            />
          </div>

          {/* Budget Filter */}
          <div className="relative">
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Tất cả">Khoảng giá (Tất cả)</option>
              <option value="under-5">Dưới 5 Tỷ VNĐ</option>
              <option value="5-15">Từ 5 Tỷ - 15 Tỷ VNĐ</option>
              <option value="over-15">Trên 15 Tỷ VNĐ</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="default">Sắp xếp mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Property Type Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                selectedType === type
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/10"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-amber-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Projects Grid Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-[420px] animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Không tìm thấy dự án</h3>
          <p className="text-slate-400 text-sm mt-1">Vui lòng điều chỉnh hoặc xóa bộ lọc để tìm kiếm lại.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("Tất cả");
              setSelectedBudget("Tất cả");
              setSelectedSort("default");
            }}
            className="mt-4 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onNavigate(`#projects/${project.slug}`)}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {project.type}
                </div>
                <div className="absolute bottom-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  {project.status}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm mt-auto">
                  <div className="text-slate-400 text-xs">
                    Diện tích: <span className="font-semibold text-slate-700 block text-sm mt-0.5">{project.area}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Giá bán:</span>
                    <span className="block text-base font-bold text-amber-600 mt-0.5">{project.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

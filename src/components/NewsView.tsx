import React, { useEffect, useState } from "react";
import { Search, Calendar, ChevronRight, SlidersHorizontal } from "lucide-react";
import { News } from "../types";

interface NewsViewProps {
  onNavigate: (hash: string) => void;
}

export default function NewsView({ onNavigate }: NewsViewProps) {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    document.title = "Tin Tức & Tiến Độ Mới Nhất | Dự Án K-Home Cityview";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Cập nhật các thông tin tin tức mới nhất, tiến độ xây dựng hạ tầng, lễ ký kết, bàn giao căn hộ và sự kiện mở bán dự án K-Home Cityview Biên Hòa.");
    }

    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setFilteredNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news list:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...news];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "Tất cả") {
      result = result.filter((n) => n.category === selectedCategory);
    }

    setFilteredNews(result);
  }, [searchQuery, selectedCategory, news]);

  const categories = ["Tất cả", "Tin tức dự án", "Thị trường", "Tài chính"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-8 space-y-3">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase font-tech">K-Home News & Media</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
          Tin Tức & Sự Kiện Thị Trường
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          Cập nhật thông tin nhanh nhất về tiến độ thi công các dự án, xu hướng thiết kế nội thất, biến động lãi suất và nhận định thị trường từ các chuyên gia hàng đầu.
        </p>
      </div>

      {/* Filters Area */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories Tab list */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/10"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-amber-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-xs outline-none transition-all"
          />
        </div>
      </div>

      {/* News list result */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-[300px] animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">Không tìm thấy bài viết</h3>
          <p className="text-slate-400 text-sm mt-1">Hãy thử tìm kiếm với các từ khóa khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate(`/news/${article.slug}`)}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row cursor-pointer"
            >
              <div className="relative w-full md:w-56 h-48 md:h-auto overflow-hidden shrink-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-amber-400 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-tech">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <span className="text-amber-600 font-bold text-xs tracking-wide flex items-center gap-1 group-hover:text-amber-700 transition-colors">
                  ĐỌC BÀI VIẾT <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

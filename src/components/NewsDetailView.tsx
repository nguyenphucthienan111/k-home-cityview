import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, User, Eye, Bookmark, Share2 } from "lucide-react";
import { News } from "../types";

interface NewsDetailViewProps {
  slug: string;
  onNavigate: (hash: string) => void;
}

export default function NewsDetailView({ slug, onNavigate }: NewsDetailViewProps) {
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/news")
      .then((res) => res.json())
      .then((data: News[]) => {
        const found = data.find((n) => n.slug === slug);
        setArticle(found || null);
        if (found) {
          document.title = `${found.title} | K-Home Cityview`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", `${found.excerpt} Cập nhật tin tức và tiến độ dự án K-Home Cityview Biên Hòa mới nhất.`);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news detail:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy bài viết</h2>
        <p className="text-slate-500 text-sm">Bài viết bạn yêu cầu không khả dụng hoặc đã bị gỡ bỏ.</p>
        <button
          onClick={() => onNavigate("/news")}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Quay lại tin tức
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/news")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại trang tin tức
      </button>

      {/* Article Header info */}
      <div className="space-y-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600 font-tech">
          <span>{article.category}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.date}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-slate-950 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
              K
            </div>
            <div>
              <span className="font-semibold block text-slate-700">Ban biên tập K-Home</span>
              <span className="text-slate-400 block">Thời gian đọc: 4 phút</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors" title="Lưu bài viết">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors" title="Chia sẻ">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Area */}
      <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm space-y-6">
        <p className="font-semibold text-slate-900 text-base border-l-4 border-amber-600 pl-4 py-1 bg-slate-50/50 rounded-r-lg">
          {article.excerpt}
        </p>

        {/* Display paragraphs from rich formatted text */}
        {article.content.split("\n\n").map((para, idx) => (
          <p key={idx} className="whitespace-pre-line text-slate-650">
            {para}
          </p>
        ))}
      </article>

      {/* Sidebar Consultation Call to Action inside page */}
      <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 mt-16 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-display font-semibold text-slate-800">
            Cơ hội đầu tư đón đầu chính sách mới
          </h3>
          <p className="text-slate-500 text-xs max-w-lg">
            Đừng bỏ lỡ rổ hàng chuyển nhượng và hàng chủ đầu tư đợt cuối với chính sách cam kết thuê lại sinh lời cực kỳ an toàn.
          </p>
        </div>
        <button
          onClick={() => onNavigate("/contact")}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md shadow-amber-600/10 transition-colors shrink-0 cursor-pointer"
        >
          Nhận Tư Vấn Đầu Tư
        </button>
      </div>

    </div>
  );
}

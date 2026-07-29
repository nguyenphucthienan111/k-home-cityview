import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Bookmark, Share2, ChevronRight } from "lucide-react";
import { News } from "../types";

interface NewsDetailViewProps {
  slug: string;
  onNavigate: (hash: string) => void;
}

export default function NewsDetailView({ slug, onNavigate }: NewsDetailViewProps) {
  const [article, setArticle] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryIndexes, setGalleryIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    setLoading(true);
    fetch("/api/news")
      .then((res) => res.json())
      .then((data: News[]) => {
        const list = Array.isArray(data) ? data : [];
        setAllNews(list);
        const found = list.find((n) => n.slug === slug);
        setArticle(found || null);
        if (found) {
          document.title = `${found.title} | K-Home`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", found.excerpt);
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
          onClick={() => onNavigate("/tin-tuc")}
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
        onClick={() => onNavigate("/tin-tuc")}
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
          alt={`${article.title} – K-Home Đồng Nai`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Area */}
      <article className="max-w-none text-slate-700 leading-relaxed space-y-0">
        <p className="font-semibold text-slate-900 text-base border-l-4 border-amber-600 pl-4 py-2 bg-amber-50/60 rounded-r-xl mb-8">
          {article.excerpt}
        </p>

        {(() => {
          const lines = article.content.split("\n").filter(l => !l.startsWith("---RELATED---"));
          const elements: React.ReactNode[] = [];
          let i = 0;

          while (i < lines.length) {
            const line = lines[i];

            // Gallery carousel: ---GALLERY--- url1 | url2 | url3 | caption
            if (line.startsWith("---GALLERY---")) {
              const parts = line.replace("---GALLERY---", "").trim().split("|").map(s => s.trim());
              const caption = parts[parts.length - 1].includes("://") ? "" : parts.pop() || "";
              const urls = parts;
              const gKey = `gallery-${i}`;
              const activeIdx = galleryIndexes[gKey] ?? 0;
              elements.push(
                <figure key={gKey} className="my-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900" style={{ aspectRatio: "auto" }}>
                    {/* All images stacked — crossfade */}
                    {urls.map((url, di) => (
                      <img
                        key={url}
                        src={url}
                        alt={caption || `Ảnh ${di + 1}`}
                        className="w-full block"
                        style={{
                          position: di === activeIdx ? "relative" : "absolute",
                          inset: 0,
                          opacity: di === activeIdx ? 1 : 0,
                          transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
                          zIndex: di === activeIdx ? 1 : 0,
                          height: di === activeIdx ? "auto" : "100%",
                          objectFit: di === activeIdx ? "contain" : "cover",
                        }}
                      />
                    ))}

                    {/* Gradient overlays for buttons */}
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />

                    {/* Prev / Next */}
                    {urls.length > 1 && (
                      <>
                        <button
                          onClick={() => setGalleryIndexes(p => ({ ...p, [gKey]: (activeIdx - 1 + urls.length) % urls.length }))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button
                          onClick={() => setGalleryIndexes(p => ({ ...p, [gKey]: (activeIdx + 1) % urls.length }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </>
                    )}

                    {/* Counter pill */}
                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {activeIdx + 1} / {urls.length}
                    </div>

                    {/* Dots */}
                    {urls.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {urls.map((_, di) => (
                          <button
                            key={di}
                            onClick={() => setGalleryIndexes(p => ({ ...p, [gKey]: di }))}
                            className="cursor-pointer transition-all duration-300"
                            style={{
                              width: di === activeIdx ? "24px" : "8px",
                              height: "8px",
                              borderRadius: "999px",
                              backgroundColor: di === activeIdx ? "white" : "rgba(255,255,255,0.5)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {caption && (
                    <figcaption className="text-center text-xs text-slate-400 mt-3 italic">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
              i++; continue;
            }

            // Image: ![alt](url)
            const imgMatch = line.match(/^!\[(.+?)\]\((.+?)\)$/);
            if (imgMatch) {
              elements.push(
                <figure key={i} className="my-6">
                  <img
                    src={imgMatch[2]}
                    alt={imgMatch[1]}
                    className="w-full rounded-2xl shadow-md"
                    style={{ display: "block", height: "auto" }}
                  />
                  <figcaption className="text-center text-xs text-slate-400 mt-2 italic">{imgMatch[1]}</figcaption>
                </figure>
              );
              i++; continue;
            }

            // H2
            if (line.startsWith("## ")) {
              elements.push(
                <h2 key={i} className="text-xl font-bold text-slate-900 mt-10 mb-3 pb-2 border-b-2 border-amber-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full inline-block shrink-0" />
                  {line.slice(3)}
                </h2>
              );
              i++; continue;
            }

            // Table: collect all table rows
            if (line.startsWith("|") && line.includes("|", 1)) {
              const tableLines: string[] = [];
              while (i < lines.length && lines[i].startsWith("|")) {
                tableLines.push(lines[i]);
                i++;
              }
              // Filter out separator rows (|---|)
              const dataRows = tableLines.filter(l => !l.replace(/[\s|:-]/g, ""));
              const allRows = tableLines.filter(l => !/^\|[\s|:-]+\|$/.test(l));
              const parseCells = (l: string) => l.split("|").map(c => c.trim()).filter(Boolean);

              if (allRows.length > 0) {
                const headerCells = parseCells(allRows[0]);
                const bodyRows = allRows.slice(1);
                elements.push(
                  <div key={i} className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-amber-500 text-white">
                          {headerCells.map((cell, ci) => (
                            <th key={ci} className="px-5 py-3 text-left font-bold tracking-wide">{cell}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bodyRows.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-amber-50/40"}>
                            {parseCells(row).map((cell, ci) => (
                              <td key={ci} className="px-5 py-3 text-slate-700 border-b border-slate-100">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              continue;
            }

            // Bullet list — collect consecutive items
            if (line.startsWith("- ")) {
              const items: string[] = [];
              while (i < lines.length && lines[i].startsWith("- ")) {
                items.push(lines[i].slice(2));
                i++;
              }
              elements.push(
                <ul key={i} className="my-3 space-y-2">
                  {items.map((item, ii) => {
                    const html = item.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900">$1</strong>');
                    return (
                      <li key={ii} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span dangerouslySetInnerHTML={{ __html: html }} />
                      </li>
                    );
                  })}
                </ul>
              );
              continue;
            }

            // Empty line
            if (line.trim() === "") {
              elements.push(<div key={i} className="h-2" />);
              i++; continue;
            }

            // Normal paragraph with **bold** support
            const html = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
            elements.push(
              <p key={i} className="text-sm text-slate-700 leading-7 mb-1"
                dangerouslySetInnerHTML={{ __html: html }} />
            );
            i++;
          }

          return elements;
        })()}
      </article>

      {/* Related Articles */}
      {(() => {
        // Parse ---RELATED--- marker từ content
        const relatedMarker = "---RELATED---";
        const relatedLine = article.content.split("\n").find(l => l.startsWith(relatedMarker));
        
        // Lấy bài liên quan: từ marker hoặc tự động (cùng category, khác slug)
        let relatedSlugs: { slug: string; label: string }[] = [];
        if (relatedLine) {
          relatedSlugs = relatedLine.replace(relatedMarker, "").split(";").map(item => {
            const [s, l] = item.split("|");
            return { slug: s.trim(), label: l?.trim() || s.trim() };
          });
        }

        // Lấy bài tự động (cùng category, khác slug hiện tại)
        const autoRelated = allNews
          .filter(n => n.slug !== article.slug && (n.category === article.category || relatedSlugs.some(r => r.slug === n.slug)))
          .slice(0, 3);

        if (autoRelated.length === 0) return null;

        return (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {autoRelated.map((n) => (
                <div
                  key={n.id}
                  onClick={() => { onNavigate(`/news/${n.slug}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {n.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-400">{n.date}</p>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{n.excerpt}</p>
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold pt-1">
                      Đọc tiếp <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 mt-8 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-white">
            Bạn đủ điều kiện mua NOXH K-Home?
          </h3>
          <p className="text-amber-50 text-xs max-w-lg">
            Liên hệ ngay để được tư vấn miễn phí về hồ sơ, chính sách vay và tiến độ mở bán mới nhất từ Kim Oanh Land.
          </p>
          <p className="text-white font-bold text-sm">📞 0937.587.438</p>
        </div>
        <button
          onClick={() => onNavigate("/contact")}
          className="bg-white hover:bg-amber-50 text-amber-700 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-colors shrink-0 cursor-pointer"
        >
          Tư Vấn Miễn Phí
        </button>
      </div>

    </div>
  );
}

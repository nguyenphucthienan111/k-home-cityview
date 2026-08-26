import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Calendar, Bookmark, Share2, ChevronRight, X, ZoomIn, ChevronLeft } from "lucide-react";
import { News } from "../types";

interface NewsDetailViewProps {
  slug: string;
  onNavigate: (hash: string) => void;
}

// ─── Lightbox Component ────────────────────────────────────────────────────────
interface LightboxState {
  images: { src: string; alt: string }[];
  index: number;
}

function Lightbox({ state, onClose, onPrev, onNext }: {
  state: LightboxState;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { images, index } = state;
  const current = images[index];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.92)", zIndex: 99999 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[92vw] max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
          style={{ display: "block" }}
        />
        {current.alt && (
          <p className="text-white/70 text-xs text-center max-w-xl italic px-4">{current.alt}</p>
        )}
      </div>

      {/* Dot strip */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, di) => (
            <button
              key={di}
              onClick={(e) => { e.stopPropagation(); }}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: di === index ? "24px" : "8px",
                height: "8px",
                backgroundColor: di === index ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

export default function NewsDetailView({ slug, onNavigate }: NewsDetailViewProps) {
  const [article, setArticle] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryIndexes, setGalleryIndexes] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = useCallback((images: { src: string; alt: string }[], index: number) => {
    setLightbox({ images, index });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const prevLightbox = useCallback(() => {
    setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
  }, []);

  const nextLightbox = useCallback(() => {
    setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
  }, []);

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
          document.title = `${found.title} | Tin Tức NOXH K-Home Đồng Nai`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", found.excerpt);
          }

          // Schema NewsArticle — giúp Google hiểu đây là bài báo, tăng cơ hội rich results
          const existingSchema = document.getElementById("schema-news-article");
          if (existingSchema) existingSchema.remove();
          const articleSchema = document.createElement("script");
          articleSchema.id = "schema-news-article";
          articleSchema.type = "application/ld+json";
          articleSchema.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": found.title,
            "description": found.excerpt,
            "image": found.image
              ? [found.image]
              : ["https://k-homedongnai.com.vn/hero-background.jpg"],
            "datePublished": found.date,
            "dateModified": found.date,
            "author": {
              "@type": "Organization",
              "name": "K-Home Đồng Nai – Kim Oanh Land",
              "url": "https://k-homedongnai.com.vn"
            },
            "publisher": {
              "@type": "Organization",
              "name": "K-Home Đồng Nai",
              "logo": {
                "@type": "ImageObject",
                "url": "https://k-homedongnai.com.vn/android-chrome-512x512.png",
                "width": 512,
                "height": 512
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://k-homedongnai.com.vn/tin-tuc/${found.slug}`
            },
            "url": `https://k-homedongnai.com.vn/tin-tuc/${found.slug}`,
            "articleSection": found.category || "Tin tức dự án",
            "keywords": [
              "K-Home CityView",
              "k-home city view",
              "nhà ở xã hội Biên Hòa",
              "NOXH Đồng Nai",
              found.category || "Tin tức dự án"
            ],
            "inLanguage": "vi-VN",
            "isAccessibleForFree": true
          });
          document.head.appendChild(articleSchema);

          // BreadcrumbList cho bài tin tức
          const existingBc = document.getElementById("schema-breadcrumb-news");
          if (existingBc) existingBc.remove();
          const bc = document.createElement("script");
          bc.id = "schema-breadcrumb-news";
          bc.type = "application/ld+json";
          bc.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://k-homedongnai.com.vn/" },
              { "@type": "ListItem", "position": 2, "name": "Tin tức", "item": "https://k-homedongnai.com.vn/tin-tuc" },
              { "@type": "ListItem", "position": 3, "name": found.title, "item": `https://k-homedongnai.com.vn/tin-tuc/${found.slug}` }
            ]
          });
          document.head.appendChild(bc);

          // VideoObject Schema nếu bài tin tức chứa video
          const existingVideoSchema = document.getElementById("schema-video-news");
          if (existingVideoSchema) existingVideoSchema.remove();

          if (found.content && found.content.includes("---VIDEO---")) {
            const videoLine = found.content.split("\n").find(line => line.startsWith("---VIDEO---"));
            if (videoLine) {
              const parts = videoLine.replace("---VIDEO---", "").trim().split("|").map(s => s.trim());
              const rawVideoUrl = parts[0];
              const videoCaption = parts.length > 1 ? parts[1] : found.title;
              const posterUrl = rawVideoUrl.includes("cloudinary")
                ? rawVideoUrl.replace("/upload/", "/upload/so_0,w_1200,c_scale/") + ".jpg"
                : found.image || "https://k-homedongnai.com.vn/hero-background.jpg";

              const videoSchema = document.createElement("script");
              videoSchema.id = "schema-video-news";
              videoSchema.type = "application/ld+json";
              videoSchema.text = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "VideoObject",
                "name": videoCaption,
                "description": found.excerpt || videoCaption,
                "thumbnailUrl": [posterUrl],
                "uploadDate": found.date ? `${found.date}T08:00:00+07:00` : "2026-08-24T08:00:00+07:00",
                "contentUrl": rawVideoUrl,
                "embedUrl": `https://k-homedongnai.com.vn/tin-tuc/${found.slug}`,
                "publisher": {
                  "@type": "Organization",
                  "name": "K-Home Đồng Nai",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://k-homedongnai.com.vn/android-chrome-512x512.png"
                  }
                }
              });
              document.head.appendChild(videoSchema);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch news detail:", err);
        setLoading(false);
      });

    // Cleanup khi unmount hoặc slug thay đổi
    return () => {
      document.getElementById("schema-news-article")?.remove();
      document.getElementById("schema-breadcrumb-news")?.remove();
      document.getElementById("schema-video-news")?.remove();
    };
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
      
      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          state={lightbox}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
      
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
      <div
        className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-zoom-in group"
        onClick={() => openLightbox([{ src: article.image, alt: article.title }], 0)}
      >
        <img
          src={article.image.includes("cloudinary")
            ? article.image.replace("/upload/", "/upload/w_900,q_auto:good,f_auto/")
            : article.image}
          alt={`${article.title} – K-Home Đồng Nai`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="eager"
          fetchPriority="high"
          width="900"
          height="420"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <article
        className="max-w-none text-slate-700 leading-relaxed space-y-0"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === "A") {
            const href = target.getAttribute("href");
            if (href && href.startsWith("/") && !href.startsWith("//")) {
              e.preventDefault();
              onNavigate(href);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        }}
      >
        <p className="font-semibold text-slate-900 text-base border-l-4 border-amber-600 pl-4 py-2 bg-amber-50/60 rounded-r-xl mb-8">
          {article.excerpt}
        </p>

        {(() => {
          const lines = article.content.split("\n").filter(l => !l.startsWith("---RELATED---"));
          const elements: React.ReactNode[] = [];
          let i = 0;
          const articleId = article.id || "default";

          while (i < lines.length) {
            const line = lines[i];

            // Gallery carousel: ---GALLERY--- 
            // Format: url1|alt1 | url2|alt2 | url3|alt3 | [optional: caption]
            // Each URL can have its own alt text (alt text after |)
            // Last part without :// is treated as caption
            if (line.startsWith("---GALLERY---")) {
              const rawParts = line.replace("---GALLERY---", "").trim().split("|").map(s => s.trim());
              
              // Try to identify caption (last part that doesn't look like URL)
              let caption = "";
              let parts = [...rawParts];
              if (parts.length > 0 && !parts[parts.length - 1].includes("://")) {
                caption = parts.pop() || "";
              }
              
              // Parse URL + alt pairs: each item can be "url" or "url|alttext"
              const galleryItems = parts.map((item) => {
                const [url, ...altParts] = item.split("|").map(s => s.trim());
                const altText = altParts.join("|") || ""; // rejoin in case alt had pipes
                return { url, alt: altText || caption };
              });
              
              const urls = galleryItems.map(item => item.url);
              const gKey = `gallery-${articleId}-${i}`;
              const activeIdx = galleryIndexes[gKey] ?? 0;
              
              // Prep lightbox images with individual alt texts
              const galleryLightboxImages = galleryItems.map((item, di) => ({ 
                src: item.url, 
                alt: item.alt || `Ảnh ${di + 1}` 
              }));
              
              elements.push(
                <figure key={gKey} className="my-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900" style={{ aspectRatio: "auto" }}>
                    {/* All images stacked — crossfade */}
                    {galleryItems.map((item, di) => (
                      <img
                        key={item.url}
                        src={item.url}
                        alt={item.alt || `Ảnh ${di + 1}`}
                        className="w-full block cursor-zoom-in"
                        onClick={() => openLightbox(galleryLightboxImages, di)}
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

                    {/* Zoom hint */}
                    <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm text-white rounded-full p-1.5 pointer-events-none">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>

                    {/* Prev / Next */}
                    {galleryItems.length > 1 && (
                      <>
                        <button
                          onClick={() => setGalleryIndexes(p => ({ ...p, [gKey]: (activeIdx - 1 + galleryItems.length) % galleryItems.length }))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button
                          onClick={() => setGalleryIndexes(p => ({ ...p, [gKey]: (activeIdx + 1) % galleryItems.length }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                        </button>
                      </>
                    )}

                    {/* Counter pill */}
                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {activeIdx + 1} / {galleryItems.length}
                    </div>

                    {/* Dots */}
                    {galleryItems.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {galleryItems.map((_, di) => (
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

            // Video: ---VIDEO---url|caption
            if (line.startsWith("---VIDEO---")) {
              const parts = line.replace("---VIDEO---", "").trim().split("|").map(s => s.trim());
              const caption = parts.length > 1 ? parts[1] : "";
              const videoUrl = parts[0];
              elements.push(
                <figure key={`${articleId}-video-${i}`} className="my-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900" style={{ aspectRatio: "16/9" }}>
                    <video
                      src={videoUrl.includes("cloudinary") ? videoUrl.replace("/upload/", "/upload/w_1200,h_800,c_fill,q_auto,f_auto/") : videoUrl}
                      controls
                      preload="auto"
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                      poster={videoUrl.includes("cloudinary") ? videoUrl.replace("/upload/", "/upload/so_0,w_1200,c_scale/") + ".jpg" : undefined}
                    />
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

            // Project link center: ---PROJECT-CENTER---slug|label
            if (line.startsWith("---PROJECT-CENTER---")) {
              const [slug, label] = line.replace("---PROJECT-CENTER---", "").split("|");
              elements.push(
                <div key={`${articleId}-proj-center-${i}`} className="my-8 flex justify-center">
                  <a
                    href={`/${slug.trim()}`}
                    onClick={(e) => { e.preventDefault(); onNavigate(`/${slug.trim()}`); }}
                    className="cursor-pointer group inline-flex flex-col items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-5 rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 max-w-sm w-full text-center no-underline"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-100">Xem chi tiết dự án</span>
                    <span className="text-lg font-extrabold leading-tight">{label?.trim() || slug.trim()}</span>
                    <div className="flex items-center gap-2 text-xs text-amber-100 font-semibold">
                      <span>Giá · Tiện ích · Tiến độ</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </div>
              );
              i++; continue;
            }

            // Project link: ---PROJECT-LINK---slug|label
            if (line.startsWith("---PROJECT-LINK---")) {
              const [slug, label] = line.replace("---PROJECT-LINK---", "").split("|");
              elements.push(
                <a
                  key={`${articleId}-proj-link-${i}`}
                  href={`/${slug.trim()}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(`/${slug.trim()}`); }}
                  className="flex items-center justify-between px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 hover:border-amber-400 transition-all group mb-2 no-underline"
                >
                  <span className="text-sm font-bold text-amber-800 group-hover:text-amber-900">{label?.trim() || slug.trim()}</span>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </a>
              );
              i++; continue;
            }

            // Image: ![alt](url)
            const imgMatch = line.match(/^!\[(.+?)\]\((.+?)\)$/);
            if (imgMatch) {
              const imgAlt = imgMatch[1];
              const imgSrc = imgMatch[2];
              elements.push(
                <figure key={`${articleId}-img-${i}`} className="my-6">
                  <div
                    className="relative cursor-zoom-in group rounded-2xl overflow-hidden shadow-md"
                    onClick={() => openLightbox([{ src: imgSrc, alt: imgAlt }], 0)}
                  >
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                      className="w-full block group-hover:scale-[1.02] transition-transform duration-500"
                      style={{ height: "auto" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-2.5">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <figcaption className="text-center text-xs text-slate-400 mt-2 italic">{imgAlt}</figcaption>
                </figure>
              );
              i++; continue;
            }

            // H2
            if (line.startsWith("## ")) {
              elements.push(
                <h2 key={`${articleId}-h2-${i}`} className="text-xl font-bold text-slate-900 mt-10 mb-3 pb-2 border-b-2 border-amber-200 flex items-center gap-2">
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
                  <div key={`${articleId}-table-${i}`} className="my-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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
                <ul key={`${articleId}-list-${i}`} className="my-3 space-y-2">
                  {items.map((item, ii) => {
                    const html = item
                      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-medium">$1</a>');
                    return (
                      <li key={`${articleId}-item-${i}-${ii}`} className="flex items-start gap-2.5 text-sm text-slate-700">
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
              elements.push(<div key={`${articleId}-empty-${i}`} className="h-2" />);
              i++; continue;
            }

            // Normal paragraph with **bold** and [link](url) support
            const html = line
              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-medium">$1</a>');
            elements.push(
              <p key={`${articleId}-p-${i}`} className="text-sm text-slate-700 leading-7 mb-1"
                dangerouslySetInnerHTML={{ __html: html }} />
            );
            i++;
          }

          return elements;
        })()}
      </article>

      {/* Related Articles */}
      {(() => {
        // Guard clause: if article is null, return nothing
        if (!article) return null;
        
        // Parse ---RELATED--- marker từ content
        const relatedMarker = "---RELATED---";
        const relatedLine = article.content.split("\n").find(l => l.startsWith(relatedMarker));
        
        // Lấy bài liên quan: từ marker hoặc tự động (cùng category, khác slug)
        let relatedSlugs: { slug: string; label: string }[] = [];
        if (relatedLine) {
          relatedSlugs = relatedLine.replace(relatedMarker, "").split(";")
            .map(item => {
              const [s, l] = item.split("|");
              if (!s || !s.trim()) return null;
              return { slug: s.trim(), label: l?.trim() || s.trim() };
            })
            .filter((r): r is { slug: string; label: string } => r !== null);
        }

        // Lấy bài tự động (cùng category, khác slug hiện tại)
        if (!article) return null;
        
        const autoRelated = allNews
          .filter(n => n && n.slug !== article.slug && (n.category === article.category || relatedSlugs.some(r => r?.slug === n.slug)))
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
                <a
                  key={n.id}
                  href={`/tin-tuc/${n.slug}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(`/tin-tuc/${n.slug}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 no-underline block"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={n.image.includes("cloudinary")
                        ? n.image.replace("/upload/", "/upload/w_400,q_auto:good,f_auto/")
                        : n.image}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width="400"
                      height="160"
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
                </a>
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

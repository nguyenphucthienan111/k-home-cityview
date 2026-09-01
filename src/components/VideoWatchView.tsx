import React, { useEffect } from "react";
import { ArrowLeft, Play, Phone, CheckCircle2, Calendar } from "lucide-react";

interface VideoDetail {
  slug: string;
  title: string;
  videoUrl: string;
  youtubeId: string;
  date: string;
  description: string;
  project: string;
  projectSlug: string;
  projectName: string;
}

export const VIDEO_DATA: Record<string, VideoDetail> = {
  "phong-su-k-home-cityview-ho-nai": {
    slug: "phong-su-k-home-cityview-ho-nai",
    title: "Phóng Sự Toàn Cảnh Dự Án Nhà Ở Xã Hội K-Home CityView Hố Nai Biên Hòa — Kim Oanh Land",
    videoUrl: "https://www.youtube.com/embed/RJGULOh6Wrs",
    youtubeId: "RJGULOh6Wrs",
    date: "2026-08-26",
    description: "Xem video phóng sự truyền hình toàn cảnh về dự án nhà ở xã hội K-Home CityView tại Hố Nai, TP. Biên Hòa do Kim Oanh Land phát triển. Quy mô 1.328 căn chuẩn Singapore, giá từ 950 triệu.",
    project: "cityview",
    projectSlug: "k-home-cityview-ho-nai",
    projectName: "K-Home CityView Hố Nai",
  },
  "bien-hoa-but-pha-k-home-cityview": {
    slug: "bien-hoa-but-pha-k-home-cityview",
    title: "Biên Hòa Bứt Phá — Cơ Hội An Cư Lạc Nghiệp Tại K-Home CityView Hố Nai",
    videoUrl: "https://www.youtube.com/embed/Y9502b3sDJU",
    youtubeId: "Y9502b3sDJU",
    date: "2026-08-26",
    description: "Phóng sự phân tích bứt phá hạ tầng TP. Biên Hòa và cơ hội an cư tại K-Home CityView Hố Nai từ Kim Oanh Group. Giá chỉ từ 950 triệu, gói vay 5,4%/năm.",
    project: "cityview",
    projectSlug: "k-home-cityview-ho-nai",
    projectName: "K-Home CityView Hố Nai",
  },
  "to-am-chuan-singapore-k-home-cityview": {
    slug: "to-am-chuan-singapore-k-home-cityview",
    title: "K-Home CityView Hố Nai — Tổ Ấm Chuẩn Singapore Cho Gia Đình Việt",
    videoUrl: "https://www.youtube.com/embed/f4Av04RYDrw",
    youtubeId: "f4Av04RYDrw",
    date: "2026-08-26",
    description: "Khám phá không gian sống xanh chuẩn Singapore tại dự án NOXH K-Home CityView Hố Nai. Thiết kế bởi Surbana Jurong, đạt chứng chỉ xanh quốc tế EDGE.",
    project: "cityview",
    projectSlug: "k-home-cityview-ho-nai",
    projectName: "K-Home CityView Hố Nai",
  },
  "tien-do-thi-cong-k-home-cityview": {
    slug: "tien-do-thi-cong-k-home-cityview",
    title: "Tiến Độ Xây Dựng K-Home CityView Hố Nai - Cập Nhật Mới Nhất Tháng 8/2026",
    videoUrl: "https://www.youtube.com/embed/z9ZL9_Sng4Q",
    youtubeId: "z9ZL9_Sng4Q",
    date: "2026-08-19",
    description: "Video thực tế cập nhật tiến độ thi công nền móng và khối tháp K-Home CityView Hố Nai Biên Hòa mới nhất tháng 8/2026.",
    project: "cityview",
    projectSlug: "k-home-cityview-ho-nai",
    projectName: "K-Home CityView Hố Nai",
  },
  "kham-pha-phong-cach-singapore-k-home-midtown": {
    slug: "kham-pha-phong-cach-singapore-k-home-midtown",
    title: "K-Home Midtown Trảng Bom — Khám Phá Phong Cách Sống Singapore Ngay Trung Tâm",
    videoUrl: "https://www.youtube.com/embed/8qd60-fFFkY",
    youtubeId: "8qd60-fFFkY",
    date: "2026-08-27",
    description: "Video giới thiệu đại dự án nhà ở xã hội K-Home Midtown Trảng Bom 13,97ha 542 căn hộ chuẩn Singapore Surbana Jurong, tiêu chuẩn xanh EDGE giá từ 750 triệu.",
    project: "midtown",
    projectSlug: "k-home-midtown-trang-bom",
    projectName: "K-Home Midtown Trảng Bom",
  },
  "cong-dong-thau-cam-k-home-midtown": {
    slug: "cong-dong-thau-cam-k-home-midtown",
    title: "K-Home Midtown Trảng Bom — Kiến Tạo Cộng Đồng Thấu Cảm & Sẻ Chia Giá Trị Sống",
    videoUrl: "https://www.youtube.com/embed/EyKr3u7KkyE",
    youtubeId: "EyKr3u7KkyE",
    date: "2026-08-27",
    description: "Thước phim nhân văn ghi lại hành trình kiến tạo cộng đồng cư dân gắn kết, thấu cảm và sẻ chia giá trị sống tại dự án K-Home Midtown Trảng Bom.",
    project: "midtown",
    projectSlug: "k-home-midtown-trang-bom",
    projectName: "K-Home Midtown Trảng Bom",
  },
  "tien-do-than-toc-k-home-midtown": {
    slug: "tien-do-than-toc-k-home-midtown",
    title: "K-Home Midtown Trảng Bom — Tiến Độ Thi Công Thần Tốc Cập Nhật Mới Nhất",
    videoUrl: "https://www.youtube.com/embed/3FbIphjZu38",
    youtubeId: "3FbIphjZu38",
    date: "2026-08-27",
    description: "Video tiến độ thi công thực tế tại dự án nhà ở xã hội K-Home Midtown Trảng Bom do Kim Oanh Group làm chủ đầu tư. Bàn giao 2027.",
    project: "midtown",
    projectSlug: "k-home-midtown-trang-bom",
    projectName: "K-Home Midtown Trảng Bom",
  },
  "kham-pha-k-home-avenue-nhon-trach": {
    slug: "kham-pha-k-home-avenue-nhon-trach",
    title: "K-Home Avenue Nhơn Trạch — Khám Phá Dự Án Nhà Ở Xã Hội Chuẩn Singapore",
    videoUrl: "https://www.youtube.com/embed/nV0widFZQOY",
    youtubeId: "nV0widFZQOY",
    date: "2026-08-27",
    description: "Khám phá dự án nhà ở xã hội K-Home Avenue Nhơn Trạch 1.022 căn hộ chuẩn Singapore, liền kề sân bay quốc tế Long Thành, giá từ 750 triệu.",
    project: "avenue",
    projectSlug: "k-home-avenue-nhon-trach",
    projectName: "K-Home Avenue Nhơn Trạch",
  },
  "mon-qua-y-nghia-k-home-avenue": {
    slug: "mon-qua-y-nghia-k-home-avenue",
    title: "K-Home Avenue Nhơn Trạch — Món Quà Ý Nghĩa Ba Mẹ Trao Tặng Con Trẻ",
    videoUrl: "https://www.youtube.com/embed/SlsSGiKYRBE",
    youtubeId: "SlsSGiKYRBE",
    date: "2026-08-27",
    description: "Thước phim cảm động về tổ ấm tương lai tại K-Home Avenue Nhơn Trạch – môi trường sống xanh an lành chuẩn Singapore cho con trẻ trưởng thành.",
    project: "avenue",
    projectSlug: "k-home-avenue-nhon-trach",
    projectName: "K-Home Avenue Nhơn Trạch",
  }
};

interface VideoWatchViewProps {
  videoSlug: string;
  onNavigate: (path: string) => void;
}

export default function VideoWatchView({ videoSlug, onNavigate }: VideoWatchViewProps) {
  const currentVideo = VIDEO_DATA[videoSlug] || VIDEO_DATA["phong-su-k-home-cityview-ho-nai"];
  const otherVideos = Object.values(VIDEO_DATA).filter((v) => v.slug !== currentVideo.slug);

  useEffect(() => {
    document.title = `${currentVideo.title} | Video K-Home Đồng Nai`;
    
    // Schema ItemPage với mainEntity là VideoObject (Chuẩn Google Rich Results 100%)
    const existingWebPage = document.getElementById("schema-webpage-video");
    if (existingWebPage) existingWebPage.remove();
    const wpSchema = document.createElement("script");
    wpSchema.id = "schema-webpage-video";
    wpSchema.type = "application/ld+json";
    wpSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemPage",
      "name": currentVideo.title,
      "url": `https://k-homedongnai.com.vn/video/${currentVideo.slug}`,
      "description": currentVideo.description,
      "primaryImageOfPage": `https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`,
      "mainEntity": {
        "@type": "VideoObject",
        "name": currentVideo.title,
        "description": currentVideo.description,
        "thumbnailUrl": [
          `https://img.youtube.com/vi/${currentVideo.youtubeId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`
        ],
        "uploadDate": `${currentVideo.date}T08:00:00+07:00`,
        "contentUrl": `https://www.youtube.com/watch?v=${currentVideo.youtubeId}`,
        "embedUrl": `https://www.youtube.com/embed/${currentVideo.youtubeId}`,
        "publisher": {
          "@type": "Organization",
          "name": "K-Home Đồng Nai – Kim Oanh Land",
          "logo": {
            "@type": "ImageObject",
            "url": "https://k-homedongnai.com.vn/android-chrome-512x512.png"
          }
        }
      }
    });
    document.head.appendChild(wpSchema);

    return () => {
      document.getElementById("schema-video-watch")?.remove();
      document.getElementById("schema-webpage-video")?.remove();
    };
  }, [currentVideo]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate(`/${currentVideo.projectSlug}`)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm font-medium transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang {currentVideo.projectName}
          </button>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              TRANG XEM VIDEO CHÍNH THỨC
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Watch Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Video Player Container - Prominently Above Fold */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 ring-1 ring-white/10">
              <iframe
                src={`${currentVideo.videoUrl}?autoplay=1&rel=0`}
                title={currentVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info */}
            <div className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                {currentVideo.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-base">
                    K
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">K-Home Đồng Nai – Kim Oanh Land</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Ngày đăng: {currentVideo.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="tel:0937587438"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Hotline 0937 587 438
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {currentVideo.description}
              </p>
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-900/20 border border-amber-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-amber-300">Đăng Ký Nhận Bảng Giá & Tham Quan Nhà Mẫu</h3>
                <p className="text-xs text-slate-300 mt-1">Hỗ trợ trọn gói hồ sơ vay vốn Ngân hàng CSXH lãi suất 5,4%/năm.</p>
              </div>
              <button
                onClick={() => onNavigate(`/${currentVideo.projectSlug}`)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
              >
                Xem Bảng Giá & Mặt Bằng
              </button>
            </div>

          </div>

          {/* Sidebar: Recommended Project Videos (1 col) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
              Video Dự Án Liên Quan
            </h2>

            <div className="space-y-3">
              {otherVideos.map((vid) => (
                <div
                  key={vid.slug}
                  onClick={() => onNavigate(`/video/${vid.slug}`)}
                  className="flex gap-3 p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/30 transition-all cursor-pointer group"
                >
                  <div className="relative w-32 sm:w-36 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center transition-colors">
                      <div className="w-7 h-7 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                      {vid.projectName}
                    </span>
                    <h3 className="text-xs font-medium text-slate-200 line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug">
                      {vid.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 block">
                      {vid.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-semibold text-slate-300">Các Dự Án NOXH Trọng Điểm:</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => onNavigate("/k-home-cityview-ho-nai")} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    K-Home CityView Hố Nai Biên Hòa
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("/k-home-midtown-trang-bom")} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    K-Home Midtown Trảng Bom
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate("/k-home-avenue-nhon-trach")} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    K-Home Avenue Nhơn Trạch
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

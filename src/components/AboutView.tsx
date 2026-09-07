import React, { useEffect, useState } from "react";
import { CheckCircle, Building2, MapPin, ShieldCheck, Users, TrendingUp, Phone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  {
    src: "/k-home cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2.webp",
    label: "K-Home CityView",
    location: "Hố Nai, TP. Biên Hòa, Đồng Nai",
  },
  {
    src: "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp",
    label: "K-Home Midtown",
    location: "Trảng Bom, Đồng Nai",
  },
  {
    src: "/k-home avenue/PC02-TT-10K_2-min.jpg.webp",
    label: "K-Home Avenue",
    location: "Nhơn Trạch, Đồng Nai",
  },
];

const PROJECTS = [
  {
    name: "K-Home CityView",
    location: "Hố Nai, TP. Biên Hòa",
    slug: "k-home-cityview-ho-nai",
    units: "1.352 căn hộ NOXH",
    status: "Đang bốc thăm",
    statusColor: "text-amber-600 bg-amber-50",
  },
  {
    name: "K-Home Midtown",
    location: "Trảng Bom, Đồng Nai",
    slug: "k-home-midtown-trang-bom",
    units: "542 căn hộ NOXH",
    status: "Đã công bố",
    statusColor: "text-emerald-600 bg-emerald-50",
  },
  {
    name: "K-Home Avenue",
    location: "Nhơn Trạch, Đồng Nai",
    slug: "k-home-avenue-nhon-trach",
    units: "1.022 căn hộ NOXH",
    status: "Đã công bố",
    statusColor: "text-sky-600 bg-sky-50",
  },
];

const COMMITMENTS = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Pháp lý rõ ràng", desc: "Sổ hồng sở hữu lâu dài theo đúng quy định nhà ở xã hội. Minh bạch hồ sơ từ giai đoạn đặt cọc đến khi nhận nhà." },
  { icon: <Users className="w-5 h-5" />, title: "Hỗ trợ hồ sơ miễn phí", desc: "Đội ngũ tư vấn Kim Oanh Land hỗ trợ hoàn thiện toàn bộ hồ sơ đủ điều kiện NOXH và kết nối ngân hàng chính sách." },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Lãi suất ưu đãi 5,4%/năm", desc: "Người mua đủ điều kiện được vay tối đa 80% từ Ngân hàng Chính sách Xã hội với lãi suất 5,4%/năm trong 25 năm." },
  { icon: <CheckCircle className="w-5 h-5" />, title: "Chất lượng bàn giao", desc: "Căn hộ bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án. Cư dân có thể dọn vào ở ngay khi nhận bàn giao." },
];

export default function AboutView() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = "Giới Thiệu K-Home Đồng Nai | Kim Oanh Land – NOXH Đồng Nai";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Tìm hiểu về Kim Oanh Group và thương hiệu K-Home – đơn vị phát triển các dự án nhà ở xã hội tại Đồng Nai: CityView (Biên Hòa), Midtown (Trảng Bom), Avenue (Nhơn Trạch). Pháp lý rõ ràng, lãi suất ưu đãi 5,4%/năm.");
    }

    const existingSchema = document.getElementById("schema-about-org");
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement("script");
    schema.id = "schema-about-org";
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Kim Oanh Group",
      "alternateName": ["Kim Oanh Land", "K-Home", "K-Home Đồng Nai"],
      "url": "https://k-homedongnai.com.vn",
      "logo": "https://k-homedongnai.com.vn/KOG_Web_RGB_01.svg",
      "description": "Kim Oanh Group là nhà phát triển bất động sản với nhiều năm kinh nghiệm tại khu vực phía Nam, tập trung phát triển các dự án nhà ở xã hội và nhà ở giá phù hợp tại Đồng Nai.",
      "telephone": "0937587438",
      "address": { "@type": "PostalAddress", "addressLocality": "Đồng Nai", "addressCountry": "VN" },
      "areaServed": ["Biên Hòa", "Trảng Bom", "Nhơn Trạch", "Đồng Nai"],
      "knowsAbout": ["Nhà ở xã hội", "NOXH", "Bất động sản Đồng Nai"],
    });
    document.head.appendChild(schema);

    return () => { document.getElementById("schema-about-org")?.remove(); };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* ── 1. Hero ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-50 px-3 py-1.5 rounded-full inline-block">Giới thiệu</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight">
            Kim Oanh Group &<br />Thương Hiệu K-Home
          </h1>
          <div className="w-12 h-0.5 bg-amber-600 rounded-full" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Kim Oanh Group là nhà phát triển bất động sản có nhiều năm kinh nghiệm tại khu vực phía Nam, tập trung phát triển các dự án nhà ở xã hội và nhà ở giá phù hợp. Thương hiệu <strong>K-Home</strong> được Kim Oanh Land phát triển nhằm mang đến giải pháp an cư ổn định cho người lao động và gia đình trẻ tại Đồng Nai.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
              <span className="text-2xl font-bold text-amber-600 block">3</span>
              <span className="text-xs text-slate-500 block mt-0.5">Dự án NOXH tại Đồng Nai</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <span className="text-2xl font-bold text-slate-800 block">~2.900</span>
              <span className="text-xs text-slate-500 block mt-0.5">Căn hộ NOXH đang triển khai</span>
            </div>
          </div>
        </div>

        {/* Slideshow 3 dự án */}
        <div className="relative rounded-3xl overflow-hidden h-[360px] border border-slate-100 shadow-lg">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === activeSlide ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={img.src}
                alt={`${img.label} – Dự án nhà ở xã hội K-Home tại ${img.location}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                style={{ backgroundColor: "#e2e8f0" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">{img.label}</span>
                <span className="text-sm font-semibold text-slate-800 block">{img.location}</span>
              </div>
            </div>
          ))}

          {/* Prev/Next */}
          <button
            onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors z-10 shadow cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors z-10 shadow cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`rounded-full transition-all cursor-pointer ${idx === activeSlide ? "w-5 h-2 bg-amber-400" : "w-2 h-2 bg-white/60 hover:bg-white/90"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Kim Oanh Group là ai ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Kim Oanh Group là ai?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-800">Kim Oanh Group</strong> là tập đoàn bất động sản hoạt động tại khu vực phía Nam Việt Nam, với đơn vị thành viên là <strong className="text-slate-800">Kim Oanh Land</strong> chuyên phát triển các dự án nhà ở — trong đó có phân khúc nhà ở xã hội phục vụ nhu cầu thực của người lao động và gia đình trẻ.
            </p>
            <p>
              Tập đoàn tập trung vào việc phát triển quỹ đất tại các khu vực có nhu cầu nhà ở lớn như Đồng Nai, Bình Dương và vùng lân cận TP. Hồ Chí Minh. Các dự án được đầu tư bài bản về hạ tầng kỹ thuật, tiện ích nội khu và chất lượng bàn giao.
            </p>
            <p>
              Thương hiệu <strong className="text-slate-800">K-Home</strong> là dòng sản phẩm nhà ở xã hội của Kim Oanh Land, được thiết kế theo hướng tối ưu công năng, đầy đủ tiện ích thiết yếu và có chính sách hỗ trợ vay ưu đãi từ Ngân hàng Chính sách xã hội.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Nhiều năm kinh nghiệm phát triển bất động sản tại phía Nam",
              "Tập trung phân khúc nhà ở xã hội và nhà ở giá phù hợp",
              "Có quỹ đất và năng lực triển khai nhiều dự án tại Đồng Nai",
              "Hợp tác cùng các đơn vị tư vấn quốc tế (Surbana Jurong, Global Vireon Studio…)",
              "Áp dụng tiêu chuẩn công trình xanh EDGE trong thiết kế",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Thương hiệu K-Home ── */}
      <section className="bg-amber-50 rounded-3xl border border-amber-100 p-8 space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Thương Hiệu K-Home tại Đồng Nai</h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          K-Home là dòng sản phẩm nhà ở xã hội của Kim Oanh Land — nhà ở chất lượng, giá phù hợp, pháp lý rõ ràng. Chuỗi dự án K-Home đang phát triển tại các vị trí chiến lược tỉnh Đồng Nai, cung cấp hàng ngàn căn hộ NOXH chuẩn Singapore cho người lao động.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROJECTS.map((p) => (
            <div key={p.slug} className="bg-white rounded-2xl p-5 border border-amber-100 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${p.statusColor}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> {p.location}
              </p>
              <p className="text-xs text-amber-600 font-semibold">{p.units}</p>
              <a
                href={`/${p.slug}`}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                Xem chi tiết <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Cam kết ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Cam Kết Với Khách Hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COMMITMENTS.map((c, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                {c.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">{c.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Lợi thế ── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-800">Lợi Thế K-Home Đồng Nai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <MapPin className="w-5 h-5" />, title: "Gần khu công nghiệp", desc: "3 dự án đều tọa lạc gần các KCN lớn tại Đồng Nai — tiết kiệm thời gian và chi phí di chuyển cho công nhân, người lao động." },
            { icon: <Building2 className="w-5 h-5" />, title: "Tiện ích đầy đủ", desc: "Hồ bơi, sân chơi trẻ em, khu thể dục, vườn cảnh quan — đáp ứng nhu cầu sinh hoạt thiết yếu ngay trong khuôn viên dự án." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Lãi suất ưu đãi 5,4%/năm", desc: "Vay tối đa 80%, kỳ hạn 25 năm, lãi suất 5,4%/năm từ Ngân hàng Chính sách Xã hội — trả góp chỉ từ 3,5 triệu/tháng." },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold">Cần tư vấn về dự án K-Home?</h2>
        <p className="text-amber-50 text-sm max-w-xl mx-auto">
          Đội ngũ Kim Oanh Land hỗ trợ kiểm tra điều kiện, chuẩn bị hồ sơ và kết nối ngân hàng hoàn toàn miễn phí.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <a
            href="tel:0937587438"
            className="bg-white text-amber-700 font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-amber-50 transition-colors"
          >
            <Phone className="w-4 h-4" /> 0937 587 438
          </a>
          <a
            href="/lien-he"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-full text-sm flex items-center gap-2 border border-white/20 transition-colors"
          >
            Đăng Ký Tư Vấn Miễn Phí <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
}

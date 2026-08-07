import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { Project } from "../types";

const SUPPORT_ITEMS = [
  "Kiểm tra điều kiện mua nhà ở xã hội",
  "Tư vấn chính sách thanh toán và gói vay ưu đãi 5,4%/năm",
  "Hỗ trợ hoàn thiện hồ sơ mua nhà (miễn phí)",
  "Đặt lịch tham quan dự án",
  "Giải đáp thắc mắc về pháp lý, tiến độ và bàn giao",
];

export default function ContactView() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectSlug, setProjectSlug] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Liên Hệ Tư Vấn K-Home Đồng Nai | Hotline 0937 587 438";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Liên hệ tư vấn miễn phí các dự án nhà ở xã hội K-Home tại Đồng Nai: CityView Hố Nai, Midtown Trảng Bom, Avenue Nhơn Trạch. Hỗ trợ kiểm tra điều kiện, chính sách vay và đặt lịch tham quan.");
    }

    // Schema LocalBusiness + ContactPoint
    const existingSchema = document.getElementById("schema-contact");
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement("script");
    schema.id = "schema-contact";
    schema.type = "application/ld+json";
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "K-Home Đồng Nai – Kim Oanh Land",
      "alternateName": "K-Home CityView Hố Nai | Nhà Ở Xã Hội Kim Oanh",
      "description": "Đơn vị tư vấn và phân phối nhà ở xã hội K-Home tại Đồng Nai. Hỗ trợ hồ sơ NOXH miễn phí, vay lãi suất 5,4%/năm.",
      "url": "https://k-homedongnai.com.vn",
      "telephone": "+84937587438",
      "email": "k.homekog@gmail.com",
      "image": "https://k-homedongnai.com.vn/hero-background.jpg",
      "logo": "https://k-homedongnai.com.vn/android-chrome-512x512.png",
      "priceRange": "950.000.000₫ – 2.000.000.000₫",
      "currenciesAccepted": "VND",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Đường Điểu Xiển, Phường Hố Nai",
        "addressLocality": "TP. Biên Hòa",
        "addressRegion": "Đồng Nai",
        "postalCode": "810000",
        "addressCountry": "VN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "10.9592617",
        "longitude": "106.9022019",
      },
      "hasMap": "https://maps.app.goo.gl/ZiDceAEQt5DyPFGr6",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61592416756280",
        "https://k-homecityview.vn/",
        "https://kimoanhgroup.vn/du-an/k-home-cityview/"
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "08:00",
          "closes": "20:00"
        },
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84937587438",
        "contactType": "sales",
        "areaServed": "VN",
        "availableLanguage": "Vietnamese",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "08:00",
          "closes": "20:00"
        },
      },
      "makesOffer": [
        {
          "@type": "Offer",
          "name": "Nhà ở xã hội K-Home CityView Hố Nai",
          "url": "https://k-homedongnai.com.vn/k-home-cityview-ho-nai",
          "priceCurrency": "VND",
          "price": "950000000",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "minPrice": "950000000",
            "maxPrice": "2000000000",
            "priceCurrency": "VND"
          }
        },
        {
          "@type": "Offer",
          "name": "Nhà ở xã hội K-Home Midtown Trảng Bom",
          "url": "https://k-homedongnai.com.vn/k-home-midtown-trang-bom",
          "priceCurrency": "VND",
          "price": "750000000"
        },
        {
          "@type": "Offer",
          "name": "Nhà ở xã hội K-Home Avenue Nhơn Trạch",
          "url": "https://k-homedongnai.com.vn/k-home-avenue-nhon-trach",
          "priceCurrency": "VND",
          "price": "750000000"
        }
      ],
    });
    document.head.appendChild(schema);

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectsList(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading projects:", err));

    return () => { document.getElementById("schema-contact")?.remove(); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc: Họ tên, Số điện thoại.");
      return;
    }
    setIsSubmitting(true);
    const chosenProject = projectsList.find((p) => p.slug === projectSlug);
    const projectName = chosenProject ? chosenProject.title : "Tư vấn chung";

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, projectSlug, projectName, message: message || "Yêu cầu tư vấn nhà ở xã hội K-Home." }),
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => {
        setSuccess(true);
        setIsSubmitting(false);
        setName(""); setEmail(""); setPhone(""); setProjectSlug("general"); setMessage("");
      })
      .catch(() => {
        setErrorMsg("Có lỗi xảy ra, vui lòng thử lại sau.");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* ── Header ── */}
      <div className="border-b border-slate-100 pb-8 space-y-3">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">Liên hệ</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
          Liên Hệ Tư Vấn Nhà Ở Xã Hội K-Home Đồng Nai
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ bạn kiểm tra điều kiện mua nhà ở xã hội, tư vấn chính sách thanh toán – vay vốn và đặt lịch tham quan dự án. Mọi hỗ trợ đều <strong className="text-slate-700">hoàn toàn miễn phí</strong>.
        </p>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Form */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-semibold text-slate-800">Gửi Yêu Cầu Tư Vấn</h2>
            <p className="text-slate-500 text-xs">Chúng tôi sẽ liên hệ lại trong vòng 15–30 phút vào giờ làm việc.</p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Gửi Thành Công!</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                Chúng tôi đã nhận được yêu cầu của bạn. Chuyên viên tư vấn sẽ liên hệ trong vòng 15–30 phút.
              </p>
              <button onClick={() => setSuccess(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs rounded font-medium">{errorMsg}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-600 block">Họ và tên *</label>
                  <input id="contact-name" type="text" required placeholder="VD: Nguyễn Văn Hải" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-600 block">Số điện thoại *</label>
                  <input id="contact-phone" type="tel" required placeholder="VD: 0937587438" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-600 block">Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                <input id="contact-email" type="email" placeholder="VD: hainguyen@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-project" className="text-xs font-semibold text-slate-600 block">Dự án quan tâm *</label>
                <select id="contact-project" value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg text-sm outline-none transition-all cursor-pointer">
                  <option value="general">Chưa xác định / Tư vấn chung</option>
                  <option value="k-home-cityview-ho-nai">K-Home CityView (Hố Nai, Biên Hòa)</option>
                  <option value="k-home-midtown-trang-bom">K-Home Midtown (Trảng Bom)</option>
                  <option value="k-home-avenue-nhon-trach">K-Home Avenue (Nhơn Trạch)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-600 block">Nội dung yêu cầu</label>
                <textarea id="contact-message" rows={4} placeholder="VD: Tôi muốn kiểm tra điều kiện mua NOXH và đặt lịch tham quan..." value={message} onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all resize-none" />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-amber-600/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer">
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Gửi Yêu Cầu Tư Vấn</>
                }
              </button>
              <p className="text-xs text-slate-500 text-center">
                Chúng tôi sẽ liên hệ lại trong vòng 15–30 phút vào giờ làm việc. Thông tin của bạn được bảo mật tuyệt đối.
              </p>
            </form>
          )}
        </div>

        {/* Info + Map */}
        <div className="space-y-6 flex flex-col">

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Văn phòng Đồng Nai</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">268A Đường Phan Trung, Phường Tam Hiệp, Tỉnh Đồng Nai</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Hotline tư vấn</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  <a href="tel:0937587438" className="font-bold text-amber-600 hover:text-amber-700">0937 587 438</a><br />
                  Hỗ trợ từ 8:00 – 20:00 hàng ngày
                </p>
                <div className="flex gap-2 mt-2">
                  <a href="tel:0937587438" className="text-xs font-bold bg-emerald-500 text-white px-3.5 py-2 rounded-full hover:bg-emerald-600 transition-colors min-h-[36px] flex items-center">Gọi ngay</a>
                  <a href="https://zalo.me/0937587438" target="_blank" rel="noopener noreferrer" className="text-xs font-bold bg-[#0068FF] text-white px-3.5 py-2 rounded-full hover:opacity-90 transition-opacity min-h-[36px] flex items-center">Zalo</a>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Email</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  <a href="mailto:k.homekog@gmail.com" className="text-amber-600 hover:underline">k.homekog@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Giờ làm việc</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Tư vấn & CSKH: <strong className="text-slate-700">8:00 – 20:00</strong> (hàng ngày)<br />
                  Hành chính: 8:00 – 17:30 (Thứ 2 – Thứ 6)
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 min-h-[220px] bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.4132254249716!2d106.85123267488531!3d10.961808989198438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dde43a851edd%3A0x4595de172283eab6!2zS2ltIE9hbmggR3JvdXAgLSBDaGkgTmjDoW5oIMSQ4buTbmcgTmFp!5e1!3m2!1sen!2s!4v1785211646614!5m2!1sen!2s"
              width="100%" height="100%"
              style={{ border: 0, minHeight: "220px" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ văn phòng Kim Oanh Land Đồng Nai"
            />
          </div>
        </div>
      </div>

      {/* ── Chúng tôi hỗ trợ những gì ── */}
      <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8 space-y-5">
        <h2 className="text-xl font-display font-bold text-slate-800">Chúng Tôi Hỗ Trợ Những Gì?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUPPORT_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-white rounded-xl px-4 py-3 border border-amber-100">
              <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 pt-2">
          Các dự án đang tư vấn:{" "}
          <a href="/k-home-cityview-ho-nai" className="text-amber-600 font-semibold hover:underline">K-Home CityView</a>
          {" · "}
          <a href="/k-home-midtown-trang-bom" className="text-amber-600 font-semibold hover:underline">K-Home Midtown</a>
          {" · "}
          <a href="/k-home-avenue-nhon-trach" className="text-amber-600 font-semibold hover:underline">K-Home Avenue</a>
        </p>
      </div>

    </div>
  );
}

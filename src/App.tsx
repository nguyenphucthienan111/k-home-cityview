import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo, startTransition } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Phone, Mail, ArrowUp, Send, X } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";

// Lazy load các view ít dùng hơn
const ProjectsView       = lazy(() => import("./components/ProjectsView"));
const ProjectDetailView  = lazy(() => import("./components/ProjectDetailView"));
const UnitDetailView     = lazy(() => import("./components/UnitDetailView"));
const NewsView           = lazy(() => import("./components/NewsView"));
const NewsDetailView     = lazy(() => import("./components/NewsDetailView"));
const AboutView          = lazy(() => import("./components/AboutView"));
const ContactView        = lazy(() => import("./components/ContactView"));
const AdminDashboardView = lazy(() => import("./components/AdminDashboardView"));
const NotFoundView       = lazy(() => import("./components/NotFoundView"));
const ServerErrorView    = lazy(() => import("./components/ServerErrorView"));
const ForbiddenView      = lazy(() => import("./components/ForbiddenView"));

// ── 301 Redirect map for old news slugs → new slugs ──
// When Googlebot crawls old URL, it will see redirect and transfer link juice
const NEWS_REDIRECTS: Record<string, string> = {
  "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026-khong": "/tin-tuc/k-home-cityview-la-gi-co-nen-mua-o-that-tai-bien-hoa-2026",
  "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh-khac": "/tin-tuc/vi-tri-k-home-cityview-bien-hoa-noi-bat-so-voi-cac-du-an-noxh",
};

// Module-level constant — không rebuild mỗi lần navigateTo chạy
const PAGE_TITLES: Record<string, string> = {
  "/":            "K-Home Đồng Nai | 3 Dự Án Nhà Ở Xã Hội Kim Oanh Land tại Đồng Nai",
  "/home":        "K-Home Đồng Nai | 3 Dự Án Nhà Ở Xã Hội Kim Oanh Land tại Đồng Nai",
  "/san-pham":    "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 3 Dự Án NOXH Kim Oanh",
  "/tin-tuc":     "Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai | Cập Nhật Mới Nhất",
  "/gioi-thieu":  "Giới Thiệu K-Home Đồng Nai | Kim Oanh Land – NOXH Đồng Nai",
  "/lien-he":     "Liên Hệ Tư Vấn K-Home Đồng Nai | Hotline 0937 587 438",
  "/k-home-cityview-ho-nai":    "K-Home CityView Hố Nai Biên Hòa | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
  "/k-home-midtown-trang-bom":  "K-Home Midtown Trảng Bom | Bảng Giá, Mặt Bằng NOXH Trảng Bom 2026",
  "/k-home-avenue-nhon-trach":  "K-Home Avenue Nhơn Trạch | Bảng Giá NOXH Gần Sân Bay Long Thành 2026",
};

// Helper: normalize path from window.location
const getPath = () => {
  const path = window.location.pathname;
  // Strip trailing slash except for root
  return path.length > 1 ? path.replace(/\/$/, "") : path;
};

export default function App() {
  const [path, setPath] = useState<string>(getPath());

  // ── Cập nhật title khi mount lần đầu (vì App.tsx load trước pre-render HTML) ──
  // Đảm bảo Googlebot thấy đúng title ngay từ đầu
  useEffect(() => {
    const currentPath = getPath();
    if (PAGE_TITLES[currentPath]) {
      document.title = PAGE_TITLES[currentPath];
    }
  }, []);

  // ── Cập nhật canonical + og:url ngay khi mount và mỗi khi path thay đổi ──
  // Quan trọng: phải chạy trước khi Googlebot đọc canonical
  // NHƯNG: Không ghi đè nếu component (như UnitDetailView) đã set canonical riêng
  useEffect(() => {
    const BASE = "https://k-homedongnai.com.vn";
    const currentPath = getPath();
    
    // Kiểm tra: nếu là route /project/unit hoặc /tin-tuc/*, hãy để component xử lý canonical
    const isUnitRoute = /^\/[^/]+\/(can-ho-[^/]+)$/.test(currentPath);
    const isNewsRoute = /^\/tin-tuc\//.test(currentPath);
    if (isUnitRoute || isNewsRoute) {
      // UnitDetailView/NewsDetailView sẽ set canonical riêng — không ghi đè
      return;
    }
    
    const canonicalUrl = `${BASE}${currentPath === "/" ? "/" : currentPath}`;

    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const ogUrl = document.querySelector<HTMLMetaElement>("meta[property='og:url']");
    if (ogUrl) ogUrl.content = canonicalUrl;
  }, [path]);

  useEffect(() => {
    const handlePop = () => {
      startTransition(() => setPath(getPath()));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigateTo = useCallback((newPath: string) => {
    window.history.pushState(null, "", newPath);
    const pathname = newPath.split("?")[0];
    const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    startTransition(() => setPath(cleanPath));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (PAGE_TITLES[cleanPath]) {
      document.title = PAGE_TITLES[cleanPath];
    }
    
    // ── Cập nhật canonical URL động theo route ──
    // NHƯNG: Không ghi đè cho unit routes (/project/unit) hoặc news routes (/tin-tuc/*)
    // Vì những routes này có canonical riêng được set bởi UnitDetailView/NewsDetailView
    const isUnitRoute = /^\/[^/]+\/(can-ho-[^/]+)$/.test(cleanPath);
    const isNewsRoute = /^\/tin-tuc\//.test(cleanPath);
    if (!isUnitRoute && !isNewsRoute) {
      const BASE = "https://k-homedongnai.com.vn";
      let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${BASE}${cleanPath === "/" ? "/" : cleanPath}`;
    }
    
    // Cập nhật og:url + og:title + og:description + og:image + twitter per-route
    const BASE = "https://k-homedongnai.com.vn";
    const canonicalUrl = `${BASE}${cleanPath === "/" ? "/" : cleanPath}`;
    const ogUrl = document.querySelector<HTMLMetaElement>("meta[property='og:url']");
    if (ogUrl) ogUrl.content = canonicalUrl;
    const twUrl = document.querySelector<HTMLMetaElement>("meta[name='twitter:url']");
    if (twUrl) twUrl.content = canonicalUrl;
    // Per-route OG data map
    const PAGE_OG: Record<string, { title: string; description: string; image: string }> = {
      "/": {
        title: "K-Home Đồng Nai | 3 Dự Án Nhà Ở Xã Hội Kim Oanh Land tại Đồng Nai",
        description: "K-Home Đồng Nai – 3 dự án nhà ở xã hội chuẩn Singapore: CityView Hố Nai, Midtown Trảng Bom, Avenue Nhơn Trạch. Giá từ 750 triệu, lãi suất 5,4%/năm. Kim Oanh Land.",
        image: "https://k-homedongnai.com.vn/hero-background.jpg",
      },
      "/k-home-cityview-ho-nai": {
        title: "K-Home CityView Hố Nai Biên Hòa | Bảng Giá, Mặt Bằng & Hồ Sơ NOXH 2026",
        description: "Dự án K-Home CityView Hố Nai, Biên Hòa: 1.328 căn NOXH chuẩn Singapore, giá từ 950 triệu, lãi suất 5,4%/năm, bàn giao 2028. Xem bảng giá, mặt bằng, điều kiện mua.",
        image: "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-cityview/V34_TAN-HOA_EXT_FACADE_FINAL_2",
      },
      "/k-home-midtown-trang-bom": {
        title: "K-Home Midtown Trảng Bom | Bảng Giá, Mặt Bằng NOXH Trảng Bom 2026",
        description: "K-Home Midtown tại trung tâm Trảng Bom, Đồng Nai. Studio-2PN từ 750 triệu, lãi suất 5,4%/năm, bàn giao nội thất hoàn thiện. Xem mặt bằng và đăng ký tư vấn miễn phí.",
        image: "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150",
      },
      "/k-home-avenue-nhon-trach": {
        title: "K-Home Avenue Nhơn Trạch | Bảng Giá NOXH Gần Sân Bay Long Thành 2026",
        description: "K-Home Avenue Nhơn Trạch – dự án NOXH gần sân bay Long Thành. Studio-2PN từ 750 triệu, lãi suất 5,4%/năm, bàn giao hoàn thiện nội thất. Xem bảng giá và mặt bằng.",
        image: "https://res.cloudinary.com/dthv0nsq/image/upload/w_1200,q_auto:good,f_auto/k-home-avenue/Pc09-Loi-vao-shophouse_2-min",
      },
      "/tin-tuc": {
        title: "Tin Tức Nhà Ở Xã Hội K-Home Đồng Nai | Cập Nhật Mới Nhất",
        description: "Tin tức mới nhất về K-Home CityView, K-Home Midtown, K-Home Avenue và thị trường nhà ở xã hội Đồng Nai. Cập nhật giá, tiến độ, chính sách NOXH 2026.",
        image: "https://k-homedongnai.com.vn/hero-background.jpg",
      },
      "/san-pham": {
        title: "Danh Sách Dự Án K-Home Đồng Nai | Bảng Giá 3 Dự Án NOXH Kim Oanh",
        description: "So sánh 3 dự án NOXH K-Home tại Đồng Nai: CityView Hố Nai (từ 950tr), Midtown Trảng Bom (từ 750tr), Avenue Nhơn Trạch (từ 750tr). Lãi suất 5,4%/năm.",
        image: "https://k-homedongnai.com.vn/hero-background.jpg",
      },
    };
    const ogData = PAGE_OG[cleanPath] ?? PAGE_OG["/"];
    const selectors: [string, string][] = [
      ["meta[property='og:title']",         ogData.title],
      ["meta[property='og:description']",   ogData.description],
      ["meta[property='og:image']",         ogData.image],
      ["meta[name='twitter:title']",        ogData.title],
      ["meta[name='twitter:description']",  ogData.description],
      ["meta[name='twitter:image']",        ogData.image],
    ];
    selectors.forEach(([sel, val]) => {
      const el = document.querySelector<HTMLMetaElement>(sel);
      if (el) el.content = val;
    });
  }, []);

  // Memoize renderContent để tránh re-run 8 regex khi App re-render vì lý do khác
  const content = useMemo(() => {
    // ── Check for 301 redirect of old news slugs ──
    if (NEWS_REDIRECTS[path]) {
      navigateTo(NEWS_REDIRECTS[path]);
      return null;
    }

    const unitMatch = path.match(/^\/([^/]+)\/(can-ho-[^/]+|can-ho[^/]*)$/);
    if (unitMatch) {
      return <UnitDetailView projectSlug={unitMatch[1]} unitSlug={unitMatch[2]} onNavigate={navigateTo} />;
    }

    const unitMatchOldCan = path.match(/^\/([^/]+)\/(can-(?!ho-)[^/]+)$/);
    if (unitMatchOldCan) {
      // Chỉ redirect nếu projectSlug là một trong các dự án thực — tránh match tin-tuc URLs
      const PROJECT_SLUGS_CHECK = ["k-home-cityview-ho-nai", "k-home-midtown-trang-bom", "k-home-avenue-nhon-trach"];
      if (PROJECT_SLUGS_CHECK.includes(unitMatchOldCan[1])) {
        const oldSlug = unitMatchOldCan[2];
        const slugMap: Record<string, string> = {
          "can-1pn-a": "can-ho-1-phong-ngu-a", "can-1pn-b": "can-ho-1-phong-ngu-b",
          "can-2pn":   "can-ho-2-phong-ngu",   "can-3pn":   "can-ho-3-phong-ngu",
          "can-studio":"can-ho-studio",         "can-1pn":   "can-ho-1-phong-ngu",
          "can-2pn-nho":"can-ho-2-phong-ngu-nho","can-2pn-lon":"can-ho-2-phong-ngu-lon",
        };
        navigateTo(`/${unitMatchOldCan[1]}/${slugMap[oldSlug] || oldSlug}`);
        return null;
      }
    }

    const unitMatchOld = path.match(/^\/projects\/([^/]+)\/([^/]+)$/);
    if (unitMatchOld) {
      const slugMap: Record<string, string> = {
        "1pn-a": "can-ho-1-phong-ngu-a", "can-1pn-a": "can-ho-1-phong-ngu-a",
        "1pn-b": "can-ho-1-phong-ngu-b", "can-1pn-b": "can-ho-1-phong-ngu-b",
        "2pn":   "can-ho-2-phong-ngu",   "can-2pn":   "can-ho-2-phong-ngu",
        "3pn":   "can-ho-3-phong-ngu",   "can-3pn":   "can-ho-3-phong-ngu",
        "studio":"can-ho-studio",         "can-studio":"can-ho-studio",
        "1pn":   "can-ho-1-phong-ngu",   "can-1pn":   "can-ho-1-phong-ngu",
        "2pn-nho":"can-ho-2-phong-ngu-nho","can-2pn-nho":"can-ho-2-phong-ngu-nho",
        "2pn-lon":"can-ho-2-phong-ngu-lon","can-2pn-lon":"can-ho-2-phong-ngu-lon",
      };
      navigateTo(`/${unitMatchOld[1]}/${slugMap[unitMatchOld[2]] || `can-ho-${unitMatchOld[2]}`}`);
      return null;
    }

    const PROJECT_SLUGS = ["k-home-cityview-ho-nai", "k-home-midtown-trang-bom", "k-home-avenue-nhon-trach"];
    if (PROJECT_SLUGS.includes(path.slice(1))) {
      return <ProjectDetailView slug={path.slice(1)} onNavigate={navigateTo} />;
    }

    const projectMatchOld = path.match(/^\/projects\/([^/]+)$/);
    if (projectMatchOld) { navigateTo(`/${projectMatchOld[1]}`); return null; }

    const newsMatch = path.match(/^\/tin-tuc\/([^/]+)$/);
    if (newsMatch) return <NewsDetailView slug={newsMatch[1]} onNavigate={navigateTo} />;

    const newsMatchOld = path.match(/^\/news\/([^/]+)$/);
    if (newsMatchOld) { navigateTo(`/tin-tuc/${newsMatchOld[1]}`); return null; }

    switch (path) {
      case "/":
      case "/home":
        return <HomeView onNavigate={navigateTo} />;
      case "/san-pham":
      case "/projects": {
        const params = new URLSearchParams(window.location.search);
        return <ProjectsView onNavigate={navigateTo} initialProject={params.get("project") || "all"} initialBedrooms={params.get("bedrooms") || "all"} />;
      }
      case "/tin-tuc":
      case "/news":    return <NewsView onNavigate={navigateTo} />;
      case "/gioi-thieu":
      case "/about":   return <AboutView />;
      case "/lien-he":
      case "/contact": return <ContactView />;
      case "/admin":   return <AdminDashboardView />;
      case "/403":     return <ForbiddenView onNavigate={navigateTo} />;
      case "/500":     return <ServerErrorView onNavigate={navigateTo} code={500} />;
      case "/503":     return <ServerErrorView onNavigate={navigateTo} code={503} />;
      case "/502":     return <ServerErrorView onNavigate={navigateTo} code={502} />;
      default:         return <NotFoundView onNavigate={navigateTo} />;
    }
  }, [path, navigateTo]);

  const isAdmin = path === "/admin";

  // Scroll-to-top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Contact popup state
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    if (!contactName.trim() || !contactPhone.trim()) {
      setContactError("Vui lòng điền Họ tên và Số điện thoại.");
      return;
    }
    setContactSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
          message: contactMessage || "Yêu cầu tư vấn từ widget liên hệ.",
          projectSlug: "general",
          projectName: "Tư vấn chung",
        }),
      });
      if (!res.ok) throw new Error();
      setContactSuccess(true);
      setContactName(""); setContactPhone(""); setContactEmail(""); setContactMessage("");
    } catch {
      setContactError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setContactSubmitting(false);
    }
  }, [contactName, contactPhone, contactEmail, contactMessage]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <Header currentHash={path} />

      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {content}
        </Suspense>
      </main>

      <Footer />

      <Analytics />
      <SpeedInsights />

      {/* Floating Contact Widget (right side) — hidden on admin */}
      {!isAdmin && (
        <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-3">
          <a
            href="tel:0937587438"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Gọi Hotline: 0937587438"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Gọi ngay: 0937 587 438
            </span>
            <Phone className="w-5 h-5 fill-current animate-phone-shake" />
          </a>

          <a
            href="https://zalo.me/0937587438"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Liên hệ Zalo"
          >
            <span className="absolute inset-0 rounded-full ring-2 ring-[#0068FF]/0 group-hover:ring-[#0068FF]/40 transition-all duration-300 pointer-events-none" />
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Nhắn tin Zalo
            </span>
            <img src="/z.png" alt="Zalo" className="w-6 h-6 object-contain" />
          </a>

          <a
            href="https://m.me/61592416756280"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Chat Messenger"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Chat Messenger
            </span>
            <img src="/messenger-48.webp" alt="Facebook Messenger" className="w-6 h-6 object-contain" width="24" height="24" />
          </a>
        </div>
      )}

      {/* Left-side buttons: Contact popup + Scroll to top */}
      {!isAdmin && (
        <div className="fixed bottom-6 left-4 lg:left-16 z-[9999] flex flex-col gap-3">
          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
            className={`group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${showScrollTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
          >
            <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left pointer-events-none border border-slate-800">
              Lên đầu trang
            </span>
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Contact popup trigger */}
          <button
            onClick={() => { setShowContactPopup(true); setContactSuccess(false); setContactError(""); }}
            aria-label="Gửi yêu cầu tư vấn"
            title="Gửi yêu cầu tư vấn"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="absolute left-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left pointer-events-none border border-slate-800">
              Đăng ký tư vấn
            </span>
            <Mail className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Contact Popup Modal */}
      {showContactPopup && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowContactPopup(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden"
            onClick={e => e.stopPropagation()}
            style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1)" }}
          >
            {/* Amber top bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-800">Đăng Ký Tư Vấn Miễn Phí</h3>
                  <p className="text-xs text-slate-500">Phản hồi trong vòng 15–30 phút</p>
                </div>
                <button
                  onClick={() => setShowContactPopup(false)}
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer text-lg shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {contactSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Gửi thành công!</p>
                  <p className="text-xs text-slate-500">Chuyên viên sẽ liên hệ bạn sớm nhất.</p>
                  <button
                    onClick={() => setShowContactPopup(false)}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  {contactError && (
                    <div className="p-2.5 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs rounded font-medium">
                      {contactError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="popup-contact-name" className="text-xs font-semibold text-slate-600 block">Họ và tên *</label>
                    <input
                      id="popup-contact-name"
                      type="text"
                      required
                      placeholder="VD: Nguyễn Văn An"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="popup-contact-phone" className="text-xs font-semibold text-slate-600 block">Số điện thoại *</label>
                    <input
                      id="popup-contact-phone"
                      type="tel"
                      required
                      placeholder="VD: 0937 587 438"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="popup-contact-email" className="text-xs font-semibold text-slate-600 block">Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                    <input
                      id="popup-contact-email"
                      type="email"
                      placeholder="VD: email@gmail.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="popup-contact-msg" className="text-xs font-semibold text-slate-600 block">Nội dung <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                    <textarea
                      id="popup-contact-msg"
                      rows={2}
                      placeholder="Tôi muốn tư vấn về dự án K-Home..."
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {contactSubmitting
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <><Send className="w-4 h-4" /> Gửi Yêu Cầu</>
                    }
                  </button>

                  <p className="text-xs text-slate-400 text-center">Thông tin được bảo mật tuyệt đối.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

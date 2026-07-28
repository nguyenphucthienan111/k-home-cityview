import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo, startTransition, useTransition } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Phone } from "lucide-react";
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

// Module-level constant — không rebuild mỗi lần navigateTo chạy
const PAGE_TITLES: Record<string, string> = {
  "/":            "K-Home Đồng Nai | CityView – Midtown – Avenue | Nhà Ở Xã Hội Kim Oanh Group",
  "/home":        "K-Home Đồng Nai | CityView – Midtown – Avenue | Nhà Ở Xã Hội Kim Oanh Group",
  "/san-pham":    "Danh Sách Căn Hộ K-Home Đồng Nai | Bảng Giá Chi Tiết Từng Loại Căn",
  "/tin-tuc":     "Tin Tức Bất Động Sản | K-Home Đồng Nai",
  "/gioi-thieu":  "Giới Thiệu | K-Home Đồng Nai",
  "/lien-he":     "Liên Hệ Tư Vấn | K-Home Đồng Nai",
};

// Helper: normalize path from window.location
const getPath = () => {
  const path = window.location.pathname;
  // Strip trailing slash except for root
  return path.length > 1 ? path.replace(/\/$/, "") : path;
};

export default function App() {
  const [path, setPath] = useState<string>(getPath());
  const [isPending, startNav] = useTransition();

  useEffect(() => {
    const handlePop = () => {
      startNav(() => {
        setPath(getPath());
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [startNav]);

  // Memoize navigateTo để không tạo function mới mỗi render
  const navigateTo = useCallback((newPath: string) => {
    window.history.pushState(null, "", newPath);
    const pathname = newPath.split("?")[0];
    const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    startNav(() => {
      setPath(cleanPath);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (PAGE_TITLES[cleanPath]) {
      document.title = PAGE_TITLES[cleanPath];
    }
  }, [startNav]);

  // Memoize renderContent để tránh re-run 8 regex khi App re-render vì lý do khác
  const content = useMemo(() => {
    const unitMatch = path.match(/^\/([^/]+)\/(can-ho-[^/]+|can-ho[^/]*)$/);
    if (unitMatch) {
      return <UnitDetailView projectSlug={unitMatch[1]} unitSlug={unitMatch[2]} onNavigate={navigateTo} />;
    }

    const unitMatchOldCan = path.match(/^\/([^/]+)\/(can-(?!ho-)[^/]+)$/);
    if (unitMatchOldCan) {
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
      default:         return <HomeView onNavigate={navigateTo} />;
    }
  }, [path, navigateTo]);

  const isAdmin = path === "/admin";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <Header currentHash={path} />

      <main className="flex-grow relative">
        {/* Progress bar — hiện khi đang transition sang trang mới */}
        {isPending && (
          <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-amber-500 animate-pulse" />
        )}
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

      {/* Floating Contact Widget — hidden on admin */}
      {!isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
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
            href="https://m.me/61592212156463"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Chat Messenger"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Chat Messenger
            </span>
            <img src="/messenger.png" alt="Facebook" className="w-6 h-6 object-contain" />
          </a>
        </div>
      )}
    </div>
  );
}

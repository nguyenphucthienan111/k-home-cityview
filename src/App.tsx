import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ProjectsView from "./components/ProjectsView";
import ProjectDetailView from "./components/ProjectDetailView";
import UnitDetailView from "./components/UnitDetailView";
import NewsView from "./components/NewsView";
import NewsDetailView from "./components/NewsDetailView";
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import AdminDashboardView from "./components/AdminDashboardView";
import { Phone } from "lucide-react";

// Helper: normalize path from window.location
const getPath = () => {
  const path = window.location.pathname;
  // Strip trailing slash except for root
  return path.length > 1 ? path.replace(/\/$/, "") : path;
};

export default function App() {
  const [path, setPath] = useState<string>(getPath());

  useEffect(() => {
    const handlePop = () => {
      setPath(getPath());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Programmatic navigation using History API
  const navigateTo = (newPath: string) => {
    window.history.pushState(null, "", newPath);
    setPath(newPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    // /projects/:projectSlug/:unitSlug
    const unitMatch = path.match(/^\/projects\/([^/]+)\/([^/]+)$/);
    if (unitMatch) {
      return <UnitDetailView projectSlug={unitMatch[1]} unitSlug={unitMatch[2]} onNavigate={navigateTo} />;
    }

    // /projects/:projectSlug
    const projectMatch = path.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      return <ProjectDetailView slug={projectMatch[1]} onNavigate={navigateTo} />;
    }

    // /news/:slug
    const newsMatch = path.match(/^\/news\/([^/]+)$/);
    if (newsMatch) {
      return <NewsDetailView slug={newsMatch[1]} onNavigate={navigateTo} />;
    }

    switch (path) {
      case "/":
      case "/home":
        return <HomeView onNavigate={navigateTo} />;
      case "/projects": {
        const params = new URLSearchParams(window.location.search);
        return <ProjectsView
          onNavigate={navigateTo}
          initialProject={params.get("project") || "all"}
          initialBedrooms={params.get("bedrooms") || "all"}
        />;
      }
      case "/news":
        return <NewsView onNavigate={navigateTo} />;
      case "/about":
        return <AboutView />;
      case "/contact":
        return <ContactView />;
      case "/admin":
        return <AdminDashboardView />;
      default:
        return <HomeView onNavigate={navigateTo} />;
    }
  };

  const isAdmin = path === "/admin";

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <Header currentHash={path} />

      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer />

      {/* Floating Contact Widget — hidden on admin */}
      {!isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <a
            href="tel:0933354093"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Gọi Hotline: 0933354093"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Gọi ngay: 0933 354 093
            </span>
            <Phone className="w-5 h-5 fill-current animate-phone-shake" />
          </a>

          <a
            href="https://zalo.me/0933354093"
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
            href="https://m.me/kimoanhgroup.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Chat Messenger"
          >
            <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
              Messenger Chat
            </span>
            <img src="/messenger.png" alt="Messenger" className="w-6 h-6 object-contain" />
          </a>
        </div>
      )}
    </div>
  );
}

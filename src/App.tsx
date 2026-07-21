import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ProjectsView from "./components/ProjectsView";
import ProjectDetailView from "./components/ProjectDetailView";
import NewsView from "./components/NewsView";
import NewsDetailView from "./components/NewsDetailView";
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import AdminDashboardView from "./components/AdminDashboardView";
import { Phone, MessageCircle } from "lucide-react";

export default function App() {
  const [hash, setHash] = useState<string>(window.location.hash || "#home");

  // Synchronize hash changes for client-side routing
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || "#home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Programmatic navigation helper
  const navigateTo = (newHash: string) => {
    window.location.hash = newHash;
  };

  // Render the appropriate view based on route hash
  const renderContent = () => {
    const cleanHash = hash || "#home";

    // Project detail deep link: e.g., #projects/k-home-grand-urban
    if (cleanHash.startsWith("#projects/")) {
      const slug = cleanHash.replace("#projects/", "");
      return <ProjectDetailView slug={slug} onNavigate={navigateTo} />;
    }

    // News detail deep link: e.g., #news/chinh-thuc-cong-bo-k-home-grand-urban-giai-doan-2
    if (cleanHash.startsWith("#news/")) {
      const slug = cleanHash.replace("#news/", "");
      return <NewsDetailView slug={slug} onNavigate={navigateTo} />;
    }

    switch (cleanHash) {
      case "#home":
        return <HomeView onNavigate={navigateTo} />;
      case "#projects":
        return <ProjectsView onNavigate={navigateTo} />;
      case "#news":
        return <NewsView onNavigate={navigateTo} />;
      case "#about":
        return <AboutView />;
      case "#contact":
        return <ContactView />;
      case "#admin":
        return <AdminDashboardView />;
      default:
        return <HomeView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* Dynamic Header */}
      <Header currentHash={hash} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Contact Widget (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Call Hotline Button */}
        <a
          href="tel:0933354093"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Gọi Hotline: 0933354093"
        >
          {/* Pulsing effect ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />
          
          {/* Label on Hover */}
          <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
            Gọi ngay: 0933 354 093
          </span>
          <Phone className="w-5 h-5 fill-current animate-phone-shake" />
        </a>

        {/* Zalo Button */}
        <a
          href="https://zalo.me/0933354093"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Liên hệ Zalo"
        >
          {/* Subtle ring on hover only */}
          <span className="absolute inset-0 rounded-full ring-2 ring-[#0068FF]/0 group-hover:ring-[#0068FF]/40 transition-all duration-300 pointer-events-none" />

          {/* Label on Hover */}
          <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
            Nhắn tin Zalo
          </span>
          <span className="font-extrabold text-[12px] tracking-wider uppercase">Zalo</span>
        </a>

        {/* Messenger Button */}
        <a
          href="https://m.me/kimoanhgroup.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Chat Messenger"
        >
          {/* Label on Hover */}
          <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right pointer-events-none border border-slate-800">
            Messenger Chat
          </span>
          <MessageCircle className="w-5.5 h-5.5" />
        </a>
      </div>
    </div>
  );
}

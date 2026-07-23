import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  currentHash: string; // now receives pathname e.g. "/projects"
}

export default function Header({ currentHash }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active tab: compare first path segment
  const activeSection = "/" + (currentHash.split("/")[1] || "");

  const menuItems = [
    { title: "Trang Chủ", href: "/" },
    { title: "Dự Án",     href: "/projects" },
    { title: "Tin Tức",   href: "/news" },
    { title: "Giới Thiệu",href: "/about" },
    { title: "Liên Hệ",   href: "/contact" }
  ];

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled
        ? 'bg-white/70 backdrop-blur-2xl shadow-lg border-gray-200/30'
        : 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <a href="/" onClick={(e) => handleNav(e, "/")} className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <img src="/KOG_Web_RGB_01.svg" alt="K-Home CityView Logo" className="h-8 w-auto" />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const isActive = item.href === "/"
                ? currentHash === "/" || currentHash === "/home"
                : activeSection === item.href || currentHash.startsWith(item.href + "/");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href)}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    isActive ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
                  }`}
                >
                  {item.title}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
                </a>
              );
            })}
          </nav>

          {/* Hotline */}
          <div className="hidden md:flex items-center gap-5">
            <a href="tel:0933354093" className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md shadow-amber-600/10 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              0933 354 093
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-700 hover:text-amber-600 p-2" aria-label="Toggle Menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t py-4 px-4 shadow-lg space-y-3 ${
          scrolled ? 'bg-white/80 backdrop-blur-2xl border-gray-200/30' : 'bg-white/95 border-gray-100'
        }`}>
          {menuItems.map((item) => {
            const isActive = item.href === "/"
              ? currentHash === "/" || currentHash === "/home"
              : currentHash.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNav(e, item.href)}
                className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                  isActive ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                }`}
              >
                {item.title}
              </a>
            );
          })}
          <div className="pt-4 border-t border-gray-100">
            <a href="tel:0933354093" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-md hover:bg-amber-700">
              <Phone className="w-4 h-4" />
              Gọi Hotline: 0933 354 093
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

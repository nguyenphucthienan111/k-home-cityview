import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  currentHash: string;
}

export default function Header({ currentHash }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Theo dõi scroll để thay đổi backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Normalize hash for menu selection
  const activeTab = currentHash.split("/")[0] || "#home";

  const menuItems = [
    { title: "Trang Chủ", href: "#home" },
    { title: "Dự Án", href: "#projects" },
    { title: "Tin Tức", href: "#news" },
    { title: "Giới Thiệu", href: "#about" },
    { title: "Liên Hệ", href: "#contact" }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/70 backdrop-blur-2xl shadow-lg border-gray-200/30 supports-[backdrop-filter]:bg-white/40' 
        : 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with KOG SVG */}
          <a href="#home" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <img 
              src="/KOG_Web_RGB_01.svg" 
              alt="K-Home CityView Logo" 
              className="h-8 w-auto"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const isActive = activeTab === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                    isActive
                      ? "text-amber-600 font-semibold"
                      : "text-slate-600 hover:text-amber-600"
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions - Contact Hotline */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:0901234567"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md shadow-amber-600/10 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              0901 234 567
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700 hover:text-amber-600 p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className={`md:hidden border-t py-4 px-4 shadow-lg space-y-3 transition-all ${
          scrolled
            ? 'bg-white/80 backdrop-blur-2xl border-gray-200/30 supports-[backdrop-filter]:bg-white/50'
            : 'bg-white/95 backdrop-blur-md border-gray-100'
        }`}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-amber-50 text-amber-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                }`}
              >
                {item.title}
              </a>
            );
          })}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <a
              href="tel:0901234567"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-md hover:bg-amber-700"
            >
              <Phone className="w-4 h-4" />
              Gọi Hotline: 0901 234 567
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

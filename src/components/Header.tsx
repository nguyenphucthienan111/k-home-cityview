import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ChevronDown, Building2 } from "lucide-react";

interface HeaderProps {
  currentHash: string;
}

const PROJECTS = [
  { title: "K-Home CityView Biên Hòa",    slug: "k-home-cityview-ho-nai",       location: "Hố Nai, TP. Biên Hòa" },
  { title: "K-Home Midtown Trảng Bom",    slug: "k-home-midtown-trang-bom",     location: "Trảng Bom, Đồng Nai" },
  { title: "K-Home Avenue Nhơn Trạch",    slug: "k-home-avenue-nhon-trach",     location: "Nhơn Trạch, Đồng Nai" },
];

export default function Header({ currentHash }: HeaderProps) {
  const [isOpen, setIsOpen]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [duAnOpen, setDuAnOpen]       = useState(false);
  const [mobileDuAn, setMobileDuAn]   = useState(false);
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDuAnOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setIsOpen(false);
    setDuAnOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeSection = "/" + (currentHash.split("/")[1] || "");

  // Active check for Dự Án: any project slug at root level
  const projectSlugs = PROJECTS.map((p) => "/" + p.slug);
  const isDuAnActive = projectSlugs.some((s) => currentHash.startsWith(s));

  // Active check for Sản Phẩm
  const isSanPhamActive = activeSection === "/san-pham";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled
        ? "bg-white/70 backdrop-blur-2xl shadow-lg border-gray-200/30"
        : "bg-white/95 backdrop-blur-md shadow-sm border-gray-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <a href="/" onClick={(e) => handleNav(e, "/")} className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <img src="/KOG_Web_RGB_01.svg" alt="K-Home Đồng Nai Logo" className="h-8 w-auto" />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">

            {/* Trang Chủ */}
            <a
              href="/"
              onClick={(e) => handleNav(e, "/")}
              className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                currentHash === "/" || currentHash === "/home"
                  ? "text-amber-600 font-semibold"
                  : "text-slate-600 hover:text-amber-600"
              }`}
            >
              Trang Chủ
              {(currentHash === "/" || currentHash === "/home") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
              )}
            </a>

            {/* Dự Án — dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDuAnOpen((v) => !v)}
                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors relative py-2 cursor-pointer ${
                  isDuAnActive ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
                }`}
              >
                Dự Án
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${duAnOpen ? "rotate-180" : ""}`} />
                {isDuAnActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
              </button>

              {duAnOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Dự Án K-Home Đồng Nai</span>
                  </div>
                  {PROJECTS.map((p) => (
                    <a
                      key={p.slug}
                      href={`/${p.slug}`}
                      onClick={(e) => handleNav(e, `/${p.slug}`)}
                      className={`flex items-start gap-3 px-4 py-3.5 hover:bg-amber-50 transition-colors group ${
                        currentHash.startsWith(`/${p.slug}`) ? "bg-amber-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                        <Building2 className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <span className={`block text-sm font-semibold ${
                          currentHash.startsWith(`/${p.slug}`) ? "text-amber-600" : "text-slate-800 group-hover:text-amber-600"
                        }`}>
                          {p.title}
                        </span>
                        <span className="block text-xs text-slate-400 mt-0.5">{p.location}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sản Phẩm */}
            <a
              href="/san-pham"
              onClick={(e) => handleNav(e, "/san-pham")}
              className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                isSanPhamActive ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
              }`}
            >
              Sản Phẩm
              {isSanPhamActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
            </a>

            {/* Tin Tức */}
            <a
              href="/tin-tuc"
              onClick={(e) => handleNav(e, "/tin-tuc")}
              className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                activeSection === "/tin-tuc" || activeSection === "/news" ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
              }`}
            >
              Tin Tức
              {(activeSection === "/tin-tuc" || activeSection === "/news") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
            </a>

            {/* Giới Thiệu */}
            <a
              href="/gioi-thieu"
              onClick={(e) => handleNav(e, "/gioi-thieu")}
              className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                activeSection === "/gioi-thieu" || activeSection === "/about" ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
              }`}
            >
              Giới Thiệu
              {(activeSection === "/gioi-thieu" || activeSection === "/about") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
            </a>

            {/* Liên Hệ */}
            <a
              href="/lien-he"
              onClick={(e) => handleNav(e, "/lien-he")}
              className={`text-sm font-medium tracking-wide transition-colors relative py-2 ${
                activeSection === "/lien-he" || activeSection === "/contact" ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
              }`}
            >
              Liên Hệ
              {(activeSection === "/lien-he" || activeSection === "/contact") && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />}
            </a>
          </nav>

          {/* Hotline */}
          <div className="hidden md:flex items-center gap-5">
            <a href="tel:0937587438" className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md shadow-amber-600/10 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              0937 587 438
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
        <div className={`md:hidden border-t py-4 px-4 shadow-lg space-y-1 ${
          scrolled ? "bg-white/80 backdrop-blur-2xl border-gray-200/30" : "bg-white/95 border-gray-100"
        }`}>
          {/* Trang Chủ */}
          <a
            href="/"
            onClick={(e) => handleNav(e, "/")}
            className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
              currentHash === "/" ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
            }`}
          >
            Trang Chủ
          </a>

          {/* Dự Án — expandable */}
          <div>
            <button
              onClick={() => setMobileDuAn((v) => !v)}
              className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                isDuAnActive ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
              }`}
            >
              Dự Án
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileDuAn ? "rotate-180" : ""}`} />
            </button>
            {mobileDuAn && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-amber-100 pl-3">
                {PROJECTS.map((p) => (
                  <a
                    key={p.slug}
                    href={`/${p.slug}`}
                    onClick={(e) => handleNav(e, `/${p.slug}`)}
                    className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      currentHash.startsWith(`/${p.slug}`) ? "text-amber-600 font-semibold" : "text-slate-600 hover:text-amber-600"
                    }`}
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sản Phẩm */}
          <a
            href="/san-pham"
            onClick={(e) => handleNav(e, "/san-pham")}
            className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
              isSanPhamActive ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
            }`}
          >
            Sản Phẩm
          </a>

          {[
            { title: "Tin Tức",    href: "/tin-tuc" },
            { title: "Giới Thiệu", href: "/gioi-thieu" },
            { title: "Liên Hệ",   href: "/lien-he" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                activeSection === item.href ? "bg-amber-50 text-amber-700 font-semibold" : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
              }`}
            >
              {item.title}
            </a>
          ))}

          <div className="pt-4 border-t border-gray-100">
            <a href="tel:0937587438" className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-600 text-white text-sm font-medium shadow-md hover:bg-amber-700">
              <Phone className="w-4 h-4" />
              Gọi Hotline: 0937 587 438
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, 
  Star, 
  MapPin, 
  Sparkles, 
  Building, 
  Landmark, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Coins, 
  Percent, 
  ChevronRight, 
  Search, 
  Award, 
  Eye, 
  Compass,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Project } from "../types";

interface HomeViewProps {
  onNavigate: (hash: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Slideshow States
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);

  const heroProjects = [
    {
      name: "K-Home CityView Biên Hòa",
      image: "/k-home-cityview-bg.jpg.webp",
      location: "Đường Điều Xiển, P. Hố Nai, TP. Biên Hòa, Đồng Nai",
      scale: "2,85 hecta",
      product: "1.352 căn hộ NOXH và 30 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, CDC Jsc, K-City",
    },
    {
      name: "K-Home Midtown Trảng Bom",
      image: "/k-home-midtown-bg.jpg.webp",
      location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
      scale: "13,97 hecta",
      product: "542 căn hộ NOXH và 20 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, NAGECCO, K-City",
    },
    {
      name: "K-Home Avenue Nhơn Trạch",
      image: "/k-home-avenue-bg.jpg.webp",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      scale: "5,3 hecta",
      product: "1.022 căn hộ NOXH và 82 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Surbana Jurong, Global Vireon Studio, Handong, Coninco, K-City",
    },
  ];

  // Quick Hero Filter states
  const [heroType, setHeroType] = useState<string>("all");
  const [heroPrice, setHeroPrice] = useState<string>("all");

  // Interactive Showroom Active Tab
  const [activeShowroomTab, setActiveShowroomTab] = useState<number>(0);

  // Project Carousel (right panel of amenities section)
  const [activeProjectTab, setActiveProjectTab] = useState<number>(0);

  const projectCarousel = [
    {
      slug: "k-home-cityview-ho-nai",
      name: "K-Home CityView Hố Nai",
      tag: "Nhà ở xã hội · Biên Hòa",
      location: "Đường Điểu Xiển, phường Hố Nai, TP. Biên Hòa, Đồng Nai",
      price: "Từ 950 triệu",
      scale: "2,85 ha · 4 Block · 1.816 căn",
      badge: "Đang mở bán",
      badgeColor: "bg-amber-500",
      image: "/cityview.jpg"
    },
    {
      slug: "k-home-avenue-nhon-trach",
      name: "K-Home Avenue Nhơn Trạch",
      tag: "Nhà ở xã hội · Nhơn Trạch",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      price: "Từ 750 triệu",
      scale: "84 ha · 4 Block 12 tầng · 1.104 căn",
      badge: "Sắp mở bán",
      badgeColor: "bg-blue-500",
      image: "/avenue.jpg"
    },
    {
      slug: "k-home-midtown-trang-bom",
      name: "K-Home Midtown Trảng Bom",
      tag: "Nhà ở xã hội · Trảng Bom",
      location: "KDC Bàu Xéo, huyện Trảng Bom, tỉnh Đồng Nai",
      price: "Trả góp 3,5 – 4,5tr/tháng",
      scale: "13,97 ha · 15 tầng · 562 căn",
      badge: "Đang thi công",
      badgeColor: "bg-green-600",
      image: "/midtown.jpg"
    }
  ];

  // Investment Calculator States
  const [investmentValue, setInvestmentValue] = useState<number>(10); // Billions VNĐ
  const [paymentOption, setPaymentOption] = useState<string>("fast"); // fast (12%), standard (3%), support (0%)

  // Scroll Tracking State
  const [activeSection, setActiveSection] = useState<string>("hero");

  const projectsSectionRef = useRef<HTMLDivElement>(null);

  // Auto-rotate project carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProjectTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Definition of Sections for Floating Sidebar Dot Navigation
  const homeSections = [
    { id: "hero", label: "Tổng quan dự án" },
    { id: "stats", label: "Chữ tín thương hiệu" },
    { id: "philosophy", label: "Mã gen K-Home" },
    { id: "amenities", label: "Tiện ích nội khu" },
    { id: "calculator", label: "Phân tích đầu tư" },
    { id: "featured-projects", label: "Danh mục kiệt tác" },
    { id: "testimonials", label: "Chia sẻ cư dân" },
    { id: "consultation", label: "Đăng ký tư vấn VIP" }
  ];

  // Auto-advance hero slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroProjects.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [heroProjects.length]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setAllProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects on Home:", err);
        setLoading(false);
      });
  }, []);

  // IntersectionObserver & Custom Scroll spying to highlight dots
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Bottom edge detection to force light up the last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("consultation");
        return;
      }

      for (const section of homeSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger check immediately
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [allProjects]);

  // Handle hero quick search
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filtered = [...allProjects];

    if (heroType !== "all") {
      filtered = filtered.filter(p => p.type.toLowerCase().includes(heroType.toLowerCase()) || heroType.toLowerCase().includes(p.type.toLowerCase()));
    }

    if (heroPrice === "under-5") {
      filtered = filtered.filter(p => p.priceNumber < 5);
    } else if (heroPrice === "5-15") {
      filtered = filtered.filter(p => p.priceNumber >= 5 && p.priceNumber <= 15);
    } else if (heroPrice === "above-15") {
      filtered = filtered.filter(p => p.priceNumber > 15);
    }

    setFilteredProjects(filtered);

    // Scroll to projects section smoothly
    const featuredEl = document.getElementById("featured-projects");
    if (featuredEl) {
      featuredEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset filters
  const resetFilters = () => {
    setHeroType("all");
    setHeroPrice("all");
    setFilteredProjects(allProjects);
  };

  // Calculate Investment Estimations
  const getCalculatorResults = () => {
    let discountRate = 0;
    if (paymentOption === "fast") discountRate = 12;
    else if (paymentOption === "standard") discountRate = 3;
    
    const discountAmount = (investmentValue * discountRate) / 100; // In Billions
    const actualInvestment = investmentValue - discountAmount;
    
    // Estimate annual rental yield (approx 6.5% for high-end projects)
    const annualRentalYield = actualInvestment * 0.065; // Billions per year
    const monthlyRentalYield = (annualRentalYield * 1000) / 12; // Million VND per month

    // Recommend projects based on investment budget
    const recommended = allProjects.filter(p => {
      return p.priceNumber <= investmentValue * 1.3;
    }).slice(0, 2);

    return {
      discountAmount: discountAmount.toFixed(2),
      actualInvestment: actualInvestment.toFixed(2),
      monthlyRentalYield: Math.round(monthlyRentalYield),
      recommended
    };
  };

  const calcResults = getCalculatorResults();

  const coreValues = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Vị Trí Độc Tôn",
      subtitle: "Tâm Điểm Thịnh Vượng",
      description: "Các dự án đều tọa lạc tại các vị trí đất vàng trung tâm, tâm điểm kết nối và đón đầu dòng chảy phát triển của các công trình hạ tầng trọng điểm quốc gia."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Tiện Ích Đặc Quyền",
      subtitle: "Xứng Tầm Tinh Hoa",
      description: "Kiến tạo đặc quyền sống chuẩn nghỉ dưỡng 365 ngày với hồ bơi vô cực rộng lớn, câu lạc bộ bến du thuyền thượng lưu, sky bar sang trọng và công viên sinh thái."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Pháp Lý Minh Bạch",
      subtitle: "Tuyệt Đối An Tâm",
      description: "Cam kết hồ sơ pháp lý hoàn chỉnh nhất, sở hữu lâu dài rõ ràng, liên kết bảo lãnh chặt chẽ với những ngân hàng thương mại quốc doanh lớn nhất Việt Nam."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Giá Trị Bền Vững",
      subtitle: "Tăng Trưởng Dòng Tiền",
      description: "Hệ sinh thái thương hiệu cao cấp K-Home mang lại bảo chứng thép cho tốc độ tăng giá trị tài sản bền vững cùng tính thanh khoản vượt trội trên thị trường."
    }
  ];

  const showroomGallery = [
    {
      title: "Hồ Bơi Người Lớn & Trẻ Em",
      tag: "Tiện ích nội khu",
      desc: "Hệ thống hồ bơi tiêu chuẩn dành cho cả người lớn và trẻ em, được trang bị tại cả 3 dự án K-Home — mang đến không gian thư giãn và vui chơi ngay trong khuôn viên chỉ dành cho cư dân.",
      images: ["/cityview.jpg", "/avenue.jpg", "/midtown.jpg"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Sân Chơi Trẻ Em",
      tag: "Giáo dục & Gia đình",
      desc: "Trường học và sân chơi trẻ em được quy hoạch ngay trong khu dân cư, giúp các gia đình an tâm về môi trường học tập và vui chơi an toàn cho con em ngay tại nơi ở.",
      images: ["/cityview1.jpg", "/avenue1.jpg", "/midtown1.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Khu Thể Dục Ngoài Trời",
      tag: "Sức khỏe cư dân",
      desc: "Phòng tập gym và khu thể dục ngoài trời được bố trí trong khuôn viên dự án, đáp ứng nhu cầu rèn luyện thể chất hàng ngày của cư dân mà không cần ra ngoài khu.",
      images: ["/cityview2.jpg", "/avenue2.png", "/midtown2.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    },
    {
      title: "Sky Garden & Vườn Cảnh Quan",
      tag: "Không gian xanh",
      desc: "Vườn cảnh quan, Sky Garden và nhà sinh hoạt cộng đồng tạo nên không gian gắn kết hàng xóm, nghỉ ngơi cuối tuần và thư giãn giữa thiên nhiên ngay trong lòng khu đô thị.",
      images: ["/cityview3.jpg", "/avenue3.jpg", "/midtown3.webp"],
      stats: "Có tại: Hố Nai · Nhơn Trạch · Trảng Bom"
    }
  ];

  const testimonials = [
    {
      quote: "Sở hữu biệt thự K-Home Resort Villas mang lại cho tôi không gian nghỉ dưỡng thực thụ sau những giờ điều hành doanh nghiệp căng thẳng. Chất lượng dịch vụ quản gia cao cấp ở đây cực kỳ chu đáo và đẳng cấp.",
      author: "Doanh nhân Lê Đăng Khoa",
      role: "Sáng lập & CEO TechInvest Group",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      quote: "Gia định tôi chọn căn hộ K-Home Grand Urban vì hệ thống smarthome cực kỳ tối tân và không gian sinh thái nội khu ngập tràn cây xanh rộng lớn giúp các cháu nhỏ có không gian rèn luyện sức khỏe tuyệt vời.",
      author: "Chị Hoàng Thanh Thúy",
      role: "Giám đốc Nhân sự Heineken VN",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      quote: "Dự án Sky Garden sở hữu tầm nhìn Landmark 81 đắt giá hiếm có. Tôi cực kỳ hài lòng với hiệu suất sinh lời từ dòng tiền cho thuê căn hộ cũng như đơn vị vận hành quản lý tòa nhà vô cùng chuyên nghiệp.",
      author: "Ông Henry Nguyễn",
      role: "Nhà đầu tư Kiều bào Mỹ",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    }
  ];

  return (
    <div className="space-y-24 pb-24 bg-gradient-to-b from-amber-50/20 via-white to-slate-50 overflow-hidden relative">
      
      {/* =========================================================
          FLOATING DOT NAVIGATION (LEFT SIDEBAR)
          ========================================================= */}
      <div className="fixed left-3 lg:left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4.5 bg-white/90 backdrop-blur-md px-3 py-6 rounded-full shadow-2xl border border-amber-100/60 transition-all">
        {/* Connection Vertical Line */}
        <div className="absolute top-6 bottom-6 w-[2px] bg-amber-100 rounded-full" />
        
        {homeSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="relative group flex items-center justify-center w-5.5 h-5.5 focus:outline-none cursor-pointer"
            >
              {/* Highlight Dot Indicator */}
              <div 
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 z-10 ${
                  isActive 
                    ? "bg-amber-500 border-amber-500 scale-135 shadow-lg shadow-amber-500/50" 
                    : "bg-white border-amber-300 group-hover:border-amber-500 group-hover:scale-110"
                }`}
              />
              
              {/* Hover Tooltip - Reveals section name */}
              <div className="absolute left-8 px-3.5 py-1.5 rounded-xl bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-xl flex items-center gap-1.5 border border-slate-800">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                {section.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          1. LUXURIOUS HERO SECTION (BRIGHT / SUNSET LUXURY RESORT STYLE)
          ========================================================= */}
      <section 
        id="hero" 
        className="relative min-h-[720px] lg:min-h-[820px] w-full flex flex-col justify-center items-center overflow-hidden pt-24 pb-16 lg:py-0"
      >
        {/* Custom Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/hero-background.jpg"
            alt="K-Home Premium Luxury Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </div>

        {/* Diagonal Wave Lines for Premium Texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Content Container (Grid Layout inspired by premium screenshot) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col justify-center h-full gap-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Editorial Typography & Custom Spec Sheet Card */}
            <div className="lg:col-span-5 space-y-6 text-white text-left">
              {/* Brand Elite Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-extrabold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
                ĐỊNH HÌNH CHẤT SỐNG SINGAPORE
              </div>

              {/* Serif/Sans Luxury Title */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-none text-white">
                  Tổng quan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-200 to-amber-200 font-serif italic font-normal">
                    DỰ ÁN K-HOME
                  </span>
                </h1>
              </div>

              {/* Spec Sheet Table - Dynamic theo slide đang active */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/30 space-y-4 shadow-xl">
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Vị trí</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].location}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Quy mô</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].scale}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Sản phẩm</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].product}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 border-b border-white/20 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Phát triển</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].developer}</span>
                </div>
                <div className="grid grid-cols-3 py-1.5 text-xs items-center">
                  <span className="font-semibold text-amber-100 uppercase tracking-wide">Đối tác</span>
                  <span className="col-span-2 text-white font-medium text-right sm:text-left transition-all duration-500">{heroProjects[activeHeroSlide].partner}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => {
                    const featuredEl = document.getElementById("featured-projects");
                    if (featuredEl) {
                      featuredEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-white hover:bg-amber-100 text-amber-800 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-103"
                >
                  Tìm hiểu thêm <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("#contact")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
                >
                  Nhận Báo Giá Đợt 1
                </button>
              </div>
            </div>

            {/* Right Side: Project Slideshow Carousel */}
            <div className="lg:col-span-7 hidden lg:flex flex-col gap-3">
              
              {/* Carousel Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 h-[340px] sm:h-[450px] w-full">
                {/* Blur Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl filter blur-xl opacity-30 pointer-events-none" />
                
                {/* Slides */}
                {heroProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      idx === activeHeroSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    
                    {/* Floating Info Card - Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-max">
                      <div className="bg-white/20 backdrop-blur-lg rounded-tr-2xl px-4 py-3 shadow-xl border border-white/30 flex flex-col gap-2 text-center">
                        <div>
                          <span className="text-[8px] text-amber-300 font-extrabold uppercase tracking-widest block drop-shadow-lg">Dự án bàn giao chuẩn</span>
                          <span className="text-base font-extrabold text-white block mt-0.5 drop-shadow-lg">{project.name}</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md text-amber-100 py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-white/30 drop-shadow-lg mx-auto">
                          <Activity className="w-3 h-3 text-amber-300 animate-pulse" /> Đang thi công
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots Navigation - outside carousel, full clickable */}
              <div className="flex items-center justify-center gap-3 py-1 z-10">
                {heroProjects.map((project, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroSlide(idx)}
                    style={{ cursor: "pointer" }}
                    className={`transition-all duration-300 rounded-full border-0 outline-none focus:outline-none ${
                      idx === activeHeroSlide
                        ? "w-6 h-2.5 bg-amber-400 shadow-lg shadow-amber-400/50"
                        : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Chuyển sang ${project.name}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* =========================================================
              QUICK FILTER SEARCH PANEL (INTEGRATED BRIGHT LUXURY STYLE)
              ========================================================= */}
          <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-amber-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Filter 1: Type */}
              <div className="space-y-2">
                <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Loại Hình Bất Động Sản</label>
                <div className="relative">
                  <select
                    value={heroType}
                    onChange={(e) => setHeroType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Tất cả loại hình</option>
                    <option value="căn hộ">Căn Hộ Cao Cấp</option>
                    <option value="biệt thự">Biệt Thự Nghỉ Dưỡng</option>
                    <option value="penthouse">Penthouse Triệu Đô</option>
                    <option value="nhà phố">Nhà Phố Thương Mại</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Filter 2: Price Range */}
              <div className="space-y-2">
                <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Khoảng Giá (VND)</label>
                <div className="relative">
                  <select
                    value={heroPrice}
                    onChange={(e) => setHeroPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Mọi mức ngân sách</option>
                    <option value="under-5">Dưới 5 Tỷ VNĐ</option>
                    <option value="5-15">Từ 5 Tỷ - 15 Tỷ VNĐ</option>
                    <option value="above-15">Trên 15 Tỷ VNĐ</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Tìm Nhanh Rổ Hàng
                </button>
                {(heroType !== "all" || heroPrice !== "all") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-3 rounded-xl text-xs font-semibold transition-colors shrink-0"
                    title="Xóa bộ lọc"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 text-center font-medium border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> Cam kết giá gốc chủ đầu tư</span>
              <span className="hidden sm:inline-block text-slate-200">|</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Sổ hồng sở hữu lâu dài</span>
              <span className="hidden sm:inline-block text-slate-200">|</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Sinh lời cho thuê 6.5%/năm</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. INTERACTIVE PREMIUM BRAND STATISTICS CARD (WARM SUNSET GRADIENT)
          ========================================================= */}
      <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-amber-400/20">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -left-24 -bottom-24 w-72 h-72 bg-white/15 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            <div className="space-y-1">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Building className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">15+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Dự án bàn giao</span>
              <p className="text-amber-100/80 text-[11px]">Vượt tiến độ cam kết</p>
            </div>
            
            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">12K+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Cư dân tinh hoa</span>
              <p className="text-amber-100/80 text-[11px]">Tin dùng thương hiệu</p>
            </div>

            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">10+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Năm phát triển</span>
              <p className="text-amber-100/80 text-[11px]">Bảo chứng chữ Tín vàng</p>
            </div>

            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">98%</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Đánh giá 5 sao</span>
              <p className="text-amber-100/80 text-[11px]">Hài lòng về chất lượng</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. CORE PHILOSOPHY REDESIGN
          ========================================================= */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Mã gen K-Home</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Triết Lý Kiến Tạo Nghệ Thuật
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Mỗi m2 tại các dự án K-Home không chỉ là bê tông cốt thép, mà là một tác phẩm kiến trúc độc bản được thổi hồn nghệ thuật để bảo chứng một chuẩn sống tôn quý nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-100 p-8 hover:shadow-2xl hover:border-amber-500/30 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-100 group-hover:text-amber-700 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest block mb-1">
                {value.subtitle}
              </span>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-700 transition-colors">
                {value.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. LUXURY VIRTUAL SHOWROOM (BRIGHT THEMED CAROUSEL)
          ========================================================= */}
      <section 
        id="amenities" 
        className="bg-gradient-to-b from-amber-50/50 via-white to-amber-50/50 text-slate-800 py-24 relative overflow-hidden border-y border-amber-100/50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive Tab Buttons */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/60 border border-amber-200/50 px-3.5 py-1.5 rounded-full inline-block">
                Tiện ích nội khu 3 dự án
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold leading-tight text-slate-900">
                Hành Trình <br />Trải Nghiệm <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
                  Sống Tiện Nghi
                </span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Cả 3 dự án K-Home tại Đồng Nai đều được quy hoạch đầy đủ tiện ích nội khu thiết yếu — từ hồ bơi, trường học đến vườn cảnh quan và trạm sạc xe điện, đáp ứng trọn vẹn nhu cầu sống của gia đình.
              </p>

              {/* Indicator Controls */}
              <div className="space-y-3 pt-4">
                {showroomGallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActiveShowroomTab(idx); setActiveProjectTab(0); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                      activeShowroomTab === idx
                        ? "bg-amber-500/10 border-amber-400 text-slate-900 shadow-sm font-semibold"
                        : "bg-white/70 border-slate-200/60 text-slate-500 hover:bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        activeShowroomTab === idx ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className="text-sm font-bold">{item.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      activeShowroomTab === idx ? "translate-x-1.5 text-amber-600" : "text-slate-400 group-hover:text-slate-600"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Project Carousel */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main carousel image — clickable → navigate to project */}
              <div
                onClick={() => onNavigate(`#projects/${projectCarousel[activeProjectTab].slug}`)}
                className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[360px] sm:h-[430px] group bg-slate-100 cursor-pointer"
              >
                {/* Images – stacked, fade transition via opacity — source from active amenity tab */}
                {projectCarousel.map((project, idx) => (
                  <img
                    key={project.slug}
                    src={showroomGallery[activeShowroomTab].images[idx]}
                    alt={project.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-[1.02] group-hover:scale-105 transform ${
                      activeProjectTab === idx ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Badge */}
                <div className={`absolute top-5 left-5 ${projectCarousel[activeProjectTab].badgeColor} text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md transition-all duration-300`}>
                  {projectCarousel[activeProjectTab].badge}
                </div>

                {/* "Xem dự án" hint on hover */}
                <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5">
                  Xem dự án <ArrowUpRight className="w-3 h-3" />
                </div>

                {/* Project info overlay */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    {projectCarousel[activeProjectTab].tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight">
                    {projectCarousel[activeProjectTab].name}
                  </h3>
                  <p className="text-slate-300 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {projectCarousel[activeProjectTab].location}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="bg-white/15 border border-white/20 rounded-lg px-3 py-1.5 text-[11px] font-bold text-amber-200">
                      {projectCarousel[activeProjectTab].price}
                    </div>
                    <div className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-slate-300">
                      {projectCarousel[activeProjectTab].scale}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail navigation — thumbnail cũng dùng ảnh theo tab tiện ích */}
              <div className="flex items-center justify-center gap-3">
                {projectCarousel.map((project, idx) => (
                  <button
                    key={project.slug}
                    onClick={() => setActiveProjectTab(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      activeProjectTab === idx
                        ? "border-amber-500 shadow-md shadow-amber-500/30 w-20 h-14 opacity-100"
                        : "border-transparent w-16 h-12 opacity-50 hover:opacity-80 hover:border-amber-300"
                    }`}
                    aria-label={project.name}
                  >
                    <img
                      src={showroomGallery[activeShowroomTab].images[idx]}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    {activeProjectTab === idx && (
                      <div className="absolute inset-0 bg-amber-500/20" />
                    )}
                  </button>
                ))}
              </div>

              {/* Progress bar auto-rotate indicator */}
              <div className="flex gap-2 px-1">
                {projectCarousel.map((_, idx) => (
                  <div key={idx} className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-amber-500 rounded-full transition-all ${
                        activeProjectTab === idx ? "w-full duration-[4000ms]" : activeProjectTab > idx ? "w-full duration-0" : "w-0 duration-0"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          5. SMART INVESTMENT CALCULATOR (COMPLETELY LIGHT THEMED & SHARP)
          ========================================================= */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Công cụ phân tích đầu tư</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Ước Tính Lợi Nhuận Dòng Tiền
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Công cụ tính toán chuyên sâu giúp quý khách lập kế hoạch tài chính tối ưu, tính toán chiết khấu thanh toán và dòng tiền cho thuê dự phóng từ rổ hàng K-Home.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-br-full" />
          
          {/* Controls - Left Side (7 cols) */}
          <div className="lg:col-span-7 space-y-8 relative z-10">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Calculator className="w-5 h-5 text-amber-600" /> Nhập Thông Số Kế Hoạch Đầu Tư
            </h3>

            {/* Slider 1: Capital value */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Vốn đầu tư dự kiến:</span>
                <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3.5 py-1 rounded-lg">
                  {investmentValue} Tỷ VNĐ
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={investmentValue}
                onChange={(e) => setInvestmentValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>3 Tỷ (Phù hợp Căn Hộ)</span>
                <span>25 Tỷ (Phù hợp Biệt Thự Sông)</span>
              </div>
            </div>

            {/* Selector: Payment options */}
            <div className="space-y-4">
              <span className="text-sm font-medium text-slate-600 block">Phương thức thanh toán tối ưu:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Fast option */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("fast")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                    paymentOption === "fast"
                      ? "border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    paymentOption === "fast" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    ✓
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Thanh Toán Nhanh</span>
                    <span className="text-xs text-amber-600 font-semibold mt-0.5 block">Chiết khấu 12%</span>
                  </div>
                </button>

                {/* Standard option */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("standard")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                    paymentOption === "standard"
                      ? "border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    paymentOption === "standard" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    ✓
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Thanh Toán Chuẩn</span>
                    <span className="text-xs text-amber-600 font-semibold mt-0.5 block">Chiết khấu 3%</span>
                  </div>
                </button>

                {/* Support option */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("support")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                    paymentOption === "support"
                      ? "border-amber-500 bg-amber-500/5 shadow-md shadow-amber-500/5"
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    paymentOption === "support" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    ✓
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Hỗ Trợ Lãi Suất 0%</span>
                    <span className="text-xs text-amber-600 font-semibold mt-0.5 block">Miễn lãi 24 tháng</span>
                  </div>
                </button>

              </div>
            </div>
          </div>

          {/* Outputs - Right Side (5 cols) REDESIGNED WITH AMBER/ORANGE GRADIENT */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white relative flex flex-col justify-between border border-amber-400/20 shadow-xl">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-tl-full" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-100 bg-white/15 border border-white/10 px-3 py-1 rounded-full inline-block">
                KẾT QUẢ PHÂN TÍCH DỰ PHÓNG
              </span>

              {/* Stat 1: Total Saved */}
              <div className="space-y-1">
                <span className="text-xs text-amber-100 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-yellow-200" /> Khấu trừ chiết khấu trực tiếp:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {calcResults.discountAmount > "0.00" ? (
                    <span>-{calcResults.discountAmount} Tỷ VNĐ</span>
                  ) : (
                    <span className="text-xs font-normal text-amber-50">Không áp dụng chiết khấu</span>
                  )}
                </div>
                <p className="text-[10px] text-amber-100/70">Giảm trừ ngay vào Hợp Đồng Mua Bán (HĐMB)</p>
              </div>

              {/* Stat 2: Monthly cashflow */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-xs text-amber-100 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-yellow-200" /> Dòng tiền cho thuê hàng tháng:
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-yellow-100 font-display flex items-baseline gap-1 animate-pulse">
                  ~{calcResults.monthlyRentalYield} <span className="text-xs text-white/90 font-normal">Trđ/tháng</span>
                </div>
                <p className="text-[10px] text-amber-100/70">Tỷ suất cho thuê dự kiến ~6.5%/năm trên giá trị ròng</p>
              </div>

              {/* Stat 3: Recommended match */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <span className="text-xs text-amber-100 block font-bold uppercase tracking-wider">Dự án K-Home phù hợp:</span>
                {calcResults.recommended.length > 0 ? (
                  <div className="space-y-2">
                    {calcResults.recommended.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onNavigate(`#projects/${p.slug}`)}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-yellow-200/40 transition-all flex items-center justify-between cursor-pointer group text-left"
                      >
                        <div>
                          <span className="block text-xs font-bold text-white group-hover:text-yellow-100 transition-colors">{p.title}</span>
                          <span className="text-[10px] text-amber-100">{p.location.split(",")[2] || p.location}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-extrabold text-yellow-200">{p.price}</span>
                          <span className="text-[9px] text-amber-100/80 flex items-center gap-0.5 justify-end">Xem chi tiết <ArrowUpRight className="w-2.5 h-2.5" /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-100 italic">Vui lòng tăng vốn đầu tư để xem gợi ý biệt thự/penthouse.</p>
                )}
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => onNavigate("#contact")}
                className="w-full bg-white hover:bg-amber-50 text-amber-800 font-bold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20"
              >
                Nhận Bảng Tính Dòng Tiền Độc Quyền <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          6. FEATURED PROJECTS REDESIGN
          ========================================================= */}
      <section id="featured-projects" className="bg-slate-50 py-24 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3 py-1.5 rounded-full inline-block">Danh mục kiệt tác</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                Dự Án Nổi Bật
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("#projects")}
                className="text-amber-700 font-bold text-sm hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-slate-200 hover:border-amber-400/30 shadow-sm"
              >
                Xem Toàn Bộ Rổ Hàng ({allProjects.length ? allProjects.length : "..."}) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-[450px] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : (
            <div>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 space-y-4 max-w-xl mx-auto shadow-sm">
                  <div className="text-slate-400 text-4xl">🔍</div>
                  <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dự án phù hợp</h3>
                  <p className="text-slate-500 text-sm px-6">Chúng tôi hiện không có dự án nào thỏa mãn tiêu chí tìm kiếm của bạn. Quý khách vui lòng đặt lại bộ lọc để tham quan thêm các kiệt tác khác.</p>
                  <button
                    onClick={resetFilters}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-5 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Xem Tất Cả Dự Án
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredProjects.map((project, idx) => {
                    const isSoldOutRate = idx === 0 ? "85%" : idx === 1 ? "92%" : idx === 2 ? "45%" : "70%";
                    return (
                      <div
                        key={project.id}
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-500/20 transition-all duration-500 group flex flex-col h-full cursor-pointer relative"
                        onClick={() => onNavigate(`#projects/${project.slug}`)}
                      >
                        {/* Custom Tag Overlays */}
                        <div className="relative h-72 overflow-hidden bg-slate-100">
                          {/* Main Image */}
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                          
                          {/* Luxury Badges on Image */}
                          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                            {project.type}
                          </div>
                          
                          <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md ${
                            project.status === "Đang mở bán" 
                              ? "bg-emerald-600 text-white"
                              : project.status === "Sắp mở bán"
                              ? "bg-amber-500 text-slate-950"
                              : "bg-blue-600 text-white"
                          }`}>
                            {project.status}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-8 flex flex-col flex-grow space-y-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(project.rating) ? 'fill-amber-500' : 'opacity-30'}`} />
                              ))}
                              <span className="text-slate-500 text-[11px] font-semibold ml-1">({project.rating})</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors leading-tight line-clamp-1 font-display">
                              {project.title}
                            </h3>
                            
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-light">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="line-clamp-1">{project.location.split(",").slice(-2).join(", ")}</span>
                            </div>
                          </div>

                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                            {project.description}
                          </p>

                          {/* Progress bar to show investment demand */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-semibold">Đã đăng ký giữ chỗ</span>
                              <span className="text-amber-600 font-bold">{isSoldOutRate}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" 
                                style={{ width: isSoldOutRate }}
                              />
                            </div>
                          </div>

                          {/* Price & Area Specs */}
                          <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-sm mt-auto">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Quy mô diện tích</span>
                              <span className="font-bold text-slate-700 block text-xs sm:text-sm mt-0.5">{project.area}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Giá trần tốt nhất</span>
                              <span className="block text-lg font-extrabold text-amber-600 mt-0.5">{project.price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          7. PREMIUM TESTIMONIALS (AMBER DECORATED STYLE)
          ========================================================= */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Đại sứ niềm tin</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Khách Hàng & Đối Tác Nói Gì?
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Sự hài lòng từ trải nghiệm sống thượng lưu của quý khách hàng là thành tựu vinh quang nhất của tập đoàn K-Home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-100/80 p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col justify-between space-y-8 relative overflow-hidden"
            >
              {/* Giant quote mark back decoration */}
              <span className="absolute -top-4 -left-2 text-amber-100/50 font-serif text-[180px] leading-none pointer-events-none select-none opacity-40">“</span>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic relative z-10">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 relative z-10 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30 shadow-inner"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{t.author}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          8. CONSULTATION BANNER CTA (COMPLETELY LIGHT / GOLDEN BASE STYLE)
          ========================================================= */}
      <section id="consultation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 md:p-16 text-white flex flex-col lg:flex-row justify-between items-center gap-12 shadow-2xl relative overflow-hidden border border-amber-400/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)]" />
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
              Đăng ký rổ hàng ưu đãi quý II/2026
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">
              Tìm Hiểu Chính Sách Chiết Khấu Độc Quyền <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">
                Lên Tới 12%
              </span>
            </h2>
            <p className="text-amber-50 text-xs sm:text-sm font-light leading-relaxed">
              Trở thành chủ nhân tôn quý tiếp theo của các kiệt tác bất động sản K-Home. Liên hệ ngay bộ phận tư vấn VIP để được cung cấp mặt bằng căn hộ & tiến độ thanh toán chi tiết.
            </p>
          </div>
          
          <div className="shrink-0 relative z-10 w-full lg:w-auto text-center">
            <button
              onClick={() => onNavigate("#contact")}
              className="w-full lg:w-auto bg-white hover:bg-amber-100 text-amber-800 px-10 py-5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-orange-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              Đăng Ký Tư Vấn VIP <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-amber-100/90 mt-3 font-medium">Hotline hỗ trợ 24/7: 0933 354 093</p>
          </div>
        </div>
      </section>

    </div>
  );
}

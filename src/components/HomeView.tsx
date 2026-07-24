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
import { imgUrl } from "../utils/imageUrl";

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
      image: "/k-home cityview/V32_TAN-HOA_EXT_AERIAL_2_FINAL_2.webp",
      location: "Đường Điều Xiển, P. Hố Nai, TP. Biên Hòa, Đồng Nai",
      scale: "2,85 hecta",
      product: "1.352 căn hộ NOXH và 30 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, CDC Jsc, K-City",
    },
    {
      name: "K-Home Midtown Trảng Bom",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp",
      location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
      scale: "13,97 hecta",
      product: "542 căn hộ NOXH và 20 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, NAGECCO, K-City",
    },
    {
      name: "K-Home Avenue Nhơn Trạch",
      image: "/k-home avenue/PC02-TT-10K_2-min.jpg.webp",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      scale: "5,3 hecta",
      product: "1.022 căn hộ NOXH và 82 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Surbana Jurong, Global Vireon Studio, Handong, Coninco, K-City",
    },
  ];

  // Quick Hero Filter states
  const [heroProject, setHeroProject] = useState<string>("all");
  const [heroBedrooms, setHeroBedrooms] = useState<string>("all");

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
      badge: "Đang bốc thăm",
      badgeColor: "#f59e0b",
      image: "/k-home cityview/V11_TH_EXT_NOTM_POOL_2.webp"
    },
    {
      slug: "k-home-avenue-nhon-trach",
      name: "K-Home Avenue Nhơn Trạch",
      tag: "Nhà ở xã hội · Nhơn Trạch",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      price: "Từ 750 triệu",
      scale: "84 ha · 4 Block 12 tầng · 1.104 căn",
      badge: "Sắp công bố",
      badgeColor: "#3b82f6",
      image: "/k-home avenue/PC01-TT-copy_2_2-min.jpg.webp"
    },
    {
      slug: "k-home-midtown-trang-bom",
      name: "K-Home Midtown Trảng Bom",
      tag: "Nhà ở xã hội · Trảng Bom",
      location: "KDC Bàu Xéo, huyện Trảng Bom, tỉnh Đồng Nai",
      price: "Trả góp 3,5 – 4,5tr/tháng",
      scale: "13,97 ha · 15 tầng · 562 căn",
      badge: "Đã công bố",
      badgeColor: "#16a34a",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-ho-boi-view-2-2048x1150.webp"
    }
  ];

  // Investment Calculator States
  const [investmentValue, setInvestmentValue] = useState<number>(1.0); // Tỷ VNĐ
  const [paymentOption, setPaymentOption] = useState<string>("policy");
  const [selectedCalcProject, setSelectedCalcProject] = useState<string>("k-home-cityview-ho-nai");

  // Config theo từng dự án
  const projectCalcConfig: Record<string, {
    name: string;
    loanYears: number;
    loanPercent: number;
    policyRate: number;
    priceMin: number;
    priceMax: number;
    priceStep: number;
    noteMin: string;
    noteMax: string;
    schedule: { dot: string; pct: string; note: string }[];
  }> = {
    "k-home-cityview-ho-nai": {
      name: "K-Home CityView Hố Nai",
      loanYears: 25,
      loanPercent: 75,
      policyRate: 5.4,
      priceMin: 0.95,
      priceMax: 1.95,
      priceStep: 0.05,
      noteMin: "950tr (1 Phòng Ngủ +)",
      noteMax: "1,9 tỷ (3 Phòng Ngủ)",
      schedule: [
        { dot: "Cọc",      pct: "30.000.000đ",       note: "Ký phiếu xác nhận cọc" },
        { dot: "Đợt 1",    pct: "15%",                note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
        { dot: "Đợt 2",    pct: "5%",                 note: "30 ngày kể từ hạn đợt 1" },
        { dot: "Đợt 3",    pct: "5%",                 note: "30 ngày kể từ hạn đợt 2" },
        { dot: "Đợt 4",    pct: "75% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao", pct: "Phí bảo trì 2%",    note: "15 ngày kể từ thông báo BG" },
      ],
    },
    "k-home-avenue-nhon-trach": {
      name: "K-Home Avenue Nhơn Trạch",
      loanYears: 25,
      loanPercent: 75,
      policyRate: 5.4,
      priceMin: 0.75,
      priceMax: 1.5,
      priceStep: 0.05,
      noteMin: "750tr (Studio)",
      noteMax: "1,5 tỷ (2 Phòng Ngủ-L)",
      schedule: [
        { dot: "Cọc",      pct: "30.000.000đ",       note: "Ký phiếu xác nhận cọc" },
        { dot: "Đợt 1",    pct: "15%",                note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
        { dot: "Đợt 2",    pct: "5%",                 note: "30 ngày kể từ hạn đợt 1" },
        { dot: "Đợt 3",    pct: "5%",                 note: "30 ngày kể từ hạn đợt 2" },
        { dot: "Đợt 4",    pct: "75% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao", pct: "Phí bảo trì 2%",    note: "15 ngày kể từ thông báo BG" },
      ],
    },
    "k-home-midtown-trang-bom": {
      name: "K-Home Midtown Trảng Bom",
      loanYears: 20,
      loanPercent: 70,
      policyRate: 5.4,
      priceMin: 0.8,
      priceMax: 1.5,
      priceStep: 0.05,
      noteMin: "~800tr (Studio)",
      noteMax: "~1,5 tỷ (2PN)",
      schedule: [
        { dot: "Cọc",      pct: "30.000.000đ",       note: "Ký phiếu xác nhận cọc" },
        { dot: "Đợt 1",    pct: "15%",                note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
        { dot: "Đợt 2",    pct: "5%",                 note: "30 ngày kể từ hạn đợt 1" },
        { dot: "Đợt 3",    pct: "10%",                note: "30 ngày kể từ hạn đợt 2" },
        { dot: "Đợt 4",    pct: "70% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao", pct: "Phí bảo trì 2%",    note: "15 ngày kể từ thông báo BG" },
      ],
    },
  };

  // Scroll Tracking State
  const [activeSection, setActiveSection] = useState<string>("hero");
  // Stats counter animation
  const [statsVisible, setStatsVisible] = useState<boolean>(false);
  const [statsDone, setStatsDone] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Counter values (animated)
  const [count15, setCount15] = useState(0);
  const [count12k, setCount12k] = useState(0);
  const [count10, setCount10] = useState(0);
  const [count98, setCount98] = useState(0);

  const projectsSectionRef = useRef<HTMLDivElement>(null);

  // Auto-rotate project carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProjectTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Stats counter: trigger once when section enters viewport, persist via sessionStorage
  useEffect(() => {
    const alreadyRan = sessionStorage.getItem("statsAnimated");
    if (alreadyRan) {
      // Already ran this session — show final values immediately
      setCount15(15); setCount12k(12); setCount10(10); setCount98(98);
      setStatsDone(true);
      return;
    }

    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsDone) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible || statsDone) return;

    const duration = 1800; // ms
    const steps = 60;
    const interval = duration / steps;

    // Easing function: easeOutExpo
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = ease(step / steps);
      setCount15(Math.round(progress * 15));
      setCount12k(Math.round(progress * 12));
      setCount10(Math.round(progress * 10));
      setCount98(Math.round(progress * 98));

      if (step >= steps) {
        clearInterval(timer);
        setCount15(15); setCount12k(12); setCount10(10); setCount98(98);
        setStatsDone(true);
        sessionStorage.setItem("statsAnimated", "1");
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible]);

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
        const list = Array.isArray(data) ? data : [];
        setAllProjects(list);
        setFilteredProjects(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects on Home:", err);
        setAllProjects([]);
        setFilteredProjects([]);
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

  // Handle hero quick search — navigate sang #projects với filter params trong hash
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: string[] = [];
    if (heroProject !== "all") params.push(`project=${heroProject}`);
    if (heroBedrooms !== "all") params.push(`bedrooms=${heroBedrooms}`);
    const hash = params.length > 0 ? `#projects?${params.join("&")}` : "/projects";
    onNavigate(hash);
  };

  // Reset filters
  const resetFilters = () => {
    setHeroProject("all");
    setHeroBedrooms("all");
  };

  // Calculate for NOXH — dùng config theo dự án được chọn
  const getCalculatorResults = () => {
    const cfg = projectCalcConfig[selectedCalcProject];
    const loanPercent = paymentOption === "cash" ? 0 : cfg.loanPercent;
    const interestRate = paymentOption === "commercial" ? 8.0 : cfg.policyRate;
    const loanYears = paymentOption === "cash" ? 0 : cfg.loanYears;

    const totalPrice = investmentValue;
    const downPayment = totalPrice * (100 - loanPercent) / 100;
    const loanAmount = totalPrice * loanPercent / 100;

    let monthlyPayment = 0;
    if (loanAmount > 0 && loanYears > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanYears * 12;
      monthlyPayment = (loanAmount * 1000 * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const totalInterest = monthlyPayment > 0
      ? (monthlyPayment * loanYears * 12) - loanAmount * 1000
      : 0;

    const recommended = allProjects.filter(p =>
      p.priceNumber >= investmentValue * 0.7 && p.priceNumber <= investmentValue * 1.3
    ).slice(0, 2);

    return {
      downPayment: downPayment.toFixed(2),
      loanAmount: loanAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(1),
      totalInterest: totalInterest.toFixed(0),
      loanYears,
      loanPercent,
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
      quote: "Tôi mua căn 2PN tại K-Home CityView Hố Nai vì giá hợp lý và thủ tục hồ sơ NOXH được hỗ trợ tận tình từ đầu đến cuối. Lãi suất 5,4%/năm giúp tôi an tâm hơn rất nhiều về kế hoạch tài chính.",
      author: "Chị Nguyễn Thị Lan",
      role: "Giáo viên THPT, Biên Hòa",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      quote: "Gia đình tôi chọn K-Home Avenue Nhơn Trạch vì vị trí thuận tiện và môi trường sống xanh. Đội ngũ Kim Oanh Land hỗ trợ hồ sơ miễn phí, rất chuyên nghiệp và nhiệt tình.",
      author: "Anh Trần Văn Hùng",
      role: "Kỹ sư, KCN Long Thành",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
    },
    {
      quote: "K-Home Midtown Trảng Bom là lựa chọn đúng đắn của tôi. Tiêu chuẩn xanh EDGE tiết kiệm điện nước rõ rệt, tiến độ thi công đúng hẹn, pháp lý sở hữu lâu dài rất yên tâm.",
      author: "Chị Phạm Thị Hoa",
      role: "Nhân viên văn phòng, Trảng Bom",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
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
                  onClick={() => onNavigate("/contact")}
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
                      src={imgUrl(project.image)}
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
              {/* Filter 1: Dự án */}
              <div className="space-y-2">
                <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Chọn Dự Án</label>
                <div className="relative">
                  <select
                    value={heroProject}
                    onChange={(e) => setHeroProject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Tất cả dự án</option>
                    <option value="k-home-cityview-ho-nai">K-Home CityView Biên Hòa</option>
                    <option value="k-home-midtown-trang-bom">K-Home Midtown Trảng Bom</option>
                    <option value="k-home-avenue-nhon-trach">K-Home Avenue Nhơn Trạch</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              {/* Filter 2: Loại căn */}
              <div className="space-y-2">
                <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Loại Căn Hộ</label>
                <div className="relative">
                  <select
                    value={heroBedrooms}
                    onChange={(e) => setHeroBedrooms(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                  >
                    <option value="all">Tất cả loại căn</option>
                    <option value="studio">Studio</option>
                    <option value="1pn">Căn 1 Phòng Ngủ</option>
                    <option value="2pn">Căn 2 Phòng Ngủ</option>
                    <option value="3pn">Căn 3 Phòng Ngủ</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Xem Rổ Hàng
                </button>
                {(heroProject !== "all" || heroBedrooms !== "all") && (
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
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Lãi suất ưu đãi NOXH 5,4%/năm</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. INTERACTIVE PREMIUM BRAND STATISTICS CARD (WARM SUNSET GRADIENT)
          ========================================================= */}
      <section id="stats" ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
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
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">{count15}+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Dự án bàn giao</span>
              <p className="text-amber-100/80 text-[11px]">Vượt tiến độ cam kết</p>
            </div>
            
            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">{count12k}K+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Cư dân tinh hoa</span>
              <p className="text-amber-100/80 text-[11px]">Tin dùng thương hiệu</p>
            </div>

            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Landmark className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">{count10}+</span>
              <span className="text-amber-50 text-xs font-bold tracking-wider uppercase block">Năm phát triển</span>
              <p className="text-amber-100/80 text-[11px]">Bảo chứng chữ Tín vàng</p>
            </div>

            <div className="space-y-1 pt-6 lg:pt-0">
              <div className="flex justify-center mb-1">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-yellow-100">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <span className="block text-4xl md:text-5xl font-display font-extrabold text-white">{count98}%</span>
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
                onClick={() => onNavigate(`/projects/${projectCarousel[activeProjectTab].slug}`)}
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
                <div
                  className="absolute top-5 left-5 text-white text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md transition-all duration-300"
                  style={{ backgroundColor: projectCarousel[activeProjectTab].badgeColor }}
                >
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
          5. CALCULATOR – KẾ HOẠCH TÀI CHÍNH MUA NHÀ Ở XÃ HỘI
          ========================================================= */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Công cụ tài chính NOXH</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Tính Trả Góp Mua Nhà Ở Xã Hội
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Nhập giá trị căn hộ dự kiến và phương thức vay để ước tính số tiền trả trước, khoản vay và trả góp hàng tháng theo lãi suất ưu đãi NOXH.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-br-full" />
          
          {/* Controls - Left Side */}
          <div className="lg:col-span-7 space-y-8 relative z-10">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Calculator className="w-5 h-5 text-amber-600" /> Nhập Thông Số Kế Hoạch Mua Nhà
            </h3>

            {/* Bước 1: Chọn dự án */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-700 block">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">01</span>
                Chọn dự án bạn quan tâm:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(projectCalcConfig).map(([slug, cfg]) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      setSelectedCalcProject(slug);
                      setInvestmentValue(cfg.priceMin);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedCalcProject === slug
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-slate-200 hover:border-amber-300 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-800">{cfg.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Vay tối đa {cfg.loanPercent}% · {cfg.loanYears} năm · Lãi suất NOXH {cfg.policyRate}%/năm
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ml-3 ${
                      selectedCalcProject === slug ? "bg-amber-500 border-amber-500" : "border-slate-300"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bước 2: Slider giá trị căn hộ */}
            <div className="space-y-4">
              <span className="text-sm font-semibold text-slate-700 block">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">02</span>
                Giá trị căn hộ dự kiến:
              </span>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 text-xs">Kéo để chọn mức giá</span>
                <span className="text-lg font-bold text-amber-600 bg-amber-50 px-3.5 py-1 rounded-lg">
                  {investmentValue} Tỷ VNĐ
                </span>
              </div>
              <input
                type="range"
                min={projectCalcConfig[selectedCalcProject].priceMin}
                max={projectCalcConfig[selectedCalcProject].priceMax}
                step={projectCalcConfig[selectedCalcProject].priceStep}
                value={investmentValue}
                onChange={(e) => setInvestmentValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{projectCalcConfig[selectedCalcProject].noteMin}</span>
                <span>{projectCalcConfig[selectedCalcProject].noteMax}</span>
              </div>
            </div>

            {/* Bước 3: Gói vay */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-slate-700 block">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">03</span>
                Chọn gói vay:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button type="button" onClick={() => setPaymentOption("policy")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    paymentOption === "policy" ? "border-amber-500 bg-amber-500/5 shadow-sm" : "border-slate-200 hover:border-amber-300 bg-slate-50/50"
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentOption === "policy" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"}`}>✓</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">NH Chính Sách XH</span>
                    <span className="text-xs text-amber-600 font-semibold block">
                      {projectCalcConfig[selectedCalcProject].policyRate}%/năm · {projectCalcConfig[selectedCalcProject].loanYears} năm
                    </span>
                  </div>
                </button>

                <button type="button" onClick={() => setPaymentOption("commercial")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    paymentOption === "commercial" ? "border-amber-500 bg-amber-500/5 shadow-sm" : "border-slate-200 hover:border-amber-300 bg-slate-50/50"
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentOption === "commercial" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"}`}>✓</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">NH Thương Mại</span>
                    <span className="text-xs text-amber-600 font-semibold block">
                      ~8%/năm · {projectCalcConfig[selectedCalcProject].loanYears} năm
                    </span>
                  </div>
                </button>

                <button type="button" onClick={() => setPaymentOption("cash")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    paymentOption === "cash" ? "border-amber-500 bg-amber-500/5 shadow-sm" : "border-slate-200 hover:border-amber-300 bg-slate-50/50"
                  }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paymentOption === "cash" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-400"}`}>✓</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Thanh Toán 1 Lần</span>
                    <span className="text-xs text-amber-600 font-semibold block">Không cần vay</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bảng tiến độ thanh toán — động theo dự án */}
            {paymentOption !== "cash" && (
              <div className="space-y-3">
                <span className="text-sm font-semibold text-slate-700 block">
                  📅 Lịch đóng tiền vốn tự có ({100 - projectCalcConfig[selectedCalcProject].loanPercent}%):
                </span>
                <div className="rounded-xl border border-slate-100 overflow-hidden text-[11px]">
                  <div className="grid grid-cols-3 bg-amber-500 text-white font-bold px-3 py-2">
                    <span>Đợt</span>
                    <span className="text-center">Tiến độ</span>
                    <span className="text-right">Ghi chú</span>
                  </div>
                  {projectCalcConfig[selectedCalcProject].schedule.map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 px-3 py-2 border-b border-slate-50 ${i % 2 === 0 ? "bg-amber-50/40" : "bg-white"}`}>
                      <span className="font-semibold text-slate-700">{row.dot}</span>
                      <span className="text-center font-bold text-amber-700">{row.pct}</span>
                      <span className="text-right text-slate-500">{row.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Điều kiện + hotline */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-slate-600 leading-relaxed space-y-1">
              <p className="font-bold text-amber-700">📋 Điều kiện vay NH Chính sách xã hội Đồng Nai:</p>
              <p>· Thu nhập dưới 25tr/tháng (độc thân) · Dưới 50tr/tháng (vợ chồng)</p>
              <p>· Chưa có nhà ở tại Đồng Nai · Chưa từng mua NOXH ở Việt Nam</p>
              <p className="text-amber-700 font-semibold pt-1">📞 Hotline hỗ trợ hồ sơ miễn phí: 0799.898.893</p>
            </div>
          </div>

          {/* Output - Right Side */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white relative flex flex-col justify-between border border-amber-400/20 shadow-xl">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-tl-full" />
            
            <div className="space-y-5 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-100 bg-white/15 border border-white/10 px-3 py-1 rounded-full inline-block">
                KẾT QUẢ DỰ TÍNH
              </span>

              {/* Trả trước */}
              <div className="space-y-1">
                <span className="text-xs text-amber-100 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-yellow-200" /> Vốn tự có cần chuẩn bị ({100 - calcResults.loanPercent}%):
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {calcResults.downPayment} Tỷ VNĐ
                </div>
                <p className="text-[10px] text-amber-100/70">Đóng theo nhiều đợt — không phải 1 lần</p>
              </div>

              {/* Khoản vay */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-xs text-amber-100 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-yellow-200" /> Khoản vay ngân hàng ({calcResults.loanPercent}%):
                </span>
                <div className="text-2xl font-extrabold text-yellow-100 font-display">
                  {calcResults.loanAmount} Tỷ VNĐ
                </div>
                <p className="text-[10px] text-amber-100/70">
                  {paymentOption === "policy"
                    ? `${projectCalcConfig[selectedCalcProject].policyRate}%/năm · NH Chính sách · ${calcResults.loanYears} năm`
                    : paymentOption === "commercial"
                    ? `~8%/năm · NH Thương mại · ${calcResults.loanYears} năm`
                    : "Không vay"}
                </p>
              </div>

              {/* Trả góp hàng tháng */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-xs text-amber-100 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-yellow-200" /> Trả góp hàng tháng:
                </span>
                {paymentOption === "cash" ? (
                  <div className="text-2xl font-extrabold text-yellow-100 font-display">Thanh toán 1 lần</div>
                ) : (
                  <>
                    <div className="text-3xl sm:text-4xl font-extrabold text-yellow-100 font-display flex items-baseline gap-1">
                      ~{calcResults.monthlyPayment} <span className="text-xs text-white/90 font-normal">triệu/tháng</span>
                    </div>
                    <p className="text-[10px] text-amber-100/70">Trong {calcResults.loanYears} năm · Tổng lãi ~{Number(calcResults.totalInterest).toLocaleString("vi")} triệu</p>
                  </>
                )}
              </div>

              {/* Dự án phù hợp */}
            </div>

            <div className="pt-5 relative z-10">
              <button
                onClick={() => onNavigate("/contact")}
                className="w-full bg-white hover:bg-amber-50 text-amber-800 font-bold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                Tư Vấn Hồ Sơ Miễn Phí <ArrowRight className="w-3.5 h-3.5" />
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
              <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3 py-1.5 rounded-full inline-block">3 Dự án đang triển khai</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
                Dự Án Nổi Bật
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full" />
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("/projects")}
                className="text-amber-700 font-bold text-sm hover:text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-white px-5 py-2.5 rounded-full border border-slate-200 hover:border-amber-400/30 shadow-sm"
              >
                Xem Toàn Bộ Dự Án ({allProjects.length ? allProjects.length : "..."}) <ArrowRight className="w-4 h-4" />
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
                  <p className="text-slate-500 text-sm px-6">Vui lòng đặt lại bộ lọc để xem các dự án đang triển khai.</p>
                  <button
                    onClick={resetFilters}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-5 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Xem Tất Cả Dự Án
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => {
                    // Tiến độ thi công thực tế theo từng dự án
                    const progressMap: Record<string, { label: string; rate: string }> = {
                      "k-home-cityview-ho-nai":    { label: "Tiến độ thi công", rate: "35%" },
                      "k-home-avenue-nhon-trach":  { label: "Đã đăng ký giữ chỗ", rate: "60%" },
                      "k-home-midtown-trang-bom":  { label: "Tiến độ thi công", rate: "20%" },
                    };
                    const progress = progressMap[project.slug] ?? { label: "Đã đăng ký", rate: "50%" };
                    return (
                      <div
                        key={project.id}
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-500/20 transition-all duration-500 group flex flex-col h-full cursor-pointer relative"
                        onClick={() => onNavigate(`/projects/${project.slug}`)}
                      >
                        {/* Image */}
                        <div className="relative h-72 overflow-hidden bg-slate-100">
                          <img
                            src={imgUrl(project.image)}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                          
                          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                            {project.type}
                          </div>
                          
                          <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md ${
                            project.status === "Đang bốc thăm"
                              ? "bg-amber-500 text-white"
                              : project.status === "Sắp công bố"
                              ? "bg-blue-600 text-white"
                              : project.status === "Đã công bố"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-600 text-white"
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

                          {/* Progress bar — tiến độ thực tế */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-semibold">{progress.label}</span>
                              <span className="text-amber-600 font-bold">{progress.rate}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" 
                                style={{ width: progress.rate }}
                              />
                            </div>
                          </div>

                          {/* Price & Area */}
                          <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-sm mt-auto">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Quy mô diện tích</span>
                              <span className="font-bold text-slate-700 block text-xs sm:text-sm mt-0.5">{project.area}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Giá từ</span>
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
              Hỗ trợ hồ sơ NOXH miễn phí — Hotline 0933.354.093
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">
              Tư Vấn Mua Nhà Ở Xã Hội <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100">
                Lãi Suất Chỉ 5,4%/Năm
              </span>
            </h2>
            <p className="text-amber-50 text-xs sm:text-sm font-light leading-relaxed">
              Đội ngũ tư vấn Kim Oanh Land hỗ trợ toàn bộ hồ sơ miễn phí — từ kiểm tra điều kiện, chuẩn bị giấy tờ đến kết nối ngân hàng chính sách xã hội tỉnh Đồng Nai.
            </p>
          </div>
          
          <div className="shrink-0 relative z-10 w-full lg:w-auto text-center">
            <button
              onClick={() => onNavigate("/contact")}
              className="w-full lg:w-auto bg-white hover:bg-amber-100 text-amber-800 px-10 py-5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-orange-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              Đăng Ký Tư Vấn Miễn Phí <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-amber-100/90 mt-3 font-medium">Hotline Kim Oanh Land: 0799.898.893</p>
          </div>
        </div>
      </section>

    </div>
  );
}

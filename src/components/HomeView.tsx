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
  Info,
  X,
  Send,
  CheckCircle
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
      status: "Đang bốc thăm",
      statusColor: "#f59e0b",
    },
    {
      name: "K-Home Midtown Trảng Bom",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-birdview-toan-canh-dem-2048x1150.webp",
      location: "Giữa 4 tuyến đường 30/4 – Hùng Vương – Lý Nam Đế – Lê Đại Hành, P. Trảng Bom, Đồng Nai",
      scale: "13,97 hecta",
      product: "542 căn hộ NOXH và 20 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Global Vireon Studio, Kiến Trúc Việt, NAGECCO, K-City",
      status: "Đã công bố",
      statusColor: "#6ee7b7",
    },
    {
      name: "K-Home Avenue Nhơn Trạch",
      image: "/k-home avenue/PC02-TT-10K_2-min.jpg.webp",
      location: "Đường Nguyễn Ái Quốc (25C), xã Nhơn Trạch, tỉnh Đồng Nai",
      scale: "5,3 hecta",
      product: "1.022 căn hộ NOXH và 82 căn shophouse",
      developer: "Kim Oanh Land • K-Home Group",
      partner: "Surbana Jurong, Global Vireon Studio, Handong, Coninco, K-City",
      status: "Sắp công bố",
      statusColor: "#7dd3fc",
    },
  ];

  // Quick Hero Filter states
  const [heroProject, setHeroProject] = useState<string>("all");
  const [heroBedrooms, setHeroBedrooms] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<"project" | "bedrooms" | null>(null);

  // Interactive Showroom Active Tab
  const [activeShowroomTab, setActiveShowroomTab] = useState<number>(0);

  // Project Carousel (right panel of amenities section)
  const [activeProjectTab, setActiveProjectTab] = useState<number>(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState<boolean>(false);

  // Popup lead form state
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popupName, setPopupName] = useState("");
  const [popupPhone, setPopupPhone] = useState("");
  const [popupProject, setPopupProject] = useState("k-home-cityview-ho-nai");
  const [popupSubmitting, setPopupSubmitting] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);

  // Inline consultation form state
  const [ctaName, setCtaName] = useState("");
  const [ctaPhone, setCtaPhone] = useState("");
  const [ctaProject, setCtaProject] = useState("k-home-cityview-ho-nai");
  const [ctaSubmitting, setCtaSubmitting] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [ctaError, setCtaError] = useState("");

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
      badgeColor: "#7dd3fc",
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
      badgeColor: "#6ee7b7",
      image: "/k-home midtown/Du-an-K-Home-Midtown-3d-ho-boi-view-2-2048x1150.webp"
    }
  ];

  // Investment Calculator States
  const [investmentValue, setInvestmentValue] = useState<number>(1.0); // Tỷ VNĐ
  const [paymentOption, setPaymentOption] = useState<string>("policy");
  const [selectedCalcProject, setSelectedCalcProject] = useState<string>("k-home-cityview-ho-nai");
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);

  // Config theo từng dự án
  const projectCalcConfig: Record<string, {
    name: string;
    loanYears: number;
    loanPercent: number;
    policyRate: number;
    units: { label: string; area: string; price: number; priceMin: number; priceMax: number; priceLabel: string }[];
    schedule: { dot: string; pct: string; note: string }[];
  }> = {
    "k-home-cityview-ho-nai": {
      name: "K-Home CityView Hố Nai",
      loanYears: 25,
      loanPercent: 75,
      policyRate: 5.4,
      units: [
        { label: "1PN+A", area: "47,3m²",  price: 1.0,   priceMin: 0.95,  priceMax: 1.05,  priceLabel: "950tr – 1,05 tỷ" },
        { label: "1PN+B", area: "62,4m²",  price: 1.325, priceMin: 1.25,  priceMax: 1.40,  priceLabel: "1,25 – 1,40 tỷ" },
        { label: "2PN",   area: "70,4m²",  price: 1.55,  priceMin: 1.50,  priceMax: 1.60,  priceLabel: "1,50 – 1,60 tỷ" },
        { label: "3PN",   area: "84,4m²",  price: 1.9,   priceMin: 1.80,  priceMax: 2.00,  priceLabel: "1,80 – 2,00 tỷ" },
      ],
      schedule: [
        { dot: "Cọc",        pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
        { dot: "Đợt 1",      pct: "15%",                note: "7 ngày kể từ ngày cọc, Ký HĐDVTV" },
        { dot: "Đợt 2",      pct: "5%",                 note: "30 ngày kể từ ngày đến hạn đợt 1" },
        { dot: "Đợt 3",      pct: "5%",                 note: "30 ngày kể từ ngày đến hạn đợt 2" },
        { dot: "Đợt 4",      pct: "75% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao",   pct: "Phí bảo trì 2%",    note: "15 ngày kể từ ngày nhận thông báo BG" },
      ],
    },
    "k-home-avenue-nhon-trach": {
      name: "K-Home Avenue Nhơn Trạch",
      loanYears: 25,
      loanPercent: 75,
      policyRate: 5.4,
      units: [
        { label: "Studio", area: "38m²",   price: 0.75,  priceMin: 0.75,  priceMax: 0.85,  priceLabel: "Từ 750 triệu" },
        { label: "1PN+",   area: "47m²",   price: 0.95,  priceMin: 0.95,  priceMax: 1.05,  priceLabel: "950 triệu" },
        { label: "2PN-S",  area: "65m²",   price: 1.4,   priceMin: 1.40,  priceMax: 1.50,  priceLabel: "Từ 1,4 tỷ" },
        { label: "2PN-L",  area: "69,5m²", price: 1.5,   priceMin: 1.50,  priceMax: 1.60,  priceLabel: "1,5 tỷ" },
      ],
      schedule: [
        { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
        { dot: "Đợt 1",    pct: "15%",                note: "7 ngày kể từ ngày cọc, khách TT đợt 1 và ký HĐDVTV" },
        { dot: "Đợt 2",    pct: "5%",                 note: "30 ngày kể từ ngày đến hạn TT đợt 1" },
        { dot: "Đợt 3",    pct: "5%",                 note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
        { dot: "Đợt 4",    pct: "75% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao", pct: "Phí bảo trì 2%",    note: "15 ngày kể từ ngày nhận thông báo BG" },
      ],
    },
    "k-home-midtown-trang-bom": {
      name: "K-Home Midtown Trảng Bom",
      loanYears: 25,
      loanPercent: 75,
      policyRate: 5.4,
      units: [
        { label: "Studio", area: "~35m²",  price: 0.8,   priceMin: 0.80,  priceMax: 0.90,  priceLabel: "Từ ~800 triệu" },
        { label: "1PN+A",  area: "~47m²",  price: 1.0,   priceMin: 1.00,  priceMax: 1.15,  priceLabel: "Từ ~1,0 tỷ" },
        { label: "1PN+B",  area: "~55m²",  price: 1.2,   priceMin: 1.20,  priceMax: 1.35,  priceLabel: "Từ ~1,2 tỷ" },
        { label: "2PN",    area: "~65m²",  price: 1.4,   priceMin: 1.40,  priceMax: 1.55,  priceLabel: "Từ ~1,4 tỷ" },
      ],
      schedule: [
        { dot: "Cọc",      pct: "30.000.000đ",        note: "Ngay khi ký Phiếu xác nhận cọc" },
        { dot: "Đợt 1",    pct: "15%",                note: "7 ngày kể từ ngày cọc, ký HĐDVTV" },
        { dot: "Đợt 2",    pct: "5%",                 note: "30 ngày kể từ ngày đến hạn đợt 1" },
        { dot: "Đợt 3",    pct: "10%",                note: "30 ngày kể từ ngày đến hạn đợt 2" },
        { dot: "Đợt 4",    pct: "75% (NH giải ngân)", note: "Ngân hàng giải ngân" },
        { dot: "Bàn giao", pct: "Phí bảo trì 2%",    note: "15 ngày kể từ ngày nhận thông báo BG" },
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

  // Auto-rotate project carousel every 4 seconds — dừng khi hover
  useEffect(() => {
    if (isCarouselHovered) return;
    const timer = setInterval(() => {
      setActiveProjectTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [isCarouselHovered]);

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
    { id: "hero",             label: "Tổng quan dự án" },
    { id: "featured-projects",label: "Danh mục kiệt tác" },
    { id: "amenities",        label: "Tiện ích nội khu" },
    { id: "calculator",       label: "Phân tích đầu tư" },
    { id: "philosophy",       label: "Giá trị cốt lõi" },
    { id: "testimonials",     label: "Chia sẻ cư dân" },
    { id: "consultation",     label: "Đăng ký tư vấn VIP" }
  ];

  // Auto-advance hero slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroProjects.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [heroProjects.length]);

  // Popup timer — show after 8 seconds, only once per session
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("popupShown");
    if (alreadySeen) return;
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("popupShown", "1");
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "K-Home Đồng Nai | CityView – Midtown – Avenue | Nhà Ở Xã Hội Kim Oanh Group";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Tổng hợp thông tin 3 dự án nhà ở xã hội K-Home tại Đồng Nai từ chủ đầu tư Kim Oanh Group: K-Home CityView (Hố Nai, Biên Hòa), K-Home Midtown (Trảng Bom), K-Home Avenue (Nhơn Trạch). Tư vấn bảng giá, chính sách chiết khấu và mặt bằng chi tiết.");
    }
  }, []);

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

  // Handle hero quick search — navigate sang /projects với query params đúng
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroProject !== "all") params.set("project", heroProject);
    if (heroBedrooms !== "all") params.set("bedrooms", heroBedrooms);
    const query = params.toString();
    onNavigate(query ? `/san-pham?${query}` : "/san-pham");
  };

  // Reset filters
  const resetFilters = () => {
    setHeroProject("all");
    setHeroBedrooms("all");
  };

  // Submit inline CTA form
  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCtaError("");
    if (!ctaName.trim() || !ctaPhone.trim()) {
      setCtaError("Vui lòng điền Họ tên và Số điện thoại.");
      return;
    }
    setCtaSubmitting(true);
    const projectNameMap: Record<string, string> = {
      "k-home-cityview-ho-nai":   "K-Home CityView Biên Hòa",
      "k-home-midtown-trang-bom": "K-Home Midtown Trảng Bom",
      "k-home-avenue-nhon-trach": "K-Home Avenue Nhơn Trạch",
    };
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ctaName.trim(),
        phone: ctaPhone.trim(),
        email: "",
        projectSlug: ctaProject,
        projectName: projectNameMap[ctaProject] ?? ctaProject,
        message: "Đăng ký tư vấn từ banner trang chủ."
      })
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setCtaSuccess(true); setCtaSubmitting(false); })
      .catch(() => { setCtaError("Có lỗi xảy ra. Vui lòng thử lại."); setCtaSubmitting(false); });
  };

  // Submit popup form
  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupName.trim() || !popupPhone.trim()) return;
    setPopupSubmitting(true);
    const projectNameMap: Record<string, string> = {
      "k-home-cityview-ho-nai":   "K-Home CityView Biên Hòa",
      "k-home-midtown-trang-bom": "K-Home Midtown Trảng Bom",
      "k-home-avenue-nhon-trach": "K-Home Avenue Nhơn Trạch",
    };
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: popupName.trim(),
        phone: popupPhone.trim(),
        email: "",
        projectSlug: popupProject,
        projectName: projectNameMap[popupProject] ?? popupProject,
        message: "Đăng ký tư vấn từ popup tự động."
      })
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(() => { setPopupSuccess(true); setPopupSubmitting(false); })
      .catch(() => { setPopupSubmitting(false); });
  };

  // Calculate for NOXH — dùng config theo dự án được chọn
  const getCalculatorResults = () => {
    const cfg = projectCalcConfig[selectedCalcProject];
    const loanPercent = paymentOption === "cash" ? 0 : cfg.loanPercent;
    const interestRate = cfg.policyRate;
    const loanYears = paymentOption === "cash" ? 0 : cfg.loanYears;

    const downPayment = investmentValue * (100 - loanPercent) / 100;
    const loanAmount = investmentValue * loanPercent / 100;

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

    return {
      unitPrice: investmentValue.toFixed(2),
      downPayment: downPayment.toFixed(2),
      loanAmount: loanAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(1),
      totalInterest: totalInterest.toFixed(0),
      loanYears,
      loanPercent,
    };
  };

  const calcResults = getCalculatorResults();

  const coreValues = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Vị Trí Thuận Tiện",
    subtitle: "Gần Khu Công Nghiệp & Trung Tâm",
    description: "Các dự án tọa lạc tại những vị trí kết nối thuận lợi với khu công nghiệp lớn, đường vành đai và trung tâm hành chính, giúp cư dân tiết kiệm thời gian di chuyển hàng ngày."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Tiện Ích Đầy Đủ",
    subtitle: "Sống Tiện Nghi Ngay Trong Khuôn Viên",
    description: "Hồ bơi, sân chơi trẻ em, khu thể dục ngoài trời, vườn cảnh quan và nhà sinh hoạt cộng đồng được quy hoạch đồng bộ, phục vụ nhu cầu thiết thực của gia đình mỗi ngày."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Pháp Lý Rõ Ràng",
    subtitle: "An Tâm Sở Hữu Lâu Dài",
    description: "Hồ sơ pháp lý đầy đủ, được bảo lãnh bởi ngân hàng, sở hữu lâu dài theo quy định nhà ở xã hội. Hỗ trợ hoàn thiện thủ tục từ A đến Z miễn phí."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Giá Trị Ổn Định",
    subtitle: "Tài Sản Thiết Thực Cho Tương Lai",
    description: "Giá thành hợp lý theo khung nhà ở xã hội, chính sách vay ưu đãi 5,4%/năm giúp gia đình dễ dàng tiếp cận. Tài sản có thanh khoản tốt và giá trị gia tăng theo hạ tầng xung quanh."
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
      avatar: "https://hthaostudio.com/wp-content/uploads/2020/07/%E1%BA%A2nh-%C3%A1o-d%C3%A0i-hoa-sen-22.jpg"
    },
    {
      quote: "Gia đình tôi chọn K-Home Avenue Nhơn Trạch vì vị trí thuận tiện và môi trường sống xanh. Đội ngũ Kim Oanh Land hỗ trợ hồ sơ miễn phí, rất chuyên nghiệp và nhiệt tình.",
      author: "Anh Trần Văn Hùng",
      role: "Kỹ sư, KCN Long Thành",
      rating: 5,
      avatar: "https://images.pexels.com/photos/35107772/pexels-photo-35107772/free-photo-of-chang-trai-tr-t-tin-trong-trang-ph-c-cong-s-trang-tr-ng.jpeg?cs=tinysrgb&dpr=1&w=500"
    },
    {
      quote: "K-Home Midtown Trảng Bom là lựa chọn đúng đắn của tôi. Tiêu chuẩn xanh EDGE tiết kiệm điện nước rõ rệt, tiến độ thi công đúng hẹn, pháp lý sở hữu lâu dài rất yên tâm.",
      author: "Chị Phạm Thị Hoa",
      role: "Nhân viên văn phòng, Trảng Bom",
      rating: 5,
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe5bgvBMjwmB--wJxT-wGk3q5w9zjRToatkA8wfeCcNwR9QZXPY0pkyrA&s=10"
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
        className="relative w-full flex flex-col justify-center items-center pt-24 pb-8 lg:py-24"
        style={{ minHeight: "100svh" }}
      >
        {/* Background — stretch theo content, không bị cắt */}
        <div
          className="absolute inset-0 -z-0"
          style={{
            backgroundImage: "url('/hero-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

        {/* Diagonal Wave Lines for Premium Texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Content Container (Grid Layout inspired by premium screenshot) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col justify-center h-full gap-6 sm:gap-12 lg:py-16">
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
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/30 space-y-2 sm:space-y-4 shadow-xl">
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
            <div className="lg:col-span-7 flex flex-col gap-3">
              
              {/* Carousel Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 h-[220px] sm:h-[300px] lg:h-[450px] w-full">
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
                        <div className="bg-white/20 backdrop-blur-md py-1 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border drop-shadow-lg mx-auto"
                          style={{ backgroundColor: project.statusColor + "33", borderColor: project.statusColor + "99", color: project.statusColor }}>
                          <Activity className="w-3 h-3 animate-pulse" style={{ color: project.statusColor }} /> {project.status}
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
          <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-amber-100 rounded-3xl p-4 sm:p-8 shadow-2xl relative z-20 mb-4 sm:mb-0">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            
            <form onSubmit={handleHeroSearch} className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:items-end">
              {/* 2 dropdowns cạnh nhau trên mobile */}
              <div className="grid grid-cols-2 gap-3 sm:contents">

                {/* Filter 1: Chọn Dự Án — custom dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Chọn Dự Án</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "project" ? null : "project")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 flex items-center justify-between gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <span className="truncate text-left">
                        {heroProject === "all" ? "Tất cả dự án"
                          : heroProject === "k-home-cityview-ho-nai" ? "K-Home CityView Biên Hòa"
                          : heroProject === "k-home-midtown-trang-bom" ? "K-Home Midtown Trảng Bom"
                          : "K-Home Avenue Nhơn Trạch"}
                      </span>
                      <svg className={`w-4 h-4 shrink-0 text-amber-500 transition-transform ${openDropdown === "project" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openDropdown === "project" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                        {[
                          { value: "all", label: "Tất cả dự án" },
                          { value: "k-home-cityview-ho-nai", label: "K-Home CityView Biên Hòa" },
                          { value: "k-home-midtown-trang-bom", label: "K-Home Midtown Trảng Bom" },
                          { value: "k-home-avenue-nhon-trach", label: "K-Home Avenue Nhơn Trạch" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setHeroProject(opt.value); setHeroBedrooms("all"); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2.5 ${
                              heroProject === opt.value
                                ? "bg-amber-500 text-white font-semibold"
                                : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                            }`}
                          >
                            {heroProject === opt.value
                              ? <span className="w-5 h-5 rounded-md bg-amber-500 border-2 border-amber-500 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                              : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                            }
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Filter 2: Loại Căn Hộ — custom dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 text-xs font-bold uppercase tracking-wider">Loại Căn Hộ</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === "bedrooms" ? null : "bedrooms")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 flex items-center justify-between gap-2 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <span className="truncate text-left">
                        {heroBedrooms === "all" ? "Tất cả loại căn"
                          : heroBedrooms === "studio" ? "Studio"
                          : heroBedrooms === "1pn" ? "Căn 1 Phòng Ngủ"
                          : heroBedrooms === "2pn" ? "Căn 2 Phòng Ngủ"
                          : "Căn 3 Phòng Ngủ"}
                      </span>
                      <svg className={`w-4 h-4 shrink-0 text-amber-500 transition-transform ${openDropdown === "bedrooms" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {openDropdown === "bedrooms" && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden z-50">
                        {[
                          { value: "all", label: "Tất cả loại căn", show: true },
                          { value: "studio", label: "Studio", show: heroProject !== "k-home-cityview-ho-nai" },
                          { value: "1pn", label: "Căn 1 Phòng Ngủ", show: true },
                          { value: "2pn", label: "Căn 2 Phòng Ngủ", show: true },
                          { value: "3pn", label: "Căn 3 Phòng Ngủ", show: heroProject === "all" || heroProject === "k-home-cityview-ho-nai" },
                        ].filter(o => o.show).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setHeroBedrooms(opt.value); setOpenDropdown(null); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-2.5 ${
                              heroBedrooms === opt.value
                                ? "bg-amber-500 text-white font-semibold"
                                : "text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:pl-6"
                            }`}
                          >
                            {heroBedrooms === opt.value
                              ? <span className="w-5 h-5 rounded-md bg-amber-500 border-2 border-amber-500 flex items-center justify-center shrink-0"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                              : <span className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0" />
                            }
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={() => setOpenDropdown(null)}
                  className="flex-grow bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Xem Rổ Hàng
                </button>
                {(heroProject !== "all" || heroBedrooms !== "all") && (
                  <button
                    type="button"
                    onClick={() => { resetFilters(); setOpenDropdown(null); }}
                    className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-3 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Đặt lại
                  </button>
                )}
              </div>
            </form>

            {/* Đóng dropdown khi click ra ngoài */}
            {openDropdown && (
              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            )}

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
          2. DANH MỤC KIỆT TÁC — FEATURED PROJECTS (moved after hero)
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
                onClick={() => onNavigate("/san-pham")}
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
                        onClick={() => onNavigate(`/${project.slug}`)}
                      >
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
                              ? "bg-amber-400 text-slate-900"
                              : project.status === "Sắp công bố"
                              ? "bg-sky-300 text-slate-900"
                              : project.status === "Đã công bố"
                              ? "bg-emerald-300 text-slate-900"
                              : "bg-white/90 text-slate-800"
                          }`}>
                            {project.status}
                          </div>
                        </div>
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
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400 font-semibold">{progress.label}</span>
                              <span className="text-amber-600 font-bold">{progress.rate}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" style={{ width: progress.rate }} />
                            </div>
                          </div>
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
              {/* Main carousel */}
              <div
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                onClick={() => onNavigate(`/${projectCarousel[activeProjectTab].slug}`)}
                className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl h-[220px] sm:h-[300px] lg:h-[450px] bg-slate-100 cursor-pointer"
              >
                {/* Images — crossfade với ease-in-out */}
                {projectCarousel.map((project, idx) => (
                  <div
                    key={project.slug}
                    className="absolute inset-0"
                    style={{
                      opacity: activeProjectTab === idx ? 1 : 0,
                      transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: activeProjectTab === idx ? 1 : 0,
                    }}
                  >
                    <img
                      src={showroomGallery[activeShowroomTab].images[idx]}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      style={{
                        transform: activeProjectTab === idx ? "scale(1.03)" : "scale(1)",
                        transition: "transform 5s ease-out",
                      }}
                    />
                  </div>
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent z-10" />

                {/* Badge */}
                <div
                  className="absolute top-4 left-4 z-20 text-slate-900 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-md"
                  style={{ backgroundColor: projectCarousel[activeProjectTab].badgeColor, transition: "background-color 0.4s ease" }}
                >
                  {projectCarousel[activeProjectTab].badge}
                </div>

                {/* Hover hint */}
                <div
                  className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{ opacity: isCarouselHovered ? 1 : 0, transition: "opacity 0.3s ease" }}
                >
                  Xem dự án <ArrowUpRight className="w-3 h-3" />
                </div>

                {/* Info overlay — fade khi đổi slide */}
                {projectCarousel.map((project, idx) => (
                  <div
                    key={`info-${project.slug}`}
                    className="absolute bottom-5 left-5 right-5 z-20 space-y-1.5"
                    style={{
                      opacity: activeProjectTab === idx ? 1 : 0,
                      transform: activeProjectTab === idx ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                  >
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">{project.tag}</span>
                    <h3 className="text-lg sm:text-2xl font-bold font-display text-white leading-tight">{project.name}</h3>
                    <p className="text-slate-300 text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {project.location}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="bg-white/15 border border-white/20 rounded-lg px-2.5 py-1 text-[11px] font-bold text-amber-200">{project.price}</div>
                      <div className="bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-slate-300">{project.scale}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thumbnails */}
              <div className="flex items-center justify-center gap-3">
                {projectCarousel.map((project, idx) => (
                  <button
                    key={project.slug}
                    onClick={() => { setActiveProjectTab(idx); }}
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      width: activeProjectTab === idx ? "5rem" : "4rem",
                      height: activeProjectTab === idx ? "3.5rem" : "3rem",
                      opacity: activeProjectTab === idx ? 1 : 0.5,
                      border: activeProjectTab === idx ? "2px solid #f59e0b" : "2px solid transparent",
                      boxShadow: activeProjectTab === idx ? "0 4px 12px rgba(245,158,11,0.3)" : "none",
                      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    aria-label={project.name}
                  >
                    <img src={showroomGallery[activeShowroomTab].images[idx]} alt={project.name} className="w-full h-full object-cover" />
                    {activeProjectTab === idx && <div className="absolute inset-0 bg-amber-500/20" />}
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex gap-2 px-1">
                {projectCarousel.map((_, idx) => (
                  <div key={idx} className="flex-1 h-0.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: activeProjectTab === idx ? "100%" : activeProjectTab > idx ? "100%" : "0%",
                        transition: activeProjectTab === idx && !isCarouselHovered
                          ? "width 4000ms linear"
                          : "width 0ms",
                      }}
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
            Chọn dự án, mức giá và phương thức thanh toán để xem lịch đóng tiền và số tiền trả góp hàng tháng.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-12 shadow-xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-br-full" />

          {/* ── BƯỚC 1: Chọn dự án ── */}
          <div className="space-y-4 relative z-10">
            <p className="text-sm font-semibold text-slate-700">
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">01</span>
              Chọn dự án bạn quan tâm:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(projectCalcConfig).map(([slug, cfg]) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => { setSelectedCalcProject(slug); setSelectedUnitIndex(0); setPaymentOption(""); }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedCalcProject === slug
                      ? "border-amber-500 bg-amber-50 shadow-sm"
                      : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 mb-2 ${selectedCalcProject === slug ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                  <span className="font-bold text-sm text-slate-800 block">{cfg.name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Vay {cfg.loanPercent}% · {cfg.loanYears} năm · {cfg.policyRate}%/năm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── BƯỚC 2: Chọn loại căn hộ ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">02</span>
                Chọn loại căn hộ:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {projectCalcConfig[selectedCalcProject].units.map((unit, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedUnitIndex(idx); setInvestmentValue(unit.priceMin); }}
                    className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                      selectedUnitIndex === idx
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-slate-200 hover:border-amber-300 bg-white"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mb-2 ${selectedUnitIndex === idx ? "bg-amber-500 border-amber-500" : "border-slate-300"}`} />
                    <span className="block text-base font-extrabold text-slate-800">{unit.label}</span>
                    <span className="text-xs text-slate-400 block">{unit.area}</span>
                    <span className="text-xs font-bold text-amber-600 block mt-1">{unit.priceLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── BƯỚC 3: Slider chọn mức giá trong phân khúc ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">03</span>
                Chọn mức giá cụ thể:
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].label} · {projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].area}
                </span>
                <span className="text-xl font-extrabold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-xl">
                  {investmentValue} Tỷ VNĐ
                </span>
              </div>
              <input
                type="range"
                min={projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].priceMin}
                max={projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].priceMax}
                step={0.01}
                value={investmentValue}
                onChange={(e) => setInvestmentValue(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{(projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].priceMin * 1000).toFixed(0)} triệu (giá thấp nhất)</span>
                <span>{(projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].priceMax * 1000).toFixed(0)} triệu (giá cao nhất)</span>
              </div>
            </div>
          )}

          {/* ── BƯỚC 4: Chọn phương thức thanh toán ── */}
          {selectedCalcProject && (
            <div className="space-y-4 relative z-10 pt-2 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">04</span>
                Phương thức thanh toán:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vốn tự có */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("cash")}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    paymentOption === "cash" ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${paymentOption === "cash" ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                    {paymentOption === "cash" && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="block text-base font-extrabold text-slate-800">Bằng vốn tự có</span>
                  <span className="text-xs text-slate-500 block mt-1">Thanh toán theo {projectCalcConfig[selectedCalcProject].schedule.length} đợt, không cần vay NH</span>
                </button>

                {/* Vay ngân hàng */}
                <button
                  type="button"
                  onClick={() => setPaymentOption("policy")}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    paymentOption === "policy" ? "border-amber-500 bg-amber-50 shadow-md" : "border-slate-200 hover:border-amber-300 bg-white"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 ${paymentOption === "policy" ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300"}`}>
                    {paymentOption === "policy" && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="block text-base font-extrabold text-slate-800">Bằng vốn vay ngân hàng</span>
                  <span className="text-xs text-slate-500 block mt-1">Vay tối đa {projectCalcConfig[selectedCalcProject].loanPercent}% · 25% trả dần theo đợt</span>
                </button>
              </div>
            </div>
          )}

          {/* ── BẢNG TIẾN ĐỘ (hiện ngay sau khi chọn phương thức) ── */}
          {paymentOption && (
            <div className="relative z-10 pt-2 border-t border-slate-100 space-y-4">
              <p className="text-sm font-semibold text-slate-700">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mr-2">05</span>
                Lịch đóng tiền — Phương thức {paymentOption === "cash" ? "bằng vốn tự có" : "bằng vốn vay ngân hàng"}:
              </p>

              {/* Bảng tiến độ */}
              <div className="rounded-2xl border border-slate-100 overflow-hidden text-xs shadow-sm">
                <div className="grid grid-cols-3 bg-amber-500 text-white font-bold px-4 py-2.5">
                  <span>Đợt</span>
                  <span className="text-center">Tiến độ</span>
                  <span className="text-right">Thời gian / Ghi chú</span>
                </div>
                {(paymentOption === "cash"
                  ? [
                      { dot: "Cọc",        pct: "30.000.000đ",       note: "Ngay khi ký Phiếu xác nhận cọc" },
                      { dot: "Đợt 1",      pct: "15%",               note: "7 ngày kể từ ngày cọc, Ký HĐDVTV" },
                      { dot: "Đợt 2",      pct: "5%",                note: "30 ngày kể từ ngày đến hạn đợt 1" },
                      { dot: "Đợt 3",      pct: "5%",                note: "30 ngày kể từ ngày đến hạn đợt 2" },
                      { dot: "Đợt 4",      pct: "5%",                note: "30 ngày kể từ ngày đến hạn đợt 3" },
                      { dot: "Đợt 5",      pct: "5%",                note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
                      { dot: "Đợt 6–15",   pct: "3%/đợt (10 đợt)",  note: "Mỗi đợt cách nhau 30 ngày căn cứ thông báo ký HĐMB" },
                      { dot: "Đợt 16",     pct: "5%",                note: "30 ngày kể từ ngày đến hạn đợt 15" },
                      { dot: "Đợt 17",     pct: "25% + phí bảo trì 2%", note: "15 ngày kể từ ngày nhận thông báo bàn giao nhà" },
                      { dot: "Đợt 18",     pct: "5%",                note: "15 ngày kể từ ngày nhận thông báo nhận giấy chứng nhận" },
                    ]
                  : [
                      { dot: "Cọc",    pct: "30.000.000đ",   note: "Ngay khi ký Phiếu xác nhận cọc" },
                      { dot: "Đợt 1",  pct: "15%",           note: "7 ngày kể từ ngày cọc, khách thanh toán đợt 1 và ký HĐDVTV" },
                      { dot: "Đợt 2",  pct: "5%",            note: "30 ngày kể từ ngày đến hạn thanh toán đợt 1" },
                      { dot: "Đợt 3",  pct: "5%",            note: "15 ngày kể từ ngày nhận thông báo ký HĐMB" },
                      { dot: "Đợt 4",  pct: "45%",           note: "Ngân hàng giải ngân" },
                      { dot: "Đợt 5",  pct: "25% + phí BT",  note: "15 ngày kể từ thông báo BG nhà, NH giải ngân 25% GTHĐ, KH TT 100% phí bảo trì" },
                      { dot: "Đợt 6",  pct: "5%",            note: "15 ngày kể từ ngày nhận thông báo nhận giấy chứng nhận" },
                    ]
                ).map((row, i) => (
                  <div key={i} className={`grid grid-cols-3 px-4 py-2.5 border-b border-slate-50 ${i % 2 === 0 ? "bg-amber-50/40" : "bg-white"}`}>
                    <span className="font-semibold text-slate-700">{row.dot}</span>
                    <span className="text-center font-bold text-amber-700">{row.pct}</span>
                    <span className="text-right text-slate-500 leading-snug">{row.note}</span>
                  </div>
                ))}
              </div>

              {/* Bước 5b: Nếu vay NH → chỉ 1 gói NH Chính sách */}
              {paymentOption === "policy" && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm font-semibold text-slate-700">Gói vay áp dụng:</p>
                  <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div>
                        <span className="block text-base font-extrabold text-slate-800">NH Chính Sách Xã Hội</span>
                        <span className="text-sm text-amber-600 font-bold block mt-0.5">
                          {projectCalcConfig[selectedCalcProject].policyRate}%/năm · {projectCalcConfig[selectedCalcProject].loanYears} năm
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">Gói vay ưu đãi dành riêng cho người mua Nhà Ở Xã Hội — Ngân hàng Chính sách xã hội tỉnh Đồng Nai</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── KẾT QUẢ (chỉ hiện khi đã chọn đủ) ── */}
          {paymentOption && (
            <div className="relative z-10 pt-2 border-t border-slate-100">
              <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-tl-full" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-100 bg-white/15 border border-white/10 px-3 py-1 rounded-full inline-block mb-5">
                  KẾT QUẢ DỰ TÍNH — {projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].label} · {projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].area} · {projectCalcConfig[selectedCalcProject].units[selectedUnitIndex].priceLabel}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                  {/* Vốn tự có */}
                  <div className="space-y-1">
                    <span className="text-xs text-amber-100 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-yellow-200" /> Vốn tự có ({100 - calcResults.loanPercent}%):
                    </span>
                    <div className="text-2xl font-extrabold text-white font-display">{calcResults.downPayment} Tỷ</div>
                    <p className="text-[10px] text-amber-100/70">Đóng theo nhiều đợt</p>
                  </div>

                  {/* Khoản vay */}
                  <div className="space-y-1">
                    <span className="text-xs text-amber-100 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-yellow-200" /> Khoản vay ({calcResults.loanPercent}%):
                    </span>
                    <div className="text-2xl font-extrabold text-yellow-100 font-display">
                      {paymentOption === "cash" ? "—" : `${calcResults.loanAmount} Tỷ`}
                    </div>
                    <p className="text-[10px] text-amber-100/70">
                      {paymentOption === "policy"
                        ? `${projectCalcConfig[selectedCalcProject].policyRate}%/năm · ${calcResults.loanYears} năm`
                        : "Không vay"}
                    </p>
                  </div>

                  {/* Trả góp */}
                  <div className="space-y-1">
                    <span className="text-xs text-amber-100 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-yellow-200" /> Trả góp/tháng:
                    </span>
                    {paymentOption === "cash" ? (
                      <div className="text-2xl font-extrabold text-yellow-100 font-display">Không vay</div>
                    ) : (
                      <>
                        <div className="text-2xl font-extrabold text-yellow-100 font-display">
                          ~{calcResults.monthlyPayment} <span className="text-xs font-normal text-white/80">triệu</span>
                        </div>
                        <p className="text-[10px] text-amber-100/70">
                          {calcResults.loanYears} năm · Tổng lãi ~{Number(calcResults.totalInterest).toLocaleString("vi")} triệu
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-2 text-xs text-amber-100/90">
                    <p className="font-bold text-white text-sm">📋 Điều kiện mua Nhà Ở Xã Hội:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 25tr/tháng (độc thân)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 35tr/tháng (đơn thân nuôi con)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Thu nhập &lt; 50tr/tháng (vợ chồng)</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Chưa có nhà ở tại Đồng Nai</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Chưa từng mua NOXH ở Việt Nam</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" /> Có đất / nhà tỉnh khác vẫn được mua</span>
                    </div>
                    <p className="text-yellow-200 font-semibold pt-1">📞 Hỗ trợ hồ sơ miễn phí: 0937.587.438</p>
                  </div>
                  <button
                    onClick={() => onNavigate("#contact")}
                    className="shrink-0 bg-white hover:bg-amber-50 text-amber-800 font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                  >
                    Tư Vấn Miễn Phí <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================
          6. CORE PHILOSOPHY REDESIGN (moved after calculator)
          ========================================================= */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Giá trị cốt lõi K-Home</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Cam Kết Đồng Hành Cùng Cư Dân
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            K-Home Đồng Nai được xây dựng với mục tiêu mang đến không gian sống chất lượng, pháp lý minh bạch và chi phí hợp lý, giúp người lao động có cơ hội sở hữu nhà ở ổn định lâu dài.
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
          7. PREMIUM TESTIMONIALS (AMBER DECORATED STYLE)
          ========================================================= */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase bg-amber-100/50 px-3.5 py-1.5 rounded-full inline-block">Ý kiến cư dân</span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Khách Hàng Nói Gì Về K-Home?
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Những chia sẻ chân thực từ người đã và đang sở hữu căn hộ tại các dự án K-Home Đồng Nai.
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
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden border border-amber-400/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_40%)]" />

          {/* Top row: title + button */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest">
                Hỗ trợ hồ sơ NOXH miễn phí — Hotline 0937.587.438
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
            <div className="shrink-0 w-full lg:w-auto text-center">
              <button
                onClick={() => onNavigate("/contact")}
                className="w-full lg:w-auto bg-white hover:bg-amber-100 text-amber-800 px-10 py-5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl hover:shadow-orange-500/20 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                Đăng Ký Tư Vấn Miễn Phí <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-amber-100/90 mt-3 font-medium">Hotline Kim Oanh Land: 0799.898.893</p>
            </div>
          </div>

          {/* ── Inline CTA Form ── */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 relative z-10">
            {ctaSuccess ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-bold text-sm">Đã nhận thông tin!</p>
                <p className="text-amber-100 text-xs">Chuyên viên sẽ liên hệ bạn trong vòng 15 phút.</p>
              </div>
            ) : (
              <form onSubmit={handleCtaSubmit} className="space-y-3">
                <p className="text-white font-bold text-sm text-center mb-2">Để lại thông tin — nhận tư vấn ngay</p>
                {ctaError && <p className="text-red-200 text-xs text-center">{ctaError}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ và tên *"
                    value={ctaName}
                    onChange={e => setCtaName(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm outline-none focus:bg-white/30 transition-all"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại *"
                    value={ctaPhone}
                    onChange={e => setCtaPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm outline-none focus:bg-white/30 transition-all"
                  />
                  <select
                    value={ctaProject}
                    onChange={e => setCtaProject(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white text-sm outline-none focus:bg-white/30 transition-all cursor-pointer"
                  >
                    <option value="k-home-cityview-ho-nai" className="text-slate-800">K-Home CityView Biên Hòa</option>
                    <option value="k-home-midtown-trang-bom" className="text-slate-800">K-Home Midtown Trảng Bom</option>
                    <option value="k-home-avenue-nhon-trach" className="text-slate-800">K-Home Avenue Nhơn Trạch</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={ctaSubmitting}
                  className="w-full py-3 bg-white hover:bg-amber-50 text-amber-700 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-60"
                >
                  {ctaSubmitting
                    ? <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" /> Nhận Tư Vấn Miễn Phí Ngay</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          POPUP LEAD FORM — xuất hiện sau 8 giây
          ========================================================= */}
      {showPopup && !popupDismissed && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,23,42,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <button
              onClick={() => setPopupDismissed(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 space-y-5">
              {popupSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Gửi Thành Công!</h3>
                  <p className="text-slate-500 text-sm">Chuyên viên K-Home sẽ liên hệ bạn trong vòng 15 phút.</p>
                  <button
                    onClick={() => setPopupDismissed(true)}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1.5">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Ưu đãi đặc biệt</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Nhận Tư Vấn K-Home<br/>Hoàn Toàn Miễn Phí</h3>
                    <p className="text-slate-400 text-xs">Chuyên viên sẽ gọi lại trong 15 phút — hỗ trợ hồ sơ NOXH từ A→Z</p>
                  </div>

                  <form onSubmit={handlePopupSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={popupName}
                        onChange={e => setPopupName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0933 354 093"
                        value={popupPhone}
                        onChange={e => setPopupPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Dự án quan tâm</label>
                      <select
                        value={popupProject}
                        onChange={e => setPopupProject(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl text-sm outline-none transition-all cursor-pointer"
                      >
                        <option value="k-home-cityview-ho-nai">K-Home CityView Biên Hòa</option>
                        <option value="k-home-midtown-trang-bom">K-Home Midtown Trảng Bom</option>
                        <option value="k-home-avenue-nhon-trach">K-Home Avenue Nhơn Trạch</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={popupSubmitting}
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {popupSubmitting
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><Send className="w-4 h-4" /> Nhận Tư Vấn Miễn Phí</>
                      }
                    </button>
                    <p className="text-center text-[10px] text-slate-400">
                      Thông tin của bạn được bảo mật tuyệt đối.{" "}
                      <button type="button" onClick={() => setPopupDismissed(true)} className="underline hover:text-slate-600 cursor-pointer">
                        Bỏ qua
                      </button>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

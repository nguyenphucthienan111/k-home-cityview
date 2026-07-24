import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, MapPin, Building, Star, Compass, Phone, Send, Eye, LayoutGrid } from "lucide-react";
import { Project } from "../types";
import Lightbox from "./Lightbox";
import { imgUrl } from "../utils/imageUrl";

interface ProjectDetailViewProps {
  slug: string;
  onNavigate: (hash: string) => void;
}

export default function ProjectDetailView({ slug, onNavigate }: ProjectDetailViewProps) {
  const [project, setProject] = useState<Project | null>(null);

  // Parse **bold** markers and \n\n paragraph breaks into JSX
  const renderRichText = (text: string) => {
    return text.split("\n\n").map((paragraph, pIdx) => {
      // Heading: toàn bộ đoạn là **...**
      const headingMatch = paragraph.match(/^\*\*(.+)\*\*$/);

      if (headingMatch) {
        return (
          <div key={pIdx}>
            {pIdx > 0 && <hr className="border-slate-200 my-5" />}
            <h4 className="text-base font-bold text-slate-800 mb-2">
              {headingMatch[1]}
            </h4>
          </div>
        );
      }

      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={pIdx} className="text-slate-600 text-sm leading-relaxed">
          {parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="text-slate-800 font-semibold">{part}</strong> : part
          )}
        </p>
      );
    });
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, amenities, map

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => p.slug === slug);
        setProject(found || null);
        if (found) {
          document.title = `${found.title} | Giá Bán & Mặt Bằng Dự Án K-Home`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute("content", `${found.description} Cập nhật mặt bằng, chính sách chiết khấu đợt 1 từ chủ đầu tư Kim Oanh Group.`);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project detail:", err);
        setLoading(false);
      });
  }, [slug]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Vui lòng điền đầy đủ: Họ tên, Số điện thoại.");
      return;
    }

    setIsSubmitting(true);

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formName,
        email: formEmail,
        phone: formPhone,
        projectSlug: project?.slug,
        projectName: project?.title,
        message: formMessage || `Tôi có nhu cầu tham quan và nhận báo giá dự án ${project?.title}.`
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi yêu cầu không thành công");
        return res.json();
      })
      .then(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        // Clear fields
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormMessage("");
      })
      .catch((err) => {
        console.error("Contact submission error:", err);
        setFormError("Có lỗi xảy ra trong quá trình gửi yêu cầu. Vui lòng thử lại sau.");
        setIsSubmitting(false);
      });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Đang tải thông tin chi tiết dự án...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy dự án</h2>
        <p className="text-slate-500 text-sm">Dự án bạn tìm kiếm không tồn tại hoặc đã được gỡ bỏ khỏi hệ thống.</p>
        <button
          onClick={() => onNavigate("/projects")}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back navigation button */}
      <button
        onClick={() => onNavigate("/projects")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại rổ hàng dự án
      </button>

      {/* Title & Location Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
              {project.type}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {project.status}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-light">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" /> {project.location}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between gap-10 w-full lg:w-auto">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 block font-medium">Bảng giá rổ hàng:</span>
            <span className="text-2xl font-bold text-amber-600 font-tech">{project.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Diện tích căn:</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1">{project.area}</span>
          </div>
        </div>
      </div>

      {/* Gallery Image Grid with Lightbox feature */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Bộ Sưu Tập Hình Ảnh
            <span className="text-xs font-normal text-slate-400">(Click để mở rộng xem chi tiết)</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-2 relative h-96 md:h-[480px] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100"
          >
            <img
              src={imgUrl(project.image)}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 backdrop-blur-sm text-slate-800 p-3 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                <Eye className="w-4 h-4" /> Xem Toàn Màn Hình
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-48 md:h-[480px]">
            {project.gallery.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100 h-full"
              >
                <img
                  src={imgUrl(img)}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full shadow flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Details Body & Side Registration Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Columns: Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabs Selector */}
          <div className="flex border-b border-slate-100">
            {[
              { id: "overview",  label: "Tổng Quan & Mô Tả" },
              { id: "units",     label: "Bảng Giá & Loại Hình" },
              { id: "amenities", label: "Tiện Ích Đẳng Cấp" },
              { id: "map",       label: "Vị Trí Bản Đồ" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-semibold tracking-wide transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-slate-500 hover:text-amber-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Chủ đầu tư:</span>
                  <span className="block font-bold text-slate-800 text-sm">{project.developer}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Xếp hạng:</span>
                  <span className="block font-bold text-slate-800 text-sm flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {project.rating}/5
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Số tầng:</span>
                  <span className="block font-bold text-slate-800 text-sm">{project.floorCount} tầng</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs uppercase font-tech">Bảo hành:</span>
                  <span className="block font-bold text-slate-800 text-sm">Chuẩn 5 sao</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-display font-semibold text-slate-800">Mô Tả Chi Tiết Dự Án</h3>
                <div className="space-y-3">
                  {renderRichText(project.longDescription)}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Unit Types */}
          {activeTab === "units" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-display font-semibold text-slate-800 mb-1">Bảng Giá & Loại Hình Căn Hộ</h3>
                <p className="text-slate-500 text-sm">Cập nhật bảng giá đợt 1 từ chủ đầu tư Kim Oanh Group. Giá có thể thay đổi theo từng đợt mở bán.</p>
              </div>

              {project.unitTypes && project.unitTypes.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50 border-b border-amber-100">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">Loại căn hộ</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">DT xây dựng</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">DT sử dụng</th>
                        <th className="text-right px-5 py-3.5 text-xs font-bold text-amber-800 uppercase tracking-wider">Giá bán</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {project.unitTypes.map((unit, idx) => (
                        <tr
                          key={idx}
                          onClick={() => onNavigate(`/projects/${project.slug}/${unit.slug}`)}
                          className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4 font-semibold text-slate-800 group-hover:text-amber-700 flex items-center gap-2">
                            {unit.name}
                            <span className="text-[10px] text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Xem chi tiết →
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center text-slate-600">{unit.constructionArea}</td>
                          <td className="px-5 py-4 text-center text-slate-600">{unit.usableArea}</td>
                          <td className="px-5 py-4 text-right font-bold text-amber-600">{unit.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Bảng giá sẽ được cập nhật sớm.</p>
                </div>
              )}

              <p className="text-xs text-slate-400 italic">
                * Giá trên là giá tham khảo đợt 1, chưa bao gồm phí quản lý, VAT và các khoản phí khác. Liên hệ chuyên viên để nhận báo giá chính xác nhất.
              </p>
            </div>
          )}

          {/* Tab 3: Amenities */}
          {activeTab === "amenities" && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-semibold text-slate-800">Chuỗi Đặc Quyền Sống Thượng Lưu</h3>
              <p className="text-slate-500 text-sm">
                Chúng tôi không chỉ xây nhà, chúng tôi thiết lập phong cách sống. Mỗi bước chân của chủ nhân tại đây đều chạm vào các tiện ích cao cấp tiêu chuẩn khách sạn quốc tế.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-amber-50/40 rounded-xl border border-slate-100 hover:border-amber-500/20 transition-all">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Location Map */}
          {activeTab === "map" && (
            <div className="space-y-6">
              <h3 className="text-xl font-display font-semibold text-slate-800">Vị Trí Dự Án</h3>
              <p className="text-slate-500 text-sm">
                {project.location}
              </p>
              <div className="w-full h-96 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
                <iframe
                  src={project.mapEmbedUrl || `https://www.google.com/maps/embed/v1/place?key=AIzaSyD&q=${encodeURIComponent(project.location + ", Vietnam")}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${project.title}`}
                ></iframe>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Sticky Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Tư vấn chuyên sâu</span>
              <h3 className="text-xl font-display font-semibold text-slate-800">Đăng Ký Nhận Báo Giá</h3>
              <p className="text-slate-400 text-xs mt-1">Hỗ trợ nhận thông tin rổ hàng ngoại giao chiết khấu tốt nhất</p>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">Gửi Yêu Cầu Thành Công!</h4>
                  <p className="text-slate-500 text-xs px-2">
                    Cảm ơn bạn đã đăng ký. Chuyên viên kinh doanh cao cấp của K-Home sẽ liên hệ tư vấn trong vòng 15 phút.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Gửi yêu cầu mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs font-medium rounded">
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Hải"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Địa chỉ Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                  <input
                    type="email"
                    placeholder="VD: hainguyen@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Số điện thoại liên lạc *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0933354093"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Lời nhắn yêu cầu tư vấn</label>
                  <textarea
                    rows={3}
                    placeholder={`Tôi muốn đặt lịch xem thực tế dự án ${project.title}.`}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-amber-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Đăng Ký Tư Vấn Miễn Phí
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Phone className="w-3.5 h-3.5" /> Hotline: <a href="tel:0933354093" className="text-slate-600 font-bold hover:text-amber-600">0933 354 093</a>
            </div>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={project.gallery}
          initialIndex={lightboxIndex}
          caption={`${project.title} - Phối cảnh không gian sống`}
          onClose={() => setLightboxOpen(false)}
        />
      )}

    </div>
  );
}

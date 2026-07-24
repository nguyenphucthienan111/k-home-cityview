import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, MapPin, Phone, Send, Eye, BedDouble, Bath, Sofa } from "lucide-react";
import { Project, UnitType } from "../types";
import Lightbox from "./Lightbox";
import { imgUrl } from "../utils/imageUrl";

interface UnitDetailViewProps {
  projectSlug: string;
  unitSlug: string;
  onNavigate: (hash: string) => void;
}

export default function UnitDetailView({ projectSlug, unitSlug, onNavigate }: UnitDetailViewProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [unit, setUnit] = useState<UnitType | null>(null);

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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
        const foundProject = list.find((p) => p.slug === projectSlug);
        if (foundProject && foundProject.unitTypes) {
          const foundUnit = foundProject.unitTypes.find((u) => u.slug === unitSlug);
          setProject(foundProject);
          setUnit(foundUnit || null);

          if (foundProject && foundUnit) {
            document.title = `${foundUnit.name} - ${foundProject.title} | K-Home Đồng Nai`;
          }
        } else {
          setProject(null);
          setUnit(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch unit detail:", err);
        setLoading(false);
      });
  }, [projectSlug, unitSlug]);

  const handleSubmit = (e: React.FormEvent) => {    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formPhone.trim()) {
      setFormError("Vui lòng điền đầy đủ: Họ tên, Số điện thoại.");
      return;
    }

    setIsSubmitting(true);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName,
        email: formEmail,
        phone: formPhone,
        projectSlug: project?.slug,
        projectName: project?.title,
        message: formMessage || `Tôi quan tâm loại căn ${unit?.name} thuộc dự án ${project?.title}.`
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi yêu cầu không thành công");
        return res.json();
      })
      .then(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormMessage("");
      })
      .catch((err) => {
        console.error("Contact submission error:", err);
        setFormError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Đang tải thông tin loại căn...</p>
      </div>
    );
  }

  if (!project || !unit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy loại căn hộ</h2>
        <p className="text-slate-500 text-sm">Loại căn bạn tìm kiếm không tồn tại.</p>
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
      
      {/* Back navigation */}
      <button
        onClick={() => onNavigate("/projects")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách căn hộ
      </button>

      {/* Title & Info Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
              {unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} Phòng Ngủ`}
            </span>
            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Bath className="w-3 h-3" /> {unit.bathrooms} NVS
            </span>
            {unit.furnished && (
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                <Sofa className="w-3 h-3" /> Full nội thất (trừ thiết bị điện tử)
              </span>
            )}
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {project.title}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 tracking-tight">
            {unit.name}
          </h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-light">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" /> {project.location}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between gap-10 w-full lg:w-auto">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 block font-medium">Giá bán:</span>
            <span className="text-2xl font-bold text-amber-600 font-tech">{unit.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Diện tích:</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1">{unit.constructionArea}</span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Hình Ảnh Loại Căn
          <span className="text-xs font-normal text-slate-400">(Click để mở rộng)</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {unit.images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative h-48 rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100"
            >
              <img
                src={imgUrl(img)}
                alt={`${unit.name} ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full shadow">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Specs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech">DT Xây dựng</span>
              <span className="block font-bold text-slate-800 text-lg">{unit.constructionArea}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech">DT Sử dụng</span>
              <span className="block font-bold text-slate-800 text-lg">{unit.usableArea}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" /> Phòng ngủ
              </span>
              <span className="block font-bold text-slate-800 text-lg">
                {unit.bedrooms === 0 ? "Studio" : `${unit.bedrooms} phòng`}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> Nhà vệ sinh
              </span>
              <span className="block font-bold text-slate-800 text-lg">{unit.bathrooms} phòng</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech flex items-center gap-1">
                <Sofa className="w-3.5 h-3.5" /> Nội thất
              </span>
              <span className={`block font-bold text-lg ${unit.furnished ? "text-green-600" : "text-slate-800"}`}>
                {unit.furnished ? "Full nội thất" : "Không nội thất"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs uppercase font-tech">Chủ đầu tư</span>
              <span className="block font-bold text-slate-800 text-sm leading-tight">{project.developer}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-display font-semibold text-slate-800">Mô Tả Căn Hộ</h3>
            <div className="space-y-3">
              {unit.description
                ? renderRichText(unit.description)
                : <p className="text-slate-500 text-sm">Thông tin mô tả căn hộ sẽ được cập nhật sớm.</p>
              }
            </div>
          </div>

          {/* Furnished Details */}
          {unit.furnished && (
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold text-slate-800">Gói Nội Thất Bàn Giao</h3>
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Phòng khách", items: "Sofa, ghế đơn và bàn trà" },
                    { label: "Phòng ăn",    items: "Bàn ăn và ghế ăn" },
                    { label: "Phòng ngủ",   items: "Giường, nệm, chăn ga gối, tab đầu giường và tủ quần áo" },
                    { label: "Khu bếp",     items: "Tủ bếp trên & dưới gỗ An Cường" },
                    { label: "Nhà vệ sinh", items: "Tủ lavabo, vách kính phòng tắm và thiết bị vệ sinh hoàn thiện" },
                  ].map(({ label, items }) => (
                    <div key={label} className="flex items-start gap-2.5 bg-white rounded-xl px-4 py-3 border border-amber-100">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">{label}</span>
                        <span className="text-xs text-slate-500">{items}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1 border-t border-amber-100">
                  <span className="text-amber-500 font-bold shrink-0">* Lưu ý:</span>
                  Gói bàn giao không bao gồm các thiết bị điện tử như tivi, tủ lạnh, máy giặt, điều hòa...
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-display font-semibold text-slate-800">Tiện Ích Dự Án</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm space-y-6 sticky top-24">
            <div className="text-center pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Đăng ký tư vấn</span>
              <h3 className="text-xl font-display font-semibold text-slate-800">Nhận Báo Giá</h3>
              <p className="text-slate-400 text-xs mt-1">Thông tin chính xác cho loại căn này</p>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">Gửi Yêu Cầu Thành Công!</h4>
                  <p className="text-slate-500 text-xs px-2">
                    Chuyên viên sẽ liên hệ trong vòng 15 phút.
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
                  <label className="text-xs font-semibold text-slate-600 block">Họ và tên *</label>
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
                  <label className="text-xs font-semibold text-slate-600 block">Email <span className="text-slate-400 font-normal">(không bắt buộc)</span></label>
                  <input
                    type="email"
                    placeholder="VD: hainguyen@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Số điện thoại *</label>
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
                  <label className="text-xs font-semibold text-slate-600 block">Lời nhắn</label>
                  <textarea
                    rows={3}
                    placeholder={`Tôi quan tâm ${unit.name} thuộc ${project.title}.`}
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

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={unit.images}
          initialIndex={lightboxIndex}
          caption={`${unit.name} - ${project.title}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}

    </div>
  );
}

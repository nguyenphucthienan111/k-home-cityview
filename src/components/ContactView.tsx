import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, HelpCircle } from "lucide-react";
import { Project } from "../types";

export default function ContactView() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectSlug, setProjectSlug] = useState("general");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Đăng Ký Tham Quan Căn Hộ K-Home Cityview | Phòng Kinh Doanh";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Liên hệ phòng kinh doanh chủ đầu tư Kim Oanh Group để đặt lịch xem nhà mẫu, tham quan dự án K-Home Cityview Biên Hòa và nhận bảng giá bán chiết khấu đợt 1.");
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectsList(data))
      .catch((err) => console.error("Error loading projects for contact select:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc: Họ tên, Email, Số điện thoại.");
      return;
    }

    setIsSubmitting(true);

    const chosenProjectObj = projectsList.find(p => p.slug === projectSlug);
    const projectName = chosenProjectObj ? chosenProjectObj.title : "Tư vấn chung";

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        projectSlug,
        projectName,
        message: message || "Yêu cầu tư vấn thông tin bất động sản."
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gửi liên hệ thất bại.");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setIsSubmitting(false);
        // Clear Form fields
        setName("");
        setEmail("");
        setPhone("");
        setProjectSlug("general");
        setMessage("");
      })
      .catch((err) => {
        console.error("Submit contact error:", err);
        setErrorMsg("Có lỗi xảy ra khi gửi liên hệ, vui lòng thử lại sau ít phút.");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="border-b border-slate-100 pb-8 space-y-3">
        <span className="text-xs font-bold text-amber-600 tracking-widest uppercase font-tech">Hỗ trợ khách hàng</span>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800">
          Kết Nối Với K-Home CityView
        </h1>
        <p className="text-slate-500 text-sm max-w-3xl">
          Đội ngũ chuyên viên tư vấn của chúng tôi luôn trực chiến 24/7 để cung cấp bảng tính dòng tiền chi tiết, chiết khấu và đăng ký tham quan thực tế công trình.
        </p>
      </div>

      {/* 2. Main Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Form Card */}
        <div className="bg-white border border-slate-150 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-semibold text-slate-800">Gửi Yêu Cầu Tư Vấn</h2>
            <p className="text-slate-400 text-xs">Vui lòng điền thông tin chi tiết, chúng tôi sẽ lập tức gọi lại.</p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Yêu Cầu Đã Được Tiếp Nhận!</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Hệ thống CRM đã đồng bộ thông tin của bạn. Một cuộc gọi tư vấn độc quyền rổ hàng chiết khấu sẽ được kết nối tới bạn trong 15 phút tới.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Gửi thêm yêu cầu tư vấn khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs rounded font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Họ và tên quý khách *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Hải"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0933354093"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Địa chỉ Email liên hệ *</label>
                <input
                  type="email"
                  required
                  placeholder="VD: hainguyen@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Dự án quý khách quan tâm</label>
                <select
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg text-sm outline-none transition-all cursor-pointer"
                >
                  <option value="general">Tư vấn bất động sản chung</option>
                  {projectsList.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.title} ({p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">Nội dung chi tiết yêu cầu</label>
                <textarea
                  rows={4}
                  placeholder="Tôi muốn tham quan thực địa dự án và tư vấn lịch trình thanh toán trả góp chi tiết..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-lg text-sm outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-amber-600/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Gửi Yêu Cầu Liên Hệ
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Cards + Embed Map */}
        <div className="space-y-8 flex flex-col justify-between">
          
          {/* Info cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Trụ sở chính</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Tầng 10, K-Home Tower, 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Đường dây nóng</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Tổng đài tư vấn: <a href="tel:0933354093" className="font-bold text-amber-600">0933 354 093</a> (Phục vụ 24/7)
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Hộp thư điện tử</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Hợp tác đại lý: info@k-homecityview.vn <br />
                  Chăm sóc cư dân: cskh@k-home.vn
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Giờ làm việc</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Sàn giao dịch: 8:00 - 20:00 hằng ngày <br />
                  Văn phòng hành chính: 8:00 - 17:30 (T2-T6)
                </p>
              </div>
            </div>

          </div>

          {/* Map box */}
          <div className="w-full h-72 bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.509932242149!2d106.7007028!3d10.7753062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1e0a8fc7e1%3A0xe9e9836501d5eec4!2sDistrict%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map location general"
            ></iframe>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useEffect } from "react";
import { Sparkles, Medal, Award, Eye, Heart, Target } from "lucide-react";

export default function AboutView() {
  useEffect(() => {
    document.title = "Về Chúng Tôi | Kim Oanh Group - Nhà Phát Triển K-Home Cityview";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Tìm hiểu về Kim Oanh Group - nhà phát triển bất động sản uy tín hàng đầu, đơn vị kiến tạo đại dự án K-Home Cityview Biên Hòa với sứ mệnh mang chuẩn sống Singapore đến với mọi gia đình.");
    }
  }, []);

  const leadership = [
    {
      name: "Ông Nguyễn Thế Kiên",
      role: "Chủ tịch Hội đồng Quản trị",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
      bio: "Hơn 20 năm dẫn dắt các tập đoàn bất động sản đa quốc gia phát triển thành công hàng loạt khu đô thị quy mô lớn."
    },
    {
      name: "Bà Phạm Thanh Vân",
      role: "Phó Tổng Giám đốc Kỹ thuật & Thiết kế",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      bio: "Thạc sĩ Kiến trúc sư đại học Harvard, người thổi hồn nét tinh tế của phong cách tân cổ điển vào từng mét vuông căn hộ."
    },
    {
      name: "Ông Marcus Lê",
      role: "Giám đốc Phát triển Dự án Cao cấp",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      bio: "Chuyên gia tư vấn chiến lược đầu tư với kinh nghiệm phong phú trong quản lý rổ hàng phân khúc siêu sang."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header & Vision Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase font-tech">Về K-Home Group</span>
            <h1 className="text-3xl md:text-5xl font-display font-semibold text-slate-900 leading-tight">
              Kiến Tạo Không Gian Sống Hoàn Mỹ
            </h1>
            <div className="w-12 h-0.5 bg-amber-600" />
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Được thành lập từ năm 2016, K-Home Group tự hào là một trong những nhà phát triển bất động sản hạng sang tiên phong áp dụng công nghệ xanh sinh thái thông minh vào chuỗi dự án tại Việt Nam.
          </p>
          <p className="text-slate-650 text-sm leading-relaxed font-light">
            Sứ mệnh của chúng tôi vượt xa những khối bê tông vô hồn. K-Home kiến tạo những quần thể sống tinh hoa, nơi giá trị văn hóa gia đình được gìn giữ, thăng hoa, và là di sản truyền đời vô giá cho các thế hệ mai sau.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-2.5">
              <Medal className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Top 10 Uy Tín</h4>
                <p className="text-slate-400 text-xs">Thương hiệu BĐS Việt Nam</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Thiết Kế Đột Phá</h4>
                <p className="text-slate-400 text-xs">Asia Property Awards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand visual card */}
        <div className="relative h-[380px] rounded-3xl overflow-hidden shadow-xl group border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            alt="K-Home building facade"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/25" />
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-600 tracking-wider font-tech block uppercase">Tuyên ngôn thương hiệu</span>
            <p className="text-sm font-medium italic">
              "K-Home CityView không chỉ bán nhà. Chúng tôi bán không gian tận hưởng cuộc sống đỉnh cao bên thềm tuyệt mỹ."
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision Bento Grid */}
      <section className="bg-slate-50 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-slate-100 rounded-[2.5rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Sứ Mệnh Thượng Lưu</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Cung cấp giải pháp nhà ở đỉnh cao, hội tụ các tiêu chí khắt khe nhất về tính thẩm mỹ, độ bền vững cơ học, kết nối thông minh và an ninh biệt lập cho tầng lớp thượng lưu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tầm Nhìn Chiến Lược</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Trở thành thương hiệu bất động sản nghệ thuật hàng đầu Việt Nam, được công nhận trên bản đồ khu vực Đông Nam Á nhờ sự chuẩn chỉ trong cam kết pháp lý và dịch vụ khách hàng xuất sắc.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Giá Trị Cốt Lõi</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Đồng hành cùng khách hàng bằng sự Uy Tín tuyệt đối, thấu hiểu nhu cầu bằng tâm thế Phục Vụ tận tâm, tạo dựng sản phẩm bằng Tinh Hoa công nghệ kiến trúc xanh hiện đại.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Executive Board */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-600 tracking-widest uppercase">Đội ngũ tinh hoa</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800">
            Hội Đồng Quản Trị & Ban Điều Hành
          </h2>
          <div className="w-12 h-0.5 bg-amber-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadership.map((member, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all text-center p-6 space-y-4"
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-amber-500/10 p-1 bg-amber-50">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{member.name}</h4>
                <p className="text-amber-600 text-xs font-medium mt-0.5">{member.role}</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-50 pt-3 italic">
                "{member.bio}"
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

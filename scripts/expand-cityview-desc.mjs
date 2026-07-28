import fs from "fs";

const FILES = [
  "d:/FPT University/Web Dev/k-home-cityview/api/projects.ts",
  "d:/FPT University/Web Dev/k-home-cityview/server.ts",
];

const NEW_LONG = `**Tổng quan dự án K-Home CityView Hố Nai**\\n\\n**K-Home CityView** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại mặt tiền **đường Điểu Xiển**, phường Hố Nai, thành phố Biên Hòa, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất rộng **2,85 ha** với **4 tòa tháp cao 22 tầng**, cung cấp khoảng **1.350 căn hộ nhà ở xã hội** cùng hệ thống shophouse khối đế.\\n\\nVới vị trí nằm trong khu vực có mật độ lao động cao và hạ tầng đang phát triển mạnh, K-Home CityView hướng đến giải pháp an cư ổn định, pháp lý rõ ràng và chi phí phù hợp cho người lao động, công chức và gia đình trẻ tại Đồng Nai.\\n\\n**Thiết kế & Đối tác**\\n\\nDự án được thiết kế theo **tiêu chuẩn Singapore** hiện đại, tập trung tối ưu công năng sử dụng, tận dụng ánh sáng tự nhiên và thông gió. Các căn hộ được bố trí mặt thoáng, hạn chế tối đa hành lang tối và không gian chết.\\n\\nCác đơn vị tư vấn đồng hành gồm: **Global Vireon Studio**, **Kiến Trúc Việt**, **CDC Jsc** và **K-City**. Dự án cũng hướng đến tiêu chuẩn **công trình xanh EDGE**, giúp tiết kiệm điện năng và nước sinh hoạt trong quá trình vận hành.\\n\\n**Quy mô sản phẩm & Mặt bằng căn hộ**\\n\\nK-Home CityView Hố Nai cung cấp 4 loại căn hộ đa dạng: 1PN+ loại A (47,3m²), 1PN+ loại B (62,4m²), 2 phòng ngủ (70,4m²) và 3 phòng ngủ (84,4m²). Đây là dự án NOXH đầu tiên tại Đồng Nai có căn hộ 3 phòng ngủ, đáp ứng nhu cầu của gia đình đông thành viên.\\n\\nMặt bằng tầng điển hình được thiết kế tối ưu không gian, tầng 3 có vườn treo và căn hộ ở, tầng 4 đến 22 là tầng điển hình. Tầng trệt và tầng 2 tập trung các tiện ích thiết yếu theo mô hình \\"all-in-one\\" chuẩn Singapore.\\n\\n**Hệ thống tiện ích nội khu K-Home CityView**\\n\\nHệ thống tiện ích được quy hoạch phục vụ nhu cầu thiết thực của cư dân ngay trong khuôn viên dự án, bao gồm: **hồ bơi** người lớn và trẻ em, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **nhà sinh hoạt cộng đồng**, vườn cảnh quan, khu BBQ, bãi đỗ xe và trạm sạc xe điện.\\n\\n**Vị trí kết nối – Nhà ở xã hội Hố Nai Biên Hòa**\\n\\nDự án nằm trên trục đường Điểu Xiển, phường Hố Nai, thuận tiện di chuyển đến trung tâm TP. Biên Hòa và các khu công nghiệp lớn tại Đồng Nai như **KCN Amata**, **KCN Biên Hòa 1**, **KCN Biên Hòa 2**, **KCN Long Bình** và **KCN Hố Nai**. Từ dự án chỉ mất khoảng 10 phút để đến trung tâm Biên Hòa, dễ dàng tiếp cận Big C, Lotte Mart, bệnh viện Đồng Nai và các trường học trong bán kính 5km.\\n\\n**Pháp lý & Chính sách hỗ trợ**\\n\\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp từ khoảng 3,5 – 4,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ mua nhà hoàn toàn miễn phí.`;

for (const filepath of FILES) {
  let content = fs.readFileSync(filepath, "utf8");

  // Find and replace longDescription for CityView
  content = content.replace(
    /("longDescription": ")(\*\*Tổng quan dự án K-Home CityView Hố Nai\*\*[\s\S]*?)(",\n    mapEmbedUrl: "https:\/\/www\.google\.com\/maps\/embed\?pb=!1m14)/,
    `$1${NEW_LONG}$3`
  );

  fs.writeFileSync(filepath, content, "utf8");
  console.log("Done:", filepath);
}

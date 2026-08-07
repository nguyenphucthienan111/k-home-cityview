import fs from "fs";

const files = [
  "d:/FPT University/Web Dev/k-home-cityview/api/projects.ts",
  "d:/FPT University/Web Dev/k-home-cityview/server.ts",
];

const NEW_MIDTOWN_DESC = "K-Home Midtown Trảng Bom – dự án nhà ở xã hội quy mô 13,97 ha, 542 căn hộ. Vị trí trung tâm Trảng Bom, giao 4 tuyến đường lớn. Lãi suất ưu đãi 5,4%/năm, hỗ trợ hồ sơ miễn phí.";

const NEW_MIDTOWN_LONG = "**Tổng quan dự án K-Home Midtown Trảng Bom**\\n\\n**K-Home Midtown** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại trung tâm thị trấn Trảng Bom, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất rộng **13,97 ha** với **1 block cao 15 tầng**, cung cấp **542 căn hộ nhà ở xã hội** cùng **20 căn shophouse**.\\n\\nĐây là dự án có quy mô đất lớn nhất trong hệ thống 3 dự án K-Home tại Đồng Nai, hướng đến giải pháp an cư ổn định cho người lao động, công nhân và gia đình trẻ đang làm việc tại các khu công nghiệp trong khu vực.\\n\\n**Vị trí & Kết nối**\\n\\nK-Home Midtown sở hữu vị trí thuận lợi tại giao điểm của 4 tuyến đường chính: **đường 30/4**, **đường Hùng Vương**, **đường Lý Nam Đế** và **đường Lê Đại Hành**. Từ dự án, cư dân dễ dàng kết nối đến các khu công nghiệp lớn (Bàu Xéo, Hố Nai…), trung tâm TP. Biên Hòa và TP. Hồ Chí Minh qua cao tốc TP.HCM – Long Thành – Dầu Giây.\\n\\n**Thiết kế & Đối tác**\\n\\nDự án được thiết kế theo **tiêu chuẩn Singapore** hiện đại, chú trọng tối ưu công năng, ánh sáng tự nhiên và không gian sống thực tế. Các đơn vị tư vấn đồng hành gồm: **Global Vireon Studio**, **Kiến Trúc Việt**, **NAGECCO** và **K-City**. Dự án hướng đến tiêu chuẩn **công trình xanh EDGE**, hỗ trợ tiết kiệm điện và nước trong quá trình sử dụng.\\n\\n**Quy mô sản phẩm**\\n\\nDự án cung cấp đa dạng loại căn hộ: Studio (36,1m²), 1 phòng ngủ+ loại A (47m²), 1 phòng ngủ+ loại B (55,1m²), 2 phòng ngủ (68,8m²) và 20 căn shophouse. Tất cả bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án.\\n\\n**Hệ thống tiện ích nội khu**\\n\\nVới quỹ đất rộng 13,97 ha, K-Home Midtown được quy hoạch hệ thống tiện ích đầy đủ phục vụ cư dân: **hồ bơi**, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **Sky Garden & vườn cảnh quan**, **nhà sinh hoạt cộng đồng** và không gian xanh nội khu.\\n\\n**Pháp lý & Chính sách hỗ trợ**\\n\\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp từ khoảng 3,5 – 4,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ miễn phí.";

const NEW_AVENUE_DESC = "K-Home Avenue Nhơn Trạch – dự án nhà ở xã hội tại đường 25C, quy mô 5,3 ha, 1.022 căn hộ. Gần sân bay Long Thành, lãi suất ưu đãi 5,4%/năm, hỗ trợ hồ sơ miễn phí.";

const NEW_AVENUE_LONG = "**Tổng quan dự án K-Home Avenue Nhơn Trạch**\\n\\n**K-Home Avenue** là dự án nhà ở xã hội (NOXH) do **Kim Oanh Land** phát triển, tọa lạc tại đường **Nguyễn Ái Quốc (Tỉnh lộ 25C)**, xã Nhơn Trạch, tỉnh Đồng Nai. Dự án được quy hoạch trên quỹ đất **5,3 ha** với **4 block cao 12 tầng**, cung cấp **1.022 căn hộ nhà ở xã hội** cùng **82 căn shophouse**.\\n\\nVới vị trí nằm trên trục kết nối quan trọng của huyện Nhơn Trạch, K-Home Avenue hướng đến giải pháp an cư phù hợp cho người lao động và gia đình trẻ trong khu vực đang phát triển mạnh nhờ hạ tầng sân bay Long Thành và các khu công nghiệp.\\n\\n**Vị trí & Lợi thế kết nối**\\n\\nDự án nằm trên đường **Nguyễn Ái Quốc (Tỉnh lộ 25C)** — tuyến đường kết nối Nhơn Trạch với khu vực **Sân bay Quốc tế Long Thành** đang xây dựng và các trục giao thông liên vùng. Cư dân thuận tiện di chuyển đến khu vực sân bay Long Thành, các khu công nghiệp tại Nhơn Trạch (KCN Nhơn Trạch 1–6), TP. Biên Hòa và TP. Hồ Chí Minh qua hệ thống cao tốc và đường vành đai.\\n\\n**Thiết kế & Đối tác**\\n\\nK-Home Avenue được quy hoạch và thiết kế theo **tiêu chuẩn Singapore** hiện đại với sự tham gia của: **Surbana Jurong** (Singapore), **Global Vireon Studio**, **Handong**, **Coninco** và **K-City**. Thiết kế tập trung tối ưu công năng, ánh sáng tự nhiên và thông gió. Dự án hướng đến tiêu chuẩn **công trình xanh EDGE** nhằm giảm chi phí vận hành cho cư dân.\\n\\n**Quy mô sản phẩm**\\n\\nDự án cung cấp đa dạng: Studio (37,7m²), 1 phòng ngủ+ (46,6m²), 2 phòng ngủ nhỏ (65,7m²), 2 phòng ngủ lớn (69,5m²) và 82 căn shophouse. Tất cả bàn giao hoàn thiện nội thất theo tiêu chuẩn dự án.\\n\\n**Hệ thống tiện ích nội khu**\\n\\nHệ thống tiện ích phục vụ nhu cầu thiết thực hàng ngày của cư dân bao gồm: **hồ bơi**, **sân chơi trẻ em**, **khu thể dục ngoài trời**, **Sky Garden & vườn cảnh quan**, **nhà sinh hoạt cộng đồng**, **trạm sạc xe điện** và hệ thống shophouse khối đế.\\n\\n**Pháp lý & Chính sách hỗ trợ**\\n\\nSổ hồng sở hữu lâu dài theo quy định nhà ở xã hội. Người mua đủ điều kiện được hỗ trợ vay từ **Ngân hàng Chính sách Xã hội** với lãi suất ưu đãi **5,4%/năm** trong 25 năm, trả góp chỉ từ 3,5 triệu/tháng. Đội ngũ Kim Oanh Land hỗ trợ hoàn thiện hồ sơ miễn phí.";

for (const filepath of files) {
  let content = fs.readFileSync(filepath, "utf8");

  // Update Midtown description
  content = content.replace(
    "Tọa lạc tại trung tâm huyện Trảng Bom, K-Home Midtown là dự án NOXH quy mô 13,97 hecta với 542 căn hộ và 20 căn shophouse, kết nối thuận tiện 4 tuyến đường lớn.",
    NEW_MIDTOWN_DESC
  );

  // Update Midtown longDescription (find old pattern and replace)
  content = content.replace(
    /("longDescription": ")(\*\*Tổng quan dự án K-Home Midtown Trảng Bom\*\*.*?)(")/s,
    `$1${NEW_MIDTOWN_LONG}$3`
  );

  // Update Avenue description
  content = content.replace(
    "Tọa lạc trên trục đường Nguyễn Ái Quốc (25C), K-Home Avenue là dự án NOXH quy mô 5,3 hecta với 1.022 căn hộ và 82 căn shophouse, hưởng lợi trực tiếp từ hạ tầng sân bay Long Thành.",
    NEW_AVENUE_DESC
  );

  // Update Avenue longDescription
  content = content.replace(
    /("longDescription": ")(\*\*Tổng quan dự án K-Home Avenue Nhơn Trạch\*\*.*?)(")/s,
    `$1${NEW_AVENUE_LONG}$3`
  );

  // Update Midtown developer
  content = content.replace(
    'status: "Đã công bố", rating: 4.7, floorCount: 15, developer: "Kim Oanh Land \u2022 K-Home Group"',
    'status: "Đã công bố", rating: 4.7, floorCount: 15, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)"'
  );

  // Update Avenue developer
  content = content.replace(
    'status: "Đã công bố", rating: 4.8, floorCount: 12, developer: "Kim Oanh Land \u2022 K-Home Group"',
    'status: "Đã công bố", rating: 4.8, floorCount: 12, developer: "Kim Oanh Land (Tập đoàn Kim Oanh Group)"'
  );

  fs.writeFileSync(filepath, content, "utf8");
  console.log("Updated:", filepath);
}

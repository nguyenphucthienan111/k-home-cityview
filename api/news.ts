import type { VercelRequest, VercelResponse } from "@vercel/node";

// AUTO-GENERATED — run: node scripts/generate-api-functions.mjs
// Data inlined from server.ts — no external imports needed
const DATA = [
{
    id: "1", slug: "chinh-thuc-cong-bo-k-home-grand-urban-giai-doan-2",
    title: "Chính thức công bố kế hoạch xây dựng K-Home Grand Urban Giai đoạn 2",
    date: "2026-07-20",
    excerpt: "Chủ đầu tư K-Home Group vừa công bố kế hoạch khởi công phân khu The Oasis thuộc giai đoạn 2 dự án K-Home Grand Urban với hàng loạt nâng cấp đắt giá.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    category: "Tin tức dự án",
    content: "Nối tiếp thành công vang dội của giai đoạn 1 với hơn 95% căn hộ được giao dịch thành công trong ngày đầu tiên mở bán, K-Home Group đã chính thức đưa ra thị trường lộ trình phát triển giai đoạn 2 của K-Home Grand Urban.",
  },
  {
    id: "2", slug: "xu-huong-lua-chon-can-ho-xanh-thong-minh",
    title: "Xu hướng lựa chọn căn hộ xanh thông minh lên ngôi năm 2026",
    date: "2026-07-15",
    excerpt: "Khảo sát mới đây cho thấy hơn 85% người mua nhà sẵn sàng chi trả thêm từ 10% - 15% ngân sách cho các căn hộ áp dụng giải pháp xanh và tự động hóa thông minh.",
    image: "https://images.unsplash.com/photo-1502005229762-fc1b2381f0db?auto=format&fit=crop&w=800&q=80",
    category: "Thị trường",
    content: "Sự phát triển vượt bậc của công nghệ và biến đổi khí hậu đang định hình lại hành vi của người mua nhà.",
  },
  {
    id: "3", slug: "lai-suat-mua-nha-giam-sau-co-hoi-vang",
    title: "Lãi suất vay mua nhà giảm sâu: Cơ hội vàng cho người mua nhà ở thực",
    date: "2026-07-10",
    excerpt: "Nhiều ngân hàng thương mại lớn đồng loạt hạ mức lãi suất vay mua nhà ưu đãi xuống chỉ còn từ 4.5%/năm.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    category: "Tài chính",
    content: "Làn sóng hạ lãi suất cho vay đang diễn ra vô cùng mạnh mẽ.",
  },
];

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.json(DATA);
}

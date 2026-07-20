export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string; // e.g. "Căn hộ chung cư", "Biệt thự nghỉ dưỡng", "Penthouse", "Nhà phố thương mại"
  price: string; // e.g. "Từ 3.2 Tỷ"
  priceNumber: number; // For filtering, in billions
  area: string; // e.g. "54m² - 110m²"
  image: string;
  description: string;
  longDescription: string;
  gallery: string[];
  amenities: string[];
  status: string; // "Đang mở bán", "Sắp mở bán", "Đã bàn giao"
  rating: number;
  floorCount: number;
  developer: string;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  content: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectSlug: string;
  projectName: string;
  message: string;
  status: string; // "Chờ liên hệ", "Đã liên hệ", "Đang thương lượng", "Đã chốt"
  notes: string;
  createdAt: string;
}

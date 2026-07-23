export interface UnitType {
  slug: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  constructionArea: string;
  usableArea: string;
  price: string;
  priceNumber: number;
  furnished: boolean;
  description?: string;  // mô tả riêng cho loại căn
  images: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  price: string;
  priceNumber: number;
  area: string;
  image: string;
  description: string;
  longDescription: string;
  gallery: string[];
  amenities: string[];
  unitTypes?: UnitType[];
  mapEmbedUrl?: string;
  status: string;
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

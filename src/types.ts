export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  retailPrice?: number;
  category: string;
  tag?: string;
  description: string;
  image: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  outOfStockSizes?: string[];
  stock?: number;
  rating: number;
  salesCount?: number;
  featured?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  productCount?: number;
}

export interface PromotionsConfig {
  headline: string;
  subheadline: string;
  badgeText: string;
  discounts: string[];
  buttonText: string;
  activeCategory: string;
  bannerImageUrl?: string;
  active: boolean;
}

export interface SiteConfig {
  logoUrl: string;
  faviconUrl: string;
  mainBannerUrl: string;
  promoBannerUrl: string;
  whatsappPhone: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  openingHours: string;
  deliveryCostLima: number;
  deliveryCostProvincias: number;
  freeShippingThreshold: number;
  storePickupAddress: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  primaryColor?: string;
  accentColor?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  token?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: 'producto' | 'marca' | 'categoria' | 'promocion' | 'configuracion' | 'sistema';
  details: string;
  timestamp: string;
  user: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  retailPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
  deliveryMethod: 'Delivery' | 'Recojo en Tienda';
  notes?: string;
}

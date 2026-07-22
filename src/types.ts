export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  retailPrice?: number;
  category: 'Hombre' | 'Mujer' | 'Unisex' | 'Trekking' | 'Fiestas Patrias' | string;
  tag?: 'Nuevo' | 'Oferta' | 'Top Ventas' | 'Fiestas Patrias' | string;
  description: string;
  image: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  outOfStockSizes?: string[];
  rating: number;
  salesCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
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

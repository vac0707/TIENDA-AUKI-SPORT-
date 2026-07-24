import { Product, Brand, Category, PromotionsConfig, SiteConfig, AdminUser, ActivityLog } from '../types';
import { products as initialProducts } from '../data/products';

// STORAGE KEYS FOR LOCAL FALLBACK / OFFLINE CACHE
const STORAGE_KEYS = {
  PRODUCTS: 'auki_admin_products',
  BRANDS: 'auki_admin_brands',
  CATEGORIES: 'auki_admin_categories',
  PROMOTIONS: 'auki_admin_promotions',
  CONFIG: 'auki_admin_config',
  AUTH: 'auki_admin_auth',
  LOGS: 'auki_admin_logs'
};

// Initial default brands
const DEFAULT_BRANDS: Brand[] = [
  { id: '1', name: 'Adidas', logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=200', description: 'Marca alemana líder en calzado deportivo y urbano.', active: true },
  { id: '2', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200', description: 'Innovación y rendimiento deportivo global.', active: true },
  { id: '3', name: 'New Balance', logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=200', description: 'Comodidad superior, diseño retro y urbano.', active: true },
  { id: '4', name: 'Puma', logo: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=200', description: 'Estilo audaz y de alto impacto deportivo.', active: true },
  { id: '5', name: 'Li-Ning', logo: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=200', description: 'Tecnología avanzada para basketball y running.', active: true },
  { id: '6', name: '361°', logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200', description: 'Amortiguación técnica y rendimiento dinámico.', active: true },
  { id: '7', name: 'Caterpillar', logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200', description: 'Calzado resistente, durable e industrial.', active: true }
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'hombre', name: 'Hombre', description: 'Calzado deportivo y urbano masculino', active: true },
  { id: 'mujer', name: 'Mujer', description: 'Calzado deportivo y urbano femenino', active: true },
  { id: 'unisex', name: 'Unisex', description: 'Modelos versátiles para todos', active: true },
  { id: 'trekking', name: 'Trekking', description: 'Zapatillas de outdoor, montaña y senderismo', active: true },
  { id: 'fiestas-patrias', name: 'Fiestas Patrias', description: 'Especiales y ofertas patrias', active: true },
  { id: 'ofertas', name: 'Ofertas', description: 'Promociones con descuento', active: true }
];

const DEFAULT_PROMOTIONS: PromotionsConfig = {
  headline: "¡CELEBRA AL PERÚ CON LO MEJOR!",
  subheadline: "Descuentos reales en zapatillas seleccionadas para Fiestas Patrias 🇵🇪",
  badgeText: "Especial Fiestas Patrias 🇵🇪 - AUKI SPORT",
  discounts: ["20%", "30%", "50%"],
  buttonText: "Ver Colección Patrias",
  activeCategory: "Fiestas Patrias",
  bannerImageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200",
  active: true
};

const DEFAULT_SITE_CONFIG: SiteConfig = {
  logoUrl: "https://res.cloudinary.com/demo/image/upload/v1631234567/auki_sport_logo.png",
  faviconUrl: "https://res.cloudinary.com/demo/image/upload/v1631234567/auki_favicon.ico",
  mainBannerUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200",
  promoBannerUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1200",
  whatsappPhone: "51931741682",
  contactPhone: "931 741 682",
  contactEmail: "ventas@aukisport.com",
  address: "Av. Grau 456, Galería La Virreyna Stand 102 - Huancayo / Lima",
  openingHours: "Lunes a Sábado: 9:00 am - 8:30 pm",
  deliveryCostLima: 15.00,
  deliveryCostProvincias: 20.00,
  freeShippingThreshold: 299.00,
  storePickupAddress: "Tienda Principal: Av. Grau 456 Stand 102",
  socials: {
    facebook: "https://facebook.com/aukisport.pe",
    instagram: "https://instagram.com/aukisport.pe",
    tiktok: "https://tiktok.com/@aukisport.pe",
    youtube: "https://youtube.com/@aukisport"
  },
  primaryColor: "#dc2626",
  accentColor: "#eab308"
};

// Helper function to safely fetch from REST API or fallback to localStorage
async function requestAPI<T>(endpoint: string, options: RequestInit = {}, fallbackFn: () => T): Promise<T> {
  try {
    const authUser = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    if (authUser?.token) {
      headers['Authorization'] = `Bearer ${authUser.token}`;
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // REST API call failed (e.g., client side or offline mode), fallback to localStorage data
  }
  return fallbackFn();
}

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

function getAuthToken(): AdminUser | null {
  return getStoredItem<AdminUser | null>(STORAGE_KEYS.AUTH, null);
}

// DECOUPLED SERVICE EXPORTS

// 1. Auth Service
export const authService = {
  async login(credentials: { email: string; password: string }): Promise<{ success: boolean; user?: AdminUser; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoredItem(STORAGE_KEYS.AUTH, data.user);
        return { success: true, user: data.user };
      } else {
        // Fallback offline check
        if ((credentials.email === 'admin@aukisport.com' || credentials.email === 'admin') && credentials.password === 'auki2026') {
          const user: AdminUser = {
            id: 'usr-1',
            username: 'admin',
            email: 'admin@aukisport.com',
            name: 'Administrador AUKI',
            role: 'admin',
            token: `offline-token-${Date.now()}`
          };
          setStoredItem(STORAGE_KEYS.AUTH, user);
          return { success: true, user };
        }
        return { success: false, message: data.message || 'Credenciales incorrectas' };
      }
    } catch {
      if ((credentials.email === 'admin@aukisport.com' || credentials.email === 'admin') && credentials.password === 'auki2026') {
        const user: AdminUser = {
          id: 'usr-1',
          username: 'admin',
          email: 'admin@aukisport.com',
          name: 'Administrador AUKI',
          role: 'admin',
          token: `offline-token-${Date.now()}`
        };
        setStoredItem(STORAGE_KEYS.AUTH, user);
        return { success: true, user };
      }
      return { success: false, message: 'Credenciales de prueba: admin@aukisport.com / auki2026' };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getCurrentUser(): AdminUser | null {
    return getAuthToken();
  },

  isAuthenticated(): boolean {
    const user = getAuthToken();
    return !!(user && user.token);
  }
};

// 2. Products Service
export const productsService = {
  async getAll(): Promise<Product[]> {
    return requestAPI('/productos', { method: 'GET' }, () => {
      const stored = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
      if (!stored || stored.length === 0) {
        setStoredItem(STORAGE_KEYS.PRODUCTS, initialProducts);
        return initialProducts;
      }
      return stored;
    });
  },

  async getById(id: string): Promise<Product | null> {
    const list = await this.getAll();
    return list.find(p => p.id === id) || null;
  },

  async create(data: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: data.id || `prod-${Date.now()}`,
      rating: data.rating || 5,
      salesCount: data.salesCount || 0,
      stock: Number(data.stock ?? 10),
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return requestAPI('/productos', {
      method: 'POST',
      body: JSON.stringify(newProduct)
    }, () => {
      const current = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
      const updated = [newProduct, ...current];
      setStoredItem(STORAGE_KEYS.PRODUCTS, updated);
      activityService.addLog('Crear Producto', 'producto', `Se creó el producto: ${newProduct.brand} ${newProduct.name}`);
      return newProduct;
    });
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return requestAPI(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const current = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
      const index = current.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Producto no encontrado');

      const updatedProduct = {
        ...current[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      current[index] = updatedProduct;
      setStoredItem(STORAGE_KEYS.PRODUCTS, current);
      activityService.addLog('Editar Producto', 'producto', `Se actualizó el producto: ${updatedProduct.brand} ${updatedProduct.name}`);
      return updatedProduct;
    });
  },

  async delete(id: string): Promise<boolean> {
    return requestAPI(`/productos/${id}`, {
      method: 'DELETE'
    }, () => {
      const current = getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
      const target = current.find(p => p.id === id);
      const filtered = current.filter(p => p.id !== id);
      setStoredItem(STORAGE_KEYS.PRODUCTS, filtered);
      if (target) {
        activityService.addLog('Eliminar Producto', 'producto', `Se eliminó el producto: ${target.brand} ${target.name}`);
      }
      return true;
    });
  }
};

// 3. Brands Service
export const brandsService = {
  async getAll(): Promise<Brand[]> {
    return requestAPI('/marcas', { method: 'GET' }, () => {
      return getStoredItem<Brand[]>(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
    });
  },

  async create(data: Omit<Brand, 'id'>): Promise<Brand> {
    const newBrand: Brand = {
      ...data,
      id: `brand-${Date.now()}`,
      active: data.active ?? true
    };
    return requestAPI('/marcas', {
      method: 'POST',
      body: JSON.stringify(newBrand)
    }, () => {
      const current = getStoredItem<Brand[]>(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
      const updated = [...current, newBrand];
      setStoredItem(STORAGE_KEYS.BRANDS, updated);
      activityService.addLog('Crear Marca', 'marca', `Se creó la marca: ${newBrand.name}`);
      return newBrand;
    });
  },

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    return requestAPI(`/marcas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const current = getStoredItem<Brand[]>(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
      const index = current.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Marca no encontrada');
      const updated = { ...current[index], ...data };
      current[index] = updated;
      setStoredItem(STORAGE_KEYS.BRANDS, current);
      activityService.addLog('Editar Marca', 'marca', `Se actualizó la marca: ${updated.name}`);
      return updated;
    });
  },

  async delete(id: string): Promise<boolean> {
    return requestAPI(`/marcas/${id}`, { method: 'DELETE' }, () => {
      const current = getStoredItem<Brand[]>(STORAGE_KEYS.BRANDS, DEFAULT_BRANDS);
      const target = current.find(b => b.id === id);
      const filtered = current.filter(b => b.id !== id);
      setStoredItem(STORAGE_KEYS.BRANDS, filtered);
      if (target) {
        activityService.addLog('Eliminar Marca', 'marca', `Se eliminó la marca: ${target.name}`);
      }
      return true;
    });
  }
};

// 4. Categories Service
export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return requestAPI('/categorias', { method: 'GET' }, () => {
      return getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    });
  },

  async create(data: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
    const id = data.id || data.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = { ...data, id, active: data.active ?? true };
    return requestAPI('/categorias', {
      method: 'POST',
      body: JSON.stringify(newCat)
    }, () => {
      const current = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      const updated = [...current, newCat];
      setStoredItem(STORAGE_KEYS.CATEGORIES, updated);
      activityService.addLog('Crear Categoría', 'categoria', `Se creó la categoría: ${newCat.name}`);
      return newCat;
    });
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return requestAPI(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const current = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      const index = current.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Categoría no encontrada');
      const updated = { ...current[index], ...data };
      current[index] = updated;
      setStoredItem(STORAGE_KEYS.CATEGORIES, current);
      activityService.addLog('Editar Categoría', 'categoria', `Se actualizó la categoría: ${updated.name}`);
      return updated;
    });
  },

  async delete(id: string): Promise<boolean> {
    return requestAPI(`/categorias/${id}`, { method: 'DELETE' }, () => {
      const current = getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      const target = current.find(c => c.id === id);
      const filtered = current.filter(c => c.id !== id);
      setStoredItem(STORAGE_KEYS.CATEGORIES, filtered);
      if (target) {
        activityService.addLog('Eliminar Categoría', 'categoria', `Se eliminó la categoría: ${target.name}`);
      }
      return true;
    });
  }
};

// 5. Promotions Service
export const promotionsService = {
  async get(): Promise<PromotionsConfig> {
    return requestAPI('/promociones', { method: 'GET' }, () => {
      return getStoredItem<PromotionsConfig>(STORAGE_KEYS.PROMOTIONS, DEFAULT_PROMOTIONS);
    });
  },

  async update(data: Partial<PromotionsConfig>): Promise<PromotionsConfig> {
    return requestAPI('/promociones', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const current = getStoredItem<PromotionsConfig>(STORAGE_KEYS.PROMOTIONS, DEFAULT_PROMOTIONS);
      const updated = { ...current, ...data };
      setStoredItem(STORAGE_KEYS.PROMOTIONS, updated);
      activityService.addLog('Actualizar Promoción', 'promocion', `Se actualizó la promoción: ${updated.headline}`);
      return updated;
    });
  }
};

// 6. Site Config Service
export const configService = {
  async get(): Promise<SiteConfig> {
    return requestAPI('/configuracion', { method: 'GET' }, () => {
      return getStoredItem<SiteConfig>(STORAGE_KEYS.CONFIG, DEFAULT_SITE_CONFIG);
    });
  },

  async update(data: Partial<SiteConfig>): Promise<SiteConfig> {
    return requestAPI('/configuracion', {
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const current = getStoredItem<SiteConfig>(STORAGE_KEYS.CONFIG, DEFAULT_SITE_CONFIG);
      const updated = { ...current, ...data };
      setStoredItem(STORAGE_KEYS.CONFIG, updated);
      activityService.addLog('Actualizar Configuración', 'configuracion', 'Se actualizaron los datos generales de la tienda');
      return updated;
    });
  }
};

// 7. Activity Logs Service
export const activityService = {
  async getLogs(): Promise<ActivityLog[]> {
    return requestAPI('/activity-logs', { method: 'GET' }, () => {
      return getStoredItem<ActivityLog[]>(STORAGE_KEYS.LOGS, [
        {
          id: 'log-1',
          action: 'Sistema listo',
          entity: 'sistema',
          details: 'Panel de administración inicializado',
          timestamp: new Date().toISOString(),
          user: 'admin@aukisport.com'
        }
      ]);
    });
  },

  addLog(action: string, entity: ActivityLog['entity'], details: string): void {
    const current = getStoredItem<ActivityLog[]>(STORAGE_KEYS.LOGS, []);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
      user: authService.getCurrentUser()?.email || 'admin@aukisport.com'
    };
    const updated = [newLog, ...current].slice(0, 50);
    setStoredItem(STORAGE_KEYS.LOGS, updated);
  }
};

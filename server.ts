import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { products as initialProducts } from "./src/data/products.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial Memory Store
let dbProducts = [...initialProducts.map(p => ({
  ...p,
  stock: p.stock ?? Math.floor(Math.random() * 15) + 5,
  active: p.active ?? true,
  createdAt: p.createdAt ?? new Date().toISOString()
}))];

let dbBrands = [
  { id: '1', name: 'Adidas', logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=200', description: 'Marca alemana líder en calzado deportivo y urbano.', active: true },
  { id: '2', name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200', description: 'Innovación y rendimiento deportivo global.', active: true },
  { id: '3', name: 'New Balance', logo: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=200', description: 'Comodidad superior, diseño retro y urbano.', active: true },
  { id: '4', name: 'Puma', logo: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=200', description: 'Estilo audaz y de alto impacto deportivo.', active: true },
  { id: '5', name: 'Li-Ning', logo: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=200', description: 'Tecnología avanzada para basketball y running.', active: true },
  { id: '6', name: '361°', logo: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=200', description: 'Amortiguación técnica y rendimiento dinámico.', active: true },
  { id: '7', name: 'Caterpillar', logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200', description: 'Calzado resistente, durable e industrial.', active: true }
];

let dbCategories = [
  { id: 'hombre', name: 'Hombre', description: 'Calzado deportivo y urbano masculino', active: true },
  { id: 'mujer', name: 'Mujer', description: 'Calzado deportivo y urbano femenino', active: true },
  { id: 'unisex', name: 'Unisex', description: 'Modelos versátiles para todos', active: true },
  { id: 'trekking', name: 'Trekking', description: 'Zapatillas de outdoor, montaña y senderismo', active: true },
  { id: 'fiestas-patrias', name: 'Fiestas Patrias', description: 'Especiales y ofertas patrias', active: true },
  { id: 'ofertas', name: 'Ofertas', description: 'Promociones con descuento', active: true }
];

let dbPromotions = {
  headline: "¡CELEBRA AL PERÚ CON LO MEJOR!",
  subheadline: "Descuentos reales en zapatillas seleccionadas para Fiestas Patrias 🇵🇪",
  badgeText: "Especial Fiestas Patrias 🇵🇪 - AUKI SPORT",
  discounts: ["20%", "30%", "50%"],
  buttonText: "Ver Colección Patrias",
  activeCategory: "Fiestas Patrias",
  bannerImageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200",
  active: true
};

let dbSiteConfig = {
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

let dbActivityLogs = [
  {
    id: 'log-1',
    action: 'Actualización de Campaña',
    entity: 'promocion' as const,
    details: 'Se actualizó la promoción a Fiestas Patrias 2026',
    timestamp: new Date().toISOString(),
    user: 'admin@aukisport.com'
  }
];

function logActivity(action: string, entity: any, details: string, user: string = 'admin@aukisport.com') {
  dbActivityLogs.unshift({
    id: `log-${Date.now()}`,
    action,
    entity,
    details,
    timestamp: new Date().toISOString(),
    user
  });
  if (dbActivityLogs.length > 50) dbActivityLogs.pop();
}

// REST API ROUTES
// Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if ((email === "admin@aukisport.com" || email === "admin") && password === "auki2026") {
    const token = `auki-auth-token-${Date.now()}`;
    const user = {
      id: "usr-1",
      username: "admin",
      email: "admin@aukisport.com",
      name: "Administrador AUKI",
      role: "admin" as const,
      token
    };
    logActivity("Inicio de sesión", "sistema", "Ingreso exitoso al panel de administración", user.email);
    res.json({ success: true, token, user });
  } else {
    res.status(401).json({ success: false, message: "Credenciales incorrectas. Intente con admin@aukisport.com / auki2026" });
  }
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer auki-auth-token-")) {
    res.json({
      success: true,
      user: {
        id: "usr-1",
        username: "admin",
        email: "admin@aukisport.com",
        name: "Administrador AUKI",
        role: "admin"
      }
    });
  } else {
    res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
});

// Products REST API
app.get("/api/productos", (req, res) => {
  res.json(dbProducts);
});

app.post("/api/productos", (req, res) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    rating: req.body.rating || 5,
    salesCount: req.body.salesCount || 0,
    stock: Number(req.body.stock ?? 10),
    active: req.body.active ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dbProducts.unshift(newProduct);
  logActivity("Crear Producto", "producto", `Se creó el producto: ${newProduct.brand} ${newProduct.name}`);
  res.status(201).json(newProduct);
});

app.put("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const index = dbProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    dbProducts[index] = {
      ...dbProducts[index],
      ...req.body,
      stock: Number(req.body.stock ?? dbProducts[index].stock),
      updatedAt: new Date().toISOString()
    };
    logActivity("Editar Producto", "producto", `Se modificó el producto: ${dbProducts[index].brand} ${dbProducts[index].name}`);
    res.json(dbProducts[index]);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const target = dbProducts.find(p => p.id === id);
  if (target) {
    dbProducts = dbProducts.filter(p => p.id !== id);
    logActivity("Eliminar Producto", "producto", `Se eliminó el producto: ${target.brand} ${target.name}`);
    res.json({ success: true, message: "Producto eliminado correctamente", id });
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

// Brands REST API
app.get("/api/marcas", (req, res) => {
  res.json(dbBrands);
});

app.post("/api/marcas", (req, res) => {
  const newBrand = {
    ...req.body,
    id: req.body.id || `brand-${Date.now()}`,
    active: req.body.active ?? true
  };
  dbBrands.push(newBrand);
  logActivity("Crear Marca", "marca", `Se creó la marca: ${newBrand.name}`);
  res.status(201).json(newBrand);
});

app.put("/api/marcas/:id", (req, res) => {
  const { id } = req.params;
  const index = dbBrands.findIndex(b => b.id === id);
  if (index !== -1) {
    dbBrands[index] = { ...dbBrands[index], ...req.body };
    logActivity("Editar Marca", "marca", `Se actualizó la marca: ${dbBrands[index].name}`);
    res.json(dbBrands[index]);
  } else {
    res.status(404).json({ message: "Marca no encontrada" });
  }
});

app.delete("/api/marcas/:id", (req, res) => {
  const { id } = req.params;
  const target = dbBrands.find(b => b.id === id);
  if (target) {
    dbBrands = dbBrands.filter(b => b.id !== id);
    logActivity("Eliminar Marca", "marca", `Se eliminó la marca: ${target.name}`);
    res.json({ success: true, id });
  } else {
    res.status(404).json({ message: "Marca no encontrada" });
  }
});

// Categories REST API
app.get("/api/categorias", (req, res) => {
  res.json(dbCategories);
});

app.post("/api/categorias", (req, res) => {
  const newCat = {
    ...req.body,
    id: req.body.id || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    active: req.body.active ?? true
  };
  dbCategories.push(newCat);
  logActivity("Crear Categoría", "categoria", `Se creó la categoría: ${newCat.name}`);
  res.status(201).json(newCat);
});

app.put("/api/categorias/:id", (req, res) => {
  const { id } = req.params;
  const index = dbCategories.findIndex(c => c.id === id);
  if (index !== -1) {
    dbCategories[index] = { ...dbCategories[index], ...req.body };
    logActivity("Editar Categoría", "categoria", `Se actualizó la categoría: ${dbCategories[index].name}`);
    res.json(dbCategories[index]);
  } else {
    res.status(404).json({ message: "Categoría no encontrada" });
  }
});

app.delete("/api/categorias/:id", (req, res) => {
  const { id } = req.params;
  const target = dbCategories.find(c => c.id === id);
  if (target) {
    dbCategories = dbCategories.filter(c => c.id !== id);
    logActivity("Eliminar Categoría", "categoria", `Se eliminó la categoría: ${target.name}`);
    res.json({ success: true, id });
  } else {
    res.status(404).json({ message: "Categoría no encontrada" });
  }
});

// Promotions REST API
app.get("/api/promociones", (req, res) => {
  res.json(dbPromotions);
});

app.put("/api/promociones", (req, res) => {
  dbPromotions = { ...dbPromotions, ...req.body };
  logActivity("Actualizar Promoción", "promocion", `Se actualizó el banner promocional: ${dbPromotions.headline}`);
  res.json(dbPromotions);
});

// Site General Config REST API
app.get("/api/configuracion", (req, res) => {
  res.json(dbSiteConfig);
});

app.put("/api/configuracion", (req, res) => {
  dbSiteConfig = { ...dbSiteConfig, ...req.body };
  logActivity("Actualizar Configuración", "configuracion", "Se actualizaron los datos generales del sitio web");
  res.json(dbSiteConfig);
});

// Activity Logs REST API
app.get("/api/activity-logs", (req, res) => {
  res.json(dbActivityLogs);
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AUKI SPORT SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();

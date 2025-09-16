import express from "express";
import ProductManager from "./src/manage/productManager.js";
import CartManager from "./src/manage/cartManager.js";
import productRouter from "./src/routes/productRouter.js";
import cartRouter from "./src/routes/cartRouter.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Crear instancias de los managers con rutas correctas
const productManager = new ProductManager(path.join(__dirname, "src/data/products.json"));
const cartManager = new CartManager(path.join(__dirname, "src/data/carts.json"));

// Pasar los managers a los routers mediante middleware
app.use((req, res, next) => {
  req.productManager = productManager;
  req.cartManager = cartManager;
  next();
});

// Usar los routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Papelería!");
});

// Ruta de salud
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.url} no existe` 
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ 
    error: "Error interno del servidor",
    message: error.message 
  });
});

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🛒 Servidor de papelería iniciado en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Carts: http://localhost:${PORT}/api/carts`);
});

export default app;
import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();

// Helper para formatear fechas
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES');
};

// Home 
viewsRouter.get("/", async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.render("home", { 
      products, 
      user: { username: "BenicioDev01", isAdmin: false } 
    });
  } catch (error) {
    console.error("Error en home:", error);
    res.render("home", { 
      products: [], 
      user: { username: "BenicioDev01", isAdmin: false } 
    });
  }
});

// Dashboard - Vista original
viewsRouter.get("/dashboard", async (req, res) => {
  try {
    const products = await Product.find();
    const user = { username: "BenicioDev01", isAdmin: false };
    res.render("dashboard", { products, user });
  } catch (error) {
    console.error("Error en dashboard:", error);
    res.render("dashboard", { products: [], user: { username: "BenicioDev01", isAdmin: false } });
  }
});

// RealTimeProducts 
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("realTimeProducts", { 
      products, 
      user: { username: "BenicioDev01", isAdmin: true } 
    });
  } catch (error) {
    console.error("Error en realtimeproducts:", error);
    res.render("realTimeProducts", { 
      products: [], 
      user: { username: "BenicioDev01", isAdmin: true } 
    });
  }
});

// Ruta para productos eliminados (para mantener compatibilidad)
viewsRouter.get("/deleted-products", async (req, res) => {
  try {
    // En MongoDB con eliminación física, no hay productos eliminados
    const deletedProducts = [];
    res.render("deleted-products", { 
      deletedProducts, 
      user: { username: "BenicioDev01", isAdmin: true },
      helpers: { formatDate } 
    });
  } catch (error) {
    console.error("Error en deleted-products:", error);
    res.render("deleted-products", { 
      deletedProducts: [], 
      user: { username: "BenicioDev01", isAdmin: true },
      helpers: { formatDate } 
    });
  }
});

export default viewsRouter;
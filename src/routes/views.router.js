import express from "express";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();

// Helper para formatear fechas
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('es-ES');
};

// Home 
viewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { 
    products, 
    user: { username: "BenicioDev01", isAdmin: false } 
  });
});

// Dashboard - Vista original
viewsRouter.get("/dashboard", async (req, res) => {
  const user = { username: "BenicioDev01", isAdmin: false };
  const products = await productManager.getProducts();
  res.render("dashboard", { products, user });
});

// RealTimeProducts 
viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { 
    products, 
    user: { username: "BenicioDev01", isAdmin: true } 
  });
});

// ruta para productos eliminados
viewsRouter.get("/deleted-products", async (req, res) => {
  const deletedProducts = await productManager.getDeletedProducts();
  res.render("deleted-products", { 
    deletedProducts, 
    user: { username: "BenicioDev01", isAdmin: true },
    helpers: { formatDate } 
  });
});

export default viewsRouter;
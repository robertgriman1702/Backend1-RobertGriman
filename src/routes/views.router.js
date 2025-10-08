import express from "express";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { 
    products, 
    user: { username: "BenicioDev01", isAdmin: false } 
  });
});

viewsRouter.get("/dashboard", async (req, res) => {
  const user = { username: "BenicioDev01", isAdmin: false };
  const products = await productManager.getProducts();
  res.render("dashboard", { products, user });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { 
    products, 
    user: { username: "BenicioDev01", isAdmin: true } 
  });
});

export default viewsRouter;
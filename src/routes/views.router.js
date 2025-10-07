import express from "express";
import ProductManager from "../productManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

viewsRouter.get("/", (req, res)=> {
  res.render("home");
});

viewsRouter.get("/dashboard", async(req, res)=> {
  const user = { username: "BenicioDev01", isAdmin: false };
  const products = await productManager.getProducts();

  res.render("dashboard", { products, user } );
});

export default viewsRouter;
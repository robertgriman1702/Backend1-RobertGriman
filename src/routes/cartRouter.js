import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../productManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get("/", (req, res) => {
  res.json({ message: "¡Router de carritos funcionando!" });
});

// POST /api/carts/ -> crear carrito
router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// GET /api/carts/:cid -> productos del carrito
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid -> agregar producto (incrementa qty si ya existe)
router.post("/:cid/product/:pid", async (req, res) => {
  const product = await productManager.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });

  const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (!updatedCart) return res.status(404).json({ error: "Carrito no encontrado" });

  res.json(updatedCart);
});

export default router;
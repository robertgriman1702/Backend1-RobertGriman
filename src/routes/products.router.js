import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await manager.getAll();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.title || !body.price) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }
  const newProduct = await manager.addProduct(body);
  res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updated);
});

router.delete("/:pid", async (req, res) => {
  await manager.deleteProduct(req.params.pid);
  res.json({ status: "ok" });
});

export default router;
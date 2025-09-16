import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productManager = req.productManager;
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const productManager = req.productManager;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const productManager = req.productManager;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto añadido", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;
    const productManager = req.productManager;
    const products = await productManager.setProductById(pid, updates);
    res.status(200).json({ message: "Producto actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
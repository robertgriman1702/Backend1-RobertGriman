import { Router } from "express";
import multer from "multer";
import path from "path";
import ProductManager from "../productManager.js";

const router = Router();
const manager = new ProductManager();

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET /api/products/   -> listar todos
router.get("/", async (req, res) => {
  try {
    const products = await manager.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/products/:pid  -> traer uno
router.get("/:pid", async (req, res) => {
  try {
    const product = await manager.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/products/  -> crear con manejo de archivos
router.post("/", upload.single('file'), async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    const { title, price } = req.body;
    
    // Validar campos requeridos
    if (!title || !price) {
      return res.status(400).json({ error: "Faltan campos requeridos: title y price" });
    }

    // Preparar datos del producto
    const productData = {
      title,
      price: parseFloat(price),
      thumbnail: req.file ? `/img/${req.file.filename}` : '/img/default-product.jpg'
    };

    const newProduct = await manager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/products/:pid -> actualizar
router.put("/:pid", async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/products/:pid -> eliminar
router.delete("/:pid", async (req, res) => {
  try {
    await manager.deleteProduct(req.params.pid);
    res.json({ status: "ok", message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
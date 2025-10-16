import { Router } from "express";
import multer from "multer";
import path from "path";
import Product from "../models/product.model.js";

const router = Router();

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
    const { limit = 10, page = 1 } = req.query;

    const data = await Product.paginate({}, { limit, page });
    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", payload: products, ...data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al recuperar los productos" });
  }
});

// GET /api/products/:pid  -> traer uno
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

// POST /api/products/  -> crear con manejo de archivos
router.post("/", upload.single('file'), async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    console.log("Archivo recibido:", req.file);

    const { title, description, code, price, stock, category } = req.body;
    
    // Validar campos requeridos
    if (!title || !price || !code) {
      return res.status(400).json({ status: "error", message: "Faltan campos requeridos: title, price y code" });
    }

    // Preparar datos del producto
    const productData = {
      title,
      description: description || "",
      code,
      price: parseFloat(price),
      stock: stock ? parseInt(stock) : 0,
      category: category || "general",
      thumbnail: req.file ? `/img/${req.file.filename}` : '/img/default-product.jpg'
    };

    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    if (error.code === 11000) {
      return res.status(400).json({ status: "error", message: "El código del producto ya existe" });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ status: "error", message: error.message });
    }
    res.status(500).json({ status: "error", message: "Error al agregar un producto" });
  }
});

// PUT /api/products/:pid -> actualizar
router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar un producto" });
  }
});

// DELETE /api/products/:pid -> eliminar
router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.status(200).json({ 
      status: "success", 
      message: "Producto eliminado correctamente",
      payload: deletedProduct 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar un producto" });
  }
});

export default router;
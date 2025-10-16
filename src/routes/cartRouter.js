import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const router = Router();

// GET /api/carts/ -> listar todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al recuperar los carritos" });
  }
});

// POST /api/carts/ -> crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el carrito" });
  }
});

// GET /api/carts/:cid -> obtener carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.status(200).json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/carts/:cid/product/:pid -> agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    // Verificar que el producto existe
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    // Verificar que el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    // Buscar si el producto ya está en el carrito
    const existingProduct = cart.products.find(
      item => item.product.toString() === pid
    );

    if (existingProduct) {
      // Si ya existe, actualizar la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si no existe, agregar nuevo producto
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid -> eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    // Filtrar el producto a eliminar
    cart.products = cart.products.filter(
      item => item.product.toString() !== pid
    );

    await cart.save();
    await cart.populate('products.product');

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
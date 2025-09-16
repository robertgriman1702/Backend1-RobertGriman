import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cartManager = req.cartManager;
    const cart = await cartManager.createCart();
    res.status(201).json({ 
      message: "Carrito creado exitosamente",
      cart 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartManager = req.cartManager;
    const cart = await cartManager.getCart(cartId);
    res.status(200).json({ cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1;
    const cartManager = req.cartManager;
    
    const cart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(200).json({ 
      message: "Producto agregado al carrito",
      cart 
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
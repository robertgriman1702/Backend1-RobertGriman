import crypto from "crypto";
import fs from "fs/promises";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async #readFile() {
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(fileData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error("Error al leer el archivo: " + error.message);
    }
  }

  async #writeFile(data) {
    try {
      await fs.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      throw new Error("Error al escribir en el archivo: " + error.message);
    }
  }

  async createCart() {
    try {
      const carts = await this.#readFile();
      const newCart = {
        id: this.generateNewId(),
        products: []
      };
      
      carts.push(newCart);
      await this.#writeFile(carts);
      
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async getCart(cartId) {
    try {
      const carts = await this.#readFile();
      const cart = carts.find(cart => cart.id === cartId);
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const carts = await this.#readFile();
      const cartIndex = carts.findIndex(cart => cart.id === cartId);
      
      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = carts[cartIndex].products.findIndex(
        item => item.product === productId
      );

      if (productIndex === -1) {
        // Producto no existe en el carrito, agregarlo
        carts[cartIndex].products.push({
          product: productId,
          quantity: quantity
        });
      } else {
        // Producto ya existe, incrementar cantidad
        carts[cartIndex].products[productIndex].quantity += quantity;
      }

      await this.#writeFile(carts);
      return carts[cartIndex];
    } catch (error) {
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  }
}

export default CartManager;
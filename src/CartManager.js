import fs from "fs/promises";
import path from "path";

const CARTS_FILE = path.resolve("src", "carts.json");

export default class CartManager {
  constructor(file = CARTS_FILE) {
    this.path = file;
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content || "[]");
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length ? Math.max(...carts.map((c) => Number(c.id))) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find((c) => String(c.id) === String(id)) || null;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex((c) => String(c.id) === String(cartId));
    if (cartIndex === -1) return null;

    const prodIndex = carts[cartIndex].products.findIndex(
      (p) => String(p.product) === String(productId)
    );

    if (prodIndex === -1) {
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    } else {
      carts[cartIndex].products[prodIndex].quantity += 1;
    }

    await this._writeFile(carts);
    return carts[cartIndex];
  }
}
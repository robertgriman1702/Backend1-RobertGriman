import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const PRODUCTS_FILE = path.resolve("src", "products.json");

export default class ProductManager {
  constructor(file = PRODUCTS_FILE) {
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

  async getProducts() {
    return await this._readFile();
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const items = await this._readFile();
    return items.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(product) {
    const items = await this._readFile();
    const newProduct = { 
      id: uuidv4(), 
      status: true, 
      thumbnails: [], 
      ...product 
    };
    items.push(newProduct);
    await this._writeFile(items);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const items = await this._readFile();
    const idx = items.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;
    const preservedId = items[idx].id;
    items[idx] = { ...items[idx], ...updates, id: preservedId };
    await this._writeFile(items);
    return items[idx];
  }

  async deleteProduct(id) {
    const items = await this._readFile();
    const filtered = items.filter((p) => String(p.id) !== String(id));
    await this._writeFile(filtered);
    return filtered;
  }
}
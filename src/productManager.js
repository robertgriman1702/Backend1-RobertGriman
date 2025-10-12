import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Resolver rutas absolutas desde la raíz del proyecto (process.cwd())
const PRODUCTS_FILE = path.resolve(process.cwd(), "src", "products.json");
const DELETED_PRODUCTS_FILE = path.resolve(process.cwd(), "src", "deleted-products.json");

export default class ProductManager {
  constructor(file = PRODUCTS_FILE) {
    this.path = file;
    this.deletedPath = DELETED_PRODUCTS_FILE;
  }

  async _readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content || "[]");
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw err;
    }
  }

  async _writeFile(data, filePath) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile(this.path);
  }

  async getAll() {
    return await this._readFile(this.path);
  }

  async getById(id) {
    const items = await this._readFile(this.path);
    return items.find((p) => String(p.id) === String(id)) || null;
  }

  async addProduct(product) {
    const items = await this._readFile(this.path);
    const newProduct = { 
      id: uuidv4(), 
      status: true, 
      thumbnails: [], 
      ...product 
    };
    items.push(newProduct);
    await this._writeFile(items, this.path);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const items = await this._readFile(this.path);
    const idx = items.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;
    const preservedId = items[idx].id;
    items[idx] = { ...items[idx], ...updates, id: preservedId };
    await this._writeFile(items, this.path);
    return items[idx];
  }

  async deleteProduct(id) {
    const items = await this._readFile(this.path);
    const productIndex = items.findIndex((p) => String(p.id) === String(id));
    
    if (productIndex === -1) return null;

    // Guardar el producto en la lista de eliminados
    const deletedProduct = items[productIndex];
    const deletedProducts = await this._readFile(this.deletedPath);
    
    // Agregar fecha de eliminación
    deletedProduct.deletedAt = new Date().toISOString();
    deletedProducts.push(deletedProduct);
    
    await this._writeFile(deletedProducts, this.deletedPath);

    // Eliminar del array principal
    const filtered = items.filter((p) => String(p.id) !== String(id));
    await this._writeFile(filtered, this.path);
    
    return { 
      deletedProduct, 
      remainingProducts: filtered 
    };
  }

  //método para obtener productos eliminados
  async getDeletedProducts() {
    return await this._readFile(this.deletedPath);
  }

  //método para restaurar producto eliminado
  async restoreProduct(id) {
    const deletedProducts = await this._readFile(this.deletedPath);
    const productIndex = deletedProducts.findIndex((p) => String(p.id) === String(id));
    
    if (productIndex === -1) return null;

    const productToRestore = deletedProducts[productIndex];
    
    // Remover la fecha de eliminación
    delete productToRestore.deletedAt;
    
    // Agregar a productos activos
    const activeProducts = await this._readFile(this.path);
    activeProducts.push(productToRestore);
    await this._writeFile(activeProducts, this.path);

    // Remover de eliminados
    const updatedDeleted = deletedProducts.filter((p) => String(p.id) !== String(id));
    await this._writeFile(updatedDeleted, this.deletedPath);

    return productToRestore;
  }
}
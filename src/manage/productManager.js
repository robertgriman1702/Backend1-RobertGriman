import crypto from "crypto";
import fs from "fs/promises";

class ProductManager{

  constructor(pathFile){
    this.pathFile = pathFile;
  }

  generateNewId(){
    return crypto.randomUUID();
  }

  async addProduct(newProduct){
    try {
      //recuperar los productos
      const fileData = await fs.readFile( this.pathFile, "utf-8" );
      const products = JSON.parse(fileData);

      const newId = this.generateNewId();

      //creamos el producto nuevo y lo pusheamos al array de products
      const product = { id: newId, ...newProduct };
      products.push(product);

      //guardar los productos en el json
      await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2) , "utf-8" );

      return products;
    } catch (error) {
      throw new Error("Error al añadir el nuevo producto: "+error.message);
    }
  }

  async getProducts(){
    try {
      //recuperar los productos
      const fileData = await fs.readFile( this.pathFile, "utf-8" );
      const products = JSON.parse(fileData);

      return products;
    } catch (error) {
      
    }
  }

  async setProductById(productId, updates){
    try {
      //recuperar los productos
      const fileData = await fs.readFile( this.pathFile, "utf-8" );
      const products = JSON.parse(fileData);

      const indexProduct = products.findIndex( product => product.id === productId );
      if( indexProduct === -1 ) throw new Error("Producto no encontrado");

      products[indexProduct] = { ...products[indexProduct], ...updates };

      //guardar los productos actualizados en el json
      await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2) , "utf-8" );

      return products;
    } catch (error) {
      
    }
  }

  async deleteProductById(productId){
    try {
      //recuperar los productos
      const fileData = await fs.readFile( this.pathFile, "utf-8" );
      const products = JSON.parse(fileData);

      const filteredProduct = products.filter( product => product.id !== productId );

      //guardar los productos actualizados en el json
      await fs.writeFile( this.pathFile, JSON.stringify(filteredProduct, null, 2) , "utf-8" );

      return filteredProduct;
    } catch (error) {
      
    }
  }
}

export default ProductManager;
import express from "express";
import http from "http";
import path from "path"; 
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cartRouter.js";
import ProductManager from "./productManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messages = [];
const productManager = new ProductManager();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// WebSockets
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  
  socket.emit("message history", messages);

  socket.on("new message", (data) => {
    messages.push(data);
    io.emit("broadcast new message", data);
  });

  socket.on("delete product", async (productId) => {
    try {
      console.log("Intentando eliminar producto:", productId);
      const result = await productManager.deleteProduct(productId);
      console.log("Producto eliminado, resultado:", result);
      
      if (result) {
        // Emitir a todos los clientes que se eliminó un producto
        io.emit("product deleted", productId);
        
        // Emitir el producto eliminado para la lista de eliminados
        io.emit("product added to deleted", result.deletedProduct);
        
        console.log(`Producto ${productId} eliminado exitosamente`);
      }
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  });
});

// Handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// usar ruta absoluta basada en el working directory del proceso
const viewsPath = path.resolve(process.cwd(), "src", "views");
app.set("views", viewsPath);

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

server.listen(8080, () => {
  console.log("Servidor iniciado correctamente en http://localhost:8080");
});
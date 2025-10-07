import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cartRouter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messages = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
      const productManager = (await import('./productManager.js')).default;
      await productManager.deleteProduct(productId);
      io.emit("product deleted", productId);
      console.log(`Producto ${productId} eliminado`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });
});

// Handlebars config
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

server.listen(8080, () => {
  console.log("Servidor iniciado correctamente en http://localhost:8080");
});
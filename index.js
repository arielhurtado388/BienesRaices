import express from "express";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Conexion a la DB
try {
  await db.authenticate();
  console.log("Conexion correcta a la DB");
} catch (error) {
  console.log(error);
}

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta publica
app.use(express.static("public"));

// Routing
app.use("/auth", authRoutes);

// Definir puerto e iniciar proyecto
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor está en el puerto ${port}`);
});

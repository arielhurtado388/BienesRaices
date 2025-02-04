import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexion a la BD
try {
  await db.authenticate();
  db.sync();
  console.log("Conexion correcta");
} catch (error) {
  console.log(error);
}

// Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta publica
app.use(express.static("public"));

// Routing
app.use("/auth", usuarioRoutes);

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`El servidor en el puerto ${port}`);
});

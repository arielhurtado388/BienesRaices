import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();
app.use(express.json());

// Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF
app.use(
  csrf({
    cookie: true,
  })
);

// Conexion a la DB
try {
  await db.authenticate();
  db.sync();
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
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`El servidor está en el puerto ${port}`);
});

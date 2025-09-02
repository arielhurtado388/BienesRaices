import express from "express";
import authRoutes from "./routes/authRoutes.js";

// Crear la app
const app = express();

// Routing
app.use("/auth", authRoutes);

// Definir puerto e iniciar proyecto
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor está en el puerto ${port}`);
});

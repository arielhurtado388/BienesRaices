import express from "express";
import {
  inicio,
  categoria,
  noEncontrado,
  buscador,
} from "../controllers/appController.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

// Inicio
router.get("/", identificarUsuario, inicio);

// Categorias
router.get("/categorias/:id", identificarUsuario, categoria);

// 404
router.get("/404", identificarUsuario, noEncontrado);

// Buscador
router.post("/buscador", identificarUsuario, buscador);

export default router;

import express from "express";
import {
  confirmar,
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
  registrar,
} from "../controllers/usuarioController.js";
const router = express.Router();

// Routing
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/olvide", formularioOlvidePassword);
router.get("/confirmar/:token", confirmar);

export default router;

import express from "express";
import {
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

export default router;

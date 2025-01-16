import express from "express";
import {
  comprobarToken,
  confirmar,
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
  nuevoPassword,
  registrar,
  resetPassword,
} from "../controllers/usuarioController.js";
const router = express.Router();

// Routing
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/olvide", formularioOlvidePassword);
router.post("/olvide", resetPassword);
router.get("/confirmar/:token", confirmar);

// Almacena el nuevo password
router.get("/olvide/:token", comprobarToken);
router.post("/olvide/:token", nuevoPassword);

export default router;

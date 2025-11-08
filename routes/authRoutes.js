import express from "express";
import {
  confirmarCuenta,
  formularioLogin,
  formularioOlvide,
  formularioRegistro,
  registrar,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/confirmar/:token", confirmarCuenta);
router.get("/olvide", formularioOlvide);

export default router;

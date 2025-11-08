import express from "express";
import {
  autenticar,
  comprobarToken,
  confirmarCuenta,
  formularioLogin,
  formularioOlvide,
  formularioRegistro,
  nuevaContrasena,
  reestablecerContrasena,
  registrar,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.post("/login", autenticar);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/confirmar/:token", confirmarCuenta);
router.get("/olvide", formularioOlvide);
router.post("/olvide", reestablecerContrasena);
router.get("/olvide/:token", comprobarToken);
router.post("/olvide/:token", nuevaContrasena);

export default router;

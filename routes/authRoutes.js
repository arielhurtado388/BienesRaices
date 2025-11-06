import express from "express";
import {
  formularioLogin,
  formularioOlvide,
  formularioRegistro,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/olvide", formularioOlvide);

export default router;

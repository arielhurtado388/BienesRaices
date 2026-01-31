import express from "express";
import { body } from "express-validator";
import {
  admin,
  agregarImagen,
  cambiarEstado,
  crear,
  editar,
  eliminar,
  enviarMensaje,
  guardar,
  guardarCambios,
  mostrarPropiedad,
  subirImagen,
  verMensajes,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, crear);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("descripcion")
    .isLength({ max: 1500 })
    .withMessage("La descripción debe tener máximo 1500 caracteres"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamientos")
    .isNumeric()
    .withMessage("Selecciona la cantidad de estacionamientos"),
  body("banos").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  guardar
);

router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);
router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  subirImagen
);

router.get("/propiedades/editar/:id", protegerRuta, editar);

router.post(
  "/propiedades/editar/:id",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  body("descripcion")
    .isLength({ max: 1500 })
    .withMessage("La descripción debe tener máximo 1500 caracteres"),
  body("categoria").isNumeric().withMessage("Selecciona una categoría"),
  body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamientos")
    .isNumeric()
    .withMessage("Selecciona la cantidad de estacionamientos"),
  body("banos").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  guardarCambios
);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);
router.put("/propiedades/:id", protegerRuta, cambiarEstado);

// Area publica
router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad);

// Almacenar los mensajes
router.post(
  "/propiedad/:id",
  identificarUsuario,
  body("mensaje")
    .isLength({ min: 10, max: 1500 })
    .withMessage("El mensaje es muy corto o demasiado largo"),
  enviarMensaje
);

router.get("/mensajes/:id", protegerRuta, verMensajes);

export default router;

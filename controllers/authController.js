import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../helpers/tokens.js";
import { correoRegistro } from "../helpers/correosCuenta.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  // Validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("correo")
    .isEmail()
    .withMessage("El correo no es válido")
    .run(req);
  await check("contrasena")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .run(req);
  await check("repetir_contrasena")
    .equals(contrasena)
    .withMessage("Las contraseñas no son iguales")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre,
        correo,
      },
    });
  }

  // Verificar duplicados
  const existeUsuario = await Usuario.findOne({
    where: {
      correo,
    },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre,
        correo,
      },
    });
  }

  const usuario = await Usuario.create({
    nombre,
    correo,
    contrasena,
    token: generarToken(),
  });

  // Enviar correo
  correoRegistro({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token: usuario.token,
  });

  // Mostrar mensaje
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un correo de confirmación, presiona en el enlace",
  });
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({
    where: {
      token,
    },
  });

  if (!usuario) {
    res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "La cuenta se confirmó correctamente",
  });
};

const formularioOlvide = (req, res) => {
  res.render("auth/olvide", {
    pagina: "Olvidé mi contraseña",
    csrfToken: req.csrfToken(),
  });
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  confirmarCuenta,
  formularioOlvide,
};

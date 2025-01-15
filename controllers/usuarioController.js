import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { correoRegistro } from "../helpers/correos.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};
const registrar = async (req, res) => {
  // Validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);

  await check("correo")
    .isEmail()
    .withMessage("El correo no es válido")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las contraseñas no son iguales")
    .run(req);

  let resultado = validationResult(req);

  // Verificar que resultado este vacio
  if (!resultado.isEmpty()) {
    // Errores
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo,
      },
    });
  }

  // Extraer los datos
  const { nombre, correo, password } = req.body;

  // Verificar que el usuario sea unico
  const existeUsuario = await Usuario.findOne({
    where: { correo },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: nombre,
        correo: correo,
      },
    });
  }

  // Guardar usuario
  const usuario = await Usuario.create({
    nombre,
    correo,
    password,
    token: generarId(),
  });

  // Enviar correo de confirmacion
  correoRegistro({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token: usuario.token,
  });

  // Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un correo de confirmación, presiona en el enlace",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide", {
    pagina: "Recuperar acceso",
  });
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  // Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }
  // Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar", {
    pagina: "Cuenta confirmada",
    mensaje: "La cuenta se confirmó correctamente",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  registrar,
  formularioOlvidePassword,
  confirmar,
};

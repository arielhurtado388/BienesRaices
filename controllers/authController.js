import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarJwtToken, generarToken } from "../helpers/tokens.js";
import {
  correoReestablecer,
  correoRegistro,
} from "../helpers/correosCuenta.js";
import bcrypt from "bcrypt";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  await check("correo")
    .isEmail()
    .withMessage("El correo es obligatorio")
    .run(req);
  await check("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { correo, contrasena } = req.body;

  const usuario = await Usuario.findOne({
    where: {
      correo,
    },
  });

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no está registrado" }],
    });
  }
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no está confirmado" }],
    });
  }

  if (!usuario.verificarContrasena(contrasena)) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "La contraseña es incorrecta" }],
    });
  }

  // Autenticar con JWT
  const jwtToken = generarJwtToken(usuario.id);

  // Almacenar en un cookie
  return res
    .cookie("_jwtToken", jwtToken, {
      httpOnly: true,
      // expires: 9000,
      // secure: true,
      // sameSite: true
    })
    .redirect("/mis-propiedades");
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

const reestablecerContrasena = async (req, res) => {
  await check("correo")
    .isEmail()
    .withMessage("El correo no es válido")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/olvide", {
      pagina: "Olvidé mi contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { correo } = req.body;

  const usuario = await Usuario.findOne({
    where: {
      correo,
    },
  });
  if (!usuario) {
    res.render("auth/olvide", {
      pagina: "Olvidé mi contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario no está registrado" }],
    });
  }

  // Enviar correo con token
  usuario.token = generarToken();
  await usuario.save();

  correoReestablecer({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token: usuario.token,
  });
  // Mostrar mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu contraseña",
    mensaje: "Hemos enviado un correo con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({
    where: {
      token,
    },
  });

  if (!usuario) {
    return res.render(`auth/confirmar-cuenta`, {
      pagina: "Reestablece tu contraseña",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }

  // Mostrar formulario
  res.render("auth/reestablecer", {
    pagina: "Coloca tu nueva contraseña",
    csrfToken: req.csrfToken(),
  });
};
const nuevaContrasena = async (req, res) => {
  await check("contrasena")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .run(req);

  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("auth/reestablecer", {
      pagina: "Coloca tu nueva contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { contrasena } = req.body;

  const usuario = await Usuario.findOne({
    where: {
      token,
    },
  });

  const salt = await bcrypt.genSalt(10);
  usuario.contrasena = await bcrypt.hash(contrasena, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Contraseña reestablecida",
    mensaje: "La contraseña se cambió correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  registrar,
  confirmarCuenta,
  formularioOlvide,
  reestablecerContrasena,
  comprobarToken,
  nuevaContrasena,
};

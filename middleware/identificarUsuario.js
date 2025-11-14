import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const identificarUsuario = async (req, res, next) => {
  // Identificar si hay un token en las cookies
  const { _jwtToken } = req.cookies;

  if (!_jwtToken) {
    req.usuario = null;
    return next();
  }

  // Comprobar el token
  try {
    const decoded = jwt.verify(_jwtToken, process.env.JWT_SECRET);
    const usuario = await Usuario.scope("eliminarContrasena").findByPk(
      decoded.id
    );
    if (usuario) {
      req.usuario = usuario;
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.clearCookie("_jwtToken").redirect("/auth/login");
  }
};

export default identificarUsuario;

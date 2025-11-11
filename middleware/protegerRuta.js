import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

const protegerRuta = async (req, res, next) => {
  // Verificar si hay token
  const { _jwtToken } = req.cookies;

  if (!_jwtToken) {
    return res.redirect("/auth/login");
  }

  // Comprobar el token

  try {
    const decoded = jwt.verify(_jwtToken, process.env.JWT_SECRET);
    const usuario = await Usuario.scope("eliminarContrasena").findByPk(
      decoded.id
    );
    // Almacenar el usuario en el Req
    if (usuario) {
      req.usuario = usuario;
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    return res.clearCookie("_jwtToken").redirect("/auth/login");
  }
};

export default protegerRuta;

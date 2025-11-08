import jwt from "jsonwebtoken";

const generarToken = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

const generarJwtToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export { generarToken, generarJwtToken };

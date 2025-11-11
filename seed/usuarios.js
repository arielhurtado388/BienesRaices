import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "Ariel",
    correo: "ariel@ariel.com",
    contrasena: bcrypt.hashSync("12345678", 10),
    confirmado: 1,
  },
];

export default usuarios;

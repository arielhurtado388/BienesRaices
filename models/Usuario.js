import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
      },
    },
  }
);

// Metodos personalizados
Usuario.prototype.verificarContrasena = function (contrasena) {
  return bcrypt.compareSync(contrasena, this.contrasena);
};

export default Usuario;

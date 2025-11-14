import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

Propiedad.belongsTo(Precio, { foreignKey: "idPrecio" });
Propiedad.belongsTo(Categoria, { foreignKey: "idCategoria" });
Propiedad.belongsTo(Usuario, { foreignKey: "idUsuario" });
Propiedad.hasMany(Mensaje, { foreignKey: "idPropiedad" });
Mensaje.belongsTo(Propiedad, { foreignKey: "idPropiedad" });
Mensaje.belongsTo(Usuario, { foreignKey: "idUsuario" });

export { Propiedad, Precio, Categoria, Usuario, Mensaje };

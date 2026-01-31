import { Sequelize } from "sequelize";
import { Categoria, Propiedad } from "../models/index.js";

const inicio = async (req, res) => {
  const [categorias, casas, departamentos] = await Promise.all([
    Categoria.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        idCategoria: 1,
        publicada: 1,
      },
      include: [{ model: Categoria, as: "categoria" }],
      order: [["createdAt", "DESC"]],
    }),

    Propiedad.findAll({
      limit: 3,
      where: {
        idCategoria: 2,
        publicada: 1,
      },
      include: [{ model: Categoria, as: "categoria" }],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("inicio", {
    pagina: "Inicio",
    csrfToken: req.csrfToken(),
    categorias,
    casas,
    departamentos,
    usuario: req.usuario,
  });
};

const categoria = async (req, res) => {
  const { id } = req.params;

  // Comprobar que la categoria exista
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }
  // Obtener las propiedades
  const propiedades = await Propiedad.findAll({
    where: {
      idCategoria: id,
      publicada: 1,
    },
    include: [{ model: Categoria, as: "categoria" }],
  });

  res.render("categoria", {
    pagina: `${categoria.nombre}s en venta`,
    csrfToken: req.csrfToken(),
    propiedades,
    usuario: req.usuario,
  });
};

const noEncontrado = (req, res) => {
  res.render("404", {
    pagina: "No encontrada",
    csrfToken: req.csrfToken(),
    usuario: req.usuario,
  });
};

const buscador = async (req, res) => {
  const { termino } = req.body;
  // Validar que termino no este vacio
  if (!termino.trim()) {
    // return res.redirect("back");
    return res.redirect(req.get("Referer"));
  }

  // Consultar las propiedades
  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Sequelize.Op.like]: "%" + termino + "%",
      },
      publicada: 1,
    },
    include: [{ model: Categoria, as: "categoria" }],
  });

  res.render("busqueda", {
    pagina: "Resultados de la búsqueda",
    csrfToken: req.csrfToken(),
    propiedades,
    usuario: req.usuario,
  });
};

export { inicio, categoria, noEncontrado, buscador };

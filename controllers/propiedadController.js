import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import {
  Categoria,
  Precio,
  Propiedad,
  Usuario,
  Mensaje,
} from "../models/index.js";
import { esVendedor, formatearFecha } from "../helpers/index.js";

const admin = async (req, res) => {
  // Leer query string
  const { pagina: paginaActual } = req.query;
  const expresion = /^[1-9]$/;
  if (!expresion.test(paginaActual)) {
    return res.redirect("/mis-propiedades?pagina=1");
  }

  try {
    const { id } = req.usuario;

    // Limites y offset para el paginador
    const limit = 10;
    const offset = paginaActual * limit - limit;

    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: {
          idUsuario: id,
        },
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Categoria,
            as: "categoria",
          },
          {
            model: Precio,
            as: "precio",
          },
          {
            model: Mensaje,
            as: "mensajes",
          },
        ],
      }),
      Propiedad.count({
        where: {
          idUsuario: id,
        },
      }),
    ]);

    res.render("propiedades/admin", {
      pagina: "Mis propiedades",
      csrfToken: req.csrfToken(),
      propiedades,
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
};

const crear = async (req, res) => {
  // Consultar precios y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear propiedad",
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  // Validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Consultar precios y categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear propiedad",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  // Crear registro
  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamientos,
    banos,
    calle,
    lat,
    lng,
    precio: idPrecio,
    categoria: idCategoria,
  } = req.body;

  const { id: idUsuario } = req.usuario;

  try {
    const propiedadAlmacenada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      banos,
      calle,
      lat,
      lng,
      imagen: "",
      idPrecio,
      idCategoria,
      idUsuario,
    });

    const { id } = propiedadAlmacenada;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  // Validar que exista la propiedad
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que no este publicada la propiedad
  if (propiedad.publicada) {
    return res.redirect("/mis-propiedades");
  }

  // Que la propiedad pertenece al usuario
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const subirImagen = async (req, res, next) => {
  // Validar que exista la propiedad
  const { id } = req.params;
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Validar que no este publicada la propiedad
  if (propiedad.publicada) {
    return res.redirect("/mis-propiedades");
  }

  // Que la propiedad pertenece al usuario
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  try {
    const { filename } = req.file;
    // Almacenar la imagen y publicar propiedad
    propiedad.imagen = filename;
    propiedad.publicada = 1;
    await propiedad.save();
    next();
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  // Validar que exista la propiedad
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Quien ve la url es quien creo la propiedad
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Consultar precios y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/editar", {
    pagina: `Editar propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad,
  });
};

const guardarCambios = async (req, res) => {
  // Validacion
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    // Consultar precios y categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/editar", {
      pagina: "Editar propiedad",
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  const { id } = req.params;
  // Validar que exista la propiedad
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Quien ve la url es quien creo la propiedad
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Reescribir el objeto y actualizarlo
  try {
    const {
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      banos,
      calle,
      lat,
      lng,
      precio: idPrecio,
      categoria: idCategoria,
    } = req.body;

    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      banos,
      calle,
      lat,
      lng,
      idPrecio,
      idCategoria,
    });

    await propiedad.save();
    res.redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  // Validar que exista la propiedad
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Quien ve la url es quien creo la propiedad
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Eliminar la imagen
  await unlink(`public/uploads/${propiedad.imagen}`);

  // Eliminar la propiedad
  await propiedad.destroy();
  res.redirect("/mis-propiedades");
};

const mostrarPropiedad = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Precio, as: "precio" },
      { model: Categoria, as: "categoria" },
      { model: Usuario, as: "usuario" },
    ],
  });

  if (!propiedad) {
    return res.redirect("/404");
  }

  res.render("propiedades/mostrar", {
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    propiedad,
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.idUsuario),
  });
};

const enviarMensaje = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Precio, as: "precio" },
      { model: Categoria, as: "categoria" },
      { model: Usuario, as: "usuario" },
    ],
  });

  if (!propiedad) {
    return res.redirect("/404");
  }

  // Rendereizar los errores
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    return res.render("propiedades/mostrar", {
      pagina: propiedad.titulo,
      csrfToken: req.csrfToken(),
      propiedad,
      usuario: req.usuario,
      esVendedor: esVendedor(req.usuario?.id, propiedad.idUsuario),
      errores: resultado.array(),
    });
  }

  // Almacenar el mensaje
  await Mensaje.create({
    mensaje: req.body.mensaje,
    idPropiedad: req.params.id,
    idUsuario: req.usuario.id,
  });

  // TODO: Enviar alerta al correo del usuario sobre un nuevo mensaje

  // res.redirect("/");

  res.render("propiedades/mostrar", {
    pagina: propiedad.titulo,
    csrfToken: req.csrfToken(),
    propiedad,
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id, propiedad.idUsuario),
    enviado: true,
  });
};

// Leer mensajes recibidos
const verMensajes = async (req, res) => {
  const { id } = req.params;
  // Validar que exista la propiedad
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensaje,
        as: "mensajes",
        include: [
          {
            model: Usuario.scope("eliminarContrasena"),
            as: "usuario",
          },
        ],
      },
    ],
  });

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  // Quien ve la url es quien creo la propiedad
  if (propiedad.idUsuario.toString() !== req.usuario.id.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/mensajes", {
    pagina: "Mensajes",
    mensajes: propiedad.mensajes,
    formatearFecha,
  });
};

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  subirImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
};

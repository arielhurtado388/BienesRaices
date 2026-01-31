import { Propiedad, Categoria } from "../models/index.js";

const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    where: {
      publicada: 1,
    },
    include: [
      { model: Categoria, as: "categoria" },
    ],
  });

  res.json(propiedades);
};

export { propiedades };

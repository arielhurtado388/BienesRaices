(function () {
  const lat = -1.683351835541667;
  const lng = -79.02596756686448;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 15);

  let markers = new L.FeatureGroup().addTo(mapa);
  let propiedades = [];

  //   Filtros
  const filtros = {
    categoria: "",
    precio: { min: 0, max: Infinity },
  };

  const categoriasSelect = document.querySelector("#categorias");
  const preciosSelect = document.querySelector("#precios");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //   Filtrado de categorias y precios
  categoriasSelect.addEventListener("change", (e) => {
    filtros.categoria = +e.target.value;
    filtrarPropiedades();
  });

  preciosSelect.addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.dataset.min !== undefined) {
      filtros.precio = {
        min: Number(selectedOption.dataset.min),
        max: selectedOption.dataset.max === "Infinity" ? Infinity : Number(selectedOption.dataset.max),
      };
    } else {
      filtros.precio = { min: 0, max: Infinity };
    }
    filtrarPropiedades();
  });

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades";
      const respuesta = await fetch(url);
      propiedades = await respuesta.json();
      mostrarPropiedades(propiedades);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarPropiedades = (propiedades) => {
    // Limpiar los markers previos
    markers.clearLayers();

    propiedades.forEach((propiedad) => {
      // Agregar cada pin
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
            <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
            <h1 class="font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
            <img class="rounded-lg" src="/uploads/${propiedad?.imagen}" alt="Imagen de ${propiedad?.titulo}"/>
            <p class="text-gray-600 font-bold">$${Number(propiedad.precio).toLocaleString()} USD</p>
            <a class="bg-indigo-600 block p-2 text-center font-bold uppercase" href="/propiedad/${propiedad.id}">Ver propiedad</a>
            `);
      markers.addLayer(marker);
    });
  };

  const filtrarPropiedades = () => {
    const resultado = propiedades
      .filter(filtrarCategoria)
      .filter(filtrarPrecio);
    mostrarPropiedades(resultado);
  };

  const filtrarCategoria = (propiedad) =>
    filtros.categoria ? propiedad.idCategoria === filtros.categoria : propiedad;

  const filtrarPrecio = (propiedad) => {
    const precio = Number(propiedad.precio);
    if (filtros.precio.min === 0 && filtros.precio.max === Infinity) {
      return true;
    }
    return precio >= filtros.precio.min && precio <= filtros.precio.max;
  };

  obtenerPropiedades();
})();

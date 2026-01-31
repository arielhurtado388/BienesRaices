(function () {
  const categoriaSelect = document.querySelector("#categoria");
  const camposPropiedad = document.querySelector("#campos-propiedad");
  const metrosCuadradosContainer = document.querySelector(
    "#metros-cuadrados-container"
  );

  if (!categoriaSelect || !camposPropiedad || !metrosCuadradosContainer) return;

  function toggleCampos() {
    const selectedOption =
      categoriaSelect.options[categoriaSelect.selectedIndex];
    const esTerreno =
      selectedOption && selectedOption.dataset.nombre === "Terreno";

    if (esTerreno) {
      camposPropiedad.classList.add("hidden");
      metrosCuadradosContainer.classList.remove("hidden");
    } else {
      camposPropiedad.classList.remove("hidden");
      metrosCuadradosContainer.classList.add("hidden");
    }
  }

  categoriaSelect.addEventListener("change", toggleCampos);
  toggleCampos();
})();

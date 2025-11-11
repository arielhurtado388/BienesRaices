(function () {
  // Logical OR
  const lat = document.querySelector("#lat").value || -1.683351835541667;
  const lng = document.querySelector("#lng").value || -79.02596756686448;
  const mapa = L.map("mapa").setView([lat, lng], 15);
  let marker;

  //   Utilizar provider y geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //   El pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //   Leer lat y lng del pin
  marker.on("moveend", function (e) {
    marker = e.target;
    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

    // Obtener la informacion de las calles al soltar el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        marker.bindPopup(resultado.address.LongLabel);

        // Llenar los campos de calle, lat y lng
        document.querySelector(".calle").textContent =
          resultado?.address?.Address ?? "";

        document.querySelector("#calle").value =
          resultado?.address?.Address ?? "";

        document.querySelector("#lat").value = resultado?.latlng?.lat ?? "";
        document.querySelector("#lng").value = resultado?.latlng?.lng ?? "";
      });
  });
})();

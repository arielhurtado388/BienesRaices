/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js"
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n(function () {\n  const lat = -1.683351835541667;\n  const lng = -79.02596756686448;\n  const mapa = L.map(\"mapa-inicio\").setView([lat, lng], 15);\n\n  let markers = new L.FeatureGroup().addTo(mapa);\n  let propiedades = [];\n\n  //   Filtros\n  const filtros = {\n    categoria: \"\",\n    precio: { min: 0, max: Infinity },\n  };\n\n  const categoriasSelect = document.querySelector(\"#categorias\");\n  const preciosSelect = document.querySelector(\"#precios\");\n\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\n    attribution:\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\n  }).addTo(mapa);\n\n  //   Filtrado de categorias y precios\n  categoriasSelect.addEventListener(\"change\", (e) => {\n    filtros.categoria = +e.target.value;\n    filtrarPropiedades();\n  });\n\n  preciosSelect.addEventListener(\"change\", (e) => {\n    const selectedOption = e.target.options[e.target.selectedIndex];\n    if (selectedOption.dataset.min !== undefined) {\n      filtros.precio = {\n        min: Number(selectedOption.dataset.min),\n        max: selectedOption.dataset.max === \"Infinity\" ? Infinity : Number(selectedOption.dataset.max),\n      };\n    } else {\n      filtros.precio = { min: 0, max: Infinity };\n    }\n    filtrarPropiedades();\n  });\n\n  const obtenerPropiedades = async () => {\n    try {\n      const url = \"/api/propiedades\";\n      const respuesta = await fetch(url);\n      propiedades = await respuesta.json();\n      mostrarPropiedades(propiedades);\n    } catch (error) {\n      console.log(error);\n    }\n  };\n\n  const mostrarPropiedades = (propiedades) => {\n    // Limpiar los markers previos\n    markers.clearLayers();\n\n    propiedades.forEach((propiedad) => {\n      // Agregar cada pin\n      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\n        autoPan: true,\n      }).addTo(mapa).bindPopup(`\n            <p class=\"text-indigo-600 font-bold\">${propiedad.categoria.nombre}</p>\n            <h1 class=\"font-extrabold uppercase my-2\">${propiedad?.titulo}</h1>\n            <img class=\"rounded-lg\" src=\"/uploads/${propiedad?.imagen}\" alt=\"Imagen de ${propiedad?.titulo}\"/>\n            <p class=\"text-gray-600 font-bold\">$${Number(propiedad.precio).toLocaleString()} USD</p>\n            <a class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\" href=\"/propiedad/${propiedad.id}\">Ver propiedad</a>\n            `);\n      markers.addLayer(marker);\n    });\n  };\n\n  const filtrarPropiedades = () => {\n    const resultado = propiedades\n      .filter(filtrarCategoria)\n      .filter(filtrarPrecio);\n    mostrarPropiedades(resultado);\n  };\n\n  const filtrarCategoria = (propiedad) =>\n    filtros.categoria ? propiedad.idCategoria === filtros.categoria : propiedad;\n\n  const filtrarPrecio = (propiedad) => {\n    const precio = Number(propiedad.precio);\n    if (filtros.precio.min === 0 && filtros.precio.max === Infinity) {\n      return true;\n    }\n    return precio >= filtros.precio.min && precio <= filtros.precio.max;\n  };\n\n  obtenerPropiedades();\n})();\n\n\n//# sourceURL=webpack://bienesraices/./src/js/mapaInicio.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0,__webpack_exports__,__webpack_require__);
/******/ 	
/******/ })()
;
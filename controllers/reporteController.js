import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Propiedad, Categoria } from "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const obtenerPropiedadesUsuario = async (idUsuario) => {
  return await Propiedad.findAll({
    where: { idUsuario },
    order: [["updatedAt", "DESC"]],
    include: [{ model: Categoria, as: "categoria" }],
  });
};

const formatearPrecio = (precio) => {
  return `$${Number(precio).toLocaleString("en-US")} USD`;
};

// Generar reporte PDF
const generarPDF = async (req, res) => {
  try {
    const { id } = req.usuario;
    const propiedades = await obtenerPropiedadesUsuario(id);

    if (!propiedades.length) {
      return res.redirect("/mis-propiedades?pagina=1");
    }

    const doc = new PDFDocument({ margin: 50, size: "LETTER" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte-propiedades.pdf",
    );

    doc.pipe(res);

    // Logo
    const logoPath = join(__dirname, "..", "public", "img", "logo.png");
    doc.image(logoPath, 50, 30, { width: 60 });

    // Titulo
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Reporte de Propiedades", 120, 45, { align: "left" });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generado: ${new Date().toLocaleDateString("es-ES")}`, 120, 70, {
        align: "left",
      });

    doc.moveDown(3);

    // Linea separadora
    const lineY = doc.y;
    doc
      .moveTo(50, lineY)
      .lineTo(doc.page.width - 50, lineY)
      .stroke("#4338ca");

    doc.moveDown(1);

    // Listado de propiedades
    let valorTotal = 0;

    propiedades.forEach((propiedad, index) => {
      // Verificar si necesitamos una nueva pagina
      if (doc.y > doc.page.height - 180) {
        doc.addPage();
      }

      const precio = Number(propiedad.precio);
      valorTotal += precio;

      // Numero y titulo
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#4338ca")
        .text(`${index + 1}. ${propiedad.titulo}`);

      doc.moveDown(0.3);

      // Detalles
      doc.fontSize(10).font("Helvetica").fillColor("#000000");

      const estado = propiedad.publicada ? "Publicada" : "No publicada";

      doc.text(`Categoria: ${propiedad.categoria.nombre}`);
      doc.text(`Precio: ${formatearPrecio(precio)}`);
      doc.text(`Direccion: ${propiedad.calle}`);
      doc.text(`Estado: ${estado}`);

      // Solo mostrar habitaciones, banos, estacionamientos si no son todos 0
      if (
        propiedad.habitaciones > 0 ||
        propiedad.banos > 0 ||
        propiedad.estacionamientos > 0
      ) {
        doc.text(
          `Habitaciones: ${propiedad.habitaciones} | Baños: ${propiedad.banos} | Estacionamientos: ${propiedad.estacionamientos}`,
        );
      }

      if (propiedad.metrosCuadrados) {
        doc.text(`Metros Cuadrados: ${propiedad.metrosCuadrados} m²`);
      }

      doc.moveDown(0.5);

      // Linea separadora entre propiedades
      const sepY = doc.y;
      doc
        .moveTo(50, sepY)
        .lineTo(doc.page.width - 50, sepY)
        .stroke("#e5e7eb");

      doc.moveDown(0.5);
    });

    // Verificar espacio para el resumen
    if (doc.y > doc.page.height - 160) {
      doc.addPage();
    }

    // Resumen final
    doc.moveDown(4);

    const resumenY = doc.y;
    doc
      .moveTo(50, resumenY)
      .lineTo(doc.page.width - 50, resumenY)
      .stroke("#4338ca");

    doc.moveDown(0.5);

    doc.rect(50, doc.y, doc.page.width - 100, 50).fill("#f5f3ff");

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#4338ca")
      .text(`Total de propiedades: ${propiedades.length}`, 70, doc.y - 40, {
        continued: false,
      });

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#4338ca")
      .text(`Valor total: ${formatearPrecio(valorTotal)}`);

    doc.end();
  } catch (error) {
    console.log(error);
    return res.redirect("/mis-propiedades?pagina=1");
  }
};

// Generar reporte Excel
const generarExcel = async (req, res) => {
  try {
    const { id } = req.usuario;
    const propiedades = await obtenerPropiedadesUsuario(id);

    if (!propiedades.length) {
      return res.redirect("/mis-propiedades?pagina=1");
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "BienesRaices";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Propiedades");

    // Logo
    const logoPath = join(__dirname, "..", "public", "img", "logo.webp");
    try {
      const logoImage = workbook.addImage({
        buffer: readFileSync(logoPath),
        extension: "png",
      });
      sheet.addImage(logoImage, {
        tl: { col: 0, row: 0 },
        ext: { width: 80, height: 80 },
      });
    } catch {
      // Si no se puede cargar el logo, continuar sin el
    }

    // Titulo
    sheet.mergeCells("B1:I1");
    const titleCell = sheet.getCell("B1");
    titleCell.value = "Reporte de Propiedades";
    titleCell.font = { size: 18, bold: true, color: { argb: "FF4338CA" } };
    titleCell.alignment = { vertical: "middle" };

    sheet.mergeCells("B2:I2");
    const dateCell = sheet.getCell("B2");
    dateCell.value = `Generado: ${new Date().toLocaleDateString("es-ES")}`;
    dateCell.font = { size: 10, italic: true, color: { argb: "FF6B7280" } };

    sheet.getRow(1).height = 40;
    sheet.getRow(2).height = 20;

    // Fila vacia
    sheet.getRow(3).height = 10;

    // Encabezados de tabla en fila 4
    const headerRow = sheet.getRow(4);
    const headers = [
      "Titulo",
      "Categoria",
      "Precio",
      "Habitaciones",
      "Baños",
      "Estacionamientos",
      "Metros Cuadrados",
      "Direccion",
      "Estado",
    ];

    headers.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = header;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4338CA" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FF4338CA" } },
      };
    });
    headerRow.height = 30;

    // Anchos de columna
    sheet.columns = [
      { width: 30 }, // Titulo
      { width: 15 }, // Categoria
      { width: 18 }, // Precio
      { width: 14 }, // Habitaciones
      { width: 10 }, // Banos
      { width: 16 }, // Estacionamientos
      { width: 18 }, // Metros Cuadrados
      { width: 25 }, // Direccion
      { width: 15 }, // Estado
    ];

    // Datos
    let valorTotal = 0;

    propiedades.forEach((propiedad, index) => {
      const rowIndex = index + 5; // Empezamos en fila 5
      const precio = Number(propiedad.precio);
      valorTotal += precio;

      const row = sheet.getRow(rowIndex);
      row.values = [
        propiedad.titulo,
        propiedad.categoria.nombre,
        formatearPrecio(precio),
        propiedad.habitaciones,
        propiedad.banos,
        propiedad.estacionamientos,
        propiedad.metrosCuadrados ? `${propiedad.metrosCuadrados} m²` : "N/A",
        propiedad.calle,
        propiedad.publicada ? "Publicada" : "No publicada",
      ];

      // Estilo alternado de filas
      const fillColor = index % 2 === 0 ? "FFF5F3FF" : "FFFFFFFF";
      for (let col = 1; col <= 9; col++) {
        const cell = row.getCell(col);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.alignment = { vertical: "middle" };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      }

      // Centrar columnas numericas
      [4, 5, 6].forEach((col) => {
        row.getCell(col).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });
    });

    // Fila de totales
    const totalRowIndex = propiedades.length + 5;
    const totalRow = sheet.getRow(totalRowIndex);

    sheet.mergeCells(`A${totalRowIndex}:B${totalRowIndex}`);
    const totalLabelCell = totalRow.getCell(1);
    totalLabelCell.value = `Total de propiedades: ${propiedades.length}`;
    totalLabelCell.font = {
      bold: true,
      size: 12,
      color: { argb: "FF4338CA" },
    };

    const totalPriceCell = totalRow.getCell(3);
    totalPriceCell.value = formatearPrecio(valorTotal);
    totalPriceCell.font = {
      bold: true,
      size: 12,
      color: { argb: "FF4338CA" },
    };

    for (let col = 1; col <= 9; col++) {
      totalRow.getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E7FF" },
      };
      totalRow.getCell(col).border = {
        top: { style: "medium", color: { argb: "FF4338CA" } },
      };
    }
    totalRow.height = 30;

    // Enviar respuesta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte-propiedades.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
    return res.redirect("/mis-propiedades?pagina=1");
  }
};

export { generarPDF, generarExcel };

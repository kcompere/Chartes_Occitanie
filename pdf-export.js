(function () {
  "use strict";

  const PDF_FORMATS = {
    a4: { width: 210, height: 297, orientation: "portrait", margin: 12 },
    a3: { width: 420, height: 297, orientation: "landscape", margin: 10 },
  };
  const PDF_MIN_FONT_SIZE = 12;
  const POSTER_VALUE_ORDER = [
    "solidarite",
    "responsabilite",
    "echanges",
    "equite",
    "reconnaissance",
    "bienveillance",
    "confiance",
    "respect",
    "convivialite",
  ];

  const COMMITMENT_LABELS = {
    collegue: "En tant que collègue",
    professionnel: "En tant que professionnel",
    equipe: "En tant qu’équipe",
  };

  function getPdfClass() {
    return window.jspdf?.jsPDF || window.jsPDF;
  }

  function buildPdfDocumentModel(snapshot) {
    const resources = window.CHARTES_DOUANE_OCCITANIE_PDF_RESOURCES || {};
    const theme = resolvePdfTheme(snapshot);
    const values = snapshot.valuesRetenues || [];
    const valueOrder = new Map(POSTER_VALUE_ORDER.map((valueId, index) => [valueId, index]));
    const posterValues = [...values].sort(
      (left, right) => (valueOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (valueOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
    );
    const valueColorsById = Object.fromEntries(
      posterValues.map((value, index) => [value.id, theme.valueColors[index] || theme.primary])
    );
    return {
      snapshot,
      theme,
      service: snapshot.service || {},
      values,
      posterValues,
      valueColorsById,
      engagements: snapshot.engagements || {},
      finalEngagement: snapshot.phraseFinaleEngagement || "",
      schemaMarkup:
        typeof window.buildGlobalValuesSvgMarkup === "function"
          ? window.buildGlobalValuesSvgMarkup(snapshot)
          : "",
      logoDouanes: resources.logoDouanes || window.ChartesDouaneOccitanieState?.assets?.douanesLogo || "",
      logoService: snapshot.service?.logo?.dataUrl || snapshot.service?.logoDataUrl || "",
      logoServiceRaster: "",
      iconSvgs: resources.iconSvgs || {},
      schemaPng: "",
      iconPngs: {},
    };
  }

  function resolvePdfTheme(snapshot) {
    const palette = typeof window.getPaletteById === "function"
      ? window.getPaletteById(snapshot.options?.palette_graphique)
      : null;
    const primary = palette?.primary || "#00008F";
    const secondary = palette?.secondary || "#E00016";
    const accent = palette?.accent || "#427CC2";
    return {
      primary,
      secondary,
      accent,
      text: palette?.text || "#232323",
      mutedText: palette?.mutedText || "#5D5D66",
      background: palette?.softBackground || "#F5F5F5",
      panel: palette?.panelBackground || "#FFFFFF",
      border: palette?.border || "#D8D8DE",
      valueColors: [primary, secondary, accent],
    };
  }

  function createPdf(format) {
    const JsPDF = getPdfClass();
    if (!JsPDF) {
      throw new Error("jsPDF n’est pas chargé. Vérifiez vendor/jspdf.umd.min.js.");
    }
    const spec = PDF_FORMATS[format];
    const pdf = new JsPDF({
      orientation: spec.orientation,
      unit: "mm",
      format: [spec.width, spec.height],
      compress: true,
      putOnlyUsedFonts: true,
    });
    registerPdfFonts(pdf);
    pdf.setProperties({
      title: "Charte des règles de bonne conduite et de courtoisie",
      subject: "Charte du bien vivre ensemble au travail",
      author: "Direction interrégionale des douanes - Occitanie",
    });
    return pdf;
  }

  function registerPdfFonts(pdf) {
    const fonts = window.CHARTES_DOUANE_OCCITANIE_PDF_RESOURCES?.fonts || {};
    try {
      if (fonts.regular && fonts.bold) {
        pdf.addFileToVFS("Spectral-Regular.ttf", fonts.regular);
        pdf.addFont("Spectral-Regular.ttf", "Spectral", "normal");
        pdf.addFileToVFS("Spectral-Bold.ttf", fonts.bold);
        pdf.addFont("Spectral-Bold.ttf", "Spectral", "bold");
        pdf.__kimFont = "Spectral";
        return;
      }
    } catch (error) {
      console.warn("La police PDF locale n’a pas pu être chargée.", error);
    }
    pdf.__kimFont = "helvetica";
  }

  function setText(pdf, color, size, style = "normal") {
    pdf.setTextColor(color);
    pdf.setFont(pdf.__kimFont || "helvetica", style);
    pdf.setFontSize(Math.max(PDF_MIN_FONT_SIZE, size));
  }

  function textLines(pdf, text, width, size, style = "normal") {
    setText(pdf, "#000000", size, style);
    return pdf.splitTextToSize(String(text || "").trim(), width);
  }

  function drawText(pdf, options) {
    const clean = String(options.text || "").trim();
    if (!clean) return 0;
    const lineHeight = options.lineHeight || 1.28;
    let size = Math.max(PDF_MIN_FONT_SIZE, options.size || PDF_MIN_FONT_SIZE);
    const minSize = Math.max(PDF_MIN_FONT_SIZE, options.minSize || size);
    let lines = [];
    let height = 0;
    do {
      lines = textLines(pdf, clean, options.width, size, options.style);
      if (options.maxLines && lines.length > options.maxLines) {
        lines = lines.slice(0, options.maxLines);
        const last = lines.length - 1;
        lines[last] = `${lines[last].replace(/[.,;:]?$/, "")}…`;
      }
      height = lines.length * size * 0.3528 * lineHeight;
      if (!options.maxHeight || height <= options.maxHeight || size <= minSize) break;
      size -= 0.5;
    } while (size >= minSize);

    setText(pdf, options.color || "#232323", size, options.style);
    const baseline = options.y + size * 0.3528;
    pdf.text(lines, options.x, baseline, {
      align: options.align || "left",
      lineHeightFactor: lineHeight,
    });
    return height;
  }

  function drawBulletList(pdf, items, options) {
    const cleanItems = (items || []).filter((item) => String(item?.texte || item || "").trim());
    let y = options.y;
    const size = Math.max(PDF_MIN_FONT_SIZE, options.size || PDF_MIN_FONT_SIZE);
    const lineHeight = options.lineHeight || 1.22;
    cleanItems.slice(0, options.maxItems || cleanItems.length).forEach((item) => {
      const label = typeof item === "string" ? item : item.texte;
      pdf.setFillColor(options.bulletColor || options.color || "#232323");
      pdf.circle(options.x + 1.2, y + 1.7, options.bulletRadius || 0.65, "F");
      const used = drawText(pdf, {
        text: label,
        x: options.x + 4,
        y,
        width: options.width - 4,
        size,
        minSize: Math.max(PDF_MIN_FONT_SIZE, options.minSize || size),
        maxLines: options.maxLinesPerItem,
        lineHeight,
        color: options.color,
      });
      y += Math.max(used, size * 0.3528 * lineHeight) + (options.gap ?? 1.5);
    });
    return y - options.y;
  }

  function drawImageContained(pdf, source, box, alias) {
    if (!source || !/^data:image\//.test(source)) return false;
    try {
      const properties = pdf.getImageProperties(source);
      const ratio = properties.width / properties.height || 1;
      let width = box.width;
      let height = width / ratio;
      if (height > box.height) {
        height = box.height;
        width = height * ratio;
      }
      const x = box.x + (box.width - width) / 2;
      const y = box.y + (box.height - height) / 2;
      const type = source.includes("image/png") ? "PNG" : "JPEG";
      pdf.addImage(source, type, x, y, width, height, alias, "FAST");
      return true;
    } catch (error) {
      console.warn("Une image n’a pas pu être insérée dans le PDF.", error);
      return false;
    }
  }

  function prepareSchemaSvg(svgMarkup, theme, fontBase64 = "", schemaFormat = "") {
    if (!svgMarkup) return "";
    const doc = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || doc.querySelector("parsererror")) return "";
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.querySelectorAll("metadata, desc").forEach((node) => node.remove());
    svg.querySelector("#schema-dynamic-style")?.remove();
    const optimizeSchemaText = schemaFormat === "a3" || schemaFormat === "a4";
    const embeddedFontName = fontBase64 && optimizeSchemaText ? "KimSchemaPdf" : "serif";
    if (fontBase64 && optimizeSchemaText) {
      const fontStyle = doc.createElementNS("http://www.w3.org/2000/svg", "style");
      fontStyle.textContent = `@font-face{font-family:KimSchemaPdf;src:url(data:font/truetype;base64,${fontBase64}) format("truetype");font-weight:400;}`;
      svg.insertBefore(fontStyle, svg.firstChild);
    }
    svg.querySelectorAll(".value-row").forEach((group) => {
      const style = group.getAttribute("style") || "";
      const match = style.match(/--value-color\s*:\s*([^;]+)/);
      const color = match ? match[1].trim() : theme.mutedText;
      const muted = group.classList.contains("is-muted");
      group.setAttribute("opacity", muted ? (schemaFormat === "a3" ? "0.46" : "0.32") : "1");
      group.querySelectorAll(".value-copy").forEach((node) => {
        if (optimizeSchemaText) {
          [node, ...node.querySelectorAll("tspan")].forEach((textNode) => {
            textNode.removeAttribute("style");
            textNode.setAttribute("fill", theme.text);
            textNode.setAttribute("font-size", schemaFormat === "a3" ? "20" : "19");
            textNode.setAttribute("font-family", embeddedFontName);
            textNode.setAttribute("font-weight", "400");
          });
        } else {
          node.setAttribute("fill", theme.text);
          node.setAttribute("font-size", "36");
          node.setAttribute("font-family", "Marianne, Arial, sans-serif");
          node.setAttribute("font-weight", "500");
        }
        if (muted) node.setAttribute("display", "none");
      });
      group.querySelectorAll(".connector").forEach((node) => node.setAttribute("stroke", color));
      group.querySelectorAll(".node").forEach((node) => node.setAttribute("fill", color));
      group.querySelectorAll(".icon-ring").forEach((node) => {
        node.setAttribute("fill", "#FFFFFF");
        node.setAttribute("stroke", color);
      });
      group.querySelectorAll(".value-title").forEach((node) => {
        if (optimizeSchemaText) node.removeAttribute("style");
        node.setAttribute("fill", color);
        if (optimizeSchemaText) {
          node.setAttribute("font-size", schemaFormat === "a3" ? "40" : "25");
          node.setAttribute("font-family", embeddedFontName);
          node.setAttribute("font-weight", "700");
        }
      });
      group.querySelectorAll(".value-icon *").forEach((node) => {
        if (node.getAttribute("fill") !== "none") node.setAttribute("fill", color);
        if (node.getAttribute("stroke") && node.getAttribute("stroke") !== "none") node.setAttribute("stroke", color);
      });
    });
    return new XMLSerializer().serializeToString(svg);
  }

  function svgToPng(svgMarkup, width, height) {
    return new Promise((resolve) => {
      if (!svgMarkup) return resolve("");
      const parsedSvg = new DOMParser().parseFromString(svgMarkup, "image/svg+xml").querySelector("svg");
      const viewBox = (parsedSvg?.getAttribute("viewBox") || "").split(/\s+/).map(Number);
      const sourceRatio = viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0
        ? viewBox[2] / viewBox[3]
        : 1;
      const canvasHeight = height || Math.max(1, Math.round(width / sourceRatio));
      const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = canvasHeight;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, width, canvasHeight);
          context.drawImage(image, 0, 0, width, canvasHeight);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          console.warn("Une ressource SVG n’a pas pu être convertie pour le PDF.", error);
          resolve("");
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("");
      };
      image.src = url;
    });
  }

  function colorizeIconSvg(svgMarkup, color) {
    if (!svgMarkup) return "";
    const doc = new DOMParser().parseFromString(svgMarkup, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || doc.querySelector("parsererror")) return svgMarkup;
    svg.querySelectorAll("path, circle, rect, polygon, polyline, line").forEach((node) => {
      if (node.getAttribute("fill") !== "none") node.setAttribute("fill", color);
      if (node.hasAttribute("stroke") && node.getAttribute("stroke") !== "none") node.setAttribute("stroke", color);
    });
    return new XMLSerializer().serializeToString(svg);
  }

  function rasterizeDataImage(source, width = 1200) {
    if (!/^data:image\/svg\+xml/i.test(source || "")) return Promise.resolve(source || "");
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        try {
          const ratio = image.naturalWidth / image.naturalHeight || 1;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = Math.max(1, Math.round(width / ratio));
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          console.warn("Le logo de service SVG n’a pas pu être préparé pour le PDF.", error);
          resolve("");
        }
      };
      image.onerror = () => resolve("");
      image.src = source;
    });
  }

  function getValueColor(model, value, fallbackIndex = 0) {
    return model.valueColorsById[value.id] || model.theme.valueColors[fallbackIndex] || model.theme.primary;
  }

  async function prepareModelImages(model) {
    if (!model.schemaPng) {
      model.schemaPng = await svgToPng(
        prepareSchemaSvg(
          model.schemaMarkup,
          model.theme,
          window.CHARTES_DOUANE_OCCITANIE_PDF_RESOURCES?.fonts?.regular || "",
          model.snapshot.format
        ),
        2400
      );
    }
    model.logoServiceRaster = await rasterizeDataImage(model.logoService);
    await Promise.all(model.values.map(async (value, index) => {
      if (!model.iconPngs[value.id] && model.iconSvgs[value.id]) {
        const iconSvg = colorizeIconSvg(model.iconSvgs[value.id], getValueColor(model, value, index));
        model.iconPngs[value.id] = await svgToPng(iconSvg, 512, 512);
      }
    }));
  }

  function drawInstitutionHeader(pdf, model, format, compact = false) {
    const spec = PDF_FORMATS[format];
    const m = spec.margin;
    const scale = format === "a3" ? 1.25 : 1;
    const height = (compact ? 22 : 27) * scale;
    pdf.setFillColor(model.theme.panel);
    pdf.rect(0, 0, spec.width, height + m * 0.25, "F");
    drawImageContained(pdf, model.logoDouanes, {
      x: m,
      y: m * 0.45,
      width: 38 * scale,
      height: 16 * scale,
    }, "logo-douanes");
    if (model.logoServiceRaster || model.logoService) {
      drawImageContained(pdf, model.logoServiceRaster || model.logoService, {
        x: spec.width - m - 32 * scale,
        y: m * 0.4,
        width: 32 * scale,
        height: 17 * scale,
      }, "logo-service");
    }
    const directionSize = format === "a3" ? 20 : (compact ? 11 : 13) * scale;
    const occitanieSize = format === "a3" ? 18 : (compact ? 10 : 12) * scale;
    const lineGap = 1.1 * scale;
    const directionLineHeight = directionSize * 0.3528 * 1.25;
    const occitanieLineHeight = occitanieSize * 0.3528 * 1.25;
    const headerHeight = height + m * 0.25;
    const textBlockHeight = directionLineHeight + lineGap + occitanieLineHeight;
    const directionY = Math.max(m * 0.25, (headerHeight - textBlockHeight) / 2);
    const occitanieY = directionY + directionLineHeight + lineGap;
    drawText(pdf, {
      text: "Direction interrégionale",
      x: spec.width / 2,
      y: directionY,
      width: spec.width * 0.38,
      size: directionSize,
      color: model.theme.primary,
      style: "bold",
      align: "center",
    });
    drawText(pdf, {
      text: "Occitanie",
      x: spec.width / 2,
      y: occitanieY,
      width: spec.width * 0.38,
      size: occitanieSize,
      color: model.theme.secondary,
      style: "bold",
      align: "center",
    });
    pdf.setDrawColor(model.theme.primary);
    pdf.setLineWidth(0.7 * scale);
    pdf.line(m, height + m * 0.15, spec.width - m, height + m * 0.15);
    return height + m * 0.15;
  }

  function drawFooter(pdf, model, pageNumber, format) {
    const spec = PDF_FORMATS[format];
    const m = spec.margin;
    const size = 7.5;
    setText(pdf, model.theme.mutedText, size);
    pdf.text(model.service.nom || "Charte du bien vivre ensemble", m, spec.height - m * 0.45);
    pdf.text(String(pageNumber), spec.width - m, spec.height - m * 0.45, { align: "right" });
  }

  function drawValueIcon(pdf, model, value, box) {
    const source = model.iconPngs[value.id];
    if (source) drawImageContained(pdf, source, box, `icone-${value.id}`);
  }

  function drawSyntheticPhrases(pdf, model, value, box, size, maxLines = 2) {
    const phrases = (value.phrases_synthetiques || []).filter(Boolean).slice(0, 2);
    if (!phrases.length) return 0;
    pdf.setFillColor(model.theme.background);
    pdf.roundedRect(box.x, box.y, box.width, box.height, 3, 3, "F");
    const text = phrases.map((phrase) => `• ${phrase}`).join("\n");
    return drawText(pdf, {
      text,
      x: box.x + 4,
      y: box.y + 3,
      width: box.width - 8,
      maxHeight: box.height - 6,
      maxLines,
      size,
      minSize: Math.max(7, size - 1.5),
      color: model.theme.primary,
      style: "bold",
      lineHeight: 1.18,
    });
  }

  function measureTextHeight(pdf, text, width, size = PDF_MIN_FONT_SIZE, lineHeight = 1.22) {
    if (!String(text || "").trim()) return 0;
    const activeSize = Math.max(PDF_MIN_FONT_SIZE, size);
    return textLines(pdf, text, width, activeSize).length * activeSize * 0.3528 * lineHeight;
  }

  function getA4ValueCardMetrics(pdf, model, value) {
    const definitionHeight = Math.max(10, measureTextHeight(pdf, value.definition_courte, 150, 12, 1.2));
    const headerHeight = Math.max(29, definitionHeight + 18);
    const includeComplete = model.snapshot.options?.inclure_definitions_completes && value.definition_complete;
    const completeHeight = includeComplete
      ? measureTextHeight(pdf, value.definition_complete, 170, 12, 1.2) + 14
      : 0;
    const items = value.items || [];
    const split = Math.ceil(items.length / 2);
    const columns = items.length > 4 ? [items.slice(0, split), items.slice(split)] : [items];
    const columnWidth = columns.length === 2 ? 81 : 170;
    const itemsHeight = Math.max(12, ...columns.map((column) => column.reduce((height, item) => (
      height + measureTextHeight(pdf, item.texte || item, columnWidth - 5, 12, 1.18) + 1.4
    ), 0)));
    const actionHeight = 13 + itemsHeight;
    return {
      height: Math.max(62, 9 + headerHeight + completeHeight + actionHeight + 8),
      headerHeight,
      completeHeight,
      columns,
    };
  }

  function drawA4ValueCard(pdf, model, value, index, box, metrics) {
    const theme = model.theme;
    const color = theme.valueColors[index] || theme.primary;
    pdf.setFillColor(theme.panel);
    pdf.setDrawColor(theme.border);
    pdf.roundedRect(box.x, box.y, box.width, box.height, 3, 3, "FD");
    pdf.setFillColor(color);
    pdf.rect(box.x, box.y, 4, box.height, "F");

    drawValueIcon(pdf, model, value, { x: box.x + 9, y: box.y + 8, width: 16, height: 16 });
    drawText(pdf, {
      text: value.nom,
      x: box.x + 31,
      y: box.y + 7,
      width: box.width - 40,
      size: 18,
      color,
      style: "bold",
      maxLines: 1,
    });
    drawText(pdf, {
      text: value.definition_courte,
      x: box.x + 31,
      y: box.y + 17,
      width: box.width - 40,
      size: 12,
      color: theme.text,
      lineHeight: 1.2,
    });

    let y = box.y + 7 + metrics.headerHeight;
    if (metrics.completeHeight) {
      pdf.setFillColor(theme.background);
      pdf.roundedRect(box.x + 9, y, box.width - 18, metrics.completeHeight - 4, 2, 2, "F");
      drawText(pdf, { text: "Définition complète", x: box.x + 14, y: y + 3, width: box.width - 28, size: 12, color, style: "bold" });
      drawText(pdf, {
        text: value.definition_complete,
        x: box.x + 14,
        y: y + 11,
        width: box.width - 28,
        size: 12,
        color: theme.text,
        lineHeight: 1.2,
      });
      y += metrics.completeHeight;
    }

    drawText(pdf, {
      text: "Nos engagements concrets",
      x: box.x + 9,
      y,
      width: box.width - 18,
      size: 12,
      color,
      style: "bold",
    });
    const gap = 8;
    const colWidth = metrics.columns.length === 2 ? (box.width - 18 - gap) / 2 : box.width - 18;
    metrics.columns.forEach((column, columnIndex) => {
      drawBulletList(pdf, column, {
        x: box.x + 9 + columnIndex * (colWidth + gap),
        y: y + 9,
        width: colWidth,
        size: 12,
        minSize: 12,
        color: theme.text,
        bulletColor: color,
        gap: 1.4,
      });
    });
  }

  async function generateA4Pdf(model) {
    await prepareModelImages(model);
    const pdf = createPdf("a4");
    const theme = model.theme;

    drawInstitutionHeader(pdf, model, "a4");
    drawText(pdf, {
      text: model.service.nom || "Nom du service",
      x: 105,
      y: 42,
      width: 180,
      size: 10,
      color: theme.secondary,
      style: "bold",
      align: "center",
    });
    drawText(pdf, {
      text: "Charte des règles de bonne conduite\net de courtoisie",
      x: 105,
      y: 52,
      width: 178,
      size: 25,
      minSize: 22,
      color: theme.primary,
      style: "bold",
      align: "center",
      lineHeight: 1.08,
    });
    drawText(pdf, {
      text: `Un cadre partagé pour faire vivre nos valeurs au quotidien${model.service.dateValidation ? `  •  ${formatDateForPdf(model.service.dateValidation)}` : ""}`,
      x: 105,
      y: 79,
      width: 170,
      size: 11,
      color: theme.mutedText,
      align: "center",
    });
    if (model.schemaPng) {
      drawImageContained(pdf, model.schemaPng, { x: 10, y: 94, width: 190, height: 119 }, "schema-global");
    }
    pdf.setFillColor(theme.background);
    pdf.setDrawColor(theme.border);
    pdf.roundedRect(15, 224, 180, 47, 4, 4, "FD");
    drawText(pdf, {
      text: model.service.introduction || "Cette charte exprime les repères communs que nous choisissons pour travailler ensemble dans un climat de confiance, de respect et de responsabilité.",
      x: 24,
      y: 232,
      width: 162,
      maxHeight: 20,
      size: 10.5,
      minSize: 9,
      color: theme.text,
      lineHeight: 1.35,
    });
    drawText(pdf, {
      text: model.finalEngagement,
      x: 24,
      y: 252,
      width: 162,
      maxHeight: 12,
      size: 9.5,
      minSize: 8.5,
      color: theme.primary,
      style: "bold",
      lineHeight: 1.22,
    });

    let pageNumber = 2;
    pdf.addPage([210, 297], "portrait");
    drawInstitutionHeader(pdf, model, "a4", true);
    drawText(pdf, { text: "Nos valeurs en action", x: 12, y: 42, width: 186, size: 19, color: theme.primary, style: "bold" });
    drawFooter(pdf, model, pageNumber, "a4");
    let y = 55;
    model.values.forEach((value, index) => {
      const metrics = getA4ValueCardMetrics(pdf, model, value);
      if (y + metrics.height > 277) {
        pageNumber += 1;
        pdf.addPage([210, 297], "portrait");
        drawInstitutionHeader(pdf, model, "a4", true);
        drawFooter(pdf, model, pageNumber, "a4");
        y = 42;
      }
      drawA4ValueCard(pdf, model, value, index, { x: 12, y, width: 186, height: metrics.height }, metrics);
      y += metrics.height + 5;
    });

    const commitmentsHeight = 126;
    if (y + commitmentsHeight > 277) {
      pageNumber += 1;
      pdf.addPage([210, 297], "portrait");
      drawInstitutionHeader(pdf, model, "a4", true);
      drawFooter(pdf, model, pageNumber, "a4");
      y = 43;
    }
    drawText(pdf, { text: "Nos engagements communs", x: 12, y, width: 186, size: 19, color: theme.primary, style: "bold" });
    drawText(pdf, { text: model.finalEngagement, x: 12, y: y + 11, width: 186, size: 12, color: theme.mutedText, lineHeight: 1.2 });
    drawCommitmentColumns(pdf, model, { x: 12, y: y + 29, width: 186, height: 92 }, 12);
    return pdf;
  }

  function measureBulletItemsHeight(pdf, items, width, size, lineHeight = 1.08, gap = 0.35) {
    const cleanItems = (items || []).filter((item) => String(item?.texte || item || "").trim());
    return cleanItems.reduce((height, item) => {
      const text = typeof item === "string" ? item : item.texte;
      return height + measureTextHeight(pdf, text, width - 4, size, lineHeight) + gap;
    }, 0);
  }

  function getBulletColumnLayout(pdf, items, width, size, lineHeight = 1.08, gap = 0.35) {
    const cleanItems = (items || []).filter((item) => String(item?.texte || item || "").trim());
    const singleHeight = measureBulletItemsHeight(pdf, cleanItems, width, size, lineHeight, gap);
    if (cleanItems.length < 5 || width < 100) {
      return { columns: [cleanItems], columnWidth: width, columnGap: 0, height: singleHeight };
    }
    const columnGap = 3;
    const columnWidth = (width - columnGap) / 2;
    const splitAt = Math.ceil(cleanItems.length / 2);
    const columns = [cleanItems.slice(0, splitAt), cleanItems.slice(splitAt)];
    const height = Math.max(
      ...columns.map((column) => measureBulletItemsHeight(pdf, column, columnWidth, size, lineHeight, gap))
    );
    return height < singleHeight
      ? { columns, columnWidth, columnGap, height }
      : { columns: [cleanItems], columnWidth: width, columnGap: 0, height: singleHeight };
  }

  function getHorizontalCardRequiredHeight(pdf, value, boxWidth, sizes, bodySize = PDF_MIN_FONT_SIZE) {
    const leftWidth = boxWidth * 0.3;
    const contentInset = sizes.strip + sizes.pad;
    const definitionWidth = leftWidth - contentInset - sizes.pad;
    const listWidth = boxWidth - leftWidth - sizes.pad * 2;
    const definitionHeight = measureTextHeight(pdf, value.definition_courte, definitionWidth, bodySize, 1.1);
    const itemsHeight = getBulletColumnLayout(
      pdf,
      value.items,
      listWidth,
      bodySize,
      1.08,
      sizes.itemGap
    ).height;
    return Math.max(
      sizes.pad * 2 + sizes.icon + sizes.gap + definitionHeight,
      sizes.pad * 2 + itemsHeight
    );
  }

  function chooseHorizontalCardFontSize(pdf, value, box, sizes) {
    for (let size = Math.max(PDF_MIN_FONT_SIZE, sizes.body); size >= PDF_MIN_FONT_SIZE; size -= 0.5) {
      if (getHorizontalCardRequiredHeight(pdf, value, box.width, sizes, size) <= box.height) return size;
    }
    return PDF_MIN_FONT_SIZE;
  }

  function allocateCardHeights(requiredHeights, totalHeight, minimumHeight) {
    const count = requiredHeights.length;
    if (!count) return [];
    const naturalHeights = requiredHeights.map((height) => Math.max(minimumHeight, height));
    const naturalTotal = naturalHeights.reduce((sum, height) => sum + height, 0);
    if (naturalTotal <= totalHeight) {
      const remaining = totalHeight - naturalTotal;
      const weights = naturalHeights.map((height) => Math.pow(height, 1.35));
      const weightTotal = weights.reduce((sum, weight) => sum + weight, 0) || 1;
      return naturalHeights.map((height, index) => height + remaining * (weights[index] / weightTotal));
    }
    const minimumTotal = minimumHeight * count;
    if (minimumTotal >= totalHeight) return requiredHeights.map(() => totalHeight / count);
    const extras = naturalHeights.map((height) => Math.max(0, height - minimumHeight));
    const weightedExtras = extras.map((height) => Math.pow(height, 1.35));
    const extrasTotal = weightedExtras.reduce((sum, height) => sum + height, 0);
    const availableExtra = totalHeight - minimumTotal;
    if (!extrasTotal) return requiredHeights.map(() => totalHeight / count);
    return weightedExtras.map((extra) => minimumHeight + (extra / extrasTotal) * availableExtra);
  }

  function drawHorizontalValueCard(pdf, model, value, index, box, sizes) {
    const theme = model.theme;
    const color = getValueColor(model, value, index);
    const bodySize = chooseHorizontalCardFontSize(pdf, value, box, sizes);
    pdf.setFillColor(theme.panel);
    pdf.setDrawColor(theme.border);
    pdf.roundedRect(box.x, box.y, box.width, box.height, sizes.radius, sizes.radius, "FD");
    pdf.setFillColor(color);
    pdf.rect(box.x, box.y, sizes.strip, box.height, "F");

    const leftWidth = box.width * 0.3;
    const contentInset = sizes.strip + sizes.pad;
    drawValueIcon(pdf, model, value, {
      x: box.x + contentInset,
      y: box.y + sizes.pad,
      width: sizes.icon,
      height: sizes.icon,
    });
    drawText(pdf, {
      text: value.nom,
      x: box.x + contentInset + sizes.icon + sizes.gap,
      y: box.y + sizes.pad,
      width: leftWidth - contentInset - sizes.icon - sizes.gap - sizes.pad,
      size: sizes.title,
      minSize: sizes.title - 2,
      color,
      style: "bold",
      maxLines: 2,
    });
    drawText(pdf, {
      text: value.definition_courte,
      x: box.x + contentInset,
      y: box.y + sizes.pad + sizes.icon + sizes.gap,
      width: leftWidth - contentInset - sizes.pad,
      size: bodySize,
      minSize: PDF_MIN_FONT_SIZE,
      color: theme.mutedText,
      lineHeight: 1.1,
    });
    pdf.setDrawColor(theme.border);
    pdf.line(box.x + leftWidth, box.y + sizes.pad, box.x + leftWidth, box.y + box.height - sizes.pad);
    const listX = box.x + leftWidth + sizes.pad;
    const listWidth = box.width - leftWidth - sizes.pad * 2;
    const listLayout = getBulletColumnLayout(pdf, value.items, listWidth, bodySize, 1.08, sizes.itemGap);
    listLayout.columns.forEach((items, columnIndex) => {
      drawBulletList(pdf, items, {
        x: listX + columnIndex * (listLayout.columnWidth + listLayout.columnGap),
        y: box.y + sizes.pad,
        width: listLayout.columnWidth,
        size: bodySize,
        minSize: PDF_MIN_FONT_SIZE,
        maxItems: sizes.maxItems,
        lineHeight: 1.08,
        color: theme.text,
        bulletColor: color,
        gap: sizes.itemGap,
        bulletRadius: sizes.bullet,
      });
    });
  }

  function drawCommitmentColumns(pdf, model, box, size, maxItems, splitItems = false) {
    const keys = Object.keys(COMMITMENT_LABELS);
    const gap = box.width * 0.018;
    const colWidth = (box.width - gap * 2) / 3;
    const lineSizeMm = size * 0.3528;
    const headerHeight = Math.max(6.5, lineSizeMm * 1.35);
    keys.forEach((key, index) => {
      const x = box.x + index * (colWidth + gap);
      const color = model.theme.valueColors[index] || model.theme.primary;
      pdf.setFillColor(model.theme.background);
      pdf.setDrawColor(model.theme.border);
      pdf.roundedRect(x, box.y, colWidth, box.height, 2.5, 2.5, "FD");
      pdf.setFillColor(color);
      pdf.rect(x, box.y, colWidth, headerHeight, "F");
      drawText(pdf, {
        text: COMMITMENT_LABELS[key],
        x: x + colWidth / 2,
        y: box.y + 0.8,
        width: colWidth - 6,
        size: size + 0.6,
        minSize: size - 0.5,
        color: "#FFFFFF",
        style: "bold",
        align: "center",
        maxLines: 1,
      });
      const allItems = model.engagements[key] || [];
      const visibleItems = maxItems ? allItems.slice(0, maxItems) : allItems;
      const splitAt = splitItems ? Math.ceil(visibleItems.length / 2) : visibleItems.length;
      const itemColumns = splitItems
        ? [visibleItems.slice(0, splitAt), visibleItems.slice(splitAt)]
        : [visibleItems];
      const innerGap = splitItems ? 3 : 0;
      const innerWidth = (colWidth - 6.4 - innerGap * (itemColumns.length - 1)) / itemColumns.length;
      itemColumns.forEach((items, itemColumnIndex) => {
        drawBulletList(pdf, items, {
          x: x + 3.2 + itemColumnIndex * (innerWidth + innerGap),
          y: box.y + headerHeight + 1,
          width: innerWidth,
          size,
          minSize: 12,
          lineHeight: 1.08,
          color: model.theme.text,
          bulletColor: color,
          gap: 0.2,
          bulletRadius: 0.55,
        });
      });
    });
  }

  function getContainedImageRect(pdf, source, box) {
    try {
      const properties = pdf.getImageProperties(source);
      const ratio = properties.width / properties.height || 1;
      let width = box.width;
      let height = width / ratio;
      if (height > box.height) {
        height = box.height;
        width = height * ratio;
      }
      return {
        x: box.x + (box.width - width) / 2,
        y: box.y + (box.height - height) / 2,
        width,
        height,
      };
    } catch (_error) {
      return box;
    }
  }

  function getSchemaValueCenters(selectedValues) {
    const selectedById = new Map(selectedValues.map((value) => [value.id, value]));
    const rowHeights = POSTER_VALUE_ORDER.map((valueId) => {
      const value = selectedById.get(valueId);
      if (!value) return 54;
      return Math.max(136, 64 + getSchemaPhraseLineCount(value) * 20 + 32);
    });
    const totalHeight = rowHeights.reduce((total, height) => total + height, 0);
    let cursor = Math.max(28, (1000 - totalHeight) / 2);
    const centers = {};
    POSTER_VALUE_ORDER.forEach((valueId, index) => {
      centers[valueId] = cursor + rowHeights[index] / 2;
      cursor += rowHeights[index];
    });
    return centers;
  }

  function getSchemaPhraseLineCount(value) {
    const lines = (value?.phrases_synthetiques || [])
      .filter(Boolean)
      .slice(0, 2)
      .flatMap((phrase) => wrapTextByLength(String(phrase), 42));
    return Math.max(1, lines.length);
  }

  function drawA3ValueConnectors(pdf, model, schemaBox, cardBoxes) {
    if (!model.schemaPng || !cardBoxes.length) return;
    const imageRect = getContainedImageRect(pdf, model.schemaPng, schemaBox);
    const centers = getSchemaValueCenters(model.posterValues);
    model.posterValues.forEach((value, index) => {
      const card = cardBoxes[index];
      if (!card) return;
      const sourceY = centers[value.id] ?? 500;
      const startY = imageRect.y + ((sourceY - 76) / 848) * imageRect.height;
      const longestLine = Math.max(
        0,
        ...(value.phrases_synthetiques || [])
          .slice(0, 2)
          .flatMap((phrase) => wrapTextByLength(String(phrase), 42))
          .map((line) => line.length)
      );
      const sourceEndX = Math.min(1050, 570 + Math.max(195, longestLine * 10));
      const viewBoxWidth = 960;
      const endX = card.x;
      const estimatedStartX = imageRect.x + ((sourceEndX - 100) / viewBoxWidth) * imageRect.width;
      const startX = Math.min(endX - 1.5, estimatedStartX);
      const endY = card.y + card.height / 2;
      const elbowX = startX + Math.max(2, (endX - startX) * 0.45);
      pdf.setDrawColor(getValueColor(model, value, index));
      pdf.setLineWidth(0.7);
      pdf.setLineDashPattern([1.8, 1.2], 0);
      pdf.line(startX, startY, elbowX, startY);
      pdf.line(elbowX, startY, endX, endY);
      pdf.setLineDashPattern([], 0);
    });
  }

  function wrapTextByLength(text, maxLength) {
    const words = String(text || "").trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && candidate.length > maxLength) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  async function generateA3Pdf(model) {
    await prepareModelImages(model);
    const pdf = createPdf("a3");
    const theme = model.theme;
    drawInstitutionHeader(pdf, model, "a3", true);
    drawText(pdf, {
      text: "Charte des règles de bonne conduite et de courtoisie",
      x: 104,
      y: 33,
      width: 196,
      size: 18,
      color: theme.primary,
      style: "bold",
      align: "center",
      maxLines: 1,
    });
    drawText(pdf, {
      text: `${model.service.nom || "Service"}${model.service.dateValidation ? `  •  ${formatDateForPdf(model.service.dateValidation)}` : ""}`,
      x: 104,
      y: 42,
      width: 196,
      size: 12,
      color: theme.mutedText,
      align: "center",
      maxLines: 1,
    });
    const schemaBox = { x: 1, y: 46, width: 200, height: 178 };
    if (model.schemaPng) {
      drawImageContained(pdf, model.schemaPng, schemaBox, "schema-global");
    }
    drawText(pdf, { text: "Nos valeurs en action", x: 202, y: 33, width: 214, size: 14, color: theme.primary, style: "bold" });
    drawText(pdf, {
      text: "Trois repères choisis par le service, traduits en engagements concrets.",
      x: 202, y: 42, width: 214, size: 12, color: theme.mutedText, maxLines: 1,
    });
    const cardSizes = {
      radius: 2.5, strip: 3, pad: 2.5, icon: 13, gap: 2.5, title: 13.5, body: 12.5,
      maxItems: undefined, itemGap: 0.2, bullet: 0.6,
    };
    const requiredHeights = model.posterValues.map((value) =>
      getHorizontalCardRequiredHeight(pdf, value, 214, cardSizes, PDF_MIN_FONT_SIZE)
    );
    const cardHeights = allocateCardHeights(requiredHeights, 174, 34);
    const cardBoxes = [];
    let cardY = 49;
    model.posterValues.forEach((value, index) => {
      const box = { x: 202, y: cardY, width: 214, height: cardHeights[index] };
      cardBoxes.push(box);
      cardY += cardHeights[index] + 2;
    });
    drawA3ValueConnectors(pdf, model, schemaBox, cardBoxes);
    model.posterValues.forEach((value, index) => drawHorizontalValueCard(pdf, model, value, index, cardBoxes[index], cardSizes));
    drawText(pdf, { text: "Nos engagements communs", x: 6, y: 229, width: 408, size: 14, color: theme.primary, style: "bold" });
    drawText(pdf, { text: model.finalEngagement, x: 6, y: 237, width: 408, size: 12, color: theme.mutedText, maxLines: 1 });
    drawCommitmentColumns(pdf, model, { x: 6, y: 246, width: 408, height: 44 }, 12, undefined, true);
    return pdf;
  }

  async function generatePdf(format) {
    const snapshot = { ...window.buildSnapshot(), format };
    const validation = window.getValidationState(snapshot);
    if (!window.showValidationState(validation)) return null;
    const model = buildPdfDocumentModel(snapshot);
    if (format === "a4") return generateA4Pdf(model);
    if (format === "a3") return generateA3Pdf(model);
    throw new Error(`Format PDF inconnu : ${format}`);
  }

  async function downloadPdf(format) {
    setBusy(true);
    try {
      window.setStatus?.(`Génération du PDF ${format.toUpperCase()} en cours…`, "info");
      const pdf = await generatePdf(format);
      if (!pdf) return;
      const snapshot = window.buildSnapshot();
      const suffix = format === "a4" ? "charte-a4" : `poster-${format}`;
      window.downloadBlob(`${window.slugify(snapshot.service.nom || "charte")}-${suffix}.pdf`, pdf.output("blob"));
      window.setStatus?.(`PDF ${format.toUpperCase()} généré.`, "success");
    } catch (error) {
      console.error(error);
      window.setStatus?.(`Le PDF ${format.toUpperCase()} n’a pas pu être généré.`, "error", true);
    } finally {
      setBusy(false);
    }
  }

  function setBusy(busy) {
    ["pdf-a4-button", "pdf-a3-button"].forEach((id) => {
      const button = document.getElementById(id);
      if (button) button.disabled = busy;
    });
  }

  function formatDateForPdf(value) {
    return typeof window.formatDate === "function" ? window.formatDate(value) : String(value || "");
  }

  window.ChartesDouaneOccitaniePdfExport = {
    PDF_FORMATS,
    buildPdfDocumentModel,
    generatePdf,
    downloadPdf,
  };
})();



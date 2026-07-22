const APP_VERSION = "3.1.0";
const STORAGE_KEY = "chartes-douane-occitanie-brouillon-v3";
const LEGACY_STORAGE_KEYS = [
  "charte-bien-vivre-brouillon-v3",
  "charte-bien-vivre-brouillon-v2",
  "charte-bien-vivre-brouillon-v1",
];

const DEFAULT_PALETTE_ID = "republique";
const VALUES_SOURCE_PATH = "data/valeurs_charte_pdf_structure_codex.json";
const PALETTES_SOURCE_PATH = "data/palettes.json";
const EXAMPLE_SOURCE_PATH = "exemples/exemple_charte.json";
const ASSET_PATHS = {
  douanesLogo: "data/logos/Logo_Douanes_et_Droits_indirects.svg_.png",
  valuesChart: "data/charte_9_valeurs_douane_editable_v4.svg",
};
const VALUE_ICON_PATHS = {
  solidarite: "data/icones valeurs/svg/solidarite_new.svg",
  responsabilite: "data/icones valeurs/svg/responsabilite.svg",
  echanges: "data/icones valeurs/svg/echange.svg",
  echange: "data/icones valeurs/svg/echange.svg",
  equite: "data/icones valeurs/svg/equite.svg",
  reconnaissance: "data/icones valeurs/svg/reconnaissance.svg",
  bienveillance: "data/icones valeurs/svg/bienveillance.svg",
  confiance: "data/icones valeurs/svg/confiance.svg",
  respect: "data/icones valeurs/svg/respect.svg",
  convivialite: "data/icones valeurs/svg/convivialite.svg",
};

const DEFAULT_INTRO =
  "Cette charte décline, pour notre service, les comportements concrets qui rendent le travail collectif plus juste, plus lisible et plus serein.";
const DEFAULT_FINAL_ENGAGEMENT =
  "Nous nous engageons collectivement à faire vivre ces principes dans nos décisions, nos paroles et nos pratiques quotidiennes.";
const SVG_VALUE_IDS = [
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

function sortValuesBySchemaOrder(values) {
  const order = new Map(SVG_VALUE_IDS.map((valueId, index) => [valueId, index]));
  return [...(values || [])].sort(
    (left, right) => (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.id) ?? Number.MAX_SAFE_INTEGER)
  );
}
const FORMAT_RULES = {
  a4: "@page { size: A4 portrait; margin: 14mm; }",
  a3: "@page { size: A3 landscape; margin: 12mm; }",
};

const VALUE_LIST_LABEL =
  "Règles, gestes ou engagements concrets associés à cette valeur";

const COMMITMENT_SECTIONS = [
  {
    key: "collegue",
    title: "En tant que collègue",
    description: "Ce que chacun s'engage a faire dans ses relations quotidiennes.",
    required: true,
  },
  {
    key: "professionnel",
    title: "En tant que professionnel",
    description: "Ce que nous mettons en oeuvre dans nos pratiques de travail.",
    required: true,
  },
  {
    key: "equipe",
    title: "En tant qu'équipe",
    description: "Ce que le collectif organise pour soutenir le bien vivre ensemble.",
    required: true,
  },
];

const DEFAULT_COMMITMENTS = {
  collegue: [
    "Je me rends disponible",
    "J'aide un collègue en difficulté",
    "J'écoute sans préjugés",
    "Je partage l'information",
    "Je valorise le travail d'autrui",
    "Je remercie les autres",
    "J’aborde autrui positivement",
    "Je suis indulgent",
    "Je vais vers les autres",
    "Je salue mes collegues",
  ],
  professionnel: [
    "Je suis autonome",
    "Je rends compte",
    "Je suis force de proposition",
    "Je suis exemplaire",
    "J'assume mes erreurs",
    "Je fais ma juste part",
    "Je tiens mes engagements",
    "Je respecte les règles",
    "Je ne manipule pas",
  ],
  equipe: [
    "Je participe au collectif",
    "Je construis des projets communs",
    "Je fais circuler l'info",
    "Je privilégie le dialogue",
    "J'assure l'égalité de traitement",
    "J'accorde ma confiance",
    "Je respecte les usages",
  ],
};

const REMOVED_DEFAULT_TEAM_COMMITMENTS = new Set([
  "J'organise des moments",
  "Je prends du temps",
]);

const FALLBACK_PALETTES = [
  {
    id: "eclat",
    nom: "Éclat",
    description: "Palette expressive : violet profond, fuchsia, orange, turquoise et vert anis.",
    primary: "#391C46",
    secondary: "#C82670",
    accent: "#F9711B",
    softBackground: "#F7F1F8",
    panelBackground: "#FFFFFF",
    border: "#D8C4DE",
    text: "#231428",
    mutedText: "#66536E",
    swatches: [
      { label: "Couleur 1", color: "#391C46" },
      { label: "Couleur 2", color: "#C82670" },
      { label: "Couleur 3", color: "#F9711B" },
      { label: "Couleur 4", color: "#1AA1A4" },
      { label: "Couleur 5", color: "#C3BA28" },
    ],
  },
  {
    id: "horizon",
    nom: "Horizon",
    description: "Palette ouverte et dynamique : violet, bleu, turquoise, corail et jaune.",
    primary: "#6F498E",
    secondary: "#236AB7",
    accent: "#2F9D96",
    softBackground: "#F4F6FB",
    panelBackground: "#FFFFFF",
    border: "#CCC3DC",
    text: "#1E2430",
    mutedText: "#596276",
    swatches: [
      { label: "Couleur 1", color: "#6F498E" },
      { label: "Couleur 2", color: "#236AB7" },
      { label: "Couleur 3", color: "#2F9D96" },
      { label: "Couleur 4", color: "#F16462" },
      { label: "Couleur 5", color: "#FDB642" },
    ],
  },
  {
    id: "republique",
    nom: "République",
    description: "Palette officielle et sobre : bleu, rouge, cumulus, fond clair et texte sombre.",
    primary: "#00008F",
    secondary: "#E00016",
    accent: "#427CC2",
    softBackground: "#F5F5F5",
    panelBackground: "#FFFFFF",
    border: "#D0D0D8",
    text: "#232323",
    mutedText: "#5D5D66",
    swatches: [
      { label: "Couleur 1", color: "#00008F" },
      { label: "Couleur 2", color: "#E00016" },
      { label: "Couleur 3", color: "#427CC2" },
      { label: "Couleur 4", color: "#F5F5F5" },
      { label: "Couleur 5", color: "#232323" },
    ],
  },
  {
    id: "patrimoine",
    nom: "Patrimoine",
    description: "Palette institutionnelle chaleureuse : bleu nuit, rouge, blanc cassé, doré et gris.",
    primary: "#172E45",
    secondary: "#B7261E",
    accent: "#BE8F50",
    softBackground: "#FAF9FA",
    panelBackground: "#FFFFFF",
    border: "#C3C3C3",
    text: "#172E45",
    mutedText: "#5F6670",
    swatches: [
      { label: "Couleur 1", color: "#172E45" },
      { label: "Couleur 2", color: "#B7261E" },
      { label: "Couleur 3", color: "#FAF9FA" },
      { label: "Couleur 4", color: "#BE8F50" },
      { label: "Couleur 5", color: "#C3C3C3" },
    ],
  },
  {
    id: "automne",
    nom: "Automne",
    description: "Palette sobre et dense : noir, anthracite, taupe, doré mat et crème.",
    primary: "#1F1F1E",
    secondary: "#414140",
    accent: "#BD945A",
    softBackground: "#EEDEBF",
    panelBackground: "#FFF9EE",
    border: "#D8C7A7",
    text: "#1F1F1E",
    mutedText: "#6A5A48",
    swatches: [
      { label: "Couleur 1", color: "#1F1F1E" },
      { label: "Couleur 2", color: "#414140" },
      { label: "Couleur 3", color: "#796353" },
      { label: "Couleur 4", color: "#BD945A" },
      { label: "Couleur 5", color: "#EEDEBF" },
    ],
  },
  {
    id: "terroir",
    nom: "Terroir",
    description: "Palette douce et territoriale : terre battue, tilleul, café crème, fond clair et texte brun.",
    primary: "#E3784B",
    secondary: "#B5A541",
    accent: "#CFB57F",
    softBackground: "#F9F6F1",
    panelBackground: "#FFFFFF",
    border: "#D9C6B8",
    text: "#2E2925",
    mutedText: "#6F5B4F",
    swatches: [
      { label: "Couleur 1", color: "#E3784B" },
      { label: "Couleur 2", color: "#B5A541" },
      { label: "Couleur 3", color: "#CFB57F" },
      { label: "Couleur 4", color: "#F9F6F1" },
      { label: "Couleur 5", color: "#2E2925" },
    ],
  },
];

const FALLBACK_VALUES = [
  {
    id: "solidarite",
    nom: "Solidarité",
    definition_complete:
      "C'est le fondement de l'esprit d'equipe.\n\nLe pole comptabilite de la recette interregionale constitue une equipe : comme dans le domaine du sport, c'est l'esprit qui regne entre les membres de cette equipe qui conditionne son efficacite mais egalement la maniere dont ses membres percoivent le vivre ensemble.\n\nLa solidarite est la base de tout esprit d'equipe et un pilier du bien vivre ensemble au travail. Elle permet de surmonter plus facilement les difficultes, et constitue un des meilleurs moyens de prevenir le sentiment d'isolement.",
    definition_courte:
      "La solidarite est le fondement de l'esprit d'equipe : elle aide a surmonter les difficultes et a prevenir l'isolement.",
    phrases_synthetiques: [
      "La solidarite fait fonctionner le collectif comme une equipe.",
      "Elle permet de ne pas laisser un collegue seul face aux difficultes.",
    ],
  },
  {
    id: "responsabilite",
    nom: "Responsabilité",
    definition_complete:
      "Le fonctionnement harmonieux d'un groupe passe par l'etablissement de relations entre ses membres, fondees sur des droits et des devoirs reciproques, qu'il est de la responsabilite de chacun de respecter.\n\nEtre responsable signifie tout simplement faire ce que l'on doit faire pour que le groupe fonctionne mieux.",
    definition_courte:
      "La responsabilite consiste a faire ce que l'on doit faire pour que le groupe fonctionne mieux.",
    phrases_synthetiques: [
      "Etre responsable, c'est contribuer concretement au bon fonctionnement du groupe.",
      "Chacun a des droits et des devoirs reciproques a respecter.",
    ],
  },
  {
    id: "echanges",
    nom: "Échanges",
    definition_complete:
      "D'abord l'ecoute, ensuite l'ecoute, toujours l'ecoute.\n\nLe travail collectif passe par d'innombrables echanges oraux ou ecrits qui sont essentiels pour s'organiser, prendre des decisions, transmettre des directives ou des dossiers.\n\nPour eviter que ces echanges ne debouchent sur des incomprehensions, voire des conflits, il est important qu'ils soient transparents et effectues sur le mode positif du dialogue. C'est-a-dire en s'attachant a ecouter attentivement et a essayer de comprendre l'autre en faisant preuve d'empathie.",
    definition_courte:
      "Les echanges reposent d'abord sur l'ecoute, la clarte de l'information et le dialogue positif.",
    phrases_synthetiques: [
      "Echanger, c'est d'abord ecouter attentivement.",
      "Des echanges clairs et positifs previennent les incomprehensions et les conflits.",
    ],
  },
  {
    id: "equite",
    nom: "Équité",
    definition_complete:
      "Au sein de son travail comme ailleurs, tout individu attend d'etre traite de maniere equitable et de ne pas etre victime d'injustices. Il s'agit d'un droit fondamental. Les inegalites de traitement injustifiees sont sources de divisions, de jalousies, de discordes, qui vont a l'encontre du bien vivre ensemble au travail.\n\nToute difference de traitement doit pouvoir s'expliquer, ne pas reposer sur l'arbitraire, et etre justifiee de maniere explicite.",
    definition_courte:
      "L'equite suppose un traitement juste, explicable et non arbitraire des personnes et des situations.",
    phrases_synthetiques: [
      "L'equite rend les decisions comprehensibles et acceptables.",
      "Une difference de traitement doit pouvoir s'expliquer clairement.",
    ],
  },
  {
    id: "reconnaissance",
    nom: "Reconnaissance",
    definition_complete:
      "Chacun d'entre nous travaille pour disposer d'un revenu mais chacun egalement souhaite trouver dans ce travail un facteur d'epanouissement. La reconnaissance que l'on recoit pour notre travail est de ce point de vue essentielle : reconnaissance des usagers et de nos divers partenaires bien entendu, mais egalement reconnaissance entre nous... entre collegues, entre services et entre niveaux hierarchiques.\n\nLa reconnaissance que nous nous exprimons mutuellement nous renforce, elle nous permet de nous sentir des individus a part entiere au sein du groupe.",
    definition_courte:
      "La reconnaissance mutuelle renforce chacun et permet de se sentir pleinement membre du collectif.",
    phrases_synthetiques: [
      "Reconnaître le travail de l'autre renforce le collectif.",
      "La reconnaissance donne a chacun une place a part entiere dans le groupe.",
    ],
  },
  {
    id: "bienveillance",
    nom: "Bienveillance",
    definition_complete:
      "Aborder l'autre de maniere positive.\n\nLa bienveillance prefigure la confiance. C'est elle qui permet de depasser ses prejuges, d'aborder les autres de maniere positive, de leur octroyer la reconnaissance meritee, mais egalement de les interpeller sans les blesser si l'on a besoin de le faire.",
    definition_courte:
      "La bienveillance consiste a aborder l'autre positivement, tout en pouvant l'interpeller sans le blesser.",
    phrases_synthetiques: [
      "La bienveillance permet d'interpeller sans blesser.",
      "Elle aide a depasser les prejuges et prepare la confiance.",
    ],
  },
  {
    id: "confiance",
    nom: "Confiance",
    definition_complete:
      "C'est la base de relations humaines durablement harmonieuses.\n\nIl s'agit d'une evidence, sans confiance le vivre ensemble est difficile et le vivre ensemble au travail n'echappe pas a cette regle. C'est grace a la confiance que des relations humaines harmonieuses peuvent durablement s'etablir. Elle est la base d'une meilleure serenite, et sans elle l'incertitude et l'anxiete s'installent.\n\nLa confiance ne se decrete pas, elle se gagne chaque jour par l'exemplarite des attitudes et des comportements.",
    definition_courte:
      "La confiance est la base de relations durables et sereines ; elle se gagne par l'exemplarite des comportements.",
    phrases_synthetiques: [
      "La confiance ne se decrete pas, elle se gagne chaque jour.",
      "Elle reduit l'incertitude et rend le travail collectif plus serein.",
    ],
  },
  {
    id: "respect",
    nom: "Respect",
    definition_complete:
      "C'est le cadre dans lequel s'exerce la liberte de chacun.\n\nIl est le socle du bien vivre ensemble au travail. Sans respect, ni la confiance, ni la solidarite, ni la convivialite ne sont possibles. Respect des individus en premier lieu, mais egalement respect des locaux et du materiel et plus globalement respect des regles et des usages en vigueur.",
    definition_courte:
      "Le respect est le socle du bien vivre ensemble : il rend possible la confiance, la solidarité et la convivialité.",
    phrases_synthetiques: [
      "Le respect est le cadre de la liberte de chacun.",
      "Sans respect, le bien vivre ensemble ne peut pas tenir.",
    ],
  },
  {
    id: "convivialite",
    nom: "Convivialité",
    definition_complete:
      "Lieu de travail, la recette interregionale est le lieu de relations professionnelles mais egalement le lieu de simples relations humaines entre collegues.\n\nPrendre le temps de passer ensemble des moments de convivialite est une des facons de se connaitre mieux, de modifier ses eventuels prejuges, de partager sa bonne humeur et, ce faisant, d'etre dans le bien vivre ensemble au travail.",
    definition_courte:
      "La convivialite permet de mieux se connaitre, de partager des moments humains et de soutenir le bien vivre ensemble.",
    phrases_synthetiques: [
      "La convivialite nourrit les relations humaines au travail.",
      "Prendre du temps ensemble aide a mieux se connaitre et a depasser les prejuges.",
    ],
  },
];

const state = {
  info: {
    serviceName: "",
    charterVersion: "v1",
    validationDate: "",
    introText: DEFAULT_INTRO,
    finalEngagement: DEFAULT_FINAL_ENGAGEMENT,
    includeFullDefinitions: false,
    paletteId: DEFAULT_PALETTE_ID,
    fontChoice: "marianne",
    logoDataUrl: "",
    logoName: "",
    logoType: "",
  },
  format: "a4",
  valuesCatalog: [],
  palettes: [],
  selectedValues: [],
  valueEntries: {},
  commitments: createDefaultCommitments(),
  assets: {
    douanesLogo: ASSET_PATHS.douanesLogo,
    valuesChart: ASSET_PATHS.valuesChart,
    valuesChartSvgText: "",
    icons: {},
  },
  ui: {
    expandedValues: {},
  },
  createdAt: "",
};

window.ChartesDouaneOccitanieState = state;

const dragState = {
  valueId: "",
  sourceZone: "",
};

const dom = {};
let statusTimeoutId = null;
let autosaveTimeoutId = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheDom();
  bindGlobalEvents();
  await Promise.all([loadAssets(), loadPalettes(), loadValues()]);
  const hasStoredDraft = Boolean(findStoredDraft());
  restoreDraft();
  if (!hasStoredDraft) {
    await loadDefaultExample();
  }
  state.format = "a4";
  ensureValueEntries();
  ensureExpandedState();
  syncFormFromState();
  applyFormat(state.format);
  renderAll();
}

function cacheDom() {
  dom.liveMessage = document.getElementById("live-message");
  dom.formErrors = document.getElementById("form-errors");
  dom.formWarnings = document.getElementById("form-warnings");
  dom.serviceName = document.getElementById("service-name");
  dom.charterVersion = document.getElementById("charter-version");
  dom.validationDate = document.getElementById("validation-date");
  dom.paletteSelect = document.getElementById("palette-select");
  dom.paletteDescription = document.getElementById("palette-description");
  dom.palettePreview = document.getElementById("palette-preview");
  dom.fontSelect = document.getElementById("font-select");
  dom.serviceLogo = document.getElementById("service-logo");
  dom.introText = document.getElementById("intro-text");
  dom.finalEngagement = document.getElementById("final-engagement");
  dom.includeFullDefinitions = document.getElementById("include-full-definitions");
  dom.logoPreview = document.getElementById("logo-preview");
  dom.logoPlaceholder = document.getElementById("logo-placeholder");
  dom.logoFilename = document.getElementById("logo-filename");
  dom.selectionCount = document.getElementById("selection-count");
  dom.availableValues = document.getElementById("available-values");
  dom.selectedValues = document.getElementById("selected-values");
  dom.valueEditors = document.getElementById("value-editors");
  dom.commitmentEditors = document.getElementById("commitment-editors");
  dom.formatButtons = Array.from(document.querySelectorAll(".format-button"));
  dom.preview = document.getElementById("charter-preview");
  dom.previewPanel = document.querySelector(".preview-panel");
  dom.appControls = document.querySelector(".app-controls");
  dom.importJsonInput = document.getElementById("import-json-input");
  dom.printPageStyle = document.getElementById("print-page-style");
  dom.expandAllValuesButton = document.getElementById("expand-all-values-button");
  dom.collapseAllValuesButton = document.getElementById("collapse-all-values-button");
  dom.jumpToPreviewButton = document.getElementById("jump-to-preview-button");
  dom.jumpToFormButton = document.getElementById("jump-to-form-button");
  dom.importStartButton = document.getElementById("import-start-button");
}

function bindGlobalEvents() {
  dom.serviceName.addEventListener("input", (event) => updateInfo("serviceName", event.target.value));
  dom.charterVersion.addEventListener("input", (event) => updateInfo("charterVersion", event.target.value));
  dom.validationDate.addEventListener("input", (event) => updateInfo("validationDate", event.target.value));
  dom.introText.addEventListener("input", (event) => updateInfo("introText", event.target.value));
  dom.finalEngagement.addEventListener("input", (event) =>
    updateInfo("finalEngagement", event.target.value)
  );
  dom.includeFullDefinitions.addEventListener("change", (event) =>
    updateInfo("includeFullDefinitions", event.target.checked)
  );
  dom.paletteSelect.addEventListener("change", (event) => updateInfo("paletteId", event.target.value));
  dom.fontSelect.addEventListener("change", (event) => updateInfo("fontChoice", event.target.value));
  dom.serviceLogo.addEventListener("change", handleLogoUpload);
  dom.formatButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setFormat(button.dataset.format);
    });
  });

  document.getElementById("save-draft-button").addEventListener("click", saveDraftManually);
  dom.importStartButton.addEventListener("click", () => dom.importJsonInput.click());
  document.getElementById("export-bundle-button").addEventListener("click", exportBundle);
  document.getElementById("pdf-a4-button")?.addEventListener("click", () => window.ChartesDouaneOccitaniePdfExport?.downloadPdf("a4"));
  document.getElementById("pdf-a3-button")?.addEventListener("click", () => window.ChartesDouaneOccitaniePdfExport?.downloadPdf("a3"));
  document.getElementById("reset-button").addEventListener("click", resetApplication);
  dom.importJsonInput.addEventListener("change", importJson);
  dom.expandAllValuesButton.addEventListener("click", expandAllValueEditors);
  dom.collapseAllValuesButton.addEventListener("click", collapseAllValueEditors);
  dom.jumpToPreviewButton.addEventListener("click", scrollToPreviewPanel);
  dom.jumpToFormButton.addEventListener("click", scrollToFormPanel);

  document.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", handleZoneDragOver);
    zone.addEventListener("dragenter", handleZoneDragEnter);
    zone.addEventListener("dragleave", handleZoneDragLeave);
    zone.addEventListener("drop", handleZoneDrop);
  });

  dom.valueEditors.addEventListener("click", handleValueEditorClick);
  dom.valueEditors.addEventListener("input", handleValueEditorInput);
  dom.valueEditors.addEventListener("keydown", handleValueEditorKeydown);
  dom.commitmentEditors.addEventListener("click", handleCommitmentEditorClick);
  dom.commitmentEditors.addEventListener("input", handleCommitmentEditorInput);
  dom.commitmentEditors.addEventListener("keydown", handleCommitmentEditorKeydown);
}

async function loadAssets() {
  const entries = Object.entries(ASSET_PATHS);
  const loaded = await Promise.all(entries.map(([key, path]) => loadAssetReference(key, path)));
  loaded.forEach(([key, value]) => {
    state.assets[key] = value;
  });
  state.assets.valuesChartSvgText = await loadTextAssetReference(ASSET_PATHS.valuesChart, getEmbeddedValuesChartSvg());
  const iconEntries = Object.entries(VALUE_ICON_PATHS);
  const loadedIcons = await Promise.all(iconEntries.map(([key, path]) => loadAssetReference(key, path)));
  loadedIcons.forEach(([key, value]) => {
    state.assets.icons[key] = value;
  });

    const inlineResources = window.CHARTES_DOUANE_OCCITANIE_PDF_RESOURCES || {};
  if (inlineResources.logoDouanes) {
    state.assets.douanesLogo = inlineResources.logoDouanes;
  }
  Object.entries(inlineResources.iconSvgs || {}).forEach(([key, svg]) => {
    state.assets.icons[key] = svgToDataUrl(svg);
  });
}

function svgToDataUrl(svg) {
  return svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";
}

function getEmbeddedValuesChartSvg() {
  if (typeof window === "undefined") {
    return "";
  }
  if (typeof window.CHARTES_DOUANE_OCCITANIE_VALUES_SCHEMA_SVG === "string") {
    return window.CHARTES_DOUANE_OCCITANIE_VALUES_SCHEMA_SVG;
  }
  if (typeof window.CHARTES_DOUANE_OCCITANIE_VALUES_SCHEMA_SVG?.value === "string") {
    return window.CHARTES_DOUANE_OCCITANIE_VALUES_SCHEMA_SVG.value;
  }
  return "";
}

async function loadTextAssetReference(path, fallbackText = "") {
  try {
    const response = await fetch(path, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(`Asset texte local non charge via fetch : ${path}`, error);
    return fallbackText;
  }
}

async function loadAssetReference(key, path) {
  try {
    const response = await fetch(path, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    return [key, await blobToDataUrl(blob)];
  } catch (error) {
    console.warn(`Asset local non charge via fetch pour ${key}: ${path}`, error);
    return [key, path];
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function loadPalettes() {
  try {
    const response = await fetch(PALETTES_SOURCE_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const palettes = await response.json();
    state.palettes = normalizePalettes(palettes);
  } catch (error) {
    state.palettes = normalizePalettes(FALLBACK_PALETTES);
  }

  if (!state.palettes.some((palette) => palette.id === state.info.paletteId)) {
    state.info.paletteId = state.palettes[0]?.id || DEFAULT_PALETTE_ID;
  }

  renderPaletteOptions();
}

function normalizePalettes(palettes) {
  return (Array.isArray(palettes) ? palettes : [])
    .filter((palette) => palette && palette.id && palette.nom)
    .map((palette) => ({
      id: normalizeText(palette.id),
      nom: normalizeText(palette.nom),
      description: normalizeText(palette.description || ""),
      primary: normalizeColor(palette.primary, "#000091"),
      secondary: normalizeColor(palette.secondary, "#E1000F"),
      accent: normalizeColor(palette.accent, "#417DC4"),
      softBackground: normalizeColor(palette.softBackground, "#F5F5FE"),
      panelBackground: normalizeColor(palette.panelBackground, "#FFFFFF"),
      border: normalizeColor(palette.border, "#C5C5DE"),
      text: normalizeColor(palette.text, "#1E1E1E"),
      mutedText: normalizeColor(palette.mutedText, "#4C4C66"),
      swatches: normalizePaletteSwatches(palette),
    }));
}

function normalizePaletteSwatches(palette) {
  const fallbackSwatches = [
    { label: "Primaire", color: normalizeColor(palette.primary, "#000091") },
    { label: "Secondaire", color: normalizeColor(palette.secondary, "#E1000F") },
    { label: "Accent", color: normalizeColor(palette.accent, "#417DC4") },
    { label: "Fond doux", color: normalizeColor(palette.softBackground, "#F6F6F6") },
    { label: "Texte", color: normalizeColor(palette.text, "#1E1E1E") },
  ];

  if (!Array.isArray(palette.swatches) || !palette.swatches.length) {
    return fallbackSwatches;
  }

  return palette.swatches
    .map((swatch, index) => ({
      label: normalizeText(swatch?.label || fallbackSwatches[index]?.label || `Couleur ${index + 1}`),
      color: normalizeColor(swatch?.color, fallbackSwatches[index]?.color || "#000091"),
    }))
    .filter((swatch) => swatch.label && swatch.color);
}

async function loadValues() {
  try {
    const response = await fetch(VALUES_SOURCE_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const values = await response.json();
    state.valuesCatalog = normalizeCatalogValues(values);
    setStatus(`Les 9 valeurs ont été chargées depuis ${VALUES_SOURCE_PATH}.`, "success");
  } catch (error) {
    const embeddedValues = getEmbeddedValuesCatalog();
    state.valuesCatalog = normalizeCatalogValues(embeddedValues.length ? embeddedValues : FALLBACK_VALUES);
    setStatus("Les 9 valeurs locales intégrées ont été chargées.", "success");
  }
}

function getEmbeddedValuesCatalog() {
  if (typeof window === "undefined") {
    return [];
  }
  if (Array.isArray(window.CHARTES_DOUANE_OCCITANIE_VALUES_CATALOG)) {
    return window.CHARTES_DOUANE_OCCITANIE_VALUES_CATALOG;
  }
  if (Array.isArray(window.CHARTES_DOUANE_OCCITANIE_VALUES_CATALOG?.value)) {
    return window.CHARTES_DOUANE_OCCITANIE_VALUES_CATALOG.value;
  }
  return [];
}

function normalizeCatalogValues(values) {
  return (Array.isArray(values) ? values : [])
    .filter((value) => value && value.id && value.nom)
    .map((value) => {
      const definitions = normalizeDefinitions(value);
      return {
        id: normalizeText(value.id),
        nom: normalizeText(value.nom),
        definition_complete: definitions.definition_complete,
        definition_courte: definitions.definition_courte,
        phrases_synthetiques: normalizeStringList(
          value.phrases_synthetiques || value.phrasesSynthetiques || []
        ),
      };
    });
}

function renderPaletteOptions() {
  dom.paletteSelect.innerHTML = state.palettes
    .map(
      (palette) =>
        `<option value="${escapeAttribute(palette.id)}">${escapeHtml(palette.nom)}</option>`
    )
    .join("");
  dom.paletteSelect.value = state.info.paletteId;
  updatePaletteDescription();
}

function updatePaletteDescription() {
  const palette = getPaletteById(state.info.paletteId);
  dom.paletteDescription.textContent = palette?.description
    ? palette.description
    : "Choisissez une palette appliquee uniquement au document produit.";

  if (!dom.palettePreview) {
    return;
  }

  dom.palettePreview.innerHTML = state.palettes
    .map((candidate) => {
      const swatches = (candidate.swatches || []).slice(0, 5);
      const active = candidate.id === state.info.paletteId;
      return `
        <button type="button" class="palette-thumb${active ? " is-active" : ""}" data-palette-id="${escapeAttribute(candidate.id)}">
          <span class="palette-thumb__mock" style="${buildPaletteCssVars(candidate)}">
            <span class="palette-thumb__header"></span>
            <span class="palette-thumb__title"></span>
            <span class="palette-thumb__columns">
              <span></span><span></span><span></span>
            </span>
          </span>
          <span class="palette-thumb__name">${escapeHtml(candidate.nom)}</span>
          <span class="palette-thumb__swatches">
            ${swatches
              .map(
                (swatch) =>
                  `<span title="${escapeAttribute(swatch.label)}" style="background:${escapeAttribute(swatch.color)}"></span>`
              )
              .join("")}
          </span>
        </button>
      `;
    })
    .join("");

  dom.palettePreview.querySelectorAll("[data-palette-id]").forEach((button) => {
    button.addEventListener("click", () => updateInfo("paletteId", button.dataset.paletteId));
  });
}

function restoreDraft() {
  const rawDraft = findStoredDraft();
  if (!rawDraft) {
    return false;
  }

  try {
    const payload = JSON.parse(rawDraft);
    applyImportedData(payload, { isDraft: true });
    setStatus("Le dernier brouillon local a été restauré.", "success");
  } catch (error) {
    state.createdAt = new Date().toISOString();
    setStatus("Le brouillon local n'a pas pu être restauré. Un nouveau brouillon a été initialisé.", "warning");
  }
}

function findStoredDraft() {
  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    const rawValue = localStorage.getItem(key);
    if (rawValue) {
      return rawValue;
    }
  }
  return "";
}

async function loadDefaultExample() {
  try {
    const response = await fetch(EXAMPLE_SOURCE_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    applyImportedData(payload, { isDraft: true });
    setStatus("L'exemple local a ete charge par defaut.", "success");
  } catch (error) {
    applyImportedData(buildFallbackExampleSnapshot(), { isDraft: true });
    setStatus("L'exemple integre a ete charge par defaut.", "success");
  }
}

function buildFallbackExampleSnapshot() {
  const selectedIds = ["solidarite", "respect", "convivialite"];
  const exampleItems = {
    solidarite: [
      "Je me rends disponible pour un collegue qui en a besoin.",
      "Je participe activement au travail collectif au sein de mon service.",
      "Lorsque cela derape, je me mobilise pour trouver une solution.",
    ],
    respect: [
      "Je fais preuve de politesse dans mes echanges quotidiens.",
      "Je maintiens le niveau de proprete du materiel et des espaces partages.",
      "J'evite les insultes, l'ironie et les attaques personnelles.",
    ],
    convivialite: [
      "Je participe aux moments de convivialite organises.",
      "Je propose et organise des moments collectifs simples.",
      "J'evite d'exclure certaines personnes ou d'entretenir un climat negatif.",
    ],
  };

  return {
    applicationVersion: APP_VERSION,
    dateCreation: new Date().toISOString(),
    format: "a4",
    paletteGraphique: "terroir",
    versionCharte: "v1",
    service: {
      nom: "BSI Montauban",
      version: "v1",
      dateValidation: "2026-06-29",
      introduction: DEFAULT_INTRO,
      logo: {
        dataUrl: "",
        name: "",
        type: "",
      },
    },
    options: {
      inclure_definitions_completes: false,
      palette_graphique: "terroir",
      police_document: "marianne",
    },
    phraseFinaleEngagement: DEFAULT_FINAL_ENGAGEMENT,
    engagements: createDefaultCommitments(),
    valuesRetenues: selectedIds
      .map((valueId) => {
        const value = getValueById(valueId);
        if (!value) return null;
        return {
          id: value.id,
          nom: value.nom,
          definition_complete: value.definition_complete,
          definition_courte: value.definition_courte,
          phrases_synthetiques: value.phrases_synthetiques,
          items: exampleItems[valueId].map((text) => ({ texte: text })),
        };
      })
      .filter(Boolean),
  };
}

function applyImportedData(payload, options = {}) {
  const normalized = normalizeImportedData(payload);

  state.info.serviceName = normalized.service.nom;
  state.info.charterVersion = normalized.service.version;
  state.info.validationDate = normalized.service.dateValidation;
  state.info.introText = normalized.service.introduction || DEFAULT_INTRO;
  state.info.finalEngagement = normalized.phraseFinaleEngagement || DEFAULT_FINAL_ENGAGEMENT;
  state.info.includeFullDefinitions = normalized.options.inclure_definitions_completes;
  state.info.paletteId = getPaletteById(normalized.options.palette_graphique)?.id || DEFAULT_PALETTE_ID;
  state.info.fontChoice = normalizeFontChoice(normalized.options.police_document);
  state.info.logoDataUrl = normalized.service.logo.dataUrl || "";
  state.info.logoName = normalized.service.logo.name || "";
  state.info.logoType = normalized.service.logo.type || "";
  // L'aperçu du formulaire reste volontairement en A4. Les exports PDF
  // appliquent ensuite leur propre format sans modifier la saisie en cours.
  state.format = "a4";
  state.createdAt = normalized.dateCreation || state.createdAt || new Date().toISOString();

  normalized.valuesRetenues.forEach((value) => mergeCatalogValue(value));
  state.selectedValues = normalized.valuesRetenues.map((value) => value.id).filter(Boolean).slice(0, 3);
  state.valueEntries = {};
  normalized.valuesRetenues.forEach((value) => {
    state.valueEntries[value.id] = normalizeValueEntry({ items: value.items, comportements: value.comportements });
  });
  state.commitments = normalizeCommitments(normalized.engagements);

  ensureValueEntries();
  ensureExpandedState();

  if (!options.isDraft) {
    syncFormFromState();
    applyFormat(state.format);
    renderAll();
  }
}

function normalizeImportedData(payload) {
  const service = payload.service || {};
  const options = payload.options || {};
  const valuesInput = Array.isArray(payload.valuesRetenues)
    ? payload.valuesRetenues
    : Array.isArray(payload.values_retenues)
    ? payload.values_retenues
    : [];

  return {
    dateCreation: normalizeText(payload.dateCreation || payload.date_creation || "") || new Date().toISOString(),
    format: normalizeFormat(payload.format),
    versionCharte: normalizeCharterVersion(
      payload.versionCharte || payload.version_charte || payload.charterVersion || service.version || "v1"
    ),
    service: {
      nom: normalizeText(service.nom || payload.nomService || payload.serviceName || ""),
      version: normalizeCharterVersion(
        service.version || payload.versionCharte || payload.version_charte || payload.charterVersion || "v1"
      ),
      unite: normalizeText(service.unite || payload.unite || payload.serviceUnit || ""),
      dateValidation: normalizeText(
        service.dateValidation || payload.dateValidation || payload.validationDate || ""
      ),
      introduction: normalizeText(
        service.introduction || payload.introduction || payload.introText || DEFAULT_INTRO
      ),
      logo: {
        dataUrl: normalizeText(service.logo?.dataUrl || payload.logoDataUrl || ""),
        name: normalizeText(service.logo?.name || payload.logoName || ""),
        type: normalizeText(service.logo?.type || payload.logoType || ""),
      },
    },
    options: {
      inclure_definitions_completes: Boolean(
        options.inclure_definitions_completes ??
          payload.includeFullDefinitions ??
          payload.inclure_definitions_completes ??
          false
      ),
      palette_graphique: normalizeText(
        options.palette_graphique || payload.paletteGraphique || payload.paletteId || DEFAULT_PALETTE_ID
      ),
      police_document: normalizeFontChoice(
        options.police_document || payload.policeDocument || payload.fontChoice || "marianne"
      ),
    },
    phraseFinaleEngagement: normalizeText(
      payload.phraseFinaleEngagement || payload.finalEngagement || DEFAULT_FINAL_ENGAGEMENT
    ),
    valuesRetenues: valuesInput.map(normalizeImportedValue).filter((value) => value.id),
    engagements: normalizeCommitments(payload.engagements || payload.commitments || {}),
  };
}

function normalizeImportedValue(value) {
  const definitions = normalizeDefinitions(value);
  const behaviorSource = value.comportements;
  const onFait = normalizeBehaviorItems(
    Array.isArray(behaviorSource) || typeof behaviorSource === "string"
      ? behaviorSource
      : behaviorSource?.on_fait ?? value.comportementsAttendus ?? value.comportements_attendus ?? []
  );
  const onEvite = normalizeBehaviorItems(
    behaviorSource?.on_evite ?? value.comportementsAEviter ?? value.comportements_a_eviter ?? []
  );
  const reparer = normalizeBehaviorItems(
    behaviorSource?.quand_ca_derape_on_repare ??
      behaviorSource?.quand_ca_derappe_on_repare ??
      value.quandCaDerappeOnRepare ??
      value.quand_ca_derape_on_repare ??
      value.quand_ca_derappe_on_repare ??
      []
  );
  const attentes = normalizeBehaviorItems(
    behaviorSource?.attentes_organisation_encadrement ??
      value.attentesOrganisationEncadrement ??
      value.attentes_organisation_encadrement ??
      []
  );
  const phrases = normalizeStringList(
    value.phrases_synthetiques || value.phrasesSynthetiques || value.phrases || []
  );
  const generalExamples = normalizeStringList(value.exemplesConcrets ?? value.exemples ?? []);
  attachGeneralExamples([onFait, onEvite, reparer, attentes], generalExamples);

  return {
    id: normalizeText(value.id),
    nom: normalizeText(value.nom || value.id || ""),
    definition_complete: definitions.definition_complete,
    definition_courte: definitions.definition_courte,
    phrases_synthetiques: phrases,
    items: normalizeTextItems(value.items || value.liste || value.actions || []).length
      ? normalizeTextItems(value.items || value.liste || value.actions || [])
      : mergeLegacyBehaviorItems([onFait, onEvite, reparer, attentes]),
    comportements: {
      on_fait: onFait,
      on_evite: onEvite,
      quand_ca_derape_on_repare: reparer,
      attentes_organisation_encadrement: attentes,
    },
  };
}

function normalizeDefinitions(value) {
  const complete = normalizeText(
    value.definition_complete || value.definitionComplete || value.definition || value.definition_courte || ""
  );
  const short = normalizeText(
    value.definition_courte || value.definitionCourte || value.definition || value.definition_complete || ""
  );
  return {
    definition_complete: complete || short,
    definition_courte: short || complete,
  };
}

function normalizeBehaviorItems(input) {
  const rawItems = Array.isArray(input) ? input : normalizeText(input) ? [input] : [];
  return rawItems
    .map((item) => {
      if (typeof item === "string") {
        return createBehaviorItem(item, "");
      }
      return createBehaviorItem(
        normalizeText(item?.texte || item?.text || item?.label || ""),
        normalizeText(item?.exemple || item?.example || item?.detail || "")
      );
    })
    .filter((item) => item.texte || item.exemple);
}

function normalizeStringList(input) {
  const rawItems = Array.isArray(input) ? input : normalizeText(input) ? [input] : [];
  return rawItems.map((item) => normalizeText(item)).filter(Boolean);
}

function attachGeneralExamples(groups, examples) {
  if (!examples.length) {
    return;
  }

  const items = groups.flat();
  let exampleIndex = 0;
  items.forEach((item) => {
    if (!item.exemple && exampleIndex < examples.length) {
      item.exemple = examples[exampleIndex];
      exampleIndex += 1;
    }
  });
}

function mergeCatalogValue(value) {
  const definitions = normalizeDefinitions(value);
  const existingIndex = state.valuesCatalog.findIndex((entry) => entry.id === normalizeText(value.id));
  const existing = existingIndex >= 0 ? state.valuesCatalog[existingIndex] : null;
  const importedPhrases = normalizeStringList(
    value.phrases_synthetiques || value.phrasesSynthetiques || []
  );
  const normalized = {
    id: normalizeText(value.id),
    nom: normalizeText(value.nom || existing?.nom || value.id || ""),
    definition_complete: definitions.definition_complete || existing?.definition_complete || "",
    definition_courte: definitions.definition_courte || existing?.definition_courte || "",
    phrases_synthetiques: importedPhrases.length
      ? importedPhrases
      : normalizeStringList(existing?.phrases_synthetiques || []),
  };

  if (existingIndex >= 0) {
    state.valuesCatalog[existingIndex] = { ...state.valuesCatalog[existingIndex], ...normalized };
  } else {
    state.valuesCatalog.push(normalized);
  }
}

function ensureValueEntries() {
  state.selectedValues.forEach((valueId) => {
    if (!state.valueEntries[valueId]) {
      state.valueEntries[valueId] = createDefaultValueEntry();
    } else {
      state.valueEntries[valueId] = normalizeValueEntry(state.valueEntries[valueId]);
    }
  });
}

function ensureExpandedState(forceExpand = false) {
  if (forceExpand) {
    state.selectedValues.forEach((valueId) => {
      state.ui.expandedValues[valueId] = true;
    });
    return;
  }

  const hasExplicitState = state.selectedValues.some((valueId) => typeof state.ui.expandedValues[valueId] === "boolean");
  if (!hasExplicitState && state.selectedValues.length) {
    setSingleExpandedValue(state.selectedValues[0]);
    return;
  }

  state.selectedValues.forEach((valueId) => {
    if (typeof state.ui.expandedValues[valueId] !== "boolean") {
      state.ui.expandedValues[valueId] = false;
    }
  });
}

function createDefaultValueEntry() {
  return {
    items: [createTextItem()],
  };
}

function normalizeValueEntry(entry) {
  const comportements = entry?.comportements || {};
  const directItems = normalizeTextItems(entry?.items || entry?.liste || entry?.actions || []);
  const legacyItems = mergeLegacyBehaviorItems([
    normalizeBehaviorItems(comportements.on_fait),
    normalizeBehaviorItems(comportements.on_evite),
    normalizeBehaviorItems(comportements.quand_ca_derape_on_repare || comportements.quand_ca_derappe_on_repare),
    normalizeBehaviorItems(comportements.attentes_organisation_encadrement),
  ]);
  return {
    items: directItems.length ? directItems : legacyItems.length ? legacyItems : [createTextItem()],
  };
}

function normalizeEditorBehaviorList(items, ensureOneRow) {
  const normalized = normalizeBehaviorItems(items);
  if (!normalized.length && ensureOneRow) {
    return [createBehaviorItem()];
  }
  return normalized;
}

function createBehaviorItem(texte = "", exemple = "") {
  return {
    texte: normalizeText(texte),
    exemple: normalizeText(exemple),
  };
}

function createTextItem(texte = "") {
  return {
    texte: normalizeText(texte),
  };
}

function normalizeTextItems(input) {
  const rawItems = Array.isArray(input) ? input : normalizeText(input) ? [input] : [];
  return rawItems
    .map((item) => {
      if (typeof item === "string") {
        return createTextItem(item);
      }
      return createTextItem(item?.texte || item?.text || item?.label || "");
    })
    .filter((item) => item.texte);
}

function mergeLegacyBehaviorItems(groups) {
  return groups.flat().map((item) => createTextItem(item.texte)).filter((item) => item.texte);
}

function normalizeCommitments(input) {
  const source = input || {};
  return COMMITMENT_SECTIONS.reduce((accumulator, section) => {
    const rawItems =
      source[section.key] ||
      source[section.key === "collegue" ? "collègue" : section.key] ||
      source[section.title] ||
      [];
    const normalized = normalizeTextItems(rawItems);
    let items = normalized.length
      ? normalized
      : DEFAULT_COMMITMENTS[section.key].map((text) => createTextItem(text));
    if (section.key === "equipe") {
      items = items.filter((item) => !REMOVED_DEFAULT_TEAM_COMMITMENTS.has(item.texte));
    }
    accumulator[section.key] = items;
    return accumulator;
  }, {});
}

function createDefaultCommitments() {
  return normalizeCommitments({});
}

function normalizeFontChoice(value) {
  return value === "spectral" ? "spectral" : "marianne";
}

function syncFormFromState() {
  dom.serviceName.value = state.info.serviceName;
  dom.charterVersion.value = state.info.charterVersion;
  dom.validationDate.value = state.info.validationDate;
  dom.introText.value = state.info.introText;
  dom.finalEngagement.value = state.info.finalEngagement;
  dom.includeFullDefinitions.checked = state.info.includeFullDefinitions;
  dom.paletteSelect.value = state.info.paletteId;
  dom.fontSelect.value = state.info.fontChoice;
  renderLogoSummary();
  updatePaletteDescription();
}

function updateInfo(key, value) {
  state.info[key] = value;
  if (key === "paletteId") {
    dom.paletteSelect.value = state.info.paletteId;
    updatePaletteDescription();
  }
  if (key === "fontChoice") {
    state.info.fontChoice = normalizeFontChoice(value);
    dom.fontSelect.value = state.info.fontChoice;
  }
  renderPreview();
  renderAdvisories();
  queueAutosave();
}

function renderAll() {
  renderLogoSummary();
  renderPaletteOptions();
  renderValueLists();
  renderValueEditors();
  renderCommitmentEditors();
  renderPreview();
  renderAdvisories();
  updateSelectionSummary();
}

function renderLogoSummary() {
  if (state.info.logoDataUrl) {
    dom.logoPreview.src = state.info.logoDataUrl;
    dom.logoPreview.style.display = "block";
    dom.logoPlaceholder.style.display = "none";
    dom.logoFilename.textContent = state.info.logoName
        ? `Logo de service importé : ${state.info.logoName}`
        : "Logo de service importé";
  } else {
    dom.logoPreview.removeAttribute("src");
    dom.logoPreview.style.display = "none";
    dom.logoPlaceholder.style.display = "block";
    dom.logoFilename.textContent =
      "Le logo du service apparaîtra à droite du logo Douanes dans la prévisualisation, le PDF et le JSON.";
  }
}

function renderValueLists() {
  const availableValues = state.valuesCatalog.filter((value) => !state.selectedValues.includes(value.id));
  const selectedValues = state.selectedValues.map((valueId) => getValueById(valueId)).filter(Boolean);
  renderValueList(dom.availableValues, availableValues, "available");
  renderValueList(dom.selectedValues, selectedValues, "selected");
}

function renderValueList(container, values, zone) {
  container.innerHTML = "";
  container.classList.toggle("is-empty", values.length === 0);
  container.dataset.empty =
    zone === "available"
      ? "Toutes les valeurs sont actuellement retenues."
      : "Faites glisser ici les 3 valeurs qui composeront la charte.";

  container.classList.add("value-list--table");
  container.innerHTML = values
    .map(
      (value, index) => `
        <article class="value-row-option" draggable="true" data-value-id="${escapeAttribute(value.id)}" data-zone="${zone}" data-index="${index}">
          <div class="value-row-option__main">
            <strong>${escapeHtml(value.nom)}</strong>
            <details>
              <summary>Voir le détail</summary>
              <p>${escapeHtml(value.definition_courte)}</p>
              <p>${escapeHtml(value.definition_complete)}</p>
            </details>
          </div>
          <button type="button" class="secondary-button" data-value-action="${zone === "selected" ? "remove" : "add"}" data-value-id="${escapeAttribute(value.id)}">
            ${zone === "selected" ? "Retirer" : "Ajouter"}
          </button>
        </article>
      `
    )
    .join("");
  container.querySelectorAll(".value-row-option").forEach((row) => {
    row.addEventListener("dragstart", handleCardDragStart);
    row.addEventListener("dragend", handleCardDragEnd);
    row.addEventListener("dragover", handleCardDragOver);
    row.addEventListener("dragleave", handleCardDragLeave);
    row.addEventListener("drop", handleCardDropOnCard);
  });
  container.querySelectorAll("[data-value-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.valueAction === "remove") removeSelectedValue(button.dataset.valueId);
      else addSelectedValue(button.dataset.valueId);
    });
  });
}

function createActionButton(label, onClick, className = "secondary-button") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function updateSelectionSummary() {
  const count = state.selectedValues.length;
  const label = count === 1 ? "valeur sélectionnée" : "valeurs sélectionnées";
  dom.selectionCount.textContent = `${count} ${label} sur 3`;
}

function addSelectedValue(valueId, insertIndex = state.selectedValues.length) {
  if (state.selectedValues.includes(valueId)) {
    reorderSelectedValue(valueId, insertIndex);
    return;
  }

  if (state.selectedValues.length >= 3) {
    setStatus("Vous avez déjà sélectionné 3 valeurs. Retirez-en une avant d'en ajouter une autre.", "warning");
    return;
  }

  state.selectedValues.splice(insertIndex, 0, valueId);
  ensureValueEntries();
  setSingleExpandedValue(valueId);
  renderAll();
  queueAutosave();
}

function removeSelectedValue(valueId) {
  state.selectedValues = state.selectedValues.filter((id) => id !== valueId);
  delete state.ui.expandedValues[valueId];
  ensureExpandedState();
  renderAll();
  queueAutosave();
}

function moveSelectedValue(valueId, delta) {
  const currentIndex = state.selectedValues.indexOf(valueId);
  if (currentIndex === -1) {
    return;
  }
  reorderSelectedValue(valueId, currentIndex + delta);
}

function reorderSelectedValue(valueId, newIndex) {
  const currentIndex = state.selectedValues.indexOf(valueId);
  if (currentIndex === -1) {
    return;
  }

  const boundedIndex = Math.max(0, Math.min(newIndex, state.selectedValues.length - 1));
  if (boundedIndex === currentIndex) {
    return;
  }

  state.selectedValues.splice(currentIndex, 1);
  state.selectedValues.splice(boundedIndex, 0, valueId);
  renderAll();
  queueAutosave();
}

function handleCardDragStart(event) {
  const card = event.currentTarget;
  dragState.valueId = card.dataset.valueId || "";
  dragState.sourceZone = card.dataset.zone || "";
  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", dragState.valueId);
}

function handleCardDragEnd(event) {
  event.currentTarget.classList.remove("is-dragging");
  clearDropHighlights();
}

function handleZoneDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleZoneDragEnter(event) {
  event.preventDefault();
  event.currentTarget.classList.add("is-over");
}

function handleZoneDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    event.currentTarget.classList.remove("is-over");
  }
}

function handleZoneDrop(event) {
  event.preventDefault();
  const zone = event.currentTarget;
  zone.classList.remove("is-over");
  const targetZone = zone.dataset.zone;

  if (!dragState.valueId) {
    return;
  }

  if (targetZone === "available") {
    removeSelectedValue(dragState.valueId);
    return;
  }

  addSelectedValue(dragState.valueId, state.selectedValues.length);
}

function handleCardDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("is-drop-target");
}

function handleCardDragLeave(event) {
  event.currentTarget.classList.remove("is-drop-target");
}

function handleCardDropOnCard(event) {
  event.preventDefault();
  const targetCard = event.currentTarget;
  targetCard.classList.remove("is-drop-target");

  if (!dragState.valueId) {
    return;
  }

  const targetZone = targetCard.dataset.zone;
  const targetValueId = targetCard.dataset.valueId;

  if (targetZone === "available") {
    removeSelectedValue(dragState.valueId);
    return;
  }

  const rect = targetCard.getBoundingClientRect();
  const placeAfter = event.clientY >= rect.top + rect.height / 2;
  const targetIndex = state.selectedValues.indexOf(targetValueId);

  if (dragState.sourceZone === "available") {
    addSelectedValue(dragState.valueId, placeAfter ? targetIndex + 1 : targetIndex);
    return;
  }

  const currentIndex = state.selectedValues.indexOf(dragState.valueId);
  let insertIndex = placeAfter ? targetIndex + 1 : targetIndex;
  if (insertIndex > currentIndex) {
    insertIndex -= 1;
  }
  reorderSelectedValue(dragState.valueId, insertIndex);
}

function clearDropHighlights() {
  document.querySelectorAll(".is-drop-target, .is-over").forEach((element) => {
    element.classList.remove("is-drop-target", "is-over");
  });
}

function expandAllValueEditors() {
  state.selectedValues.forEach((valueId) => {
    state.ui.expandedValues[valueId] = true;
  });
  renderValueEditors();
}

function collapseAllValueEditors() {
  state.selectedValues.forEach((valueId) => {
    state.ui.expandedValues[valueId] = false;
  });
  renderValueEditors();
}

function setValueExpanded(valueId, expanded) {
  if (expanded) {
    setSingleExpandedValue(valueId);
  } else {
    state.ui.expandedValues[valueId] = false;
  }
  renderValueEditors();
}

function setSingleExpandedValue(valueId) {
  state.selectedValues.forEach((selectedId) => {
    state.ui.expandedValues[selectedId] = selectedId === valueId;
  });
}

function renderValueEditors() {
  dom.valueEditors.innerHTML = "";

  if (!state.selectedValues.length) {
    dom.valueEditors.innerHTML =
      '<div class="charte-document__empty">Sélectionnez d\'abord 3 valeurs pour définir les engagements associés.</div>';
    return;
  }

  state.selectedValues.forEach((valueId, index) => {
    const value = getValueById(valueId);
    const entry = state.valueEntries[valueId];
    const expanded = state.ui.expandedValues[valueId] !== false;
    if (!value || !entry) {
      return;
    }

    const editor = document.createElement("section");
    editor.className = "editor-card";
    editor.innerHTML = `
      <div class="editor-card__header">
        <div>
          <h3>${index + 1}. ${escapeHtml(value.nom)}</h3>
          <p>${escapeHtml(value.definition_courte)}</p>
        </div>
        <div class="editor-card__actions">
          <span class="editor-card__badge">${index + 1}</span>
          <button type="button" class="secondary-button" data-toggle-value="${valueId}">${expanded ? "Replier" : "Deplier"}</button>
        </div>
      </div>
      ${expanded ? renderExpandedEditorBody(valueId, value, entry) : ""}
    `;
    dom.valueEditors.appendChild(editor);
  });
}

function renderExpandedEditorBody(valueId, value, entry) {
  return `
    <div class="editor-card__body">
      <details class="value-card__details" style="margin-top: 12px;">
        <summary>Référence complète</summary>
        <p>${escapeHtml(value.definition_complete)}</p>
      </details>
      ${renderValueItemSectionEditor(valueId, entry)}
    </div>
  `;
}

function renderValueItemSectionEditor(valueId, entry) {
  const items = entry.items;

  return `
    <section class="section-block">
      <p class="section-help">Une ligne = une puce dans le document. Vous pouvez copier-coller une liste déjà préparée.</p>
      <label class="field field--full value-bullet-editor">
        <span>Liste à puces</span>
        <textarea rows="8" data-value-items-text data-value-id="${valueId}" placeholder="• Je partage l'information utile&#10;• Je respecte les usages communs">${escapeHtml(
          itemsToBulletLinesText(items)
        )}</textarea>
      </label>
    </section>
  `;
}

function handleValueEditorClick(event) {
  const toggleButton = event.target.closest("[data-toggle-value]");
  if (toggleButton) {
    const valueId = toggleButton.dataset.toggleValue;
    setValueExpanded(valueId, state.ui.expandedValues[valueId] === false);
    return;
  }

  return;
}

function handleValueEditorInput(event) {
  const input = event.target;

  if (input.dataset.valueItemsText !== undefined) {
    const valueId = input.dataset.valueId;
    state.valueEntries[valueId].items = parseBulletLinesText(input.value);
    renderPreview();
    renderAdvisories();
    queueAutosave();
    return;
  }

  if (!input.dataset.valueItemField) {
    return;
  }

  const valueId = input.dataset.valueId;
  const itemIndex = Number(input.dataset.itemIndex);

  state.valueEntries[valueId].items[itemIndex].texte = input.value;
  renderPreview();
  renderAdvisories();
  queueAutosave();
}

function handleValueEditorKeydown(event) {
  const textarea = event.target.closest("textarea[data-value-items-text]");
  if (!textarea || event.key !== "Enter" || event.shiftKey || event.isComposing) {
    return;
  }

  event.preventDefault();
  textarea.setRangeText("\n\u2022 ", textarea.selectionStart, textarea.selectionEnd, "end");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function addValueItemRow(valueId) {
  setSingleExpandedValue(valueId);
  state.valueEntries[valueId].items.push(createTextItem());
  renderValueEditors();
  renderPreview();
  renderAdvisories();
  queueAutosave();
}

function removeValueItemRow(valueId, itemIndex) {
  setSingleExpandedValue(valueId);
  const list = state.valueEntries[valueId].items;
  list.splice(itemIndex, 1);
  if (list.length === 0) {
    list.push(createTextItem());
  }
  renderValueEditors();
  renderPreview();
  renderAdvisories();
  queueAutosave();
}

function itemsToBulletText(items) {
  return sanitizeTextList(items)
    .map((item) => `• ${item.texte}`)
    .join("\n");
}

function parseBulletText(value) {
  const items = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => createTextItem(line));
  return items.length ? items : [createTextItem()];
}

function itemsToBulletLinesText(items) {
  return sanitizeTextList(items)
    .map((item) => `\u2022 ${item.texte}`)
    .join("\n");
}

function parseBulletLinesText(value) {
  const items = String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*\u2022]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => createTextItem(line));
  return items.length ? items : [createTextItem()];
}

function renderCommitmentEditors() {
  if (!dom.commitmentEditors) {
    return;
  }

  dom.commitmentEditors.innerHTML = `
    <section class="editor-card editor-card--commitments">
      <div class="editor-card__header">
        <div>
          <h3>Engagements par point de vue</h3>
          <p>Ces trois cadres structurent les pages A4 et les posters A3.</p>
        </div>
      </div>
      <div class="commitment-grid">
        ${COMMITMENT_SECTIONS.map((section) => renderCommitmentSectionEditor(section)).join("")}
      </div>
    </section>
  `;
}

function renderCommitmentSectionEditor(section) {
  const items = state.commitments[section.key] || [createTextItem()];

  return `
    <section class="section-block commitment-section">
      <h4>${escapeHtml(section.title)}</h4>
      <p class="section-help">${escapeHtml(section.description)}</p>
      <label class="field field--full value-bullet-editor">
        <span>Liste a puces</span>
        <textarea rows="10" data-commitment-text data-commitment-key="${section.key}">${escapeHtml(
          itemsToBulletLinesText(items)
        )}</textarea>
      </label>
    </section>
  `;
}

function handleCommitmentEditorClick(event) {
  return;
}

function handleCommitmentEditorInput(event) {
  const input = event.target;
  if (input.dataset.commitmentText !== undefined) {
    const key = input.dataset.commitmentKey;
    state.commitments[key] = parseBulletLinesText(input.value);
    renderPreview();
    renderAdvisories();
    queueAutosave();
    return;
  }

  if (!input.dataset.commitmentField) {
    return;
  }

  const key = input.dataset.commitmentKey;
  const index = Number(input.dataset.itemIndex);
  state.commitments[key][index].texte = input.value;
  renderPreview();
  renderAdvisories();
  queueAutosave();
}

function handleCommitmentEditorKeydown(event) {
  const textarea = event.target.closest("textarea[data-commitment-text]");
  if (!textarea || event.key !== "Enter" || event.shiftKey || event.isComposing) {
    return;
  }

  event.preventDefault();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.setRangeText("\n• ", start, end, "end");
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function renderPreview() {
  const snapshot = buildSnapshot();
  const palette = getPaletteById(snapshot.options.palette_graphique);
  dom.preview.className = `charte-document format-a4 font-${snapshot.options.police_document}`;
  dom.preview.setAttribute("style", buildPaletteCssVars(palette));
  dom.preview.innerHTML = buildCharterMarkup(snapshot, palette);
}

function renderAdvisories() {
  const validation = getValidationState(buildSnapshot());
  dom.formWarnings.style.display = validation.warnings.length ? "block" : "none";
  dom.formWarnings.innerHTML = validation.warnings.length
    ? `<strong>Conseils utiles avant impression :</strong><ul>${validation.warnings
        .map((warning) => `<li>${escapeHtml(warning)}</li>`)
        .join("")}</ul>`
    : "";
}

function buildSnapshot() {
  return {
    applicationVersion: APP_VERSION,
    dateCreation: state.createdAt || new Date().toISOString(),
    versionCharte: normalizeCharterVersion(state.info.charterVersion),
    format: state.format,
    paletteGraphique: state.info.paletteId,
    service: {
      nom: state.info.serviceName.trim(),
      version: normalizeCharterVersion(state.info.charterVersion),
      dateValidation: state.info.validationDate,
      introduction: state.info.introText.trim() || DEFAULT_INTRO,
      logo: {
        dataUrl: state.info.logoDataUrl,
        name: state.info.logoName,
        type: state.info.logoType,
      },
    },
    options: {
      inclure_definitions_completes: Boolean(state.info.includeFullDefinitions),
      palette_graphique: state.info.paletteId,
      police_document: state.info.fontChoice,
    },
    phraseFinaleEngagement: state.info.finalEngagement.trim() || DEFAULT_FINAL_ENGAGEMENT,
    engagements: COMMITMENT_SECTIONS.reduce((accumulator, section) => {
      accumulator[section.key] = sanitizeTextList(state.commitments[section.key]);
      return accumulator;
    }, {}),
    valuesRetenues: state.selectedValues
      .map((valueId) => {
        const value = getValueById(valueId);
        const entry = state.valueEntries[valueId];
        if (!value || !entry) {
          return null;
        }
        return {
          id: value.id,
          nom: value.nom,
          definition_complete: value.definition_complete,
          definition_courte: value.definition_courte,
          phrases_synthetiques: value.phrases_synthetiques,
          items: sanitizeTextList(entry.items),
        };
      })
      .filter(Boolean),
  };
}

function sanitizeTextList(items) {
  return (items || [])
    .map((item) => createTextItem(item?.texte || item?.text || item))
    .filter((item) => item.texte.trim());
}

function sanitizeBehaviorList(items) {
  return (items || [])
    .map((item) => createBehaviorItem(item?.texte, item?.exemple))
    .filter((item) => item.texte.trim());
}

function getValidationState(snapshot) {
  const errors = [];
  const warnings = [];

  if (!snapshot.service.nom) {
    errors.push("Veuillez saisir le nom du service.");
  }

  if (snapshot.valuesRetenues.length !== 3) {
    errors.push("Veuillez retenir exactement 3 valeurs.");
  }

  if (snapshot.valuesRetenues.some((value) => value.items.length === 0)) {
    errors.push("Pour chaque valeur, renseignez au moins une ligne d'engagement concret.");
  }

  COMMITMENT_SECTIONS.forEach((section) => {
    if (!snapshot.engagements[section.key]?.length) {
      errors.push(`Renseignez au moins une ligne dans "${section.title}".`);
    }
  });

  return { errors, warnings };
}

function showValidationState(validation) {
  dom.formErrors.style.display = validation.errors.length ? "block" : "none";
  dom.formErrors.innerHTML = validation.errors.length
    ? `<strong>Verifications a corriger :</strong><ul>${validation.errors
        .map((error) => `<li>${escapeHtml(error)}</li>`)
        .join("")}</ul>`
    : "";

  dom.formWarnings.style.display = validation.warnings.length ? "block" : "none";
  dom.formWarnings.innerHTML = validation.warnings.length
    ? `<strong>Conseils utiles avant impression :</strong><ul>${validation.warnings
        .map((warning) => `<li>${escapeHtml(warning)}</li>`)
        .join("")}</ul>`
    : "";

  if (validation.errors.length) {
    setStatus("Certaines informations obligatoires sont manquantes. Corrigez-les avant de poursuivre.", "error");
    return false;
  }

  if (validation.warnings.length) {
    setStatus("La charte peut être exportée, mais quelques rubriques facultatives restent à compléter.", "warning");
  }

  return true;
}

function buildCharterMarkup(snapshot, palette) {
  const isA4 = snapshot.format === "a4";
  return isA4 ? buildA4Markup(snapshot, palette) : buildPosterMarkup(snapshot, palette);
}

function buildA4Markup(snapshot) {
  const includeFullDefinitions = snapshot.options.inclure_definitions_completes;
  const valuesMarkup = snapshot.valuesRetenues.length
      ? snapshot.valuesRetenues
        .map((value, index) => buildA4ValueMarkup(value, index, includeFullDefinitions, snapshot.service))
        .join("")
    : '<div class="charte-document__empty">Sélectionnez 3 valeurs puis renseignez au moins une ligne pour chaque valeur.</div>';

  return `
    <section class="a4-page a4-page--cover">
      ${buildA4CoverMarkup(snapshot)}
    </section>
    <section class="a4-page a4-page--values">
      <header class="content-page__header">
        <h2>Nos valeurs en action</h2>
        <p class="content-page__service-text">${escapeHtml(snapshot.service.introduction || DEFAULT_INTRO)}</p>
      </header>
      <div class="charte-document__grid">${valuesMarkup}</div>
    </section>
    <section class="a4-page a4-page--commitments">
      ${buildCommitmentFramesMarkup(snapshot, "a4", snapshot.phraseFinaleEngagement)}
    </section>
  `;
}

function buildA4CoverMarkup(snapshot) {
  return `
    ${buildDocumentBannerMarkup(snapshot.service)}
    <main class="cover-main">
      <div class="cover-title-block">
        <p class="cover-title-block__eyebrow">${escapeHtml(snapshot.service.nom || "Nom du service")}</p>
        <h1 class="cover-page__title">Charte des règles de bonne conduite et de courtoisie</h1>
        <p class="cover-page__subtitle">Un cadre partagé pour faire vivre nos valeurs au quotidien${snapshot.service.dateValidation ? `<br>${escapeHtml(formatDate(snapshot.service.dateValidation))}` : ""}</p>
      </div>
      <figure class="cover-values-figure">
        ${buildValuesFrameworkMarkup(snapshot)}
      </figure>
    </main>
  `;
}

function buildA4ValueMarkup(value, index, includeFullDefinitions, service) {
  const listMarkup = buildTextListMarkup(value.items, true);
  const completeDefinition = personalizeCompleteDefinition(value, service);

  return `
    <article class="value-card">
      <div class="value-card-header">
        ${buildValueIconMarkup(value)}
        <div class="value-card-header__text">
          <h2>${escapeHtml(value.nom)}</h2>
          <p class="value-short-definition">${escapeHtml(value.definition_courte)}</p>
        </div>
      </div>
      ${
        includeFullDefinitions
          ? `<div class="charte-definition-complete"><h3>Définition complète</h3><p>${escapeHtml(
              completeDefinition
            )}</p></div>`
          : ""
      }
      ${
        listMarkup
          ? `<section class="value-action-list"><h3>${escapeHtml(VALUE_LIST_LABEL)}</h3><ul class="charte-list">${listMarkup}</ul></section>`
          : ""
      }
    </article>
  `;
}

function personalizeCompleteDefinition(value, service) {
  const definition = value.definition_complete || "";
  if (value.id !== "solidarite") {
    return definition;
  }

  const serviceName = normalizeText(service?.nom || "");
  if (!serviceName) {
    return definition;
  }

  return definition
    .replace(/Le p[oô]le comptabilit[eé] de la recette interr[eé]gionale/gi, `Le service ${serviceName}`)
    .replace(/Le pole comptabilite de la recette interregionale/gi, `Le service ${serviceName}`)
    .replace(/la recette interr[eé]gionale/gi, `le service ${serviceName}`)
    .replace(/la recette interregionale/gi, `le service ${serviceName}`);
}

function buildPosterMarkup(snapshot) {
  if (snapshot.format === "a3") {
    return buildA3PosterMarkup(snapshot);
  }

  const valuesMarkup = snapshot.valuesRetenues.length
    ? snapshot.valuesRetenues.map((value, index) => buildPosterValueMarkup(value, index)).join("")
    : '<div class="charte-document__empty">Sélectionnez 3 valeurs puis renseignez au moins une ligne pour chaque valeur.</div>';

  return `
    <header class="poster-header">
      ${buildDocumentBannerMarkup(snapshot.service)}
      <div class="poster-header__title">
        <p class="poster-header__eyebrow">${escapeHtml(snapshot.service.nom || "Service")}</p>
        <h2>Charte des règles de bonne conduite et de courtoisie</h2>
        <p>Un cadre partagé pour faire vivre nos valeurs au quotidien</p>
      </div>
    </header>
    ${buildValuesFrameworkMarkup(snapshot, true)}
    <div class="charte-document__grid">${valuesMarkup}</div>
    ${buildCommitmentFramesMarkup(snapshot, "poster", snapshot.phraseFinaleEngagement)}
  `;
}

function buildA3PosterMarkup(snapshot) {
  const orderedValues = sortValuesBySchemaOrder(snapshot.valuesRetenues);
  const valuesMarkup = orderedValues.length
    ? orderedValues.map((value, index) => buildA3ValueMarkup(value, index)).join("")
    : '<div class="charte-document__empty">Sélectionnez 3 valeurs puis renseignez au moins une ligne pour chaque valeur.</div>';

  return `
    <header class="poster-header poster-header--a3">
      ${buildDocumentBannerMarkup(snapshot.service)}
    </header>
    <section class="a3-poster-layout a3-poster-layout--balanced">
      <div class="a3-poster-layout__main">
        <div class="poster-header__title a3-schema-title">
          <p class="poster-header__eyebrow">${escapeHtml(snapshot.service.nom || "Service")}</p>
          <h2>Charte des règles de bonne conduite et de courtoisie</h2>
          <p>Un cadre partagé pour faire vivre nos valeurs au quotidien${snapshot.service.dateValidation ? `<br>${escapeHtml(formatDate(snapshot.service.dateValidation))}` : ""}</p>
        </div>
        <div class="a3-poster-layout__schema">
          ${buildValuesFrameworkMarkup(snapshot, true)}
        </div>
        ${buildCommitmentFramesMarkup(snapshot, "a3", snapshot.phraseFinaleEngagement)}
      </div>
      <section class="a3-values-section">
        ${buildA3ValuesHeadingMarkup()}
        <div class="a3-poster-layout__values">${valuesMarkup}</div>
      </section>
    </section>
  `;
}

function buildA3ValuesHeadingMarkup() {
  return `
    <header class="a3-section-heading">
      <h2>Nos valeurs en action</h2>
      <p>Trois repères choisis par le service, traduits en engagements concrets.</p>
    </header>
  `;
}

function buildA3ValueMarkup(value, index) {
  const items = buildTextListMarkup(value.items, false);
  const accentColor = getValueAccentColor(index);
  const denseClass = (value.items || []).length >= 5 ? " a3-value-card--dense" : "";

  return `
    <article class="a3-value-card${denseClass}" data-value-id="${escapeAttribute(value.id)}" style="--value-accent:${accentColor}">
      <div class="a3-value-card__intro">
        <div class="a3-value-card__title">
          ${buildValueIconMarkup(value)}
          <h2>${escapeHtml(value.nom)}</h2>
        </div>
        <p>${escapeHtml(value.definition_courte)}</p>
      </div>
      <div class="a3-value-card__items">
        ${items ? `<ul class="charte-list">${items}</ul>` : ""}
      </div>
    </article>
  `;
}

function buildPosterValueMarkup(value, index) {
  const items = buildTextListMarkup(value.items.slice(0, 4), false);

  return `
    <article class="value-card value-card--poster">
      <div class="value-card-header">
        ${buildValueIconMarkup(value)}
        <div class="value-card-header__text">
          <h2>${escapeHtml(value.nom)}</h2>
          <p class="value-short-definition">${escapeHtml(value.definition_courte)}</p>
        </div>
      </div>
      ${items ? `<ul class="charte-list value-action-list value-action-list--poster">${items}</ul>` : ""}
    </article>
  `;
}

function buildSyntheticsMarkup(phrases) {
  const items = (phrases || []).slice(0, 2);
  if (!items.length) {
    return "";
  }

  return `<div class="value-synthetic-phrases">${items
    .map((phrase) => `<span class="charte-synthetic-pill">${escapeHtml(phrase)}</span>`)
    .join("")}</div>`;
}

function buildValuesFrameworkMarkup(snapshot, compact = false) {
  const svgMarkup = buildGlobalValuesSvgMarkup(snapshot);
  if (svgMarkup) {
    return `<section class="values-framework-svg${compact ? " values-framework-svg--compact" : ""}">${svgMarkup}</section>`;
  }

  const selectedIds = new Set(snapshot.valuesRetenues.map((value) => value.id));
  const selectedById = new Map(snapshot.valuesRetenues.map((value) => [value.id, value]));
  const catalog = state.valuesCatalog.length ? state.valuesCatalog : snapshot.valuesRetenues;
  const cells = catalog
    .slice(0, 9)
    .map((value, index) => {
      const selected = selectedIds.has(value.id);
      const selectedValue = selectedById.get(value.id) || value;
      const phrase = selectedValue.phrases_synthetiques?.[0] || selectedValue.definition_courte;
      return `
        <article class="values-framework__cell${selected ? " is-selected" : ""}" style="--cell-color:${getValueAccentColor(index)}">
          <span class="values-framework__icon">${buildValueIconMarkup(value, true) || index + 1}</span>
          <h3>${escapeHtml(value.nom)}</h3>
          ${selected ? `<p>${escapeHtml(phrase)}</p>` : ""}
        </article>
      `;
    })
    .join("");

  return `<section class="values-framework${compact ? " values-framework--compact" : ""}">${cells}</section>`;
}

function buildGlobalValuesSvgMarkup(snapshot) {
  const svgText = normalizeText(state.assets.valuesChartSvgText);
  if (!svgText) {
    console.warn("Le schéma SVG des 9 valeurs n'est pas disponible. Affichage du schéma alternatif.");
    return "";
  }

  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") {
    console.warn("DOMParser ou XMLSerializer indisponible. Affichage du schéma SVG brut.");
    return buildRawValuesSvgMarkup(svgText);
  }

  try {
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgText, "image/svg+xml");
    if (svgDocument.querySelector("parsererror")) {
      console.warn("Le schéma SVG des 9 valeurs n'a pas pu être interprété. Affichage du schéma SVG brut.");
      return buildRawValuesSvgMarkup(svgText);
    }

    const svg = svgDocument.querySelector("svg");
    if (!svg) {
      console.warn("Le schéma SVG des 9 valeurs ne contient pas d'élément <svg>. Affichage du schéma SVG brut.");
      return buildRawValuesSvgMarkup(svgText);
    }

    const palette = getPaletteById(snapshot.options.palette_graphique) || getPaletteById(DEFAULT_PALETTE_ID) || FALLBACK_PALETTES[0];
    const activeColors = [palette.primary, palette.secondary, palette.accent].filter(Boolean);
    const mutedColor = palette.mutedText || "#9AA0A6";
    const selectedById = new Map(
      sortValuesBySchemaOrder(snapshot.valuesRetenues).map((value, index) => [value.id, { value, index }])
    );
    const isA3Schema = snapshot.format === "a3";
    const valueById = new Map([
      ...state.valuesCatalog.map((value) => [value.id, value]),
      ...snapshot.valuesRetenues.map((value) => [value.id, value]),
    ]);

    addSvgClass(svg, "values-framework-svg__image");
    setSvgStyleProperty(svg, "--schema-muted", mutedColor);
    setSvgBackgroundTransparent(svg);

    SVG_VALUE_IDS.forEach((valueId) => {
      const group = findSvgElement(svg, `valeur-${valueId}`);
      if (!group) {
        return;
      }

      const selected = selectedById.get(valueId);
      const value = selected?.value || valueById.get(valueId) || { id: valueId, nom: valueId, phrases_synthetiques: [] };
      const color = selected ? activeColors[selected.index] || palette.primary : mutedColor;

      normalizeSvgValueGroup(group, valueId);
      applySvgIconColor(group, valueId, color);
      removeSvgClass(group, "is-selected");
      removeSvgClass(group, "is-muted");
      addSvgClass(group, selected ? "is-selected" : "is-muted");
      setSvgStyleProperty(group, "--value-color", color);

      if (selected) {
        group.setAttribute("data-selection-index", String(selected.index));
      } else {
        group.removeAttribute("data-selection-index");
      }

      updateSvgValueTexts(svgDocument, group, valueId, value, Boolean(selected), isA3Schema);
    });

    if (snapshot.format !== "a4") {
      reflowSvgValueRows(svg, selectedById, snapshot.format);
    }
    appendSchemaStyle(svgDocument, svg, isA3Schema);
    return new XMLSerializer().serializeToString(svg);
  } catch (error) {
    console.warn("La mise à jour dynamique du schéma SVG a échoué. Affichage du schéma SVG brut.", error);
    return buildRawValuesSvgMarkup(svgText);
  }
}

function reflowSvgValueRows(svg, selectedById, format) {
  const isA3 = format === "a3";
  const mutedRowHeight = isA3 ? 54 : 72;
  const rowHeights = SVG_VALUE_IDS.map((valueId) => {
    if (!selectedById.has(valueId)) {
      return mutedRowHeight;
    }
    if (!isA3) {
      return 120;
    }
    const phraseLineCount = getSvgSelectedPhraseLineCount(selectedById.get(valueId)?.value);
    return Math.max(136, 64 + phraseLineCount * 20 + 32);
  });
  const totalHeight = rowHeights.reduce((total, height) => total + height, 0);
  let cursor = Math.max(28, (1000 - totalHeight) / 2);

  const logoCenterX = 220;
  const logoCenterY = 500;
  const logoRadius = 103;
  const nodeX = isA3 ? 410 : 460;
  const iconCenterX = isA3 ? 500 : 550;
  const textX = isA3 ? 570 : 620;
  const viewBoxWidth = isA3 ? 960 : 1440;
  const viewBoxY = isA3 ? 76 : 92;
  const viewBoxHeight = isA3 ? 848 : 816;

  svg.setAttribute("viewBox", `100 ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
  svg.setAttribute("width", String(viewBoxWidth));
  svg.setAttribute("height", String(viewBoxHeight));

  const logoClip = svg.querySelector("#clip-ecusson-central circle");
  if (logoClip) {
    logoClip.setAttribute("cx", String(logoCenterX));
    logoClip.setAttribute("cy", String(logoCenterY));
    logoClip.setAttribute("r", String(logoRadius));
  }
  const logoImage = findSvgElement(svg, "image-ecusson-douanes");
  if (logoImage) {
    const logoSize = logoRadius * 2;
    logoImage.setAttribute("x", String(logoCenterX - logoRadius));
    logoImage.setAttribute("y", String(logoCenterY - logoRadius));
    logoImage.setAttribute("width", String(logoSize));
    logoImage.setAttribute("height", String(logoSize));
  }

  SVG_VALUE_IDS.forEach((valueId, index) => {
    const group = findSvgElement(svg, `valeur-${valueId}`);
    if (!group) {
      cursor += rowHeights[index];
      return;
    }

    const selected = selectedById.has(valueId);
    const centerY = cursor + rowHeights[index] / 2;
    const connector = findSvgElement(group, `liaison-${valueId}`);
    if (connector) {
      const deltaX = nodeX - logoCenterX;
      const deltaY = centerY - logoCenterY;
      const distance = Math.hypot(deltaX, deltaY) || 1;
      const startX = logoCenterX + (deltaX / distance) * logoRadius;
      const startY = logoCenterY + (deltaY / distance) * logoRadius;
      connector.setAttribute(
        "points",
        `${startX.toFixed(1)},${startY.toFixed(1)} ${nodeX},${centerY} ${iconCenterX - (selected ? (isA3 ? 38 : 45) : (isA3 ? 14 : 32))},${centerY}`
      );
    }

    const directCircles = Array.from(group.children).filter((element) => element.tagName.toLowerCase() === "circle");
    if (directCircles[0]) {
      directCircles[0].setAttribute("cx", String(nodeX));
      directCircles[0].setAttribute("cy", String(centerY));
      directCircles[0].setAttribute("r", selected ? "8" : isA3 ? "3.5" : "5.5");
    }
    if (directCircles[1]) {
      directCircles[1].setAttribute("cx", String(iconCenterX));
      directCircles[1].setAttribute("cy", String(centerY));
      directCircles[1].setAttribute("r", selected ? (isA3 ? "40" : "45") : (isA3 ? "14" : "32"));
    }

    const icon = findSvgElement(group, `icone-${valueId}`);
    if (icon) {
      const iconSize = selected ? (isA3 ? 62 : 72) : (isA3 ? 22 : 50);
      icon.setAttribute("x", String(iconCenterX - iconSize / 2));
      icon.setAttribute("y", String(centerY - iconSize / 2));
      icon.setAttribute("width", String(iconSize));
      icon.setAttribute("height", String(iconSize));
    }

    const title = findSvgElement(group, `nom-${valueId}`);
    const selectedValue = selectedById.get(valueId);
    const phraseLineCount = selected && isA3 ? getSvgSelectedPhraseLineCount(selectedValue?.value) : 0;
    // Centre le bloc titre + phrases entre les valeurs grisées précédente et suivante.
    const selectedTitleOffset = isA3 ? -(10 * phraseLineCount + 4) : -13;
    if (title) {
      title.setAttribute("x", String(textX));
      title.setAttribute("y", String(centerY + (selected ? selectedTitleOffset : isA3 ? 5 : 7)));
    }
    const copy = findSvgElement(group, `phrases-${valueId}`);
    if (copy) {
      copy.setAttribute("x", String(textX));
      copy.setAttribute("y", String(centerY + (isA3 ? selectedTitleOffset + 34 : 13)));
      copy.querySelectorAll("tspan").forEach((tspan) => tspan.setAttribute("x", String(textX)));
    }

    cursor += rowHeights[index];
  });
}

function getSvgSelectedPhraseLineCount(value) {
  return Math.max(
    1,
    normalizeStringList(value?.phrases_synthetiques || [])
      .slice(0, 2)
      .flatMap((phrase) => wrapSvgPhrase(phrase, 42)).length
  );
}

function buildRawValuesSvgMarkup(svgText) {
  return svgText;
}

function findSvgElement(root, id) {
  return root?.querySelector?.(`[id="${id}"]`) || null;
}

function getSvgClasses(element) {
  return new Set(normalizeText(element?.getAttribute("class") || "").split(/\s+/).filter(Boolean));
}

function setSvgClasses(element, classes) {
  if (!element) {
    return;
  }
  element.setAttribute("class", Array.from(classes).join(" "));
}

function addSvgClass(element, className) {
  const classes = getSvgClasses(element);
  classes.add(className);
  setSvgClasses(element, classes);
}

function removeSvgClass(element, className) {
  const classes = getSvgClasses(element);
  classes.delete(className);
  setSvgClasses(element, classes);
}

function setSvgStyleProperty(element, property, value) {
  if (!element) {
    return;
  }
  if (element.style?.setProperty) {
    element.style.setProperty(property, value);
    return;
  }
  const existing = normalizeText(element.getAttribute("style") || "");
  const declarations = existing
    .split(";")
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration && !declaration.startsWith(`${property}:`));
  declarations.push(`${property}: ${value}`);
  element.setAttribute("style", declarations.join("; "));
}

function setSvgBackgroundTransparent(svg) {
  const background = findSvgElement(svg, "fond") || svg.querySelector("rect");
  if (background) {
    background.setAttribute("fill", "none");
    background.removeAttribute("stroke");
  }
}

function normalizeSvgValueGroup(group, valueId) {
  addSvgClass(group, "value-row");

  const connector = findSvgElement(group, `liaison-${valueId}`);
  if (connector) {
    addSvgClass(connector, "connector");
  }

  const directCircles = Array.from(group.children).filter((element) => element.tagName.toLowerCase() === "circle");
  if (directCircles[0]) {
    addSvgClass(directCircles[0], "node");
  }
  if (directCircles[1]) {
    addSvgClass(directCircles[1], "icon-ring");
  }

  const icon = findSvgElement(group, `icone-${valueId}`);
  if (icon) {
    addSvgClass(icon, "value-icon");
  }

  const title = findSvgElement(group, `nom-${valueId}`);
  if (title) {
    addSvgClass(title, "value-title");
  }

  const copy = findSvgElement(group, `phrases-${valueId}`);
  if (copy) {
    addSvgClass(copy, "value-copy");
  }
}

function applySvgIconColor(group, valueId, color) {
  const icon = findSvgElement(group, `icone-${valueId}`);
  if (!icon) {
    return;
  }

  icon.setAttribute("color", color);
  icon.setAttribute("visibility", "visible");
  icon.setAttribute("opacity", "1");
  Array.from(icon.querySelectorAll("path, circle, rect, polygon, polyline, line")).forEach((node) => {
    if (node.getAttribute("fill") !== "none") {
      node.setAttribute("fill", color);
    }
    if (node.hasAttribute("stroke") && node.getAttribute("stroke") !== "none") {
      node.setAttribute("stroke", color);
    }
  });
}

function updateSvgValueTexts(svgDocument, group, valueId, value, isSelected, isA3Schema) {
  const titleElement = findSvgElement(group, `nom-${valueId}`);
  if (titleElement) {
    titleElement.textContent = normalizeText(value.nom || valueId).toUpperCase();
  }

  const groupTitle = group.querySelector("title");
  if (groupTitle) {
    groupTitle.textContent = normalizeText(value.nom || valueId);
  }

  const copyElement = findSvgElement(group, `phrases-${valueId}`);
  if (!copyElement) {
    return;
  }

  const x = copyElement.getAttribute("x") || copyElement.querySelector("tspan")?.getAttribute("x") || titleElement?.getAttribute("x") || "0";
  while (copyElement.firstChild) {
    copyElement.removeChild(copyElement.firstChild);
  }

  if (!isSelected) {
    return;
  }

  const phrases = normalizeStringList(value.phrases_synthetiques || value.phrasesSynthetiques || []).slice(0, 2);
  const lines = isA3Schema ? phrases.flatMap((phrase) => wrapSvgPhrase(phrase, 42)) : phrases;

  lines.forEach((phrase, index) => {
      const tspan = svgDocument.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", x);
      tspan.setAttribute("dy", index === 0 ? "0" : isA3Schema ? "20" : "21");
      tspan.textContent = phrase;
      copyElement.appendChild(tspan);
  });
}

function wrapSvgPhrase(phrase, maxLength) {
  const words = normalizeText(phrase).split(/\s+/).filter(Boolean);
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

function appendSchemaStyle(svgDocument, svg, isA3Schema) {
  svg.querySelector("#schema-dynamic-style")?.remove();
  const style = svgDocument.createElementNS("http://www.w3.org/2000/svg", "style");
  style.setAttribute("id", "schema-dynamic-style");
  style.textContent = `
    svg {
      width: 100%;
      height: auto;
      display: block;
      background: transparent;
      --schema-muted: #9AA0A6;
    }
    svg > rect:first-child,
    svg > .background,
    svg > #background,
    svg > #fond {
      fill: transparent !important;
      stroke: none !important;
    }
    .value-row {
      --value-color: var(--schema-muted);
      transition: opacity 180ms ease;
    }
    .value-row .connector {
      stroke: var(--value-color) !important;
    }
    .value-row .node {
      fill: var(--value-color) !important;
    }
    .value-row .icon-ring {
      fill: #FFFFFF !important;
      stroke: var(--value-color) !important;
    }
    .value-row .value-icon {
      color: var(--value-color) !important;
    }
    .value-row .value-icon,
    .value-row .value-icon * {
      fill: currentColor !important;
      stroke: currentColor !important;
    }
    .value-row .value-title {
      fill: var(--value-color) !important;
      font-family: var(--doc-title-font, "Marianne", Arial, sans-serif) !important;
      font-size: ${isA3Schema ? "40px" : "25px"} !important;
      font-weight: 700 !important;
    }
    .value-row .value-copy {
      fill: var(--doc-text) !important;
      font-family: var(--doc-body-font, "Marianne", Arial, sans-serif) !important;
      font-size: ${isA3Schema ? "20px" : "19px"} !important;
      font-weight: 400 !important;
    }
    .value-row.is-selected {
      opacity: 1;
    }
    .value-row.is-muted {
      opacity: ${isA3Schema ? "0.56" : "0.42"};
    }
    .value-row.is-muted .value-copy {
      display: none;
    }
  `;
  svg.appendChild(style);
}

function getValueAccentColor(index) {
  const palette = getPaletteById(state.info.paletteId) || FALLBACK_PALETTES[0];
  const colors = (palette.swatches || []).map((swatch) => swatch.color).filter(Boolean);
  return colors[index % Math.max(colors.length, 1)] || palette.primary || "#102B44";
}

function buildCommitmentFramesMarkup(snapshot, mode, subtitle = "") {
  const frames = COMMITMENT_SECTIONS.map((section) => {
    const items = snapshot.engagements[section.key] || [];
    if (!items.length) {
      return "";
    }
    return `
      <section class="commitment-frame commitment-frame--${section.key}">
        <h2>${escapeHtml(section.title)}</h2>
        <ul class="charte-list">${buildTextListMarkup(items, false)}</ul>
      </section>
    `;
  })
    .filter(Boolean)
    .join("");

  if (!frames) {
    return "";
  }

  return `
    <section class="commitment-frames commitment-frames--${mode}">
      <header class="content-page__header commitment-frames__header">
        <h2>Nos engagements communs</h2>
        ${subtitle ? `<p class="commitment-frames__subtitle">${escapeHtml(subtitle)}</p>` : ""}
      </header>
      <div class="commitment-frames__grid">${frames}</div>
    </section>
  `;
}

function buildTextListMarkup(items) {
  return items
    .map(
      (item) => `
        <li class="charte-item">
          <p class="charte-item__texte">${escapeHtml(item.texte)}</p>
        </li>
      `
    )
    .join("");
}

function buildValueIconMarkup(value, compact = false) {
  const source = state.assets.icons?.[value.id] || VALUE_ICON_PATHS[value.id] || "";
  if (!source) {
    return "";
  }
  const className = compact ? "value-icon value-icon--compact" : "value-icon";
  return `<span class="${className}"><img src="${escapeAttribute(source)}" alt="" aria-hidden="true"></span>`;
}

function buildInstitutionLogoMarkup() {
  return `
    <div class="institution-logo">
      ${buildAssetImageMarkup(state.assets.douanesLogo, "Logo Douanes et Droits indirects")}
    </div>
  `;
}

function buildDocumentBannerMarkup(service, extraClass = "") {
  return `
    <header class="document-banner${extraClass ? ` ${extraClass}` : ""}">
      <div class="document-banner__logo document-banner__logo--left">${buildInstitutionLogoMarkup()}</div>
      <div class="document-banner__center">
        <strong>Direction interrégionale</strong>
        <span>Occitanie</span>
      </div>
      <div class="document-banner__logo document-banner__logo--right">${buildServiceLogoMarkup(service.logo)}</div>
    </header>
  `;
}

function buildServiceLogoMarkup(logo) {
  const dataUrl = typeof logo === "string" ? logo : logo?.dataUrl;
  if (!dataUrl) {
    return "";
  }

  return `
    <div class="service-logo">
      <img src="${escapeAttribute(dataUrl)}" alt="Logo du service">
    </div>
  `;
}

function buildAssetImageMarkup(source, alt) {
  if (!source) {
    return "";
  }
  return `<img src="${source}" alt="${escapeAttribute(alt)}">`;
}

function buildPaletteCssVars(palette) {
  const active = palette || getPaletteById(DEFAULT_PALETTE_ID) || FALLBACK_PALETTES[0];
  const fontChoice = normalizeFontChoice(state.info.fontChoice);
  const bodyFont = fontChoice === "spectral" ? '"Spectral", Georgia, serif' : '"Marianne", Arial, sans-serif';
  const titleFont = fontChoice === "spectral" ? '"Spectral", Georgia, serif' : '"Marianne", Arial, sans-serif';
  return [
    `--doc-primary: ${active.primary}`,
    `--doc-secondary: ${active.secondary}`,
    `--doc-accent: ${active.accent}`,
    `--doc-soft-bg: ${active.softBackground}`,
    `--doc-panel-bg: ${active.panelBackground}`,
    `--doc-border: ${active.border}`,
    `--doc-text: ${active.text}`,
    `--doc-muted-text: ${active.mutedText}`,
    `--schema-muted: ${active.mutedText || "#9AA0A6"}`,
    `--doc-body-font: ${bodyFont}`,
    `--doc-title-font: ${titleFont}`,
  ].join("; ");
}

function setFormat(format) {
  state.format = normalizeFormat(format);
  applyFormat(state.format);
  renderPreview();
  queueAutosave();
}

function applyFormat(format) {
  document.body.classList.remove("format-a4", "format-a3", "print-a4", "print-a3");
  document.body.classList.add(`format-${format}`, `print-${format}`);
  dom.preview.classList.remove("format-a4", "format-a3");
  dom.preview.classList.add(`format-${format}`);
  dom.formatButtons.forEach((button) => {
    const isActive = button.dataset.format === format;
    button.setAttribute("aria-pressed", String(isActive));
  });
  dom.printPageStyle.textContent = FORMAT_RULES[format] || FORMAT_RULES.a4;
}

async function handleLogoUpload(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    state.info.logoDataUrl = dataUrl;
    state.info.logoName = file.name;
    state.info.logoType = file.type || detectMimeTypeFromName(file.name);
    renderLogoSummary();
    renderPreview();
    queueAutosave();
    setStatus("Le logo du service a été importé avec succès.", "success");
  } catch (error) {
    setStatus("Le logo du service n'a pas pu être chargé.", "error");
  } finally {
    dom.serviceLogo.value = "";
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function saveDraftManually() {
  saveDraft();
  setStatus("Le brouillon temporaire a été sauvegardé dans ce navigateur.", "success");
}

async function exportBundle() {
  const snapshot = buildSnapshot();
  const validation = getValidationState(snapshot);
  if (!showValidationState(validation)) {
    return;
  }
  saveDraft();

  const baseSnapshot = JSON.parse(JSON.stringify(snapshot));
  const baseName = buildExchangeBaseName(snapshot);

  const exportFiles = [
    {
      name: `${baseName}-echange.json`,
      content: JSON.stringify(baseSnapshot, null, 2),
      type: "application/json",
    },
    {
      name: `${baseName}-charte-a4.html`,
      content: buildStandaloneHtml({ ...baseSnapshot, format: "a4" }),
      type: "text/html",
    },
    {
      name: `${baseName}-poster-a3.html`,
      content: buildStandaloneHtml({ ...baseSnapshot, format: "a3" }),
      type: "text/html",
    },
    {
      name: `${baseName}-manifest.json`,
      content: JSON.stringify(buildExportManifest(baseSnapshot, baseName), null, 2),
      type: "application/json",
    },
    {
      name: `LISEZ-MOI-${baseName}.txt`,
      content: buildExportInstructions(baseSnapshot, baseName),
      type: "text/plain",
    },
  ];

  try {
    if (!window.fflate?.zipSync) {
      throw new Error("fflate indisponible");
    }
    const encoder = new TextEncoder();
    const files = {};
    for (const file of exportFiles) {
      files[`${baseName}/${file.name}`] = encoder.encode(file.content);
    }
    const zipped = window.fflate.zipSync(files, { level: 6 });
    await saveBlobWithPicker(
      `${baseName}-projet-charte.zip`,
      new Blob([zipped], { type: "application/zip" }),
      "application/zip"
    );
    setStatus("Le ZIP d'échange a été généré. Il contient le JSON complet et les HTML A4 et A3.", "success");
  } catch (error) {
    if (error?.name === "AbortError") {
      setStatus("Export ZIP annulé.", "info");
      return;
    }
    console.error(error);
    setStatus("Le ZIP d'export n'a pas pu être créé.", "error", true);
  }
}

async function importJson(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const payload = await readImportedCharterPayload(file);
    applyImportedData(payload);
    syncFormFromState();
    applyFormat(state.format);
    renderAll();
    queueAutosave();
    setStatus("La charte a été importée avec succès.", "success");
  } catch (error) {
    console.error(error);
    setStatus("Le fichier ZIP ou JSON n'a pas pu être importé. Vérifiez son contenu.", "error");
  } finally {
    dom.importJsonInput.value = "";
  }
}

async function readImportedCharterPayload(file) {
  const lowerName = String(file.name || "").toLowerCase();
  if (lowerName.endsWith(".zip") || file.type === "application/zip" || file.type === "application/x-zip-compressed") {
    if (!window.fflate?.unzipSync) {
      throw new Error("Import ZIP indisponible : fflate n'est pas chargé.");
    }
    const archive = window.fflate.unzipSync(new Uint8Array(await file.arrayBuffer()));
    const decoder = new TextDecoder("utf-8");
    const jsonPath = findExchangeJsonPath(Object.keys(archive));
    if (!jsonPath) {
      throw new Error("Aucun JSON d'échange trouvé dans le ZIP.");
    }
    return JSON.parse(decoder.decode(archive[jsonPath]));
  }

  return JSON.parse(await file.text());
}

function findExchangeJsonPath(paths) {
  const jsonPaths = paths.filter((path) => path.toLowerCase().endsWith(".json"));
  return (
    jsonPaths.find((path) => /(^|\/)[^/]*-echange\.json$/i.test(path)) ||
    jsonPaths.find((path) => /(^|\/)charte\.json$/i.test(path)) ||
    jsonPaths.find((path) => /(^|\/)[^/]*manifest\.json$/i.test(path) === false) ||
    jsonPaths[0] ||
    ""
  );
}

function exportHtml() {
  const snapshot = buildSnapshot();
  const validation = getValidationState(snapshot);
  if (!showValidationState(validation)) {
    return;
  }

  downloadFile(
    `${buildExchangeBaseName(snapshot)}.html`,
    buildStandaloneHtml(snapshot),
    "text/html;charset=utf-8"
  );
  setStatus("L'export HTML autonome est prêt.", "success");
}

function buildExportManifest(snapshot, baseName) {
  return {
    generatedAt: new Date().toISOString(),
    applicationVersion: APP_VERSION,
    charterVersion: snapshot.versionCharte || snapshot.service.version || "",
    service: snapshot.service.nom || "",
    exchangeName: `${snapshot.service.nom || "Charte"} ${snapshot.versionCharte || snapshot.service.version || ""}`.trim(),
    palette: snapshot.options.palette_graphique,
    formats: [
      `${baseName}-charte-a4.html`,
      `${baseName}-poster-a3.html`,
    ],
    exchangeFile: `${baseName}-echange.json`,
    note:
      "Pour collaborer, partagez le ZIP complet ou le fichier d'échange JSON. L'import accepte les deux formats.",
  };
}

function buildExportInstructions(snapshot, baseName) {
  return [
    `Export Chartes_Douane_Occitanie`,
    ``,
    `Service : ${snapshot.service.nom || "Non renseigné"}`,
    `Version de la charte : ${snapshot.versionCharte || snapshot.service.version || "v1"}`,
    `Nom d'échange : ${snapshot.service.nom || "Charte"} ${snapshot.versionCharte || snapshot.service.version || "v1"}`,
    `Date de validation : ${snapshot.service.dateValidation ? formatDate(snapshot.service.dateValidation) : "Non renseignée"}`,
    `Palette : ${snapshot.options.palette_graphique || DEFAULT_PALETTE_ID}`,
    ``,
    `Fichiers créés :`,
    `- ${baseName}-echange.json : fichier d'échange pour rouvrir la charte dans l'application`,
    `- ${baseName}-charte-a4.html : version A4 multipage imprimable`,
    `- ${baseName}-poster-a3.html : version A3 imprimable`,
    `- ${baseName}-manifest.json : résumé technique de l'export`,
    ``,
    `Pour obtenir les PDF :`,
    `1. Ouvrez chaque fichier HTML exporté dans un navigateur récent.`,
    `2. Lancez l'impression du navigateur.`,
    `3. Choisissez l'enregistrement en PDF.`,
    `4. Désactivez les en-têtes et pieds de page pour un rendu propre.`,
    ``,
    `Important :`,
    `Pour collaborer, partagez le ZIP complet ou le fichier ${baseName}-echange.json. L'import accepte les deux.`,
    `Dans Chrome ou Edge, l'application peut proposer de choisir l'emplacement du ZIP. Dans Firefox, le ZIP est placé dans le dossier de téléchargements configuré par le navigateur.`,
  ].join("\n");
}

function buildExchangeBaseName(snapshot = buildSnapshot()) {
  const servicePart = slugify(snapshot.service?.nom || state.info.serviceName || "charte");
  const versionPart = slugify(snapshot.versionCharte || snapshot.service?.version || state.info.charterVersion || "v1");
  return [servicePart, versionPart].filter(Boolean).join("-");
}

function normalizeCharterVersion(value) {
  const normalized = normalizeText(value || "v1");
  return normalized || "v1";
}

async function saveBlobWithPicker(filename, blob, mimeType) {
  if (typeof window.showSaveFilePicker === "function") {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "Archive ZIP",
            accept: { [mimeType || "application/zip"]: [".zip"] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        throw error;
      }
      console.warn("Sélecteur de fichier indisponible, téléchargement classique utilisé.", error);
    }
  }
  downloadBlob(filename, blob);
}

async function writeTextFileToDirectory(directoryHandle, filename, content) {
  const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

function buildStandaloneHtml(snapshot) {
  const palette = getPaletteById(snapshot.options.palette_graphique);
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Charte du bien vivre ensemble - ${escapeHtml(snapshot.service.nom || "Service")}</title>
  <style>
${buildStandaloneCss(snapshot.format)}
  </style>
</head>
<body class="format-${snapshot.format} print-${snapshot.format}">
  <div class="export-toolbar">
    <button type="button" onclick="window.print()">Imprimer / Enregistrer en PDF</button>
  </div>
  <article class="charte-document format-${snapshot.format} font-${snapshot.options.police_document}" style="${buildPaletteCssVars(palette)}">
    ${buildCharterMarkup(snapshot, palette)}
  </article>
</body>
</html>`;
}

function buildStandaloneCss(format) {
  const pageRule = FORMAT_RULES[normalizeFormat(format)] || FORMAT_RULES.a4;
  const documentWidth = format === "a3" ? "420mm" : "210mm";
  const documentMinHeight = "297mm";
  const documentPadding = format === "a3" ? "8mm" : "12mm";
  const titleSize = format === "a3" ? "24pt" : "26pt";
  const gridColumns = format === "a3" ? "repeat(3, minmax(0, 1fr))" : "1fr";
  return `
@font-face {
  font-family: "Marianne";
  src: url("data/fonts/Marianne/Marianne-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Marianne";
  src: url("data/fonts/Marianne/Marianne-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Marianne";
  src: url("data/fonts/Marianne/Marianne-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Spectral";
  src: url("data/fonts/Spectral/Spectral-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Spectral";
  src: url("data/fonts/Spectral/Spectral-SemiBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Spectral";
  src: url("data/fonts/Spectral/Spectral-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
${pageRule}
* { box-sizing: border-box; }
body { margin: 0; padding: 24px; background: #f3f4f6; color: #173046; font-family: "Marianne", Arial, sans-serif; }
.export-toolbar { display: flex; justify-content: center; margin-bottom: 16px; }
.export-toolbar button { min-height: 44px; padding: 10px 18px; border-radius: 999px; border: 1px solid #c7d4de; background: #fff; color: #0c4760; cursor: pointer; }
.charte-document, .charte-document p, .charte-document li, .charte-document dd, .charte-document dt { font-family: var(--doc-body-font, "Marianne", Arial, sans-serif); }
.charte-document h1, .charte-document h2, .charte-document h3, .charte-document h4 { font-family: var(--doc-title-font, "Spectral", Georgia, serif); color: var(--doc-primary); }
.charte-document {
  width: min(100%, ${documentWidth});
  min-height: ${documentMinHeight};
  margin: 0 auto;
  padding: ${documentPadding};
  border-radius: 20px;
  border: 1px solid var(--doc-border, #c5c5de);
  box-shadow: 0 24px 60px rgba(17, 45, 66, 0.13);
  background: linear-gradient(180deg, var(--doc-soft-bg, #f7f8ff) 0%, var(--doc-panel-bg, #ffffff) 100%);
  color: var(--doc-text, #1e1e1e);
}
.a4-page { min-height: ${format === "a4" ? "273mm" : "auto"}; break-after: ${format === "a4" ? "page" : "auto"}; page-break-after: ${format === "a4" ? "always" : "auto"}; }
.a4-page:last-child { break-after: auto; page-break-after: auto; }
.document-banner { display: grid; grid-template-columns: 52mm minmax(0, 1fr) 52mm; gap: 8mm; align-items: center; padding: 0 0 7mm; border-bottom: 1px solid var(--doc-border); }
.document-banner__logo--left { justify-self: start; }
.document-banner__logo--right { justify-self: end; }
.document-banner__center { display: grid; gap: 1mm; align-self: stretch; align-content: center; justify-items: center; text-align: center; line-height: 1; }
.document-banner__center strong { color: var(--doc-primary); font-size: 22pt; }
.document-banner__center span { color: var(--doc-secondary); font-size: 19pt; font-weight: 700; }
.cover-main { display: grid; gap: 8mm; padding: 8mm 0; }
.cover-title-block { max-width: 165mm; display: grid; gap: 3mm; }
.cover-title-block__eyebrow, .content-page__eyebrow, .poster-header__eyebrow { margin: 0; color: var(--doc-secondary); font-size: 9pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.cover-page__title { margin: 0; font-size: 31pt; line-height: 1.05; }
.cover-page__subtitle { margin: 0; font-size: 14pt; color: var(--doc-secondary); }
.cover-values-figure { margin: 0; }
.cover-values-figure .values-framework-svg { margin: 0; }
.cover-values-figure img { width: 100%; max-height: 128mm; object-fit: contain; }
.institution-logo img, .service-logo img { max-height: 21mm; width: auto; object-fit: contain; }
.cover-info-panel, .poster-header__identity { padding: 6mm; border-radius: 12px; background: var(--doc-soft-bg); border: 1px solid var(--doc-border); }
.cover-info-panel__top { display: grid; grid-template-columns: 1fr auto; gap: 8mm; align-items: center; }
.cover-info-panel__text { display: grid; gap: 3mm; margin-top: 4mm; padding-top: 4mm; border-top: 1px solid var(--doc-border); }
.identity-list { margin: 0; }
.identity-list__row + .identity-list__row { margin-top: 3.5mm; }
.identity-list dt {
  margin: 0 0 1.5mm;
  color: var(--doc-muted-text);
  font-size: 8.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.identity-list dd {
  margin: 0;
  color: var(--doc-text);
  font-size: 10.5pt;
  font-weight: 500;
}
.cover-page__lead, .cover-page__closing {
  margin: 0;
  color: var(--doc-text);
  font-size: 10.5pt;
  line-height: 1.45;
}
.cover-page__closing { font-weight: 600; }
.content-page__header {
  margin-bottom: 8mm;
  padding: 0 0 6mm;
  border-bottom: 1px solid var(--doc-border);
}
.commitment-frames__header {
  margin-bottom: ${format === "a3" ? "2.5mm" : "8mm"};
  padding-bottom: ${format === "a3" ? "2mm" : "6mm"};
}
.commitment-frames__header h2 { font-size: ${format === "a3" ? "13pt" : "20pt"}; }
.content-page__heading { display: grid; gap: 2mm; }
.content-page__header h2 {
  margin: 0;
  font-size: 20pt;
  line-height: 1.15;
}
.content-page__intro {
  display: grid;
  gap: 3mm;
  margin-top: 4mm;
}
.content-page__header p {
  margin: 0;
  font-size: 11pt;
  line-height: 1.45;
  color: var(--doc-text);
}
.content-page__service-text { color: var(--doc-muted-text); }
.poster-header {
  margin-bottom: 8mm;
  padding: 8mm;
  border-radius: 14px;
  border: 1px solid var(--doc-border);
  background: linear-gradient(180deg, var(--doc-panel-bg), var(--doc-soft-bg));
}
.poster-header__top {
  display: flex;
  justify-content: space-between;
  gap: 6mm;
  align-items: flex-start;
}
.poster-header__title {
  margin-top: 5mm;
  display: grid;
  gap: 2mm;
}
.poster-header__title h2 { margin: 0; font-size: ${titleSize}; line-height: 1.08; }
.poster-header__title p { margin: 0; color: var(--doc-muted-text); font-size: 12pt; line-height: 1.4; }
.values-framework { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5mm; margin: 7mm 0; }
.values-framework__cell { padding: 4.5mm; border-radius: 12px; border: 1px solid var(--doc-border); background: #efefef; color: #777; }
.values-framework__cell.is-selected { background: color-mix(in srgb, var(--cell-color) 13%, white); border-color: var(--cell-color); color: var(--doc-text); }
.values-framework__icon { display: inline-flex; width: 8mm; height: 8mm; border-radius: 50%; align-items: center; justify-content: center; background: var(--cell-color); color: white; font-weight: 700; }
.values-framework__cell h3 { margin: 2mm 0 0; font-size: 13pt; }
.values-framework__cell p { margin: 2mm 0 0; font-size: 9.5pt; color: var(--doc-muted-text); }
.values-framework-svg { display: block; width: 100%; margin: 5mm 0 7mm; background: transparent; }
.values-framework-svg svg, .values-framework-svg img { width: 100%; height: auto; display: block; background: transparent; }
.a3-poster-layout { display: ${format === "a3" ? "grid" : "block"}; grid-template-columns: 1fr; gap: 5mm; align-items: start; }
.a3-poster-layout--balanced { grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); gap: 6mm; }
.a3-poster-layout__main { display: grid; gap: 2.5mm; align-content: start; }
.a3-schema-title { margin: 0; padding: 0 2mm 2mm; text-align: center; }
.a3-schema-title h2 { margin: 0; white-space: normal; font-size: 18pt; line-height: 1.08; }
.a3-schema-title p { line-height: 1.15; }
.a3-poster-layout--balanced .a3-poster-layout__values { align-self: stretch; }
.a3-values-section { display: grid; gap: 2mm; align-content: start; min-width: 0; }
.a3-section-heading { padding-bottom: 2mm; border-bottom: 1px solid var(--doc-border); }
.a3-section-heading h2 { margin: 0; color: var(--doc-primary); font-size: 13pt; line-height: 1.1; }
.a3-section-heading p { margin: 1mm 0 0; color: var(--doc-muted-text); font-size: 12pt; line-height: 1.12; }
.a3-poster-layout--balanced .a3-value-card { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 2mm; padding: 2.4mm; }
.a3-poster-layout--balanced .commitment-frames { margin-top: 0; }
.a3-poster-layout--balanced .a3-value-card .value-icon { width: 16mm; height: 16mm; }
.a3-poster-layout--balanced .a3-value-card .value-icon img { width: 13mm; height: 13mm; }
.a3-poster-layout--balanced .a3-value-card__title { display: grid; justify-items: start; gap: 1.5mm; }
.a3-poster-layout__schema { padding: 0; border-radius: 0; border: 0; background: transparent; }
.a3-poster-layout__schema .values-framework-svg { margin: 0; }
.a3-poster-layout__values { display: grid; gap: 3mm; }
.poster-header--a3 { margin-bottom: 2mm; padding: 2mm 4mm; }
.poster-header--a3 .document-banner { padding-bottom: 3mm; }
.poster-header--a3 .institution-logo img, .poster-header--a3 .service-logo img { max-height: 16mm; }
.poster-header--a3 .document-banner__center { align-self: stretch; align-content: center; justify-items: center; }
.poster-header--a3 .document-banner__center strong { font-size: 23pt; }
.poster-header--a3 .document-banner__center span { font-size: 20pt; }
.poster-header--a3 .poster-header__title { margin-top: 2mm; text-align: center; }
.poster-header--a3 .poster-header__title h2 { font-size: 20pt; }
.a3-value-card { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 4mm; padding: 4mm; border-radius: 14px; border: 1px solid var(--doc-border); border-left: 3mm solid var(--value-accent, var(--doc-primary)); background: var(--doc-panel-bg); }
.a3-value-card::before { content: ""; position: absolute; top: 50%; right: 100%; width: 6mm; border-top: .7mm solid var(--value-accent, var(--doc-primary)); opacity: .72; }
.a3-value-card__title { display: flex; align-items: center; gap: 3mm; }
.a3-value-card__title h2 { margin: 0; color: var(--value-accent, var(--doc-primary)); font-size: 14pt; line-height: 1.12; }
.a3-value-card__intro p { margin: 2mm 0 0 1mm; color: var(--doc-text); font-size: 12pt; line-height: 1.18; overflow-wrap: break-word; hyphens: auto; }
.a3-value-card__items { padding: 2mm 3mm; border-radius: 10px; background: var(--doc-soft-bg); border: 1px solid var(--doc-border); }
.a3-value-card__items .charte-item__texte { overflow-wrap: break-word; hyphens: auto; }
.a3-value-card__items .charte-item::before { background: var(--value-accent, var(--doc-primary)); }
.a3-value-card--dense .a3-value-card__items .charte-list { columns: 2; column-gap: 3mm; }
.a3-value-card--dense .a3-value-card__items .charte-item { break-inside: avoid; page-break-inside: avoid; }
.charte-document__grid {
  display: grid;
  gap: 6mm;
  grid-template-columns: ${gridColumns};
}
.value-card {
  padding: ${format === "a3" ? "6.5mm" : "10mm"};
  border-radius: 12px;
  border: 1px solid var(--doc-border);
  border-left: 3mm solid var(--doc-primary);
  background: var(--doc-panel-bg);
  box-shadow: 0 4px 16px rgba(23, 48, 70, 0.05);
}
.value-card-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 8mm; align-items: start; }
.value-card-intro, .value-card-actions { min-width: 0; }
.value-card-header {
  display: flex;
  gap: 4mm;
  align-items: flex-start;
}
.value-card-header__text { min-width: 0; }
.value-card-header h2 {
  margin: 0;
  font-size: ${format === "a3" ? "16pt" : "19pt"};
  line-height: 1.12;
}
.value-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12mm;
  height: 12mm;
  border-radius: 50%;
  background: var(--doc-primary);
  color: #fff;
  font-weight: 700;
}
.value-card .value-icon, .a3-value-card .value-icon, .values-framework__icon .value-icon { display: inline-grid; place-items: center; width: 14mm; height: 14mm; flex: 0 0 auto; border-radius: 12px; background: var(--doc-soft-bg); border: 1px solid var(--doc-border); }
.value-card .value-icon img, .a3-value-card .value-icon img, .values-framework__icon .value-icon img { width: 10mm; height: 10mm; object-fit: contain; }
.value-card .value-icon--compact, .a3-value-card .value-icon--compact, .values-framework__icon .value-icon--compact { width: 7mm; height: 7mm; border: 0; background: transparent; }
.value-card .value-icon--compact img, .a3-value-card .value-icon--compact img, .values-framework__icon .value-icon--compact img { width: 6mm; height: 6mm; }
.value-short-definition {
  margin: 3mm 0 0;
  color: var(--doc-text);
  font-size: 11pt;
  line-height: 1.45;
}
.value-synthetic-phrases { display: flex; flex-wrap: wrap; gap: 2.5mm; margin-top: 4mm; }
.charte-synthetic-pill {
  display: inline-flex;
  align-items: center;
  padding: 1.6mm 3mm;
  border-radius: 999px;
  background: var(--doc-soft-bg);
  color: var(--doc-muted-text);
  font-size: 9pt;
}
.charte-definition-complete {
  display: ${format === "a4" ? "block" : "none"};
  margin-top: 5mm;
  padding: 5mm 6mm;
  border-left: 2mm solid var(--doc-accent);
  border-radius: 0 8px 8px 0;
  background: var(--doc-soft-bg);
}
.charte-definition-complete h3,
.behavior-block h3 { margin: 0 0 3mm; font-size: 11.5pt; line-height: 1.2; }
.charte-definition-complete p { margin: 0; font-size: 10pt; line-height: 1.45; white-space: pre-line; }
.value-action-list { margin-top: 0; padding: 5mm; border-radius: 10px; background: var(--doc-soft-bg); border: 1px solid var(--doc-border); }
.value-action-list h3 { margin: 0 0 3mm; font-size: 12pt; }
.charte-list { margin: 0; padding: 0; list-style: none; }
.charte-item + .charte-item { margin-top: ${format === "a3" ? ".35mm" : "3mm"}; }
.charte-item { padding-left: 4.5mm; position: relative; }
.charte-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: ${format === "a3" ? ".58em" : "50%"};
  transform: ${format === "a3" ? "none" : "translateY(-50%)"};
  width: 1.8mm;
  height: 1.8mm;
  border-radius: 50%;
  background: var(--doc-primary);
}
.charte-item__texte { margin: 0; color: var(--doc-text); font-size: ${format === "a3" ? "12pt" : "10.5pt"}; line-height: ${format === "a3" ? "1.08" : "1.4"}; }
.commitment-frames { margin-top: 4mm; }
.commitment-frames__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: ${format === "a3" ? "3mm" : "5mm"}; }
.commitment-frame { padding: ${format === "a3" ? "1.4mm 2.5mm 2mm" : "6mm"}; border-radius: 14px; border: 1px solid var(--doc-border); background: var(--doc-panel-bg); border-top: 3mm solid var(--doc-accent); }
.commitment-frame h2 { margin: 0 0 ${format === "a3" ? ".6mm" : "4mm"}; font-size: ${format === "a3" ? "12pt" : "15pt"}; line-height: 1.05; }
.commitment-frames__subtitle { max-width: 95ch; margin: ${format === "a3" ? "1mm" : "3mm"} 0 0; color: var(--doc-muted-text); font-size: ${format === "a3" ? "12pt" : "11pt"}; line-height: ${format === "a3" ? "1.12" : "1.45"}; }
.charte-document__empty {
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed var(--doc-border);
  background: rgba(255,255,255,0.74);
  text-align: center;
  color: var(--doc-muted-text);
}
@media (max-width: 860px) {
  body { padding: 14px; }
  .cover-header, .cover-info-panel__top, .poster-header__top { display: block; }
  .values-framework, .commitment-frames__grid, .charte-document__grid, .value-card-layout { grid-template-columns: 1fr; }
}
@media print {
  html, body { background: #fff; padding: 0; width: auto; min-height: 0; }
  .export-toolbar { display: none; }
  .charte-document {
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    min-height: 0;
    box-shadow: none;
    background: #fff;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  body.print-a4 .a4-page {
    min-height: calc(297mm - 28mm);
    break-after: page;
    page-break-after: always;
    overflow: visible;
  }
  body.print-a4 .a4-page--cover {
    overflow: hidden;
  }
  body.print-a4 .a4-page:last-child {
    break-after: auto;
    page-break-after: auto;
  }
  body.print-a3 .charte-document {
    min-height: calc(297mm - 24mm);
    overflow: hidden;
  }
}
`;
}

function scrollToPreviewPanel() {
  scrollToElement(dom.previewPanel);
}

function scrollToFormPanel() {
  scrollToElement(dom.appControls);
}

function scrollToElement(element) {
  if (!element) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
    inline: "nearest",
  });
}

function queueAutosave() {
  window.clearTimeout(autosaveTimeoutId);
  autosaveTimeoutId = window.setTimeout(saveDraft, 250);
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSnapshot()));
}

function resetApplication() {
  const confirmed = window.confirm(
    "Voulez-vous vraiment reinitialiser le formulaire et supprimer le brouillon local en cours ?"
  );
  if (!confirmed) {
    return;
  }

  state.info = {
    serviceName: "",
    charterVersion: "v1",
    validationDate: "",
    introText: DEFAULT_INTRO,
    finalEngagement: DEFAULT_FINAL_ENGAGEMENT,
    includeFullDefinitions: false,
    paletteId: DEFAULT_PALETTE_ID,
    fontChoice: "marianne",
    logoDataUrl: "",
    logoName: "",
    logoType: "",
  };
  state.format = "a4";
  state.selectedValues = [];
  state.valueEntries = {};
  state.commitments = createDefaultCommitments();
  state.ui.expandedValues = {};
  state.createdAt = new Date().toISOString();
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  syncFormFromState();
  applyFormat(state.format);
  renderAll();
  dom.formErrors.style.display = "none";
  dom.formWarnings.style.display = "none";
  setStatus("Le formulaire a été réinitialisé.", "success");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(filename, blob);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getValueById(valueId) {
  return state.valuesCatalog.find((value) => value.id === valueId) || null;
}

function getPaletteById(paletteId) {
  return state.palettes.find((palette) => palette.id === paletteId) || state.palettes[0] || null;
}

function setStatus(message, type = "info", persistent = false) {
  dom.liveMessage.textContent = message;
  dom.liveMessage.className = `live-message no-print is-${type}`;
  dom.liveMessage.style.display = "block";

  window.clearTimeout(statusTimeoutId);
  if (!persistent && type !== "error") {
    statusTimeoutId = window.setTimeout(() => {
      dom.liveMessage.style.display = "none";
    }, 6000);
  }
}

function normalizeFormat(value) {
  return value === "a3" ? value : "a4";
}

function normalizeColor(value, fallback) {
  const normalized = normalizeText(value);
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized) ? normalized : fallback;
}

function formatDate(value) {
  const [year, month, day] = String(value || "").split("-");
  if (!year || !month || !day) {
    return value || "";
  }
  return `${day}/${month}/${year}`;
}

function normalizeText(value) {
  return repairEncodingText(String(value || "")).trim();
}

function repairEncodingText(text) {
  if (!text || !/[ÃâÂ]/.test(text)) {
    return text;
  }
  try {
    return decodeURIComponent(escape(text));
  } catch (error) {
    return text;
  }
}

function slugify(value) {
  return String(value || "charte")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "charte";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function detectMimeTypeFromName(name) {
  const lowerName = String(name || "").toLowerCase();
  if (lowerName.endsWith(".png")) {
    return "image/png";
  }
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (lowerName.endsWith(".svg")) {
    return "image/svg+xml";
  }
  return "application/octet-stream";
}

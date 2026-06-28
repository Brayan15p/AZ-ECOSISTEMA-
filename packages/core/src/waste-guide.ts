/**
 * Guía de separación de residuos (Colombia · Res. 2184 de 2019).
 * --------------------------------------------------------------
 * Conocimiento de dominio compartido por móvil y web. Permite responder
 * “¿dónde va este residuo?” con un buscador tolerante a tildes/mayúsculas.
 *
 * Categorías:
 *  - aprovechable  → Bolsa blanca (reciclables limpios y secos)
 *  - organico      → Bolsa verde  (restos de comida, poda)
 *  - noAprovechable→ Bolsa negra  (no reciclable, contaminado)
 *  - peligroso     → Punto especial (riesgo a la salud/ambiente)
 *  - especial      → Punto posconsumo (RAEE, pilas, aceite, medicamentos)
 */

export type WasteCategoryId =
  | "aprovechable"
  | "organico"
  | "noAprovechable"
  | "peligroso"
  | "especial";

export interface WasteCategoryInfo {
  id: WasteCategoryId;
  label: string;
  bag: string;
  /** Cómo prepararlo antes de sacarlo. */
  tip: string;
}

export const WASTE_CATEGORIES: Record<WasteCategoryId, WasteCategoryInfo> = {
  aprovechable: {
    id: "aprovechable",
    label: "Aprovechable",
    bag: "Bolsa blanca",
    tip: "Límpialo y sécalo. Aplástalo para ocupar menos espacio.",
  },
  organico: {
    id: "organico",
    label: "Orgánico",
    bag: "Bolsa verde",
    tip: "Sin líquidos. Ideal para compostaje del municipio.",
  },
  noAprovechable: {
    id: "noAprovechable",
    label: "No aprovechable",
    bag: "Bolsa negra",
    tip: "Lo que está sucio o mezclado y no se puede reciclar.",
  },
  peligroso: {
    id: "peligroso",
    label: "Peligroso",
    bag: "Punto especial",
    tip: "No lo mezcles con la basura común. Llévalo a un punto autorizado.",
  },
  especial: {
    id: "especial",
    label: "Posconsumo",
    bag: "Punto posconsumo",
    tip: "Entrégalo en puntos de recolección (tiendas, droguerías, alcaldía).",
  },
};

export interface WasteItem {
  name: string;
  category: WasteCategoryId;
  /** Sinónimos / términos de búsqueda extra. */
  aka?: string[];
}

/** Diccionario de residuos frecuentes en un hogar araucano. */
export const WASTE_ITEMS: readonly WasteItem[] = [
  // Aprovechables
  { name: "Botella de plástico (PET)", category: "aprovechable", aka: ["gaseosa", "pet", "botella agua"] },
  { name: "Lata de aluminio", category: "aprovechable", aka: ["cerveza", "gaseosa lata", "aluminio"] },
  { name: "Cartón seco", category: "aprovechable", aka: ["caja", "carton"] },
  { name: "Papel limpio", category: "aprovechable", aka: ["hoja", "cuaderno", "periodico"] },
  { name: "Vidrio (frasco/botella)", category: "aprovechable", aka: ["frasco", "botella vidrio"] },
  { name: "Envase de champú", category: "aprovechable", aka: ["plastico bano", "shampoo"] },
  { name: "Bolsa plástica limpia", category: "aprovechable", aka: ["bolsa"] },
  { name: "Tetra Pak (limpio)", category: "aprovechable", aka: ["caja leche", "jugo caja", "tetrapak"] },
  // Orgánicos
  { name: "Restos de comida", category: "organico", aka: ["sobras", "comida"] },
  { name: "Cáscaras de fruta/verdura", category: "organico", aka: ["cascara", "fruta", "verdura"] },
  { name: "Cuncho de café", category: "organico", aka: ["cafe", "borra"] },
  { name: "Restos de poda / hojas", category: "organico", aka: ["jardin", "hojas", "pasto"] },
  { name: "Cáscara de huevo", category: "organico", aka: ["huevo"] },
  // No aprovechables
  { name: "Papel higiénico usado", category: "noAprovechable", aka: ["papel bano"] },
  { name: "Servilleta sucia", category: "noAprovechable", aka: ["servilleta"] },
  { name: "Pañal", category: "noAprovechable", aka: ["panal", "bebe"] },
  { name: "Icopor", category: "noAprovechable", aka: ["poliestireno", "espuma"] },
  { name: "Colilla de cigarrillo", category: "noAprovechable", aka: ["cigarrillo", "colilla"] },
  { name: "Papel o plástico engrasado", category: "noAprovechable", aka: ["grasa", "sucio"] },
  // Peligrosos
  { name: "Pila / batería", category: "peligroso", aka: ["pila", "bateria"] },
  { name: "Bombillo / tubo fluorescente", category: "peligroso", aka: ["bombilla", "foco", "luz"] },
  { name: "Jeringa / objeto cortopunzante", category: "peligroso", aka: ["jeringa", "aguja", "bisturi"] },
  { name: "Envase de plaguicida", category: "peligroso", aka: ["veneno", "insecticida", "fumigar"] },
  { name: "Pintura / disolvente", category: "peligroso", aka: ["pintura", "thinner", "solvente"] },
  // Especiales (posconsumo)
  { name: "Celular / electrónico (RAEE)", category: "especial", aka: ["celular", "electronico", "computador", "raee"] },
  { name: "Aceite de cocina usado", category: "especial", aka: ["aceite", "fritura"] },
  { name: "Medicamentos vencidos", category: "especial", aka: ["remedio", "pastillas", "droga"] },
  { name: "Llantas", category: "especial", aka: ["neumatico", "llanta"] },
  { name: "Electrodoméstico", category: "especial", aka: ["nevera", "licuadora", "plancha"] },
];

/** Quita tildes y normaliza a minúsculas para búsquedas tolerantes. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Busca residuos por nombre o sinónimo. Vacío → lista completa. */
export function searchWaste(query: string): WasteItem[] {
  const q = normalize(query);
  if (!q) return [...WASTE_ITEMS];
  return WASTE_ITEMS.filter((it) => {
    const haystack = normalize([it.name, ...(it.aka ?? [])].join(" "));
    return haystack.includes(q);
  });
}

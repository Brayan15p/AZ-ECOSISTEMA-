/**
 * AZ Ecosistema — Identidad de marca (fuente única de verdad)
 * -----------------------------------------------------------
 * Historia, voz y constantes de marca que comparten web, móvil y los
 * correos transaccionales. La idea: que todo el ecosistema cuente la
 * MISMA historia — "separar bien se siente como subir de nivel" — con
 * el mismo nombre, tono, colores y firma en cada punto de contacto.
 *
 * Colores derivados de los design tokens (navy = confianza/estructura,
 * eco = acción/crecimiento) para que marca y UI nunca se desincronicen.
 */
import { navy, eco, gray, amber } from "./tokens";

export const brand = {
  name: "AZ Ecosistema",
  shortName: "AZ",
  /** Promesa en una línea. */
  tagline: "Economía circular para Arauca",
  /** Idea central que ordena toda la experiencia. */
  bigIdea: "Separar bien se siente como subir de nivel.",
  /** Para qué existimos (úsalo en about / correos / onboarding). */
  mission:
    "Conectar a municipios, ciudadanos y recicladores en una sola plataforma " +
    "para que separar en la fuente sea fácil, justo y recompensado.",

  location: "Arauca, Colombia",
  url: "https://azecosistema.co",
  supportEmail: "hola@azecosistema.co",

  /**
   * Voz: cómo suena AZ. Cercana y orgullosa de lo local, optimista sin
   * ser cursi, clara antes que técnica. Tutea ("vos/tú") y celebra el
   * esfuerzo de la gente.
   */
  voice: {
    personality: ["cercana", "optimista", "orgullo araucano", "clara", "motivadora"],
    do: [
      "Habla de la persona y su barrio, no de 'usuarios'.",
      "Celebra el progreso: niveles, rachas, impacto real (kg, CO₂, agua).",
      "Frases cortas. Verbos de acción: separá, canjeá, sube de nivel.",
    ],
    dont: [
      "Jerga técnica o tono burocrático.",
      "Culpar o regañar; el error se corrige, no se castiga.",
      "Promesas vacías; siempre cifras y beneficios concretos.",
    ],
  },

  /** Tema narrativo de la gamificación (alineado con ECO_LEVELS en core). */
  levelsTheme: "De brote a Leyenda Verde",

  /**
   * Paleta canónica de marca (hex planos, seguros para HTML de correo).
   * Reutiliza los ramps de tokens para no divergir.
   */
  colors: {
    ink: navy[900], // titulares sobre claro
    brand: navy[700], // azul AZ
    brandDeep: navy[900],
    accent: eco[500], // verde acción / CTA
    accentDeep: eco[700],
    gold: amber[500], // logros / recompensas
    bg: gray[50],
    surface: gray[0],
    border: gray[200],
    textBody: gray[700],
    textMuted: gray[500],
    onAccent: "#FFFFFF",
  },

  /** Gradiente firma (navy → eco). [desde, hasta]. */
  gradient: {
    signature: [navy[700], eco[600]] as [string, string],
    eco: [eco[400], eco[600]] as [string, string],
  },
} as const;

export type Brand = typeof brand;

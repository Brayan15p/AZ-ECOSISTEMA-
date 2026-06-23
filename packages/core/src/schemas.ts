/**
 * Esquemas de validación (zod) para entradas de formularios y APIs.
 * Compartidos por móvil y web para validar una sola vez la forma de los datos.
 */
import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^3\d{9}$/u, "Celular colombiano inválido (debe iniciar en 3 y tener 10 dígitos)");

export const householdInputSchema = z.object({
  owner: z.string().trim().min(3, "Nombre del propietario muy corto"),
  address: z.string().trim().min(5, "Dirección requerida"),
  phone: phoneSchema.optional().or(z.literal("")),
  zone: z.string().trim().min(2, "Zona requerida"),
  irsuId: z.string().optional(),
});
export type HouseholdInput = z.infer<typeof householdInputSchema>;

export const recyclerInputSchema = z.object({
  name: z.string().trim().min(3, "Nombre requerido"),
  phone: phoneSchema.optional().or(z.literal("")),
  zone: z.string().trim().min(2, "Zona requerida"),
  formalized: z.boolean().default(false),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAccountType: z.enum(["ahorros", "corriente"]).optional(),
});
export type RecyclerInput = z.infer<typeof recyclerInputSchema>;

export const publicationInputSchema = z.object({
  title: z.string().trim().min(3, "Título requerido").max(120),
  body: z.string().trim().min(1, "Contenido requerido").max(4000),
  mediaUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});
export type PublicationInput = z.infer<typeof publicationInputSchema>;

export const dailyDataInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Fecha YYYY-MM-DD"),
  organic: z.number().nonnegative(),
  recyclable: z.number().nonnegative(),
  energy: z.number().nonnegative(),
  reject: z.number().nonnegative(),
  purity: z.number().min(0).max(100),
});
export type DailyDataInput = z.infer<typeof dailyDataInputSchema>;

export const catalogItemInputSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(2),
  costPoints: z.number().int().nonnegative(),
  priceCop: z.number().int().nonnegative().default(0),
  stock: z.number().int().nonnegative().nullable().default(null),
});
export type CatalogItemInput = z.infer<typeof catalogItemInputSchema>;

export const penaltyInputSchema = z.object({
  householdId: z.string().min(1),
  type: z.string().trim().min(2),
  description: z.string().trim().min(2),
  severity: z.enum(["leve", "moderada", "grave"]),
});
export type PenaltyInput = z.infer<typeof penaltyInputSchema>;

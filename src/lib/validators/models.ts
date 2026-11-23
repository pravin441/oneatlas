import { z } from "zod";

export const MODEL_TYPES = ["CHAT", "EMBEDDING", "IMAGE", "AUDIO", "VIDEO"] as const;
export const MODEL_SORTS = ["release", "price", "context", "name"] as const;

export const modelQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  lab: z.string().max(100).optional(),
  provider: z.string().max(100).optional(),
  type: z.enum(MODEL_TYPES).optional(),
  capability: z.string().max(50).optional(),
  sort: z.enum(MODEL_SORTS).default("release"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ModelQuery = z.infer<typeof modelQuerySchema>;
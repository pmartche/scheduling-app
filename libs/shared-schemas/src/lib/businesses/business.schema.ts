import { z } from 'zod';

export const createBusinessSchema = z
  .object({
    name: z.string(),
  })
  .required();

export type CreateBusinessDto = z.infer<typeof createBusinessSchema>;

export const updateBusinessSchema = z
  .object({
    id: z.uuid(),
    name: z.string().trim(),
  })
  .required();

export type UpdateBusinessDto = z.infer<typeof updateBusinessSchema>;

export const addLocationSchema = z
  .object({
    businessId: z.uuid(),
    name: z.string().trim(),
    email: z.email(),
    address: z.string().trim(),
    city: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string().trim(),
  })
  .required();

export type AddLocationDto = z.infer<typeof addLocationSchema>;

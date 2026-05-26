import { z } from 'zod';

export const paperIdSchema = z.object({
  id: z.string().min(1)
});

export const regeneratePaperSchema = z.object({
  sectionTitle: z.string().optional()
});
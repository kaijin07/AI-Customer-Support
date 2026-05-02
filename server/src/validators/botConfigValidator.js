import { z } from 'zod';

export const updateBotConfigSchema = z.object({
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  instructions: z.string().optional(),
});

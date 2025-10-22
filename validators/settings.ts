
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  company: z.string().optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const notificationsSchema = z.object({
  quoteUpdates: z.boolean(),
  invoiceAlerts: z.boolean(),
  teamMessages: z.boolean(),
});

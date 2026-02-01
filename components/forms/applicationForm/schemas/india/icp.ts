import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const railICPSchema = z.object({
  serviceType: z.literal('rail-icp'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const munabaoRailCheckPostSchema = z.object({
  serviceType: z.literal('munabao-rail-check-post'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const attariRailCheckPostSchema = z.object({
  serviceType: z.literal('attari-rail-check-post'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const gedeRailRoadCheckPostSchema = z.object({
  serviceType: z.literal('gede-rail-road-check-post'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const haridaspurRailCheckPostSchema = z.object({
  serviceType: z.literal('haridaspur-rail-check-post'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const chitpurRailCheckPostSchema = z.object({
  serviceType: z.literal('chitpur-rail-check-post'),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
});

export const indiaIcpSchemas = [
  railICPSchema,
  munabaoRailCheckPostSchema,
  attariRailCheckPostSchema,
  gedeRailRoadCheckPostSchema,
  haridaspurRailCheckPostSchema,
  chitpurRailCheckPostSchema,
] as const;

import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const touristUSAEVisaSchema = z.object({
  serviceType: z.literal('tourist-e-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageScan: requiredFileSchema.optional().or(z.literal('')),
  returnTicket: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  hotelBooking: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
});

export const businessUSAEVisaSchema = z.object({
  serviceType: z.literal('business-e-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageScan: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  businessCardOrCompanyLetterhead: requiredFileSchema.optional().or(z.literal('')),
  invitationLetterFromIndianCompany: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  returnTicket: requiredFileSchema.optional().or(z.literal('')),
});

export const medicalUSAEVisaSchema = z.object({
  serviceType: z.literal('medical-e-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  hospitalLetterFromIndia: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageScan: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  returnAirTicket: requiredFileSchema.optional().or(z.literal('')),
});

export const crewUSAEVisaSchema = z.object({
  serviceType: z.literal('crew-e-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  employmentProof: requiredFileSchema.optional().or(z.literal('')),
  assignmentOrDutyLetter: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageScan: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto2x2: requiredFileSchema.optional().or(z.literal('')),
  onwardOrReturnTicket: requiredFileSchema.optional().or(z.literal('')),
});

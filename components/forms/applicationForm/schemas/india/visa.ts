import { z } from 'zod';
import { requiredFileSchema } from '../common';

// =======================================================
// INDIA TOURIST VISA
// =======================================================

export const visaIndiaTouristSchema = z.object({
  serviceType: z.literal('tourist-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  recentPassportPhoto: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  hotelBookingInvitationLetter: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  returnFlightTicket: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================================
// INDIA BUSINESS VISA
// =======================================================

export const visaIndiaBusinessSchema = z.object({
  serviceType: z.literal('business-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  invitationLetterFromIndianCompany: requiredFileSchema.optional().or(z.literal('')),
  incorporationCertificateOfIndianCompany: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  businessCoverLetter: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================================
// INDIA STUDENT VISA
// =======================================================

export const visaIndiaStudentSchema = z.object({
  serviceType: z.literal('student-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  admissionLetterFromIndianInstitution: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  academicCertificates: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  bonafideCertificate: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================================
// INDIA MEDICAL VISA
// =======================================================

export const visaIndiaMedicalSchema = z.object({
  serviceType: z.literal('medical-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  medicalTreatmentLetterFromIndianHospital: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  medicalReports: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  attendantDetailsLetter: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================================
// INDIA CONFERENCE VISA
// =======================================================

export const visaIndiaConferenceSchema = z.object({
  serviceType: z.literal('conference-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  invitationLetterToConference: requiredFileSchema.optional().or(z.literal('')),

  governmentClearance: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  conferenceRegistrationProof: requiredFileSchema.optional().or(z.literal('')),
});

// =======================================================
// INDIA EMPLOYMENT VISA
// =======================================================

export const visaIndiaEmploymentSchema = z.object({
  serviceType: z.literal('employment-visa'),

  validPassport: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos: requiredFileSchema.optional().or(z.literal('')),
  appointmentLetter: requiredFileSchema.optional().or(z.literal('')),
  companyRegistrationProof: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Excel
  employmentContract: requiredFileSchema.optional().or(z.literal('')),
});

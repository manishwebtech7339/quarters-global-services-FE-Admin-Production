import { z } from 'zod';
import { requiredFileSchema } from '../common';

export const visaGlobalSchema = z.object({
  serviceType: z.literal('visa-global'),

  // 🛂 Identity & Passport
  passportBioDataPage: requiredFileSchema.optional().or(z.literal('')),
  passportUsedPages: requiredFileSchema.optional().or(z.literal('')),
  oldPassports: requiredFileSchema.optional().or(z.literal('')),
  nationalIdOrResidencePermit: requiredFileSchema.optional().or(z.literal('')),

  // 📄 Previous Visa History
  previousVisaCopiesAllCountries: requiredFileSchema.optional().or(z.literal('')),
  previousVisaNumbersDocument: requiredFileSchema.optional().or(z.literal('')),
  entryExitStampCopies: requiredFileSchema.optional().or(z.literal('')),
  currentVisasInOldPassports: requiredFileSchema.optional().or(z.literal('')),
  longTermVisaDetails: requiredFileSchema.optional().or(z.literal('')),

  // ❌ Visa Refusal / Rejection History
  visaRefusalLetters: requiredFileSchema.optional().or(z.literal('')),
  visaRefusalDateCountry: requiredFileSchema.optional().or(z.literal('')),
  visaRejectionReasonProof: requiredFileSchema.optional().or(z.literal('')),
  visaRejectionExplanationLetter: requiredFileSchema.optional().or(z.literal('')),
  immigrationOverstayDetails: requiredFileSchema.optional().or(z.literal('')),

  // 📸 Photographs
  passportSizePhotograph: requiredFileSchema.optional().or(z.literal('')),

  // ✈️ Travel Proof
  flightReservation: requiredFileSchema.optional().or(z.literal('')),
  hotelAccommodationProof: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
  onwardReturnTravelProof: requiredFileSchema.optional().or(z.literal('')),

  // 💰 Financial Proof
  bankStatements: requiredFileSchema.optional().or(z.literal('')),
  proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
  salarySlips: requiredFileSchema.optional().or(z.literal('')),
  sponsorFinancialProof: requiredFileSchema.optional().or(z.literal('')),

  // 💼 Employment / Business / Study
  employmentOrJobProof: requiredFileSchema.optional().or(z.literal('')),
  approvedLeaveLetter: requiredFileSchema.optional().or(z.literal('')),
  businessRegistrationDocuments: requiredFileSchema.optional().or(z.literal('')),
  studentEnrollmentProof: requiredFileSchema.optional().or(z.literal('')),

  // 🏠 Residence & Home Ties
  currentAddressProof: requiredFileSchema.optional().or(z.literal('')),
  propertyOwnershipOrRentalAgreement: requiredFileSchema.optional().or(z.literal('')),
  familyRelationshipProof: requiredFileSchema.optional().or(z.literal('')),

  // 📝 Purpose of Travel Support
  invitationLetter: requiredFileSchema.optional().or(z.literal('')),
  hostIdOrPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  eventConferenceAdmissionProof: requiredFileSchema.optional().or(z.literal('')),

  // 🏥 Insurance & Health
  travelMedicalInsurance: requiredFileSchema.optional().or(z.literal('')),
  medicalReport: requiredFileSchema.optional().or(z.literal('')),
  vaccinationRecord: requiredFileSchema.optional().or(z.literal('')),

  // ⚖️ Legal & Background
  policeClearanceCertificate: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  birthCertificateForMinors: requiredFileSchema.optional().or(z.literal('')),
  parentalConsentLetter: requiredFileSchema.optional().or(z.literal('')),

  // 📦 Final Supporting Documents
  // allPreviousVisaStampCopies: requiredFileSchema.optional().or(z.literal('')),
  // nameChangeDocuments: requiredFileSchema.optional().or(z.literal('')),
  // sponsorshipOrGuaranteeLetter: requiredFileSchema.optional().or(z.literal('')),
  // documentTranslations: requiredFileSchema.optional().or(z.literal('')),

  // ✅ Final Review / Notes
  // finalChecklistAcknowledgement: requiredFileSchema.optional().or(z.literal('')),
});

// export const visaCanadaVisitorSchema = z.object({
//   serviceType: z.literal('canada-visitor-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaCanadaStudentSchema = z.object({
//   serviceType: z.literal('canada-student-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   admissionLetter: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaCanadaWorkPermitSchema = z.object({
//   serviceType: z.literal('canada-work-permit'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   jobOfferLetter: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaCanadaPRSchema = z.object({
//   serviceType: z.literal('canada-permanent-residency'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   applicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaUKTouristSchema = z.object({
//   serviceType: z.literal('uk-tourist-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaUKStudentSchema = z.object({
//   serviceType: z.literal('uk-student-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   casLetter: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaUKWorkSchema = z.object({
//   serviceType: z.literal('uk-work-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   jobOfferLetter: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaUKDependentSchema = z.object({
//   serviceType: z.literal('uk-dependent-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   relationshipProof: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaSchengenTouristSchema = z.object({
//   serviceType: z.literal('schengen-tourist-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaSchengenBusinessSchema = z.object({
//   serviceType: z.literal('schengen-business-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   invitationLetter: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaSchengenStudentSchema = z.object({
//   serviceType: z.literal('schengen-student-visa'),

//   validPassport: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   admissionLetter: requiredFileSchema.optional().or(z.literal('')),
//   passportPhotos: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
// });

export const visaOtherTouristSchema = z.object({
  serviceType: z.literal('tourist-visa-1'),

  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  flightItinerary: requiredFileSchema.optional().or(z.literal('')),
  hotelBooking: requiredFileSchema.optional().or(z.literal('')),
  travelInsurance: requiredFileSchema.optional().or(z.literal('')),
  bankStatement6Months: requiredFileSchema.optional().or(z.literal('')),
  employmentProofOrNoc: requiredFileSchema.optional().or(z.literal('')),
  salarySlipOrFundsProof: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  previousVisaCopies: requiredFileSchema.optional().or(z.literal('')),
  declarationForm: requiredFileSchema.optional().or(z.literal('')),
});

export const visaOtherBusinessSchema = z.object({
  serviceType: z.literal('business-visa-1'),

  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  invitationLetter: requiredFileSchema.optional().or(z.literal('')),
  businessCoverLetter: requiredFileSchema.optional().or(z.literal('')),
  companyRegistrationCertificate: requiredFileSchema.optional().or(z.literal('')),
  employmentLetterOrId: requiredFileSchema.optional().or(z.literal('')),
  bankStatement: requiredFileSchema.optional().or(z.literal('')),
  travelItinerary: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  travelInsurance: requiredFileSchema.optional().or(z.literal('')),
  authorizationLetter: requiredFileSchema.optional().or(z.literal('')),
});

// export const visaOtherStudentSchema = z.object({
//   serviceType: z.literal('student-visa'),

//   passportCopy: requiredFileSchema.optional().or(z.literal('')),
//   passportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   admissionLetter: requiredFileSchema.optional().or(z.literal('')),
//   tuitionFeeReceipt: requiredFileSchema.optional().or(z.literal('')),
//   bankStatement6Months: requiredFileSchema.optional().or(z.literal('')),
//   sponsorLetter: requiredFileSchema.optional().or(z.literal('')),
//   academicCertificates: requiredFileSchema.optional().or(z.literal('')),
//   accommodationProof: requiredFileSchema.optional().or(z.literal('')),
//   medicalFitnessCertificate: requiredFileSchema.optional().or(z.literal('')),
//   policeClearanceCertificate: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaOtherMedicalSchema = z.object({
//   serviceType: z.literal('medical-visa'),

//   passportCopy: requiredFileSchema.optional().or(z.literal('')),
//   passportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   hospitalInvitationLetter: requiredFileSchema.optional().or(z.literal('')),
//   medicalReferralLetter: requiredFileSchema.optional().or(z.literal('')),
//   treatmentFundsProof: requiredFileSchema.optional().or(z.literal('')),
//   relationshipProof: requiredFileSchema.optional().or(z.literal('')),
//   bankStatement6Months: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
//   flightBooking: requiredFileSchema.optional().or(z.literal('')),
//   authorizationLetter: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaOtherDependentSchema = z.object({
//   serviceType: z.literal('dependent-family-visa'),

//   passportCopy: requiredFileSchema.optional().or(z.literal('')),
//   passportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   principalVisaCopy: requiredFileSchema.optional().or(z.literal('')),
//   relationshipProof: requiredFileSchema.optional().or(z.literal('')),
//   sponsorshipLetter: requiredFileSchema.optional().or(z.literal('')),
//   bankStatement: requiredFileSchema.optional().or(z.literal('')),
//   addressProof: requiredFileSchema.optional().or(z.literal('')),
//   policeClearanceCertificate: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
//   flightItinerary: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaOtherEmploymentSchema = z.object({
//   serviceType: z.literal('employment-visa'),

//   passportCopy: requiredFileSchema.optional().or(z.literal('')),
//   passportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   employmentContract: requiredFileSchema.optional().or(z.literal('')),
//   companyRegistrationDocuments: requiredFileSchema.optional().or(z.literal('')),
//   qualificationProof: requiredFileSchema.optional().or(z.literal('')),
//   medicalFitnessCertificate: requiredFileSchema.optional().or(z.literal('')),
//   policeClearanceCertificate: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
//   declarationForm: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaOtherTransitSchema = z.object({
//   serviceType: z.literal('transit-visa'),

//   passportCopy: requiredFileSchema.optional().or(z.literal('')),
//   passportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   visaApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   onwardFlightTicket: requiredFileSchema.optional().or(z.literal('')),
//   destinationVisaCopy: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
//   travelItinerary: requiredFileSchema.optional().or(z.literal('')),
// });

// export const visaOtherEVisaSchema = z.object({
//   serviceType: z.literal('evisa'),

//   passportBioPage: requiredFileSchema.optional().or(z.literal('')),
//   digitalPassportPhoto: requiredFileSchema.optional().or(z.literal('')),
//   onlineApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   flightItinerary: requiredFileSchema.optional().or(z.literal('')),
//   hotelBooking: requiredFileSchema.optional().or(z.literal('')),
//   proofOfFunds: requiredFileSchema.optional().or(z.literal('')),
//   employmentProof: requiredFileSchema.optional().or(z.literal('')),
//   travelInsurance: requiredFileSchema.optional().or(z.literal('')),
//   paymentConfirmation: requiredFileSchema.optional().or(z.literal('')),
// });

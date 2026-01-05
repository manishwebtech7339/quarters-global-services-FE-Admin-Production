import z from 'zod';
import { requiredFileSchema } from '../common';

export const medicalEVisaSchema = z.object({
  serviceType: z.literal('medical-e-visa'),

  // 🛂 Passport & Identity
  validPassport: requiredFileSchema,
  blankVisaPagesProof: requiredFileSchema.optional(),
  oldPassports: requiredFileSchema.optional(),
  passportBioPageCopy: requiredFileSchema,

  // 📄 Previous Visa History
  previousChinaVisaCopies: requiredFileSchema.optional(),
  previousOtherCountryVisaCopies: requiredFileSchema.optional(),
  previousVisaNumbers: requiredFileSchema.optional(),
  entryExitStampCopies: requiredFileSchema.optional(),

  // ❌ Visa Refusal / Rejection History
  chinaVisaRejectionDetails: requiredFileSchema.optional(),
  otherVisaRefusalDetails: requiredFileSchema.optional(),
  rejectionLetterCopy: requiredFileSchema.optional(),
  rejectionExplanationNote: requiredFileSchema.optional(),

  // 📸 Photographs
  passportPhoto: requiredFileSchema,

  // 🏢 Business Invitation (MANDATORY)
  chinaInvitationLetter: requiredFileSchema,
  inviterBusinessLicenseCopy: requiredFileSchema,
  inviterIdOrPassportCopy: requiredFileSchema.optional(),

  // 💼 Applicant Business Proof
  employerLetter: requiredFileSchema,
  applicantBusinessCard: requiredFileSchema.optional(),
  companyRegistrationDocuments: requiredFileSchema.optional(),
  employerAuthorizationLetter: requiredFileSchema.optional(),

  // ✈️ Travel Arrangements
  flightReservation: requiredFileSchema.optional(),
  hotelBooking: requiredFileSchema.optional(),
  businessTravelItinerary: requiredFileSchema.optional(),

  // 💰 Financial Proof
  personalBankStatements: requiredFileSchema,
  companyBankStatement: requiredFileSchema.optional(),
  incomeOrSalaryProof: requiredFileSchema.optional(),
  sponsorLetter: requiredFileSchema.optional(),

  // 🏠 Residence Proof
  addressProof: requiredFileSchema,

  // 🏥 Insurance & Health
  travelMedicalInsurance: requiredFileSchema.optional(),
  healthDeclarationForm: requiredFileSchema.optional(),
  vaccinationRecord: requiredFileSchema.optional(),

  // ⚖️ Additional Supporting Documents
  previousBusinessCorrespondence: requiredFileSchema.optional(),
  tradeFairOrExhibitionProof: requiredFileSchema.optional(),
  businessRelationshipExplanationLetter: requiredFileSchema.optional(),
  embassyAdditionalDocuments: requiredFileSchema.optional(),
});

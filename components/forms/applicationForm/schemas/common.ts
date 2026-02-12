import { z } from 'zod';

// ---- Common Schemas and Types ----

// File upload schema with size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const requiredFileSchema = z
  .any()
  .refine(
    (file) => {
      if (!file) return false;

      if (file instanceof File && file.size <= MAX_FILE_SIZE) return true;

      return true;
    },
    { message: 'File is required or must be a valid upload (≤ 5MB)' },
  )
  .refine(
    (file) => {
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true; // Skip if not a File
    },
    { message: 'Uploaded file must be ≤ 5MB' },
  )
  .describe('file');

export const emptySchema = z.object({
  serviceType: z.literal('empty'),
});

export const defaultMasterChecklistSchema = z.object({
  serviceType: z.literal('default-checklist'),

  // 1️⃣ Category Selection
  applicationCategory: requiredFileSchema.optional().or(z.literal('')),

  // 2️⃣ Passport Copies
  originalPassport: requiredFileSchema.optional().or(z.literal('')),
  passportBioPageCopy: requiredFileSchema.optional().or(z.literal('')),
  passportAddressPageCopy: requiredFileSchema.optional().or(z.literal('')),
  passportObservationPagesCopy: requiredFileSchema.optional().or(z.literal('')),
  policeReportOrFir: requiredFileSchema.optional().or(z.literal('')),

  // 3️⃣ Proof of Identity
  nationalIdCard: requiredFileSchema.optional().or(z.literal('')),
  driversLicense: requiredFileSchema.optional().or(z.literal('')),
  stateId: requiredFileSchema.optional().or(z.literal('')),
  residencePermitOrGreenCard: requiredFileSchema.optional().or(z.literal('')),
  voterIdOrAadhaar: requiredFileSchema.optional().or(z.literal('')),

  // 4️⃣ Proof of Address
  utilityBill: requiredFileSchema.optional().or(z.literal('')),
  bankStatement: requiredFileSchema.optional().or(z.literal('')),
  leaseAgreement: requiredFileSchema.optional().or(z.literal('')),
  governmentIdWithAddress: requiredFileSchema.optional().or(z.literal('')),
  employerOrSchoolLetter: requiredFileSchema.optional().or(z.literal('')),

  // 5️⃣ Date of Birth Proof
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  oldPassportDobProof: requiredFileSchema.optional().or(z.literal('')),
  schoolCertificate: requiredFileSchema.optional().or(z.literal('')),
  governmentDobDocument: requiredFileSchema.optional().or(z.literal('')),

  // 6️⃣ Photographs
  passportPhoto: requiredFileSchema.optional().or(z.literal('')),
  whiteBackgroundPhoto: requiredFileSchema.optional().or(z.literal('')),
  neutralExpressionPhoto: requiredFileSchema.optional().or(z.literal('')),
  noGlassesPhoto: requiredFileSchema.optional().or(z.literal('')),
  countrySpecificPhotoSize: requiredFileSchema.optional().or(z.literal('')),

  // 7️⃣ Citizenship Proof
  citizenshipOrNaturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  nationalityRegistrationCertificate: requiredFileSchema.optional().or(z.literal('')),

  // 8️⃣ Marital Status
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  divorceDecree: requiredFileSchema.optional().or(z.literal('')),
  spousePassportCopy: requiredFileSchema.optional().or(z.literal('')),

  // 9️⃣ Name Change
  courtOrderOrGazette: requiredFileSchema.optional().or(z.literal('')),
  surnameChangeMarriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  nameChangeAffidavit: requiredFileSchema.optional().or(z.literal('')),

  // 🔟 Minor Documents
  minorBirthCertificate: requiredFileSchema.optional().or(z.literal('')),
  parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),
  parentalConsentLetter: requiredFileSchema.optional().or(z.literal('')),
  parentIdProof: requiredFileSchema.optional().or(z.literal('')),
  custodyOrder: requiredFileSchema.optional().or(z.literal('')),

  // ⚠️ Special Cases
  lostPassportPoliceReportAffidavit: requiredFileSchema.optional().or(z.literal('')),
  emergencyTravelProof: requiredFileSchema.optional().or(z.literal('')),
  tatkalDeclaration: requiredFileSchema.optional().or(z.literal('')),
  changeOfAppearanceExtraPhotos: requiredFileSchema.optional().or(z.literal('')),
});

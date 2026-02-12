import { z } from 'zod';
import { requiredFileSchema } from '../common';

// export const ociAdultDetailedSchema = z.object({
//   serviceType: z.literal('oci-adult-application-checklist'),

//   photograph2x2: requiredFileSchema.optional().or(z.literal('')),
//   signature: requiredFileSchema.optional().or(z.literal('')),

//   currentPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   lastIndianPassportCopyOrSurrenderCert: requiredFileSchema.optional().or(z.literal('')),
//   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),

//   proofOfLegalStatusUSA: requiredFileSchema.optional().or(z.literal('')),

//   birthCertificate: requiredFileSchema.optional().or(z.literal('')),
//   maritalStatusProof: requiredFileSchema.optional().or(z.literal('')),

//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
//   employmentOrWorkLetter: requiredFileSchema.optional().or(z.literal('')),

//   parentsAndSpouseDocuments: requiredFileSchema.optional().or(z.literal('')),
//   previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),

//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),
//   nativeAddressDetails: requiredFileSchema.optional().or(z.literal('')),

//   voterRationCardUndertaking: requiredFileSchema.optional().or(z.literal('')),
//   ociUndertaking: requiredFileSchema.optional().or(z.literal('')),
//   affidavitInLieuOfOriginals: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociMinorDetailedSchema = z.object({
//   serviceType: z.literal('oci-minor-application-checklist'),

//   photograph2x2: requiredFileSchema.optional().or(z.literal('')),
//   signature: requiredFileSchema.optional().or(z.literal('')),

//   parentalAuthorizationForm: requiredFileSchema.optional().or(z.literal('')),
//   parentsAffidavitForMinor: requiredFileSchema.optional().or(z.literal('')),

//   currentPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   lastIndianPassportCopyOrSurrenderCert: requiredFileSchema.optional().or(z.literal('')),
//   parentsPassportCopies: requiredFileSchema.optional().or(z.literal('')),

//   naturalizationCertificateParents: requiredFileSchema.optional().or(z.literal('')),
//   marriageCertificateParents: requiredFileSchema.optional().or(z.literal('')),

//   parentsLegalStatusUSA: requiredFileSchema.optional().or(z.literal('')),

//   parentsOciCardCopy: requiredFileSchema.optional().or(z.literal('')),
//   previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),

//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),
//   nativeAddressDetails: requiredFileSchema.optional().or(z.literal('')),

//   voterRationCardUndertaking: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociSpouseDetailedSchema = z.object({
//   serviceType: z.literal('oci-spouse-foreign-national'),

//   ociApplicationForm: requiredFileSchema.optional().or(z.literal('')),
//   photograph2x2: requiredFileSchema.optional().or(z.literal('')),
//   signature: requiredFileSchema.optional().or(z.literal('')),

//   currentPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   birthCertificateApostilled: requiredFileSchema.optional().or(z.literal('')),

//   spouseIndianOriginProof: requiredFileSchema.optional().or(z.literal('')),
//   marriageCertificate: requiredFileSchema.optional().or(z.literal('')),

//   jointAffidavitOfMarriage: requiredFileSchema.optional().or(z.literal('')),

//   legalStatusUSA: requiredFileSchema.optional().or(z.literal('')),
//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

//   employmentOrStatusLetter: requiredFileSchema.optional().or(z.literal('')),
//   previousIndianVisaCopy: requiredFileSchema.optional().or(z.literal('')),

//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),
//   nativeAddressDetails: requiredFileSchema.optional().or(z.literal('')),

//   affidavitInLieuOfOriginals: requiredFileSchema.optional().or(z.literal('')),
//   applicantUndertaking: requiredFileSchema.optional().or(z.literal('')),
//   spouseUndertaking: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociInLieuOfValidPioSchema = z.object({
//   serviceType: z.literal('oci-registration-in-lieu-of-pio-card'),

//   canceledIndianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   renunciationCertificate: requiredFileSchema.optional().or(z.literal('')),
//   usPassportCopy: requiredFileSchema.optional().or(z.literal('')),

//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),
//   birthCertificate: requiredFileSchema.optional().or(z.literal('')),
//   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),

//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

//   parentsAndSpouseDetails: requiredFileSchema.optional().or(z.literal('')),
//   referenceAddressIndia: requiredFileSchema.optional().or(z.literal('')),

//   pioCardOriginal: requiredFileSchema.optional().or(z.literal('')),
//   photographs2x2: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociInLieuOfLostPioSchema = z.object({
//   serviceType: z.literal('oci-registration-lostdamaged-pio-card'),

//   usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),

//   policeReportLostPio: requiredFileSchema.optional().or(z.literal('')),
//   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
//   birthCertificate: requiredFileSchema.optional().or(z.literal('')),

//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

//   parentsAndSpouseDetails: requiredFileSchema.optional().or(z.literal('')),
//   referenceAddressIndia: requiredFileSchema.optional().or(z.literal('')),

//   photographs2x2: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociLostDamagedSchema = z.object({
//   serviceType: z.literal('oci-lostdamaged'),

//   usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),

//   policeReport: requiredFileSchema.optional().or(z.literal('')),
//   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
//   birthCertificate: requiredFileSchema.optional().or(z.literal('')),

//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

//   parentsAndSpouseDetails: requiredFileSchema.optional().or(z.literal('')),
//   referenceAddressIndia: requiredFileSchema.optional().or(z.literal('')),

//   photographs2x2: requiredFileSchema.optional().or(z.literal('')),

//   familyOciCardCopy: requiredFileSchema.optional().or(z.literal('')),
// });

// export const ociSurrenderSchema = z.object({
//   serviceType: z.literal('oci-surrender'),

//   originalOciCard: requiredFileSchema.optional().or(z.literal('')),
//   drivingLicenseCopy: requiredFileSchema.optional().or(z.literal('')),
// });

// export const pioToOciSchema = z.object({
//   serviceType: z.literal('pio-to-oci-checklist'),

//   canceledIndianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
//   renunciationCertificate: requiredFileSchema.optional().or(z.literal('')),
//   usPassportCopy: requiredFileSchema.optional().or(z.literal('')),

//   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),
//   birthCertificate: requiredFileSchema.optional().or(z.literal('')),
//   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),

//   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

//   parentsAndSpouseDetails: requiredFileSchema.optional().or(z.literal('')),
//   referenceAddressIndia: requiredFileSchema.optional().or(z.literal('')),

//   pioCardOriginal: requiredFileSchema.optional().or(z.literal('')),
//   photographs2x2: requiredFileSchema.optional().or(z.literal('')),
// });

// // export const ociMiscAdultSchema = z.object({
// //   serviceType: z.literal('oci-misc-adult'),

// //   usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
// //   addressProofUSA: requiredFileSchema.optional().or(z.literal('')),

// //   originalOciCard: requiredFileSchema.optional().or(z.literal('')),
// //   naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
// //   birthCertificate: requiredFileSchema.optional().or(z.literal('')),

// //   nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),

// //   parentsAndSpouseDetails: requiredFileSchema.optional().or(z.literal('')),
// //   referenceAddressIndia: requiredFileSchema.optional().or(z.literal('')),

// //   affidavitInLieuOfOriginals: requiredFileSchema.optional().or(z.literal('')),
// //   photographs2x2: requiredFileSchema.optional().or(z.literal('')),
// // });

export const ociAdultSchema = z.object({
  serviceType: z.literal('oci-adult-application-checklist'),

  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),
  currentPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  lastIndianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  renunciationOrSurrenderCertificate: requiredFileSchema.optional().or(z.literal('')),
  legalStatusProof: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  maritalStatusProof: requiredFileSchema.optional().or(z.literal('')),
  nameChangeDocument: requiredFileSchema.optional().or(z.literal('')),
  employmentProof: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  ociUndertakingAffidavit: requiredFileSchema.optional().or(z.literal('')),
});

export const ociMinorSchema = z.object({
  serviceType: z.literal('oci-minor-application-checklist'),

  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),
  parentalAuthorizationForm: requiredFileSchema.optional().or(z.literal('')),
  currentPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  indianPassportOrRenunciationCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  parentsMarriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  parentsLegalStatusProof: requiredFileSchema.optional().or(z.literal('')),
  parentsOciCardCopies: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
});

export const ociSpouseSchema = z.object({
  serviceType: z.literal('oci-spouse-foreign-national'),

  ociApplicationForm: requiredFileSchema.optional().or(z.literal('')),
  photographAndSignature: requiredFileSchema.optional().or(z.literal('')),
  passportCopy: requiredFileSchema.optional().or(z.literal('')),
  apostilledBirthCertificate: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  spousePassportAndOciCopy: requiredFileSchema.optional().or(z.literal('')),
  legalStatusProof: requiredFileSchema.optional().or(z.literal('')),
  employmentLetter: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  affidavitInLieuOfOriginals: requiredFileSchema.optional().or(z.literal('')),
});

export const ociPioReplacementSchema = z.object({
  serviceType: z.literal('oci-registration-in-lieu-of-pio-card'),

  canceledIndianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  renunciationCertificate: requiredFileSchema.optional().or(z.literal('')),
  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  pioCardOriginal: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
});

export const ociLostSchema = z.object({
  serviceType: z.literal('oci-lostdamaged'),

  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  policeReport: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificate: requiredFileSchema.optional().or(z.literal('')),
  birthCertificate: requiredFileSchema.optional().or(z.literal('')),
  marriageCertificate: requiredFileSchema.optional().or(z.literal('')),
  spousePassportAndOciCopy: requiredFileSchema.optional().or(z.literal('')),
  passportPhotos2x2: requiredFileSchema.optional().or(z.literal('')),
});

export const ociUpdateSchema = z.object({
  serviceType: z.literal('oci-updates'),

  usPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  addressProof: requiredFileSchema.optional().or(z.literal('')),
  ociCardCopy: requiredFileSchema.optional().or(z.literal('')),
  naturalizationCertificateOrDate: requiredFileSchema.optional().or(z.literal('')),
  renunciationIndianPassportCopy: requiredFileSchema.optional().or(z.literal('')),
  photograph2x2: requiredFileSchema.optional().or(z.literal('')),
  signature: requiredFileSchema.optional().or(z.literal('')),
});

export const ociSurrenderSchema = z.object({
  serviceType: z.literal('oci-surrender'),

  originalOciCard: requiredFileSchema.optional().or(z.literal('')),
  drivingLicenseCopy: requiredFileSchema.optional().or(z.literal('')),
});

import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { ZodIssue } from 'zod/v3';

// The top-level response wrapper
export type ApiResponse<T = unknown> = {
  success: boolean; // API success/failure
  status: number; // HTTP status
  data: T; // Payload (can be object, array, message, etc.)
  error?: string; // Optional error message for failures
};

// Example: when data itself has message + nested data
export type ApiDataWithMessage<T = unknown> = {
  status: boolean; // internal API status
  message: string; // human readable msg
  data: T; // actual payload
};

export type ApiPagination = {
  count: number;
  currentPage: number;
  totalPages: number;
};

export const applicationSources = ['AdminPortal', 'AgentPortal', 'Website'] as const;
export type ApplicationSource = (typeof applicationSources)[number];

export type UserSession = {
  id: string;
  token: string;
};

export const taxBureauStatuses = ['Approved', 'Pending'] as const;
export const taxPackagesWithPrices = {
  personal_tax_filing: 150,
  business_tax_filing: 250,
  licensing_and_certification: 1000,
} as const;

export const taxPackagesWithPricesKeys = Object.keys(taxPackagesWithPrices) as [
  keyof typeof taxPackagesWithPrices,
  ...(keyof typeof taxPackagesWithPrices)[],
];

export const applicationStatuses = [
  'Draft',
  'Submitted',
  'Under Review',
  'Verification Pending',
  'Verified',
  'Additional Information Required',
  'Resubmitted',
  'Approved',
  'Rejected',
  'In Progress',
  'Ready for Dispatch',
  'Dispatched',
  'Delivered',
  'Cancelled',
  'Payment Pending',
  'Payment Completed',
  'Biometric Scheduled',
  'Biometric Completed',
  'Interview Scheduled',
  'On Hold',
] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

// ---
export enum UserTypeENUM {
  ADMIN = 'admin',
  SUBADMIN = 'sub-admin',
  AGENT = 'agent',
  USER = 'user',
}
export type UserDataType = {
  _id: string;
  role: UserTypeENUM;
  email: string;
  phone: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  countryCode?: string;
  country?: string;
  otp?: string | null;
  otpExpiryTime?: string | null;
  profilePicture?: string | null;
  isVerified: boolean;
  status: ApplicationStatus;
  isDeleted: boolean;
  deletedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  subAdminRoleId: {
    _id: string;
    name: string;
    permissions: PERMISSIONS_LIST_ENUM[];
  } | null;
};

export type BookingDataType = {
  _id: string;
  agent?: string;
  // fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  amount: number;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  dropDate: string;
  customerSelectedVehicleInfo: string; // e.g., "One-way", "Round-trip"
  assignedVehicle: string; // Vehicle ID
  assignedDriver: string; // Driver ID
  tripPurpose: string;
  numberOfPassanger: string; // Note: API uses "numberOfPassanger" (typo in API)
  destination: string;
  approxKilometer: string;
  estFare: string;
  paymentStatus: string; // e.g., "Paid", "Unpaid", "Pending"
  bookingStatus: string; // e.g., "Confirmed", "Pending", "Cancelled"
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
export type DriverDataType = {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phone: string;
  licenseNumber: string; // Driver’s license ID
  licenseExpiry?: string; // License expiry date
  assignedVehicleId?: string; // Ref to Vehicle
  status: string; // e.g., "active", "inactive", "suspended"
  profilePicture?: string | null;
  address?: string;
  isDeleted: boolean;
  deletedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
// =======================
// Vehicle Type
// =======================
export type VehicleDataType = {
  _id: string;
  type: string; // e.g., "Car", "Van", "Bus"
  make: string; // Vehicle brand (e.g., Toyota, Ford)
  model: string; // Model name (e.g., Corolla, Transit)
  year?: number; // Manufacturing year (optional)
  licensePlate: string; // Registration/license plate
  vin?: string; // Vehicle Identification Number
  capacity?: number; // Seating/weight capacity (optional)
  color?: string; // Optional vehicle color
  status: string; // e.g., "active", "inactive", "in-service"
  assignedDriver?: string; // Reference to a User/Driver ID
  isDeleted: boolean;
  deletedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type RoleDataType = {
  _id: string;
  name: string;
  description: string;
  permissions: PERMISSIONS_LIST_ENUM[];
  isDeleted: boolean;
  deletedBy: any;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AgencyDataType = {
  _id: string;
  name: string;
  email: string;
  businessType: string;
  authorizedRepresentativeName: string;
  website: string;
  contactEmail: string;
  countryCode: string;
  phone: string;
  taxIdOrLicense: string;
  preferredEmbassyLocation: string;
  address: Address;
  governmentBusinessRegistrationCertificate: {
    file: string;
    fileName: string;
    mimeType: string;
  };
  identityProofOfRepresentative: {
    file: string;
    fileName: string;
    mimeType: string;
  };
  authorizationLetter: {
    file: string;
    fileName: string;
    mimeType: string;
  };
  bankStatement: {
    file: string;
    fileName: string;
    mimeType: string;
  };
  managers: {
    _id: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    phone: string;
    status: string;
    id: string;
    isVerified: boolean;
  }[];
  status: string;
  isDeleted: boolean;
  deletedBy: any;
  deletedAt: any;
  agentDiscount: number;
  registrationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalNotes: string;
  approvedBy: any;
  portalCredentialsSent: boolean;
  creditDetails: {
    creditLimit: number;
    creditUsed: number;
    availableCredit: number;
    lastCreditUpdatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  _id: string;
}

export type TaxBureauDataType = {
  _id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  officeAddress: string;
  businessType: string;
  ptinNumber: string;
  efinNumber: string;
  efinStatus: string;
  enrolledServices: string[];
  experienceLevel: string;
  expectedVolume: string;
  softwarePreference: string;
  description: string;
  agreementName: string;
  agreementSignature: string;
  agreementDate: string;
  selectedPackage: string;
  selectedPackagePrice: string;
  submittedSource: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// ----------------------------
export type ErrorInstance = { response: { data: { message: string } } };
export type ErrorInstance2 = {
  data: { message: string; errors: Record<string, string> | ZodIssue[] };
};
export type ErrorInstanceCombine = { message?: string } & ErrorInstance2 & ErrorInstance;

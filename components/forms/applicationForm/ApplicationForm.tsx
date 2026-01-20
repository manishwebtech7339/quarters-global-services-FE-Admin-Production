'use client';
import React, { useEffect, useState, useTransition } from 'react';
import DocumentForm from './DocumentForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ComboSelect from './components/ComboSelect';
import PackageAddons from './components/PackageAddons';
import { toast } from 'sonner';
import { createApplicationValidator, CreateApplicationType } from './schemas/index';

import { emailSchema } from '@/lib/formSchemaFunctions';
import {
  changeStatusApplication,
  createApplication,
  editApplication,
} from '@/services/applicatonService';
import handleAsync from '@/lib/handleAsync';
import { applicationSources, ApplicationStatus, applicationStatuses } from '@/lib/types';
import Link from 'next/link';
import { getUsers } from '@/services/usersService';
import { uploadFile } from '@/lib/uploadUtils';
import PersonalInfo from './PersonalInfo';
import PassportDetails from './PassportDetails';
import ContactInfo from './ContactInfo';
import FamilyInfo from './FamilyInfo';
import WorkSchoolInfo from './WorkSchoolInfo';
import TravelToIndia from './TravelToIndia';
import ReferenceIndia from './ReferenceIndia';
import ReferenceUSA from './ReferenceUsa';
import AdditionalQuestions from './AdditionalQuestion';
import USPassportForm from './USPassportForm';
import { useRouter } from 'next/navigation';
import { visaServices_platformServiceId } from '@/lib/staticIds';
import { OtpModal } from '@/components/common/OtpModal';

const ApplicationForm = ({
  isView = false,
  isEdit = false,
  applicationData,
}: {
  isView?: boolean;
  isEdit?: boolean;
  applicationData?: any;
}) => {
  const router = useRouter();
  // Helper function to extract addon IDs from application data
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  const [isSubCategoriesAvailable, setIsSubCategoriesAvailable] = useState(
    !!applicationData?.platformServiceSubCategoryId,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    applicationData?.serviceFields?.serviceType || '',
  );
  const [countrySlug, setCountrySlug] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [_startCheckUserLoading, setCheckUserLoading] = useTransition();
  const form = useForm<CreateApplicationType>({
    resolver: zodResolver(createApplicationValidator),
    defaultValues: {
      fromCountryId: applicationData?.fromCountryId || '',
      toCountryId: applicationData?.toCountryId || '',
      platformServiceId: applicationData?.platformServiceId || '',
      platformServiceCategoryId: applicationData?.platformServiceCategoryId || '',
      platformServiceSubCategoryId: applicationData?.platformServiceSubCategoryId || '',
      platformServiceCategoryPackageId: applicationData?.platformServiceCategoryPackageId || '',
      platformServiceCategoryPackageAddonsId:
        applicationData?.platformServiceCategoryPackageAddonsId || [],
      firstName: applicationData?.firstName || '',
      lastName: applicationData?.lastName || '',
      email: applicationData?.email || '',
      countryCode: applicationData?.countryCode || '',
      phone: applicationData?.phone || '',
      country: applicationData?.address?.country || '',
      address: applicationData?.address?.addressLine1 || '',
      city: applicationData?.address?.city || '',
      state: applicationData?.address?.state || '',
      pincode: applicationData?.address?.zipCode || '',
      notes: applicationData?.description || '',

      // Personal Information fields
      middleName: applicationData?.serviceFields?.middleName || '',
      previousNames: applicationData?.serviceFields?.previousNames || '',
      sex: applicationData?.serviceFields?.sex || '',
      dob: applicationData?.serviceFields?.dob || '',
      birthCity: applicationData?.serviceFields?.birthCity || '',
      birthState: applicationData?.serviceFields?.birthState || '',
      countryOfBirth: applicationData?.serviceFields?.countryOfBirth || '',
      countryOfBirthOther: applicationData?.serviceFields?.countryOfBirthOther || '',
      nationalId: applicationData?.serviceFields?.nationalId || '',
      religion: applicationData?.serviceFields?.religion || '',
      visibleMarks: applicationData?.serviceFields?.visibleMarks || '',
      educationLevel: applicationData?.serviceFields?.educationLevel || '',
      educationOther: applicationData?.serviceFields?.educationOther || '',
      citizenshipCountry: applicationData?.serviceFields?.citizenshipCountry || '',
      citizenshipCountryOther: applicationData?.serviceFields?.citizenshipCountryOther || '',
      citizenshipAcquiredBy: applicationData?.serviceFields?.citizenshipAcquiredBy || '',
      previousCitizenship: applicationData?.serviceFields?.previousCitizenship || '',
      previousCitizenshipOther: applicationData?.serviceFields?.previousCitizenshipOther || '',

      // Passport Details fields
      passportNumber: applicationData?.serviceFields?.passportNumber || '',
      passportIssuingAuthority: applicationData?.serviceFields?.passportIssuingAuthority || '',
      passportIssueDate: applicationData?.serviceFields?.passportIssueDate || '',
      passportExpiryDate: applicationData?.serviceFields?.passportExpiryDate || '',
      holdsOtherPassport: applicationData?.serviceFields?.holdsOtherPassport || '',
      otherPassportNumber: applicationData?.serviceFields?.otherPassportNumber || '',
      otherPassportIssuingAuthority:
        applicationData?.serviceFields?.otherPassportIssuingAuthority || '',
      otherPassportIssueDate: applicationData?.serviceFields?.otherPassportIssueDate || '',
      otherPassportExpiryDate: applicationData?.serviceFields?.otherPassportExpiryDate || '',

      // Contact Information fields
      homeAddress: applicationData?.serviceFields?.homeAddress || '',
      homeCity: applicationData?.serviceFields?.homeCity || '',
      homeState: applicationData?.serviceFields?.homeState || '',
      homeZip: applicationData?.serviceFields?.homeZip || '',
      isPermanentAddress: applicationData?.serviceFields?.isPermanentAddress || '',
      permAddress: applicationData?.serviceFields?.permAddress || '',
      permCity: applicationData?.serviceFields?.permCity || '',
      permState: applicationData?.serviceFields?.permState || '',
      permZip: applicationData?.serviceFields?.permZip || '',
      permCountry: applicationData?.serviceFields?.permCountry || '',
      homePhone: applicationData?.serviceFields?.homePhone || '',
      mobilePhone: applicationData?.serviceFields?.mobilePhone || '',
      homeEmail: applicationData?.serviceFields?.homeEmail || '',

      // Family Information fields
      fatherName: applicationData?.serviceFields?.fatherName || '',
      fatherBirthCity: applicationData?.serviceFields?.fatherBirthCity || '',
      fatherBirthState: applicationData?.serviceFields?.fatherBirthState || '',
      fatherBirthCountry: applicationData?.serviceFields?.fatherBirthCountry || '',
      fatherCitizenship: applicationData?.serviceFields?.fatherCitizenship || '',
      fatherPrevCitizenship: applicationData?.serviceFields?.fatherPrevCitizenship || '',
      motherName: applicationData?.serviceFields?.motherName || '',
      motherBirthCity: applicationData?.serviceFields?.motherBirthCity || '',
      motherBirthState: applicationData?.serviceFields?.motherBirthState || '',
      motherBirthCountry: applicationData?.serviceFields?.motherBirthCountry || '',
      motherCitizenship: applicationData?.serviceFields?.motherCitizenship || '',
      motherPrevCitizenship: applicationData?.serviceFields?.motherPrevCitizenship || '',
      maritalStatus: applicationData?.serviceFields?.maritalStatus || '',
      spouseName: applicationData?.serviceFields?.spouseName || '',
      spouseCitizenship: applicationData?.serviceFields?.spouseCitizenship || '',
      spousePrevCitizenship: applicationData?.serviceFields?.spousePrevCitizenship || '',
      spouseBirthCity: applicationData?.serviceFields?.spouseBirthCity || '',
      spouseBirthState: applicationData?.serviceFields?.spouseBirthState || '',
      spouseBirthCountry: applicationData?.serviceFields?.spouseBirthCountry || '',
      grandparentsPakistan: applicationData?.serviceFields?.grandparentsPakistan || '',
      grandparentsPakistanDetails:
        applicationData?.serviceFields?.grandparentsPakistanDetails || '',

      // Work/School Information fields
      occupation: applicationData?.serviceFields?.occupation || '',
      jobTitle: applicationData?.serviceFields?.jobTitle || '',
      employerOrSchool: applicationData?.serviceFields?.employerOrSchool || '',
      workAddress: applicationData?.serviceFields?.workAddress || '',
      workCity: applicationData?.serviceFields?.workCity || '',
      workState: applicationData?.serviceFields?.workState || '',
      workZip: applicationData?.serviceFields?.workZip || '',
      workPhone: applicationData?.serviceFields?.workPhone || '',
      workEmail: applicationData?.serviceFields?.workEmail || '',
      previousOccupation: applicationData?.serviceFields?.previousOccupation || '',
      militaryService: applicationData?.serviceFields?.militaryService || '',
      militaryCountryBranch: applicationData?.serviceFields?.militaryCountryBranch || '',
      militarySpecialization: applicationData?.serviceFields?.militarySpecialization || '',
      militaryHighestRank: applicationData?.serviceFields?.militaryHighestRank || '',
      militaryCity: applicationData?.serviceFields?.militaryCity || '',
      militaryState: applicationData?.serviceFields?.militaryState || '',
      militaryCountry: applicationData?.serviceFields?.militaryCountry || '',

      // Travel to India fields
      visaType: applicationData?.serviceFields?.visaType || '',
      expectedArrivalDate: applicationData?.serviceFields?.expectedArrivalDate || '',
      arrivalCity: applicationData?.serviceFields?.arrivalCity || '',
      exitCity: applicationData?.serviceFields?.exitCity || '',
      otherIndianCities: applicationData?.serviceFields?.otherIndianCities || '',
      purposeOfVisit: applicationData?.serviceFields?.purposeOfVisit || '',
      previousVisitToIndia: applicationData?.serviceFields?.previousVisitToIndia || '',
      prevHotelAddress: applicationData?.serviceFields?.prevHotelAddress || '',
      prevCitiesVisited: applicationData?.serviceFields?.prevCitiesVisited || '',
      prevVisaNumber: applicationData?.serviceFields?.prevVisaNumber || '',
      prevVisaIssuedBy: applicationData?.serviceFields?.prevVisaIssuedBy || '',
      prevVisaType: applicationData?.serviceFields?.prevVisaType || '',
      prevVisaIssuedDate: applicationData?.serviceFields?.prevVisaIssuedDate || '',
      visaRefused: applicationData?.serviceFields?.visaRefused || '',
      visaRefusalDetails: applicationData?.serviceFields?.visaRefusalDetails || '',
      countriesVisited10Years: applicationData?.serviceFields?.countriesVisited10Years || '',

      // Reference in India fields
      refIndiaName: applicationData?.serviceFields?.refIndiaName || '',
      refIndiaCompany: applicationData?.serviceFields?.refIndiaCompany || '',
      refIndiaAddress1: applicationData?.serviceFields?.refIndiaAddress1 || '',
      refIndiaAddress2: applicationData?.serviceFields?.refIndiaAddress2 || '',
      refIndiaPhone: applicationData?.serviceFields?.refIndiaPhone || '',
      refIndiaEmail: applicationData?.serviceFields?.refIndiaEmail || '',

      // Reference in USA fields
      refUSAName: applicationData?.serviceFields?.refUSAName || '',
      refUSACompany: applicationData?.serviceFields?.refUSACompany || '',
      refUSAAddress: applicationData?.serviceFields?.refUSAAddress || '',
      refUSACity: applicationData?.serviceFields?.refUSACity || '',
      refUSAState: applicationData?.serviceFields?.refUSAState || '',
      refUSAZip: applicationData?.serviceFields?.refUSAZip || '',
      refUSAPhone: applicationData?.serviceFields?.refUSAPhone || '',
      refUSAEmail: applicationData?.serviceFields?.refUSAEmail || '',

      // Additional Questions fields
      refusedEntryDeported: applicationData?.serviceFields?.refusedEntryDeported || '',
      refusedEntryDetails: applicationData?.serviceFields?.refusedEntryDetails || '',
      everArrested: applicationData?.serviceFields?.everArrested || '',
      arrestedDetails: applicationData?.serviceFields?.arrestedDetails || '',
      everConvicted: applicationData?.serviceFields?.everConvicted || '',
      convictedDetails: applicationData?.serviceFields?.convictedDetails || '',

      // -
      additionalServiceFields: {
        paymentMethod: applicationData?.serviceFields?.paymentMethod || '',
        paymentStatus: applicationData?.serviceFields?.paymentStatus || '',
        totalAmount: applicationData?.serviceFields?.totalAmount || '',
        courierId: applicationData?.serviceFields?.courierId || '',
        paidAmount: applicationData?.serviceFields?.paidAmount || '',
        passportNumber: applicationData?.serviceFields?.passportNumber || '',
        paymentId: applicationData?.serviceFields?.paymentId || '',
      },
      documents: {
        serviceType: applicationData?.serviceFields?.serviceType || 'empty',
      },
    },
    mode: 'all',
  });
  console.log(form.formState.errors, ':Application form errors');

  const onSubmit = handleAsync(async (values: CreateApplicationType) => {
    // Handle documents upload - send URL strings instead of objects
    const processedDocuments: Record<string, string> = {};
    for (const [key, doc] of Object.entries(values.documents)) {
      if (key === 'serviceType') continue; // Skip serviceType field

      if (doc instanceof File) {
        const uploadedUrl = await uploadFile(doc, `application-${key}`);
        if (!uploadedUrl) {
          throw new Error(`Failed to upload document: ${key}`);
        }
        processedDocuments[key] = uploadedUrl; // Just the URL string
      } else if (typeof doc === 'string' && doc.trim()) {
        processedDocuments[key] = doc; // Existing URL string
      }
    }

    // Transform form data to backend payload format
    const backendPayload = {
      applications: [
        {
          isSubmittedFromApplication: true,

          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          countryCode: values.countryCode,
          phone: values.phone,
          description: values.notes || '',
          address: {
            addressLine1: values.address,
            addressLine2: '',
            city: values.city,
            state: values.state,
            zipCode: values.pincode,
            country: values.country,
          },
          currentLegalAddress: {
            addressLine1: values.address,
            addressLine2: '',
            city: values.city,
            state: values.state,
            zipCode: values.pincode,
            country: values.country,
          },

          status: 'Submitted',
          applicationSource: applicationSources?.[0],

          fromCountryId: values.fromCountryId,
          toCountryId: values.toCountryId,
          platformServices: [
            {
              platformServiceId: values.platformServiceId,
              platformServiceCategoryId: values.platformServiceCategoryId,
              ...(values.platformServiceSubCategoryId && {
                platformServiceSubCategoryId: values.platformServiceSubCategoryId,
              }),
              platformServiceCategoryPackageId: values.platformServiceCategoryPackageId,
              platformServiceCategoryPackageAddonsId: values.platformServiceCategoryPackageAddonsId
                ? values.platformServiceCategoryPackageAddonsId
                : [],
            },
          ],

          serviceFields: {
            ...values.additionalServiceFields,
            serviceType: values.documents.serviceType,
            ...processedDocuments,
            // Personal Information fields
            middleName: values.middleName,
            previousNames: values.previousNames,
            sex: values.sex,
            dob: values.dob,
            birthCity: values.birthCity,
            birthState: values.birthState,
            countryOfBirth: values.countryOfBirth,
            countryOfBirthOther: values.countryOfBirthOther,
            nationalId: values.nationalId,
            religion: values.religion,
            visibleMarks: values.visibleMarks,
            educationLevel: values.educationLevel,
            educationOther: values.educationOther,
            citizenshipCountry: values.citizenshipCountry,
            citizenshipCountryOther: values.citizenshipCountryOther,
            citizenshipAcquiredBy: values.citizenshipAcquiredBy,
            previousCitizenship: values.previousCitizenship,
            previousCitizenshipOther: values.previousCitizenshipOther,
            // Passport Details fields
            passportNumber: values.passportNumber,
            passportIssuingAuthority: values.passportIssuingAuthority,
            passportIssueDate: values.passportIssueDate,
            passportExpiryDate: values.passportExpiryDate,
            holdsOtherPassport: values.holdsOtherPassport,
            otherPassportNumber: values.otherPassportNumber,
            otherPassportIssuingAuthority: values.otherPassportIssuingAuthority,
            otherPassportIssueDate: values.otherPassportIssueDate,
            otherPassportExpiryDate: values.otherPassportExpiryDate,
            // Contact Information fields
            homeAddress: values.homeAddress,
            homeCity: values.homeCity,
            homeState: values.homeState,
            homeZip: values.homeZip,
            isPermanentAddress: values.isPermanentAddress,
            permAddress: values.permAddress,
            permCity: values.permCity,
            permState: values.permState,
            permZip: values.permZip,
            permCountry: values.permCountry,
            homePhone: values.homePhone,
            mobilePhone: values.mobilePhone,
            homeEmail: values.homeEmail,
            // Family Information fields
            fatherName: values.fatherName,
            fatherBirthCity: values.fatherBirthCity,
            fatherBirthState: values.fatherBirthState,
            fatherBirthCountry: values.fatherBirthCountry,
            fatherCitizenship: values.fatherCitizenship,
            fatherPrevCitizenship: values.fatherPrevCitizenship,
            motherName: values.motherName,
            motherBirthCity: values.motherBirthCity,
            motherBirthState: values.motherBirthState,
            motherBirthCountry: values.motherBirthCountry,
            motherCitizenship: values.motherCitizenship,
            motherPrevCitizenship: values.motherPrevCitizenship,
            maritalStatus: values.maritalStatus,
            spouseName: values.spouseName,
            spouseCitizenship: values.spouseCitizenship,
            spousePrevCitizenship: values.spousePrevCitizenship,
            spouseBirthCity: values.spouseBirthCity,
            spouseBirthState: values.spouseBirthState,
            spouseBirthCountry: values.spouseBirthCountry,
            grandparentsPakistan: values.grandparentsPakistan,
            grandparentsPakistanDetails: values.grandparentsPakistanDetails,
            // Work/School Information fields
            occupation: values.occupation,
            jobTitle: values.jobTitle,
            employerOrSchool: values.employerOrSchool,
            workAddress: values.workAddress,
            workCity: values.workCity,
            workState: values.workState,
            workZip: values.workZip,
            workPhone: values.workPhone,
            workEmail: values.workEmail,
            previousOccupation: values.previousOccupation,
            militaryService: values.militaryService,
            militaryCountryBranch: values.militaryCountryBranch,
            militarySpecialization: values.militarySpecialization,
            militaryHighestRank: values.militaryHighestRank,
            militaryCity: values.militaryCity,
            militaryState: values.militaryState,
            militaryCountry: values.militaryCountry,
            // Travel to India fields
            visaType: values.visaType,
            expectedArrivalDate: values.expectedArrivalDate,
            arrivalCity: values.arrivalCity,
            exitCity: values.exitCity,
            otherIndianCities: values.otherIndianCities,
            purposeOfVisit: values.purposeOfVisit,
            previousVisitToIndia: values.previousVisitToIndia,
            prevHotelAddress: values.prevHotelAddress,
            prevCitiesVisited: values.prevCitiesVisited,
            prevVisaNumber: values.prevVisaNumber,
            prevVisaIssuedBy: values.prevVisaIssuedBy,
            prevVisaType: values.prevVisaType,
            prevVisaIssuedDate: values.prevVisaIssuedDate,
            visaRefused: values.visaRefused,
            visaRefusalDetails: values.visaRefusalDetails,
            countriesVisited10Years: values.countriesVisited10Years,
            // Reference in India fields
            refIndiaName: values.refIndiaName,
            refIndiaCompany: values.refIndiaCompany,
            refIndiaAddress1: values.refIndiaAddress1,
            refIndiaAddress2: values.refIndiaAddress2,
            refIndiaPhone: values.refIndiaPhone,
            refIndiaEmail: values.refIndiaEmail,
            // Reference in USA fields
            refUSAName: values.refUSAName,
            refUSACompany: values.refUSACompany,
            refUSAAddress: values.refUSAAddress,
            refUSACity: values.refUSACity,
            refUSAState: values.refUSAState,
            refUSAZip: values.refUSAZip,
            refUSAPhone: values.refUSAPhone,
            refUSAEmail: values.refUSAEmail,
            // Additional Questions fields
            refusedEntryDeported: values.refusedEntryDeported,
            refusedEntryDetails: values.refusedEntryDetails,
            everArrested: values.everArrested,
            arrestedDetails: values.arrestedDetails,
            everConvicted: values.everConvicted,
            convictedDetails: values.convictedDetails,
          },
        },
      ],
    };
    await createApplication(backendPayload);
    toast.success('Application submitted successfully!');
    router.push('/admin/applications?revalidate=' + Date.now());
  });

  const onEditSubmit = handleAsync(async (values: CreateApplicationType) => {
    // Handle documents upload - send URL strings instead of objects
    const processedDocuments: Record<string, string> = {};
    for (const [key, doc] of Object.entries(values.documents)) {
      if (key === 'serviceType') continue; // Skip serviceType field

      if (doc instanceof File) {
        const uploadedUrl = await uploadFile(doc, `application-${key}`);
        if (!uploadedUrl) {
          throw new Error(`Failed to upload document: ${key}`);
        }
        processedDocuments[key] = uploadedUrl; // Just the URL string
      } else if (typeof doc === 'string' && doc.trim()) {
        processedDocuments[key] = doc; // Existing URL string
      }
    }

    // Transform form data to backend payload format
    const backendPayload = {
      id: applicationData._id,
      firstName: values.firstName,
      lastName: values.lastName,
      countryCode: values.countryCode,
      phone: values.phone,
      description: values.notes || '',
      address: {
        addressLine1: values.address,
        addressLine2: '',
        city: values.city,
        state: values.state,
        zipCode: values.pincode,
        country: values.country,
      },
      currentLegalAddress: {
        addressLine1: values.address,
        addressLine2: '',
        city: values.city,
        state: values.state,
        zipCode: values.pincode,
        country: values.country,
      },
      // status: 'Submitted', // Don't change status on edit from submit
      fromCountryId: values.fromCountryId,
      toCountryId: values.toCountryId,
      platformServices: [
        {
          platformServiceId: values.platformServiceId,
          platformServiceCategoryId: values.platformServiceCategoryId,
          ...(values.platformServiceSubCategoryId && {
            platformServiceSubCategoryId: values.platformServiceSubCategoryId,
          }),
          platformServiceCategoryPackageId: values.platformServiceCategoryPackageId,
          platformServiceCategoryPackageAddonsId: values.platformServiceCategoryPackageAddonsId
            ? values.platformServiceCategoryPackageAddonsId
            : [],
        },
      ],
      serviceFields: {
        ...values.additionalServiceFields,
        serviceType: values.documents.serviceType,
        ...processedDocuments,
        // Personal Information fields
        middleName: values.middleName,
        previousNames: values.previousNames,
        sex: values.sex,
        dob: values.dob,
        birthCity: values.birthCity,
        birthState: values.birthState,
        countryOfBirth: values.countryOfBirth,
        countryOfBirthOther: values.countryOfBirthOther,
        nationalId: values.nationalId,
        religion: values.religion,
        visibleMarks: values.visibleMarks,
        educationLevel: values.educationLevel,
        educationOther: values.educationOther,
        citizenshipCountry: values.citizenshipCountry,
        citizenshipCountryOther: values.citizenshipCountryOther,
        citizenshipAcquiredBy: values.citizenshipAcquiredBy,
        previousCitizenship: values.previousCitizenship,
        previousCitizenshipOther: values.previousCitizenshipOther,
        // Passport Details fields
        passportNumber: values.passportNumber,
        passportIssuingAuthority: values.passportIssuingAuthority,
        passportIssueDate: values.passportIssueDate,
        passportExpiryDate: values.passportExpiryDate,
        holdsOtherPassport: values.holdsOtherPassport,
        otherPassportNumber: values.otherPassportNumber,
        otherPassportIssuingAuthority: values.otherPassportIssuingAuthority,
        otherPassportIssueDate: values.otherPassportIssueDate,
        otherPassportExpiryDate: values.otherPassportExpiryDate,
        // Contact Information fields
        homeAddress: values.homeAddress,
        homeCity: values.homeCity,
        homeState: values.homeState,
        homeZip: values.homeZip,
        isPermanentAddress: values.isPermanentAddress,
        permAddress: values.permAddress,
        permCity: values.permCity,
        permState: values.permState,
        permZip: values.permZip,
        permCountry: values.permCountry,
        homePhone: values.homePhone,
        mobilePhone: values.mobilePhone,
        homeEmail: values.homeEmail,
        // Family Information fields
        fatherName: values.fatherName,
        fatherBirthCity: values.fatherBirthCity,
        fatherBirthState: values.fatherBirthState,
        fatherBirthCountry: values.fatherBirthCountry,
        fatherCitizenship: values.fatherCitizenship,
        fatherPrevCitizenship: values.fatherPrevCitizenship,
        motherName: values.motherName,
        motherBirthCity: values.motherBirthCity,
        motherBirthState: values.motherBirthState,
        motherBirthCountry: values.motherBirthCountry,
        motherCitizenship: values.motherCitizenship,
        motherPrevCitizenship: values.motherPrevCitizenship,
        maritalStatus: values.maritalStatus,
        spouseName: values.spouseName,
        spouseCitizenship: values.spouseCitizenship,
        spousePrevCitizenship: values.spousePrevCitizenship,
        spouseBirthCity: values.spouseBirthCity,
        spouseBirthState: values.spouseBirthState,
        spouseBirthCountry: values.spouseBirthCountry,
        grandparentsPakistan: values.grandparentsPakistan,
        grandparentsPakistanDetails: values.grandparentsPakistanDetails,
        // Work/School Information fields
        occupation: values.occupation,
        jobTitle: values.jobTitle,
        employerOrSchool: values.employerOrSchool,
        workAddress: values.workAddress,
        workCity: values.workCity,
        workState: values.workState,
        workZip: values.workZip,
        workPhone: values.workPhone,
        workEmail: values.workEmail,
        previousOccupation: values.previousOccupation,
        militaryService: values.militaryService,
        militaryCountryBranch: values.militaryCountryBranch,
        militarySpecialization: values.militarySpecialization,
        militaryHighestRank: values.militaryHighestRank,
        militaryCity: values.militaryCity,
        militaryState: values.militaryState,
        militaryCountry: values.militaryCountry,
        // Travel to India fields
        visaType: values.visaType,
        expectedArrivalDate: values.expectedArrivalDate,
        arrivalCity: values.arrivalCity,
        exitCity: values.exitCity,
        otherIndianCities: values.otherIndianCities,
        purposeOfVisit: values.purposeOfVisit,
        previousVisitToIndia: values.previousVisitToIndia,
        prevHotelAddress: values.prevHotelAddress,
        prevCitiesVisited: values.prevCitiesVisited,
        prevVisaNumber: values.prevVisaNumber,
        prevVisaIssuedBy: values.prevVisaIssuedBy,
        prevVisaType: values.prevVisaType,
        prevVisaIssuedDate: values.prevVisaIssuedDate,
        visaRefused: values.visaRefused,
        visaRefusalDetails: values.visaRefusalDetails,
        countriesVisited10Years: values.countriesVisited10Years,
        // Reference in India fields
        refIndiaName: values.refIndiaName,
        refIndiaCompany: values.refIndiaCompany,
        refIndiaAddress1: values.refIndiaAddress1,
        refIndiaAddress2: values.refIndiaAddress2,
        refIndiaPhone: values.refIndiaPhone,
        refIndiaEmail: values.refIndiaEmail,
        // Reference in USA fields
        refUSAName: values.refUSAName,
        refUSACompany: values.refUSACompany,
        refUSAAddress: values.refUSAAddress,
        refUSACity: values.refUSACity,
        refUSAState: values.refUSAState,
        refUSAZip: values.refUSAZip,
        refUSAPhone: values.refUSAPhone,
        refUSAEmail: values.refUSAEmail,
        // Additional Questions fields
        refusedEntryDeported: values.refusedEntryDeported,
        refusedEntryDetails: values.refusedEntryDetails,
        everArrested: values.everArrested,
        arrestedDetails: values.arrestedDetails,
        everConvicted: values.everConvicted,
        convictedDetails: values.convictedDetails,
      },
    };
    await editApplication(backendPayload);
    toast.success('Application edited successfully!');
    router.push('/admin/applications?revalidate=' + Date.now());
  });

  // Check is  user data exist when entered email
  const _checkExistingUserData = handleAsync(async () => {
    const email = form.getValues('email') || '';
    const validation = emailSchema().safeParse(email);
    if (!validation.success) {
      console.log(validation.error || 'Invalid email');
      return;
    }
    setCheckUserLoading(async () => {
      const user = await getUsers({ search: email })?.then((e) => e?.data?.[0]);
      if (user) {
        form.setValue('firstName', user.firstName || '');
        form.setValue('lastName', user.lastName || '');
        form.setValue('phone', user.phone || '');
        form.setValue('country', user.country || '');
      }
    });
  });

  // Handle application status  change
  const handleApplicationStatusChange = handleAsync(async (status: ApplicationStatus) => {
    const payload = {
      id: applicationData._id,
      status,
    };
    await changeStatusApplication(payload);
    toast.success(`Application status changed to ${status}`);
  });

  // Set default values
  useEffect(() => {
    if (Object.keys(applicationData || {}).length) {
      form.reset({
        fromCountryId: applicationData?.fromCountryId || '',
        toCountryId: applicationData?.toCountryId || '',
        platformServiceId: applicationData?.platformServiceId || '',
        platformServiceCategoryId: applicationData?.platformServiceCategoryId || '',
        platformServiceSubCategoryId: applicationData?.platformServiceSubCategoryId || '',
        platformServiceCategoryPackageId: applicationData?.platformServiceCategoryPackageId || '',
        platformServiceCategoryPackageAddonsId:
          applicationData?.platformServiceCategoryPackageAddonsId || [],
        firstName: applicationData?.firstName || '',
        lastName: applicationData?.lastName || '',
        email: applicationData?.email || '',
        countryCode: applicationData?.countryCode || '',
        phone: applicationData?.phone || '',
        country: applicationData?.address?.country || '',
        address: applicationData?.address?.addressLine1 || '',
        city: applicationData?.address?.city || '',
        state: applicationData?.address?.state || '',
        pincode: applicationData?.address?.zipCode || '',
        notes: applicationData?.description || '',
        // -
        additionalServiceFields: {
          paymentMethod: applicationData?.serviceFields?.paymentMethod || '',
          paymentStatus: applicationData?.serviceFields?.paymentStatus || '',
          totalAmount: applicationData?.serviceFields?.totalAmount || '',
          courierId: applicationData?.serviceFields?.courierId || '',
          paidAmount: applicationData?.serviceFields?.paidAmount || '',
          passportNumber: applicationData?.serviceFields?.passportNumber || '',
          paymentId: applicationData?.serviceFields?.paymentId || '',
        },
        documents: {
          serviceType: applicationData?.serviceFields?.serviceType || 'empty',
          // Populate existing document fields dynamically
          ...Object.keys(applicationData?.serviceFields || {})
            .filter(
              (key) =>
                key !== 'serviceType' &&
                key !== 'paymentMethod' &&
                key !== 'paymentStatus' &&
                key !== 'totalAmount' &&
                key !== 'courierId' &&
                key !== 'paidAmount' &&
                key !== 'passportNumber' &&
                key !== 'paymentId',
            )
            .reduce(
              (docs, key) => {
                const docData = applicationData?.serviceFields?.[key];
                if (docData) {
                  // Handle both old object format {file: "url"} and new string format "url"
                  if (typeof docData === 'object' && docData.file) {
                    docs[key] = docData.file; // Old format: use the file URL
                  } else if (typeof docData === 'string' && docData.trim()) {
                    docs[key] = docData; // New format: direct URL string
                  }
                }
                return docs;
              },
              {} as Record<string, any>,
            ),
        },
      });
      if (applicationData?.serviceFields?.serviceType) {
        setSelectedCategory(applicationData?.serviceFields?.serviceType);
      }
      if (applicationData?.platformServiceSubCategoryId) {
        setIsSubCategoriesAvailable(true);
      }
    }
  }, [applicationData, form]);

  // Set default serviceType for US passport forms
  useEffect(() => {
    if (countrySlug === 'united-states' && serviceSlug === 'passport') {
      // Set a default USA passport service type for validation
      form.setValue('documents.serviceType', 'new-passport' as any);
    }
  }, [countrySlug, serviceSlug, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(isEdit ? onEditSubmit : onSubmit)} className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg font-semibold">Application</p>
          <div className="flex gap-2">
            {(isView || isEdit) && (
              <Select
                onValueChange={handleApplicationStatusChange}
                defaultValue={applicationData?.status || 'Submitted'}
                disabled={isView || !isEdit}
              >
                <SelectTrigger className="w-fit min-w-44">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {applicationStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Link
              target="_blank"
              href={
                countrySlug === 'united-states' && serviceSlug === 'passport'
                  ? 'https://drive.google.com/file/d/19OZMQlrTUvN19A8QQ2ZbZbpqCyvjONOs/view?usp=sharing'
                  : 'https://drive.google.com/file/d/19OZMQlrTUvN19A8QQ2ZbZbpqCyvjONOs/view?usp=sharing'
              }
              className="!h-12 flex items-center border  rounded-md px-4"
            >
              Download Form
            </Link>
          </div>
        </div>
        {/* {!isView && (
            <Select>
              <SelectTrigger className="w-full max-w-52">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
              </SelectContent>
            </Select>
          )} */}

        {/*   Application Details */}
        <div className="space-y-6">
          {/* ---- Service Details ---- */}
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
            <p className="col-span-2 font-semibold">Service Details</p>

            <ComboSelect
              name="fromCountryId"
              fieldLabel="From"
              placeholder="Select country"
              apiPath="/country/get-country?page=1&pageSize=256"
              enable={isEdit ? false : true}
              onSlugSelect={(slug) => setCountrySlug(slug)}
            />

            <ComboSelect
              name="toCountryId"
              fieldLabel="To"
              placeholder="Select country"
              apiPath="/country/get-country?page=1&pageSize=256"
              enable={isEdit ? false : true}
              onSlugSelect={(slug) => setCountrySlug(slug)}
            />

            <ComboSelect
              name="platformServiceId"
              placeholder="Select service"
              enable={
                isEdit
                  ? false
                  : form.watch('toCountryId') && form.watch('fromCountryId')
                    ? true
                    : false
              }
              apiPath={
                form.watch('toCountryId') && form.watch('fromCountryId')
                  ? `/platform-service/get-platform-service?toCountryId=${form.watch('toCountryId')}`
                  : ''
              }
              onSlugSelect={(slug) => setServiceSlug(slug)}
            />

            <ComboSelect
              name="platformServiceCategoryId"
              placeholder="Select ServiceType"
              enable={isEdit ? false : form.watch('platformServiceId') ? true : false}
              apiPath={
                form.watch('platformServiceId')
                  ? `/platform-service-category/get-platform-service-category?platformServiceId=${form.watch('platformServiceId')}&toCountryId=${form.watch('toCountryId')}`
                  : ''
              }
              onSelectIsHaveSubCategory={setIsSubCategoriesAvailable}
              onSelect={() => {
                form.setValue('platformServiceSubCategoryId', '');
              }}
              onSlugSelect={(e) => {
                setSelectedCategory(e);

                form.setValue('documents.serviceType', e as 'empty');
              }}
            />

            {isSubCategoriesAvailable && (
              <ComboSelect
                name="platformServiceSubCategoryId"
                placeholder="Select Category"
                enable={isEdit ? false : form.watch('platformServiceCategoryId') ? true : false}
                apiPath={
                  form.watch('platformServiceCategoryId')
                    ? `/platform-service-category/get-platform-service-category?platformServiceCategoryId=${form.watch('platformServiceCategoryId')}&platformServiceId=${form.watch('platformServiceId')}&toCountryId=${form.watch('toCountryId')}`
                    : ''
                }
                onSlugSelect={(e) => {
                  setSelectedCategory(e);

                  form.setValue('documents.serviceType', e as 'empty');
                }}
              />
            )}

            {(() => {
              const categoryValue =
                form.watch('platformServiceSubCategoryId') ||
                form.watch('platformServiceCategoryId');

              return (
                <ComboSelect
                  name="platformServiceCategoryPackageId"
                  placeholder="Select Package"
                  enable={isEdit ? false : !!categoryValue}
                  apiPath={
                    categoryValue
                      ? `/platform-service-category-package/get-platform-service-category-package?toCountryId=${form.watch('toCountryId')}&platformServiceCategoryId=${categoryValue}`
                      : ''
                  }
                />
              );
            })()}

            {/* Package Addons */}
            {(() => {
              const selectedPackageId = form.watch('platformServiceCategoryPackageId');
              return (
                <div className="col-span-2">
                  <PackageAddons
                    packageId={selectedPackageId || ''}
                    enable={!!selectedPackageId}
                    isEdit={isEdit}
                  />
                </div>
              );
            })()}
          </div>

          {/* Personal Details */}
          {countrySlug === 'united-states' && serviceSlug === 'passport' ? (
            <USPassportForm isView={isView} />
          ) : (
            <>
              <PersonalInfo isView={isView} isEdit={isEdit} setOtpModalOpen={setOtpModalOpen} />
              <PassportDetails isView={isView} />
              <ContactInfo isView={isView} />
              <FamilyInfo isView={isView} />
              <WorkSchoolInfo isView={isView} />
              <TravelToIndia isView={isView} />
              <ReferenceIndia isView={isView} />
              <ReferenceUSA isView={isView} />
              <AdditionalQuestions isView={isView} />
            </>
          )}

          {/* Payment Details */}
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
            <p className="col-span-2 font-semibold">Payment Details</p>

            <FormField
              name="additionalServiceFields.paymentMethod"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="additionalServiceFields.paymentStatus"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="additionalServiceFields.totalAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" readOnly={isView} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="additionalServiceFields.paidAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Amount (if partial)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" readOnly={isView} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="additionalServiceFields.paymentId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Payment ID(If Applicable)</FormLabel>
                  <FormControl>
                    <Input placeholder="" readOnly={isView} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="additionalServiceFields.courierId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Assign Courier ID</FormLabel>
                  <FormControl>
                    <Input placeholder="" readOnly={isView} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/*  Documents */}
        <div className="space-y-6">
          <DocumentForm
            isView={isView}
            selectedService={
              form.watch('platformServiceId') === visaServices_platformServiceId ? 'visa' : ''
            }
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            existingDocuments={applicationData?.serviceFields || null}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={form.formState.isSubmitting} asChild>
              <Link href="/admin/applications">Cancel</Link>
            </Button>

            {!isView && (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Application submitting...' : 'Save Application'}
              </Button>
            )}
          </div>
        </div>
      </form>
      {otpModalOpen && (
        <OtpModal
          isOpen={otpModalOpen}
          onClose={() => setOtpModalOpen(false)}
          email={form.getValues('email') || ''}
        />
      )}
    </Form>
  );
};

export default ApplicationForm;

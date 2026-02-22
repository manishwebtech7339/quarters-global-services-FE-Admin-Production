'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Edit, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { AgencyDataType } from '@/lib/types';
import { createAgency, updateAgency, updateCreditLimitAgency } from '@/services/agencyService';
import handleAsync from '@/lib/handleAsync';
import { uploadFile, UploadResponse } from '@/lib/uploadUtils';
import { FileInput } from '@/components/ui/file-input';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import AgencyApprovalModal from './AgencyApprovalModal';
import { useRouter } from 'next/navigation';
import {
  commonFieldSchema,
  emailSchema,
  phoneNumberSchema,
  postalCodeSchema,
} from '@/lib/formSchemaFunctions';
import { OtpVerificationDialog } from '@/components/shared/OtpVerificationDialog';
import { resendOtpToUser, verifyUser } from '@/services/usersService';
import { requiredFileSchema } from '../applicationForm/schemas/common';

// ---------------- Schema aligned with backend ---------------- //
const formSchema = z.object({
  id: commonFieldSchema().optional().or(z.literal('')), // Optional ID for editing existing agency
  name: commonFieldSchema(),
  email: emailSchema(),
  businessType: commonFieldSchema(),
  authorizedRepresentativeName: commonFieldSchema(),
  website: commonFieldSchema().optional().or(z.literal('')),
  contactEmail: emailSchema().optional().or(z.literal('')),
  countryCode: commonFieldSchema(),
  phone: phoneNumberSchema(),
  taxIdOrLicense: commonFieldSchema(),
  preferredEmbassyLocation: commonFieldSchema().optional().or(z.literal('')),
  registrationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().or(z.literal('')), // used only for type. this will pas during creating by default

  // Address
  address: z.object({
    addressLine1: commonFieldSchema().or(z.literal('')),
    city: commonFieldSchema().or(z.literal('')),
    state: commonFieldSchema().or(z.literal('')),
    zipCode: postalCodeSchema().or(z.literal('')),
    country: commonFieldSchema(),
  }),

  // File uploads
  governmentBusinessRegistrationCertificate: requiredFileSchema.optional(),
  identityProofOfRepresentative: requiredFileSchema.optional(),
  authorizationLetter: requiredFileSchema.optional(),
  bankStatement: requiredFileSchema.optional(),
});

export type AgencyFormType = z.infer<typeof formSchema>;

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  agencyData?: AgencyDataType;
}

// ---------------- Component ---------------- //
const AgencyForm = ({ isView = false, isEdit = false, agencyData }: Props) => {
  const agencyManager = agencyData?.managers?.[0] || null;

  const router = useRouter();
  const [isEditingCredit, setIsEditingCredit] = useState(false);
  const [creditLimit, setCreditLimit] = useState(agencyData?.creditDetails?.creditLimit || '0');
  const [isLoading, setIsLoading] = useState(false);
  const [otpUserId, setOtpUserId] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const form = useForm<AgencyFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      businessType: '',
      authorizedRepresentativeName: '',
      website: '',
      contactEmail: '',
      countryCode: '+1',
      phone: '',
      taxIdOrLicense: '',
      preferredEmbassyLocation: '',
      address: {
        addressLine1: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      governmentBusinessRegistrationCertificate: null,
      identityProofOfRepresentative: null,
      authorizationLetter: null,
      bankStatement: null,
    },
  });

  const watchValues = useWatch({ control: form.control });

  // Prefill data when editing
  useEffect(() => {
    if (agencyData) {
      form.reset({
        id: agencyData._id || '',
        name: agencyData.name || '',
        email: agencyData.email || '',
        businessType: agencyData.businessType || '',
        authorizedRepresentativeName: agencyData.authorizedRepresentativeName || '',
        website: agencyData.website || '',
        contactEmail: agencyData.contactEmail || '',
        countryCode: agencyData.countryCode || '+1',
        phone: agencyData.phone || '',
        taxIdOrLicense: agencyData.taxIdOrLicense || '',
        preferredEmbassyLocation: agencyData.preferredEmbassyLocation || '',
        address: {
          addressLine1: agencyData.address?.addressLine1 || '',
          city: agencyData.address?.city || '',
          state: agencyData.address?.state || '',
          zipCode: agencyData.address?.zipCode || '',
          country: agencyData.address?.country || '',
        },
        bankStatement: agencyData.bankStatement,
        authorizationLetter: agencyData.authorizationLetter,
        governmentBusinessRegistrationCertificate:
          agencyData.governmentBusinessRegistrationCertificate,
        identityProofOfRepresentative: agencyData.identityProofOfRepresentative,
      });
    }
  }, [agencyData, form]);

  // Submit handler
  const onSubmit = handleAsync(async (data: AgencyFormType) => {
    const processedDocuments: Record<string, UploadResponse> = {};
    for (const [key, doc] of Object.entries(data)) {
      if (doc instanceof File) {
        const uploadedUrl = await uploadFile(doc, `application-${key}`);
        if (!uploadedUrl) {
          throw new Error(`Failed to upload document: ${key}`);
        }
        processedDocuments[key] = {
          fileName: doc.name,
          mimeType: doc.type,
          file: uploadedUrl,
        };
      }
    }

    const prepareData = {
      ...data,
      ...processedDocuments,
    };

    if (isEdit) {
      await updateAgency(prepareData);
      toast.success('Agency details updated successfully!');
      router.push('/admin/agencies');
      return;
    }

    const createdAgency = await createAgency({ ...prepareData, registrationStatus: 'APPROVED' });

    const managerId = createdAgency?.managers?.[0];
    if (!managerId) {
      toast.error('Error while creation agency manager');
      return;
    } else {
      toast.success('Agency details saved successfully!');
      await resendOtpToUser({ userId: managerId });
      setOtpUserId(managerId);
    }
  });

  // Credit section logic
  const handleCreditSave = handleAsync(async () => {
    try {
      if (isNaN(Number(creditLimit))) {
        toast.error('Credit limit must be a number');
        return;
      }
      const existCreditLimit = +(agencyData?.creditDetails?.creditLimit || '0');
      const newCreditLimit = +(creditLimit || 0);

      if (existCreditLimit === newCreditLimit) {
        toast.error('Please change the credit limit to update');
        return;
      }
      if (existCreditLimit > newCreditLimit) {
        toast.error('Credit limit cannot be decreased');
        return;
      }
      // Simulate API call
      await updateCreditLimitAgency(agencyData?._id || '', newCreditLimit);
      toast.success('Credit limit updated successfully');
      setIsEditingCredit(false);
    } catch {
      toast.error('Failed to update credit limit');
    }
  });

  // ✅ OTP verification callback
  const handleOtpVerify = async (userId: string, otp: string) => {
    setOtpLoading(true);
    try {
      const response = await verifyUser({ userId, code: otp });

      console.log(response, 'response');
      toast.success('OTP verified successfully!');
      router.push('/admin/agencies');
      setOtpUserId(null);
    } catch (err: any) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  // ---------------- JSX ---------------- //
  return (
    <>
      {/* OTP Dialog */}
      {otpUserId && (
        <OtpVerificationDialog
          userId={otpUserId}
          open={!!otpUserId}
          setOpen={() => setOtpUserId(null)}
          onVerify={handleOtpVerify}
          loading={otpLoading}
          email={form.getValues('email')}
        />
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          {/* Credit Info Section */}
          <div className="space-y-4">
            {(isView || isEdit) && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Credit Information
                      {agencyData?.registrationStatus === 'APPROVED' && (
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Approved
                        </span>
                      )}
                      {agencyData?.registrationStatus === 'REJECTED' && (
                        <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Rejected
                        </span>
                      )}
                      {agencyData?.registrationStatus === 'PENDING' && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </h3>
                    {agencyData?.approvalNotes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Note:</span> {agencyData.approvalNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEdit && agencyData?.registrationStatus === 'APPROVED' && (
                      <Button
                        variant={isEditingCredit ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setIsEditingCredit((prev) => !prev)}
                      >
                        {isEditingCredit ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel Edit
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Credit Limit
                          </>
                        )}
                      </Button>
                    )}
                    {/* Approval Modal Trigger */}
                    {agencyData?.registrationStatus !== 'APPROVED' ? (
                      <AgencyApprovalModal
                        agencyId={agencyData?._id || ''}
                        status={agencyData?.registrationStatus || ''}
                        approvalNotes={agencyData?.approvalNotes || ''}
                        onStatusChange={() => {
                          router.refresh();
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  {/* Credit Limit */}
                  <div className="p-4 rounded-lg border bg-background shadow-sm hover:shadow transition-all duration-200">
                    <p className="text-sm text-muted-foreground mb-1">Credit Limit</p>
                    {isEditingCredit ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={creditLimit}
                          onChange={(e) => setCreditLimit(e.target.value)}
                          placeholder="Enter credit limit"
                          className="font-semibold"
                        />
                      </div>
                    ) : (
                      <p className="font-semibold text-lg text-foreground">{creditLimit}</p>
                    )}
                  </div>

                  {/* Available Credit */}
                  <div className="p-4 rounded-lg border bg-background shadow-sm hover:shadow transition-all duration-200">
                    <p className="text-sm text-muted-foreground mb-1">Available Credit</p>
                    <p className="font-semibold text-lg text-foreground">
                      {agencyData?.creditDetails?.availableCredit || '0'}
                    </p>
                  </div>

                  {/* Credit Used */}
                  <div className="p-4 rounded-lg border bg-background shadow-sm hover:shadow transition-all duration-200">
                    <p className="text-sm text-muted-foreground mb-1">Credit Used</p>
                    <p className="font-semibold text-lg text-foreground">
                      {agencyData?.creditDetails?.creditUsed || '0'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {isEditingCredit && (
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCreditLimit(agencyData?.creditDetails?.creditLimit || '0');
                  setIsEditingCredit(false);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleCreditSave}>
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          )}
        </div>

        {/* Main Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="border p-4 rounded grid sm:grid-cols-2 gap-4">
              <p className="col-span-2 border-b pb-2 font-semibold">Agency Information</p>

              {/* Agency Name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter agency name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isView || isEdit}
                        placeholder="Enter email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Type */}
              <FormField
                name="businessType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter business type" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authorized Representative Name */}
              <FormField
                name="authorizedRepresentativeName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorized Representative Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                name="website"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Email */}
              <FormField
                name="contactEmail"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter contact email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput2
                        value={field.value}
                        onChange={(val, df) => {
                          field.onChange(val ? `+${val}` : '');
                          form.setValue('countryCode', `+${df.dialCode || ''}`);
                        }}
                        disabled={isView}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax ID / License */}
              <FormField
                name="taxIdOrLicense"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID / License Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter ID or license" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferred Embassy Location */}
              <FormField
                name="preferredEmbassyLocation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Embassy Location (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <div className="border p-4 rounded grid sm:grid-cols-2 gap-4">
              <p className="col-span-2 border-b pb-2 font-semibold">Address</p>

              <FormField
                name="address.addressLine1"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter address line" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.zipCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip / Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter zip code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address.country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isView} placeholder="Enter country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Documents */}
            <div className="border p-4 rounded grid sm:grid-cols-2 gap-4">
              <p className="col-span-2 border-b pb-2 font-semibold">Upload Documents</p>

              <FormField
                name="governmentBusinessRegistrationCertificate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Certificate</FormLabel>
                    <FormControl>
                      <FileInput
                        ref={field.ref}
                        disabled={isView}
                        onFileChange={field.onChange}
                        selectedFileValue={field.value instanceof File ? field.value : null}
                        existingFileUrl={
                          watchValues?.governmentBusinessRegistrationCertificate?.file || ''
                        }
                        existingFileName={
                          watchValues?.governmentBusinessRegistrationCertificate?.fileName || ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="identityProofOfRepresentative"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Proof of Representative</FormLabel>
                    <FormControl>
                      <FileInput
                        ref={field.ref}
                        disabled={isView}
                        onFileChange={field.onChange}
                        selectedFileValue={field.value instanceof File ? field.value : null}
                        existingFileUrl={watchValues?.identityProofOfRepresentative?.file || ''}
                        existingFileName={
                          watchValues?.identityProofOfRepresentative?.fileName || ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="authorizationLetter"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authorization Letter</FormLabel>
                    <FormControl>
                      <FileInput
                        ref={field.ref}
                        disabled={isView}
                        onFileChange={field.onChange}
                        selectedFileValue={field.value instanceof File ? field.value : null}
                        existingFileUrl={watchValues?.authorizationLetter?.file || ''}
                        existingFileName={watchValues?.authorizationLetter?.fileName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bankStatement"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Statement (Optional)</FormLabel>
                    <FormControl>
                      <FileInput
                        ref={field.ref}
                        disabled={isView}
                        onFileChange={field.onChange}
                        selectedFileValue={field.value instanceof File ? field.value : null}
                        existingFileUrl={watchValues?.bankStatement?.file || ''}
                        existingFileName={watchValues?.bankStatement?.fileName || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* -- */}
              {isEdit && agencyManager && agencyManager?.isVerified === false && (
                <Button
                  onClick={handleAsync(async () => {
                    setIsLoading(true);
                    await resendOtpToUser({ userId: agencyManager._id });
                    setOtpUserId(agencyManager._id);
                    setIsLoading(false);
                  })}
                  type="button"
                  disabled={isLoading}
                  variant="link"
                  className="text-primary underline font-semibold text-base"
                >
                  {isLoading ? 'loading...' : '  Verify agency manager'}
                </Button>
              )}
              {!isView && (
                <div className="flex justify-end gap-2 ms-auto">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/admin/agencies">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    <Save className="h-4 w-4 mr-1" />
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AgencyForm;

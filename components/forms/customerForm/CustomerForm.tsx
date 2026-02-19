'use client';
import React, { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import handleAsync from '@/lib/handleAsync';
import { createCustomer, CustomerDataType, editCustomer } from '@/services/customerService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OtpVerificationDialog } from '@/components/shared/OtpVerificationDialog';
import { resendOtpToUser, verifyUser } from '@/services/usersService';
import {
  commonFieldSchema,
  emailSchema,
  passwordSchema,
  phoneNumberSchema,
  postalCodeSchema,
} from '@/lib/formSchemaFunctions';
import Link from 'next/link';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { format } from 'date-fns';
import { UserTypeENUM } from '@/lib/types';
import { Autocomplete } from '@react-google-maps/api';

export const customerFormSchema = z.object({
  firstName: commonFieldSchema(),
  lastName: commonFieldSchema(),
  email: emailSchema(),
  countryCode: commonFieldSchema(),
  phone: phoneNumberSchema(),
  alternatePhone: phoneNumberSchema().optional().or(z.literal('')),
  password: passwordSchema(),
  dateOfBirth: commonFieldSchema(),
  country: commonFieldSchema(),
  gender: z.enum(['male', 'female', 'other']),
  address: commonFieldSchema(),
  city: commonFieldSchema(),
  state: commonFieldSchema(),
  pincode: postalCodeSchema(),
  status: commonFieldSchema().optional(),
});
export const customerEditFormSchema = customerFormSchema.extend({
  email: emailSchema().optional().or(z.literal('')),
  password: passwordSchema().optional().or(z.literal('')),
});

export type CustomerFormSchemaType = z.infer<typeof customerFormSchema>;
export type CustomerEditFormSchemaType = z.infer<typeof customerEditFormSchema>;

const CustomerForm = ({
  customerData,
  isView = false,
  isEdit = false,
  role,
}: {
  customerData?: CustomerDataType;
  isView?: boolean;
  isEdit?: boolean;
  role?: UserTypeENUM;
}) => {
  const router = useRouter();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [otpUserId, setOtpUserId] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const form = useForm<CustomerFormSchemaType | CustomerEditFormSchemaType>({
    resolver: zodResolver(isEdit ? customerEditFormSchema : customerFormSchema),
    defaultValues: {
      firstName: customerData?.firstName || '',
      lastName: customerData?.lastName || '',
      email: customerData?.email || '',
      countryCode: customerData?.countryCode || '',
      phone: customerData?.phone || '',
      alternatePhone: customerData?.alternatePhone || '',
      password: '',
      dateOfBirth: customerData?.dob || '',
      country: customerData?.address?.country || '',
      gender: (customerData?.gender as 'other') || 'other',
      address: customerData?.address?.addressLine1 || '',
      city: customerData?.address?.city || '',
      state: customerData?.address?.state || '',
      pincode: customerData?.address?.zipCode || '',
      status: customerData?.status || undefined,
    },
  });
  console.log(form.formState.errors, ':Customer form errors');

  const onSubmit = handleAsync(
    async (data: CustomerFormSchemaType | CustomerEditFormSchemaType) => {
      if (isView) return;

      try {
        setIsLoading(true);

        if (customerData?._id) {
          await editCustomer(customerData?._id, data as CustomerEditFormSchemaType);
          toast.success('Customer Updated Successfully');
          if (role === UserTypeENUM.AGENT) {
            router.push('/agent/customers');
          } else {
            router.push('/admin/customers');
          }
        } else {
          const res = await createCustomer(data as CustomerFormSchemaType);
          toast.success('Customer created successfully');

          // ✅ open OTP verification dialog
          if (res?.data?._id) {
            await resendOtpToUser({ userId: res.data._id });
            setOtpUserId(res.data._id);
          } else {
            toast.error('User ID missing from response');
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
  );

  // ✅ OTP verification callback
  const handleOtpVerify = async (userId: string, otp: string) => {
    setOtpLoading(true);
    try {
      await verifyUser({ userId, code: otp });
      toast.success('OTP verified successfully!');
      setOtpUserId(null);
      if (role === UserTypeENUM.AGENT) {
        router.push('/agent/customers');
      } else {
        router.push('/admin/customers');
      }
    } catch (err: any) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    form.reset({
      firstName: customerData?.firstName || '',
      lastName: customerData?.lastName || '',
      email: customerData?.email || '',
      countryCode: customerData?.countryCode || '',
      phone: customerData?.phone || '',
      alternatePhone: customerData?.alternatePhone || '',
      password: '',
      dateOfBirth: customerData?.dob ? format(customerData.dob, 'yyyy-MM-dd') : '',
      country: customerData?.address?.country || '',
      gender: (customerData?.gender as 'other') || 'other',
      address: customerData?.address?.addressLine1 || '',
      city: customerData?.address?.city || '',
      state: customerData?.address?.state || '',
      pincode: customerData?.address?.zipCode || '',
      status: customerData?.status || undefined,
    });
  }, [customerData]);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4 items-start">
            {isView && <div className=" font-semibold col-span-2 border-b pb-2">User Details</div>}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={!!customerData?._id} type="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
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
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEdit && !isView && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password {isEdit && '(optional)'}</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    {isEdit && (
                      <FormDescription>
                        Enter new password. this will change user old password
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="alternatePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Phone (optional)</FormLabel>
                  <FormControl>
                    <PhoneInput2
                      value={field.value}
                      onChange={(val, df) => {
                        field.onChange(val ? `+${val}` : '');
                        form.setValue('countryCode', `+${df.dialCode || ''}`);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder=""
                      max={format(new Date(), 'yyyy-MM-dd')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'ACTIVE'}>Active</SelectItem>
                        <SelectItem value={'INACTIVE'}>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
            {isView && <div className="col-span-2  border-b pb-2 font-semibold">Address</div>}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="" {...field} /> */}
                    <Autocomplete
                      onLoad={(autocomplete: any) => {
                        autocompleteRef.current = autocomplete;
                      }}
                      onPlaceChanged={() => {
                        const place = autocompleteRef.current?.getPlace();
                        if (!place?.address_components) return;

                        let addressLine = '';
                        let city = '';
                        let state = '';
                        let country = '';
                        let pincode = '';

                        let streetNumber = '';
                        let route = '';
                        let sublocality = '';
                        let premise = '';

                        place.address_components.forEach((component) => {
                          const types = component.types;

                          if (types.includes('street_number')) {
                            streetNumber = component.long_name;
                          }

                          if (types.includes('route')) {
                            route = component.long_name;
                          }

                          if (
                            types.includes('sublocality') ||
                            types.includes('sublocality_level_1')
                          ) {
                            sublocality = component.long_name;
                          }

                          if (types.includes('premise')) {
                            premise = component.long_name;
                          }

                          if (types.includes('locality')) {
                            city = component.long_name;
                          }

                          if (types.includes('administrative_area_level_1')) {
                            state = component.long_name;
                          }

                          if (types.includes('country')) {
                            country = component.long_name;
                          }

                          if (types.includes('postal_code')) {
                            pincode = component.long_name;
                          }
                        });

                        // Build clean address line (NO city/state/pincode)
                        addressLine = [premise, streetNumber, route, sublocality]
                          .filter(Boolean)
                          .join(', ');

                        form.setValue('address', addressLine);
                        form.setValue('city', city);
                        form.setValue('state', state);
                        form.setValue('country', country);
                        form.setValue('pincode', pincode);
                      }}
                    >
                      <Input {...field} placeholder="" disabled={isView} />
                    </Autocomplete>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin code</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isEdit && customerData?.isVerified === false && (
            <Button
              onClick={handleAsync(async () => {
                setIsLoading(true);
                await resendOtpToUser({ userId: customerData._id });
                setOtpUserId(customerData._id);
                setIsLoading(false);
              })}
              type="button"
              disabled={isLoading}
              variant="link"
              className="text-primary underline font-semibold text-base"
            >
              {isLoading ? 'loading...' : '  Verify user'}
            </Button>
          )}
          {isView ? (
            <div className="flex items-center gap-2 justify-end">
              <Button asChild type="button" variant="outline" disabled={isLoading}>
                <Link href={role === UserTypeENUM.AGENT ? '/agent/customers' : '/admin/customers'}>
                  Back
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-end">
              <Button asChild type="button" variant="outline" disabled={isLoading}>
                <Link href={role === UserTypeENUM.AGENT ? '/agent/customers' : '/admin/customers'}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
              {/* <Button type="reset" disabled={isLoading}>Start New Application</Button> */}
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default CustomerForm;

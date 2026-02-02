'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import { commonFieldSchema } from '@/lib/formSchemaFunctions';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TaxBureauDataType,
  taxBureauStatuses,
  taxPackagesWithPrices,
  taxPackagesWithPricesKeys,
} from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import { fetcher } from '@/lib/fetcher';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/* FINAL SCHEMA (AS PROVIDED) */
/* ------------------------------------------------------------------ */

const enrollmentFormSchema = z.object({
  firstName: commonFieldSchema(),
  lastName: commonFieldSchema().optional().or(z.literal('')),
  dateOfBirth: commonFieldSchema(),
  countryCode: commonFieldSchema(),
  phone: commonFieldSchema(),
  email: z
    .string()
    .email()
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  homeAddress: commonFieldSchema(),

  businessName: commonFieldSchema(),
  businessPhone: commonFieldSchema(),
  businessEmail: z
    .string()
    .email()
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  officeAddress: commonFieldSchema(),
  businessType: commonFieldSchema(),

  ptinNumber: commonFieldSchema(),
  efinNumber: commonFieldSchema(),
  efinStatus: z.enum(['Approved', 'Pending', 'Need Assistance with Application']),

  enrolledServices: z
    .array(commonFieldSchema())
    .min(1, { message: 'This field is required' })
    .default([]),

  experienceLevel: commonFieldSchema(),
  expectedVolume: commonFieldSchema(),
  softwarePreference: commonFieldSchema(),

  description: commonFieldSchema().optional().or(z.literal('')),

  agreementName: commonFieldSchema(),
  agreementSignature: commonFieldSchema(),
  agreementDate: commonFieldSchema(),

  selectedPackage: commonFieldSchema(),

  status: commonFieldSchema(),
});

type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>;

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

const TaxBureauForm = ({
  isView,
  isEdit,
  defaultData,
}: {
  isView?: boolean;
  isEdit?: boolean;
  defaultData?: TaxBureauDataType;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      countryCode: '',
      phone: '',
      email: '',
      homeAddress: '',
      businessName: '',
      businessPhone: '',
      businessEmail: '',
      officeAddress: '',
      businessType: '',
      ptinNumber: '',
      efinNumber: '',
      efinStatus: undefined,
      enrolledServices: [],
      experienceLevel: '',
      expectedVolume: '',
      softwarePreference: '',
      description: '',
      agreementName: '',
      agreementSignature: '',
      agreementDate: '',
      selectedPackage: '',
    },
  });
  console.log(form.formState.errors, ':Tax form errors');

  const toggleArrayValue = (
    value: string,
    fieldValue: string[],
    onChange: (val: string[]) => void,
  ) => {
    if (fieldValue.includes(value)) {
      onChange(fieldValue.filter((v) => v !== value));
    } else {
      onChange([...fieldValue, value]);
    }
  };

  const onSubmit = async (data: EnrollmentFormData) => {
    try {
      setLoading(true);

      if (isEdit && defaultData?._id) {
        await fetcher(`/tax-bureau/${defaultData._id}`, {
          method: 'PUT',
          body: data,
        });
        toast.success('Tax Updated Successfully');
      } else {
        await fetcher('/tax-bureau', {
          method: 'POST',
          body: data,
        });
        toast.success('Tax Created Successfully');
      }

      // Redirect
      router.push('/admin/tax-bureau');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      console.error(`Error ${isEdit ? 'updating' : 'creating'} tax:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultData) {
      form.reset({
        // firstName: defaultData?.fullName?.split(' ')?.[0] ?? '',
        // lastName: defaultData?.fullName?.split(' ')?.pop() ?? '',
        firstName: defaultData?.fullName ?? '',
        lastName: '',
        dateOfBirth: defaultData.dateOfBirth ?? '',
        countryCode: defaultData.countryCode ?? '',
        phone: defaultData.phoneNumber ?? '',
        email: defaultData.email ?? '',
        homeAddress: defaultData.homeAddress ?? '',

        businessName: defaultData.businessName ?? '',
        businessPhone: defaultData.businessPhone ?? '',
        businessEmail: defaultData.businessEmail ?? '',
        officeAddress: defaultData.officeAddress ?? '',
        businessType: defaultData.businessType ?? '',

        ptinNumber: defaultData.ptinNumber ?? '',
        efinNumber: defaultData.efinNumber ?? '',
        efinStatus: (defaultData.efinStatus as 'Approved') ?? undefined,

        enrolledServices: defaultData.enrolledServices ?? [],

        experienceLevel: defaultData.experienceLevel ?? '',
        expectedVolume: defaultData.expectedVolume ?? '',
        softwarePreference: defaultData.softwarePreference ?? '',

        description: defaultData.description ?? '',

        agreementName: defaultData.agreementName ?? '',
        agreementSignature: defaultData.agreementSignature ?? '',
        agreementDate: defaultData.agreementDate ?? '',

        selectedPackage: defaultData.selectedPackage ?? '',

        status: defaultData.status ?? '',
      });
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Package Selection */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">Select a Package</h2>

          <FormField
            name="selectedPackage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-3 gap-4">
                    {taxPackagesWithPricesKeys.map((pkg) => {
                      const isSelected = field.value === pkg;

                      return (
                        <Card
                          key={pkg}
                          onClick={() => {
                            if (!isView) {
                              field.onChange(pkg);
                            }
                          }}
                          className={`cursor-pointer transition-all border-2 ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground shadow-md'
                              : 'border-muted hover:border-red-300'
                          }
                          ${isEdit && 'pointer-events-none opacity-70'}
                          `}
                        >
                          <CardHeader>
                            <CardTitle className="capitalize">{pkg.replace(/_/g, ' ')}</CardTitle>
                            <CardDescription className="text-lg font-semibold">
                              ${taxPackagesWithPrices[pkg]}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 1. Personal Information */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">1. Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} readOnly={isView} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} readOnly={isView} />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              name="dateOfBirth"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      disabled={isEdit}
                      readOnly={isView}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput2
                      value={field.value}
                      onChange={(val, df) => {
                        field.onChange(val ? `+${val}` : '');
                        form.setValue('countryCode', `+${df.dialCode || ''}`);
                      }}
                      disabled={isEdit}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isEdit} readOnly={isView} />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="homeAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Home Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* 2. Business Information */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">2. Business Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              name="businessName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business / Office Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessPhone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <PhoneInput2
                      value={field.value}
                      onChange={(val, df) => {
                        field.onChange(val ? `+${val}` : '');
                      }}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email (if different)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="officeAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="businessType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        'New Tax Office',
                        'Existing Office Switching Bureaus',
                        'Insurance / Real Estate / Other Business Adding Tax Services',
                        'Independent Preparer (Home-Based)',
                      ].map((service) => (
                        <label key={service} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value={service}
                            checked={field.value === service}
                            onChange={() => field.onChange(service)}
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* 3. Tax Credentials */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">3. Tax Credentials</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              name="ptinNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PTIN Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="efinNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EFIN Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="efinStatus"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>EFIN Status</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {['Approved', 'Pending', 'Need Assistance with Application'].map((status) => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={field.value === status}
                            onChange={() => field.onChange(status)}
                          />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* 4. Services */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">4. Services You Want to Enroll In</h2>

          <FormField
            name="enrolledServices"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      'Tax Software (Cloud/Desktop)',
                      'Training & Certification',
                      'Pricing & Business Strategy',
                      'Complete Start Your Own Tax Office Program',
                      'Bank Products',
                      'Office Setup Assistance',
                      'Marketing Materials',
                    ].map((service) => (
                      <label key={service} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value.includes(service)}
                          onChange={() => toggleArrayValue(service, field.value, field.onChange)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 5 */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">5. Experience Level</h2>
          <FormField
            name="experienceLevel"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      'No Experience - Need Full Training',
                      'Beginner (1–2 years)',
                      'Intermediate (3–5 years)',
                      'Advanced (5+ years)',
                      'CPA/Professional Accountant',
                    ].map((service) => (
                      <label key={service} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={service}
                          checked={field.value === service}
                          onChange={() => field.onChange(service)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 6 */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">6. Expected Volume</h2>
          <FormField
            name="expectedVolume"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-2 gap-2">
                    {['0–50', '50-150', '150-300', '300+'].map((service) => (
                      <label key={service} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={service}
                          checked={field.value === service}
                          onChange={() => field.onChange(service)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 7 */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">7. Preferred Software Type</h2>
          <FormField
            name="softwarePreference"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      'Cloud-Based (Online)',
                      'Desktop Software',
                      'Not Sure - Need Recommendation',
                    ].map((service) => (
                      <label key={service} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={service}
                          checked={field.value === service}
                          onChange={() => field.onChange(service)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* 8. Additional Info */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">8. Additional Information</h2>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        {/* 9. Agreement */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">9. Agreement & Signature</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              name="agreementName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="agreementSignature"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="agreementDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* 10. Application Status */}
        <section className="p-6 border rounded-lg space-y-4">
          <h2 className="font-semibold text-lg">10. Application Status</h2>
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid md:grid-cols-2 gap-2">
                    {taxBureauStatuses.map((service) => (
                      <label key={service} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={service}
                          checked={field.value === service}
                          onChange={() => field.onChange(service)}
                        />
                        <span>{service}</span>
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button disabled={loading} type="button" variant="outline" asChild>
            <Link href="/admin/tax-bureau" className="mr-4">
              Cancel
            </Link>
          </Button>
          {!isView && (
            <Button disabled={loading} type="submit">
              Save Form
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TaxBureauForm;

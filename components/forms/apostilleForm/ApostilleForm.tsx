'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

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
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput2 } from '@/components/ui/PhoneInput2';
import ComboSelect from '../applicationForm/components/ComboSelect';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { createApostilleApplicaton, updateApostilleApplicaton } from '@/services/apostilleService';
import handleAsync from '@/lib/handleAsync';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatCurrency';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApostilleApplicationDataType } from '@/lib/types';

const DEMO_DOCUMENTS = [
  // Personal Documents
  'Adoption Dossier',
  'Birth Certificate',
  'Death Certificate',
  'Diploma',
  'Divorce Decree',
  'Drivers License',
  'Marriage Certificate',
  'Passport',
  'Power of Attorney',
  'State Background Check',
  'State ID',
  'Transcript',
  'Single Status Affidavit',
  'Other Personal Document',

  // Business Documents
  'Articles of Incorporation',
  'Bank Statements',
  'Certificate of Good Standing',
  'Incorporation Certificate',
  'Other Business Document',

  // Federal Documents
  'Federal Background Check',
  'Social Security Income and Benefits Statement',
  'Certificate of Naturalization',
  'Consular Report of Birth Abroad',
  'Petition for Name Change Affidavit',
  'U.S. Federal Court Document',
  'FDA Document',
  'USDA Document',
  'IRS Document',
  'Social Security Letter',
  'Other Federal Document',
];

const DEMO_PACKAGES = [
  {
    id: 'gj_ad_std',
    name: 'Standard',
    days: '10–12 Days',
    price: 99,
  },
  {
    id: 'gj_ad_exp',
    name: 'Express',
    days: '5–7 Days',
    price: 149,
  },
  {
    id: 'gj_bc_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 79,
  },
  {
    id: 'gj_dc_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 79,
  },
  {
    id: 'gj_dip_std',
    name: 'Standard',
    days: '10–15 Days',
    price: 109,
  },
  {
    id: 'gj_dd_std',
    name: 'Standard',
    days: '12–15 Days',
    price: 129,
  },
  {
    id: 'gj_dl_std',
    name: 'Standard',
    days: '6–8 Days',
    price: 69,
  },
  {
    id: 'gj_mc_std',
    name: 'Standard',
    days: '8–10 Days',
    price: 89,
  },
  {
    id: 'gj_pass_std',
    name: 'Standard',
    days: '5–7 Days',
    price: 99,
  },
  {
    id: 'gj_poa_std',
    name: 'Standard',
    days: '4–6 Days',
    price: 59,
  },
  {
    id: 'gj_sbc_std',
    name: 'Standard',
    days: '7–9 Days',
    price: 89,
  },
  {
    id: 'gj_sid_std',
    name: 'Standard',
    days: '5–7 Days',
    price: 69,
  },
  {
    id: 'gj_tr_std',
    name: 'Standard',
    days: '10–15 Days',
    price: 119,
  },
  {
    id: 'gj_ssa_std',
    name: 'Standard',
    days: '3–5 Days',
    price: 49,
  },
  {
    id: 'gj_opd_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 99,
  },
  {
    id: 'mh_bc_std',
    name: 'Standard',
    days: '8–10 Days',
    price: 59,
  },

  {
    id: 'ca_ad_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 129,
  },

  {
    id: 'tx_bc_std',
    name: 'Standard',
    days: '6–9 Days',
    price: 69,
  },
  {
    id: 'biz_ai_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 149,
  },
  {
    id: 'biz_bs_std',
    name: 'Standard',
    days: '3–5 Days',
    price: 79,
  },
  {
    id: 'biz_cgs_std',
    name: 'Standard',
    days: '5–7 Days',
    price: 99,
  },
  {
    id: 'biz_ic_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 129,
  },
  {
    id: 'biz_poa_std',
    name: 'Standard',
    days: '4–6 Days',
    price: 69,
  },
  {
    id: 'biz_obd_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 109,
  },
  {
    id: 'fed_fbc_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 139,
  },
  {
    id: 'fed_ssi_std',
    name: 'Standard',
    days: '5–7 Days',
    price: 89,
  },
  {
    id: 'fed_cn_std',
    name: 'Standard',
    days: '10–15 Days',
    price: 179,
  },
  {
    id: 'fed_crba_std',
    name: 'Standard',
    days: '12–18 Days',
    price: 199,
  },
  {
    id: 'fed_pnc_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 119,
  },
  {
    id: 'fed_fc_std',
    name: 'Standard',
    days: '10–15 Days',
    price: 159,
  },
  {
    id: 'fed_fda_std',
    name: 'Standard',
    days: '8–12 Days',
    price: 149,
  },
  {
    id: 'fed_usda_std',
    name: 'Standard',
    days: '8–12 Days',
    price: 149,
  },
  {
    id: 'fed_irs_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 129,
  },
  {
    id: 'fed_ssl_std',
    name: 'Standard',
    days: '5–7 Days',
    price: 79,
  },
  {
    id: 'fed_ofd_std',
    name: 'Standard',
    days: '7–10 Days',
    price: 119,
  },
];

const SCANNED_COPY_PRICE = 20;

const documentSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
  issuedState: z.string().min(1, 'Issued state is required'),
  packageId: z.string().min(1, 'Package is required'),
  packageName: z.string().min(1),
  quantity: z.string().min(1),
  price: z.string().min(1, 'Price is required'),
});

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone is required'),
  countryCode: z.string().min(1),

  physicalAddress: z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Pincode is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  legalAddress: z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Pincode is required'),
    country: z.string().min(1, 'Country is required'),
  }),

  destinationCountry: z.string().min(1, 'Destination country is required'),

  scannedCopy: z.boolean(),

  documents: z.array(documentSchema).min(1, 'At least one document is required'),

  translation: z.object({
    selected: z.boolean(),
    language: z.string().optional(),
    pages: z.string().optional(),
    price: z.string().optional(),
  }),
  subTotal: z.string().min(1, 'Subtotal is required'),
  grandTotal: z.string().min(1, 'Grand total is required'),

  paymentStatus: z.string().min(1, 'Payment status is required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
  paymentType: z.string().min(1, 'Payment type is required'),
});
export type ApostilleFormSchemaType = z.infer<typeof formSchema>;
type FormValues = z.infer<typeof formSchema>;

const ApostilleForm = ({
  defaultValues,
  isEdit,
  isView,
  isAgent,
}: {
  defaultValues?: ApostilleApplicationDataType;
  isEdit?: boolean;
  isView?: boolean;
  isAgent?: boolean;
}) => {
  const router = useRouter();
  console.log(defaultValues, 'defaultValues');
  // --
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultValues?.customer?.firstName ?? '',
      lastName: defaultValues?.customer?.lastName ?? '',
      email: defaultValues?.customer?.email ?? '',
      phone: defaultValues?.customer?.phone ?? '',
      countryCode: defaultValues?.customer?.countryCode ?? '+1',

      physicalAddress: {
        addressLine1: defaultValues?.addresses?.physical?.addressLine1 ?? '',
        addressLine2: defaultValues?.addresses?.physical?.addressLine1 ?? '',
        city: defaultValues?.addresses?.physical?.city ?? '',
        state: defaultValues?.addresses?.physical?.state ?? '',
        zipCode: defaultValues?.addresses?.physical?.zipCode ?? '',
        country: defaultValues?.addresses?.physical?.country ?? '',
      },

      legalAddress: {
        addressLine1: defaultValues?.addresses?.legal?.addressLine1 ?? '',
        addressLine2: defaultValues?.addresses?.legal?.addressLine1 ?? '',
        city: defaultValues?.addresses?.legal?.city ?? '',
        state: defaultValues?.addresses?.legal?.state ?? '',
        zipCode: defaultValues?.addresses?.legal?.zipCode ?? '',
        country: defaultValues?.addresses?.legal?.country ?? '',
      },

      destinationCountry: defaultValues?.serviceSelection?.destinationCountry ?? '',

      scannedCopy: defaultValues?.serviceSelection?.addons?.scannedCopy?.selected ?? false,

      documents:
        defaultValues?.serviceSelection?.documents?.map((d) => ({
          documentType: d.documentType,
          issuedState: d.issuedState,
          packageId: d.packageId,
          packageName: d.packageName,
          price: String(d.price),
          quantity: String(defaultValues?.serviceSelection?.documents.length || 0),
        })) ?? [],

      translation: {
        selected: !!defaultValues?.serviceSelection?.addons?.translation?.selected,
        language: defaultValues?.serviceSelection?.addons?.translation?.language ?? '',
        pages: String(defaultValues?.serviceSelection?.addons?.translation?.pages ?? 0),
        price: '',
      },

      subTotal: String(defaultValues?.pricing?.subTotal ?? ''),
      grandTotal: String(defaultValues?.pricing?.grandTotal ?? ''),

      paymentStatus: defaultValues?.transactionDetails?.paymentStatus ?? '',
      paymentMode: defaultValues?.transactionDetails.paymentMode ?? '',
      paymentType: defaultValues?.transactionDetails.paymentType ?? '',
    },
  });
  console.log(form.formState.errors, ':Form Error');

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        firstName: defaultValues?.customer?.firstName ?? '',
        lastName: defaultValues?.customer?.lastName ?? '',
        email: defaultValues?.customer?.email ?? '',
        phone: defaultValues?.customer?.phone ?? '',
        countryCode: defaultValues?.customer?.countryCode ?? '+1',

        physicalAddress: {
          addressLine1: defaultValues?.addresses?.physical?.addressLine1 ?? '',
          addressLine2: defaultValues?.addresses?.physical?.addressLine1 ?? '',
          city: defaultValues?.addresses?.physical?.city ?? '',
          state: defaultValues?.addresses?.physical?.state ?? '',
          zipCode: defaultValues?.addresses?.physical?.zipCode ?? '',
          country: defaultValues?.addresses?.physical?.country ?? '',
        },

        legalAddress: {
          addressLine1: defaultValues?.addresses?.legal?.addressLine1 ?? '',
          addressLine2: defaultValues?.addresses?.legal?.addressLine1 ?? '',
          city: defaultValues?.addresses?.legal?.city ?? '',
          state: defaultValues?.addresses?.legal?.state ?? '',
          zipCode: defaultValues?.addresses?.legal?.zipCode ?? '',
          country: defaultValues?.addresses?.legal?.country ?? '',
        },

        destinationCountry: defaultValues?.serviceSelection?.destinationCountry ?? '',

        scannedCopy: defaultValues?.serviceSelection?.addons?.scannedCopy?.selected ?? false,

        documents:
          defaultValues?.serviceSelection?.documents?.map((d) => ({
            documentType: d.documentType,
            issuedState: d.issuedState,
            packageId: d.packageId,
            packageName: d.packageName,
            price: String(d.price),
            quantity: String(defaultValues?.serviceSelection?.documents.length || 0),
          })) ?? [],

        translation: {
          selected: !!defaultValues?.serviceSelection?.addons?.translation?.selected,
          language: defaultValues?.serviceSelection?.addons?.translation?.language ?? '',
          pages: String(defaultValues?.serviceSelection?.addons?.translation?.pages ?? 0),
          price: '',
        },

        subTotal: String(defaultValues?.pricing?.subTotal ?? ''),
        grandTotal: String(defaultValues?.pricing?.grandTotal ?? ''),

        paymentStatus: defaultValues?.transactionDetails?.paymentStatus ?? '',
        paymentMode: defaultValues?.transactionDetails.paymentMode ?? '',
        paymentType: defaultValues?.transactionDetails.paymentType ?? '',
      });
    }
  }, [defaultValues]);
  /* ------------------------------------------------------------------------ */

  const onSubmit = handleAsync(async (values: FormValues) => {
    if (values.documents.length === 0) {
      form.setError('documents', {
        type: 'manual',
        message: 'Please add at least one document',
      });
      return;
    }

    const hasIncompleteDoc = values.documents.some(
      (doc) => !doc.documentType || !doc.issuedState || !doc.packageId || !doc.price,
    );

    if (hasIncompleteDoc) {
      toast.error('Please complete all document details');
      return;
    }

    const pricing = calculatePricing(values);

    const payload = {
      userId: '',
      role: 'ADMIN',
      orderType: 'APOSTILLE_LEGALIZATION',
      currency: 'USD',

      paymentStatus: values.paymentStatus,
      paymentMode: values.paymentMode,
      paymentType: values.paymentType,

      metadata: {
        source: 'ADMIN',
        createdAt: new Date().toISOString(),
      },

      customer: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        countryCode: values.countryCode,
      },

      addresses: {
        physical: values.physicalAddress,
        legal: values.legalAddress,
      },

      serviceSelection: {
        destinationCountry: values.destinationCountry,
        documentCount: values.documents.length,
        // status: 'PENDING',
        documents: values.documents.map((doc) => ({
          documentType: doc.documentType,
          issuedState: doc.issuedState,
          packageId: doc.packageId,
          packageName: doc.packageName,
          price: Number(doc.price),
        })),
        addons: {
          scannedCopy: {
            selected: !!values.scannedCopy,
            price: Number(values.scannedCopy ? SCANNED_COPY_PRICE : '0'),
          },
          translation: {
            selected: !!values.translation.selected,
            language: String(values.translation.selected ? values.translation.language : ''),
            price: Number(values.translation.selected ? values.translation.price || '0' : '0'),
            pages: Number(values.translation.selected ? values.translation.pages : '0'),
          },
        },
      },
      pricing: {
        tax: 0,
        discount: 0,
        subTotal: Number(pricing.subTotal),
        grandTotal: Number(pricing.grandTotal),
      },
    };

    if (isEdit) {
      if (!defaultValues?._id) return;
      await updateApostilleApplicaton({
        ...payload,
        apostilleLegalizationId: defaultValues?._id,
      } as any);
      toast.success('Apostille application updated successfully');
    } else {
      await createApostilleApplicaton(payload as any);
      toast.success('Apostille application created successfully');
    }
    if (isAgent) {
      router.push('/agent/apostille');
    } else {
      router.push('/admin/apostille');
    }
  });

  // ---
  const calculatePricing = (values: FormValues) => {
    // Documents total
    const documentsTotal = values.documents.reduce((sum, doc) => {
      const price = Number(doc.price || 0);
      const qty = Number(doc.quantity || 1);
      return sum + price * qty;
    }, 0);

    // Scanned copy fee
    const scannedCopyFee = values.scannedCopy ? SCANNED_COPY_PRICE : 0;

    // Translation fee
    const translationFee = values.translation.selected ? Number(values.translation.price || 0) : 0;

    const subTotal = documentsTotal + scannedCopyFee + translationFee;

    return {
      documentsTotal,
      scannedCopyFee,
      translationFee,
      subTotal,
      grandTotal: subTotal,
    };
  };

  const watchedDocuments = useWatch({
    control: form.control,
    name: 'documents',
  });

  const watchedScannedCopy = useWatch({
    control: form.control,
    name: 'scannedCopy',
  });

  const watchedTranslationSelected = useWatch({
    control: form.control,
    name: 'translation.selected',
  });

  const watchedTranslationPages = useWatch({
    control: form.control,
    name: 'translation.pages',
  });

  const watchedTranslationPrice = useWatch({
    control: form.control,
    name: 'translation.price',
  });

  useEffect(() => {
    const values = form.getValues();

    const pricing = calculatePricing(values);

    form.setValue('subTotal', pricing.subTotal.toString(), {
      shouldValidate: true,
      shouldDirty: false,
    });

    form.setValue('grandTotal', pricing.grandTotal.toString(), {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [
    watchedDocuments,
    watchedScannedCopy,
    watchedTranslationSelected,
    watchedTranslationPages,
    watchedTranslationPrice,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                                   JSX                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* -------------------------- USER DETAILS --------------------------- */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">User Details</h2>

          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------------- PHYSICAL ADDRESS ---------------- */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Physical Address</h2>

          {(['addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country'] as const).map(
            (f) => (
              <FormField
                key={f}
                name={`physicalAddress.${f}`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{f}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}
        </div>

        {/* ---------------- LEGAL ADDRESS ---------------- */}
        <div className="p-4 border rounded-md grid sm:grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold">Legal Address</h2>

          {(['addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country'] as const).map(
            (f) => (
              <FormField
                key={f}
                name={`legalAddress.${f}`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{f}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}
        </div>

        {/* ---------------------- DESTINATION & ADDONS ---------------------- */}
        <div className="p-4 border rounded-md space-y-4">
          <ComboSelect
            name="fromCountryId"
            fieldLabel="Which country are the documents intended for?"
            placeholder="Select country"
            apiPath="/country/get-country?page=1&pageSize=256"
            onSlugSelect={(slug) =>
              form.setValue('destinationCountry', slug, { shouldValidate: true })
            }
          />

          <FormField
            name="scannedCopy"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <p>Scanned copy before return? ($20)</p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* ---------------- TRANSLATION ---------------- */}
          <FormField
            name="translation.selected"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    <p>Do you need your documents translated?</p>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('translation.selected') && (
            <div className="grid sm:grid-cols-3 gap-4">
              <FormField
                name="translation.language"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="translation.pages"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue(
                            'translation.price',
                            (Number(e.target.value || 0) * SCANNED_COPY_PRICE).toString(),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* ------------------------- DOCUMENT COUNT -------------------------- */}
        <div className="p-4 border rounded-md space-y-4">
          <Label>Number of Documents</Label>
          <Select
            onValueChange={(value) => {
              const count = Number(value);
              const existing = form.getValues('documents');

              const docs = Array.from({ length: count }).map(
                (_, i) =>
                  existing[i] || {
                    documentType: '',
                    issuedState: '',
                    packageId: '',
                    packageName: '',
                    quantity: '1',
                    price: '',
                  },
              );

              form.setValue('documents', docs);
            }}
            value={String(form.watch('documents')?.length ?? 0)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }).map((_, i) => (
                <SelectItem key={i} value={`${i + 1}`}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {form.watch('documents').map((_, index) => (
            <div key={index} className="border p-4 rounded-md space-y-4">
              <h3 className="font-semibold">Document {index + 1}</h3>

              {/* Document Type */}
              <FormField
                name={`documents.${index}.documentType`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue(`documents.${index}.packageId`, '');
                        form.setValue(`documents.${index}.packageName`, '');
                        form.setValue(`documents.${index}.price`, '');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent className="max-w-sm">
                        {DEMO_DOCUMENTS.map((doc) => (
                          <SelectItem key={doc} value={doc}>
                            {doc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Issued State */}
              {/* <FormField
                name={`documents.${index}.issuedState`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issued State</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-w-sm">
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                name={`documents.${index}.issuedState`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issued State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Package */}
              <FormField
                name={`documents.${index}.packageId`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(pkgId) => {
                        const pkg = DEMO_PACKAGES.find((p) => p.id === pkgId);
                        if (!pkg) return;
                        field.onChange(pkgId);
                        form.setValue(`documents.${index}.packageName`, pkg.name);
                        form.setValue(`documents.${index}.price`, String(pkg.price));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent className="max-w-sm">
                        {DEMO_PACKAGES.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id} className="flex justify-between">
                            <span>
                              {pkg.name} {pkg.days}
                            </span>
                            <span className="font-medium ms-auto text-primary">
                              ({formatCurrency({ amount: pkg.price })})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        {/* Payment Status */}
        <div className="p-4 border rounded-md grid sm:grid-cols-3 gap-4">
          <FormField
            name="paymentStatus"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(e) => {
                      if (e === 'null') {
                        field.onChange('');
                        return;
                      }
                      field.onChange(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Select Status</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Mode */}
          <FormField
            name="paymentMode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Mode</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(e) => {
                      if (e === 'null') {
                        field.onChange('');
                        return;
                      }
                      field.onChange(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Select mode</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Type */}
          <FormField
            name="paymentType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(e) => {
                      if (e === 'null') {
                        field.onChange('');
                        return;
                      }
                      field.onChange(e);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Select type</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ---------------- PRICING SUMMARY ---------------- */}
        <div className="p-4 border rounded-md bg-muted space-y-3">
          <h2 className="font-semibold text-lg">Pricing Summary</h2>

          {(() => {
            const pricing = calculatePricing(form.getValues());

            return (
              <>
                <div className="flex justify-between text-sm">
                  <span>Documents Total</span>
                  <span>${pricing.documentsTotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Scanned Copy</span>
                  <span>${pricing.scannedCopyFee}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Translation</span>
                  <span>${pricing.translationFee}</span>
                </div>

                <hr />

                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${pricing.subTotal}</span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span>${pricing.grandTotal}</span>
                </div>
              </>
            );
          })()}
        </div>

        {/* ------------------------------ ACTIONS ----------------------------- */}
        <div className="flex justify-end gap-2">
          {!isView ? (
            <>
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={form.formState.isSubmitting}
              >
                <Link href={isAgent ? '/agent/apostille' : '/admin/apostille'}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" asChild>
              <Link href={isAgent ? '/agent/apostille' : '/admin/apostille'}>Back</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ApostilleForm;

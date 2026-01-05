'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(1, 'Full name is required'),
  numTravellers: z.string().min(1, 'Number of travellers is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  email: z
    .string()
    .email('Invalid email address')
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  phone: z.string().min(1, 'Phone number is required'),

  // Travel Details
  purpose: z.string().min(1, 'Purpose of travel is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  tripType: z.enum(['single', 'multiple']),

  // Passport Info
  passportNumber: z.string().min(1, 'Passport number is required'),
  visaType: z.string().optional(),
  passportExpiry: z.string().min(1, 'Passport expiry date is required'),

  // Health Info
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  covidCoverage: z.enum(['yes', 'no']),

  // Coverage Requirements
  coverageType: z.string().min(1, 'Coverage type is required'),
  deductible: z.string().min(1, 'Deductible amount is required'),
  coverageLimit: z.string().min(1, 'Coverage limit is required'),

  // Additional Info
  activities: z.string().optional(),
  ageGroup: z.string().optional(),
  withChildren: z.enum(['yes', 'no']),
  notes: z.string().optional(),
});

const TravelInsuranceForm = ({ isView = false }: { isView?: boolean }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      numTravellers: '',
      dob: '',
      gender: 'other',
      email: '',
      phone: '',

      purpose: '',
      destination: '',
      startDate: '',
      endDate: '',
      tripType: 'single',

      passportNumber: '',
      visaType: '',
      passportExpiry: '',

      medicalConditions: '',
      medications: '',
      covidCoverage: 'no',

      coverageType: '',
      deductible: '',
      coverageLimit: '',

      activities: '',
      ageGroup: '',
      withChildren: 'no',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isView) return;
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && (
            <div className="col-span-2 font-semibold border-b pb-2">Personal Information</div>
          )}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numTravellers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Travellers</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                    <SelectTrigger>
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
          <FormField
            control={form.control}
            name="email"
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
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Travel Details */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && <div className="col-span-2 font-semibold border-b pb-2">Travel Details</div>}
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose of Travel</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tripType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Passport Information */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && (
            <div className="col-span-2 font-semibold border-b pb-2">Passport Information</div>
          )}
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passportExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Health Information */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && (
            <div className="col-span-2 font-semibold border-b pb-2">Health Information</div>
          )}
          <FormField
            control={form.control}
            name="medicalConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Conditions</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medications</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="covidCoverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>COVID-19 Coverage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Coverage Requirements */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && (
            <div className="col-span-2 font-semibold border-b pb-2">Coverage Requirements</div>
          )}
          <FormField
            control={form.control}
            name="coverageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deductible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deductible</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coverage Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Information */}
        <div className="p-4 border rounded-lg grid sm:grid-cols-2 gap-4">
          {isView && (
            <div className="col-span-2 font-semibold border-b pb-2">Additional Information</div>
          )}
          <FormField
            control={form.control}
            name="activities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planned Activities</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Group</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="withChildren"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travelling with Children?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        {!isView && (
          <div className="flex items-center gap-2 justify-end">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
            <Button type="reset">Start New Application</Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default TravelInsuranceForm;

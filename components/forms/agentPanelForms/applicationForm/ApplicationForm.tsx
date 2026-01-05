'use client';
import { useState } from 'react';
import z from 'zod';
import ApplicationForm_FirstStep from './ApplicationForm.FirstStep';
import ApplicationForm_SecondStep from './ApplicationForm.SecondStep';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const firstStepApplicationFormSchema = z.object({
  // Service Selection
  customer: z.string().min(1),
  country: z.string().min(1),
  service: z.string().min(1),
  serviceType: z.string().min(1),
  category: z.string().min(1),

  // Personal Details
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z
    .string()
    .email()
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  phone: z.string().min(1),
  dob: z.string().min(1),
  personalCountry: z.string().min(1),
  passportNumber: z.string().min(1),
  notes: z.string().optional(),

  // Address
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),

  // Payment Details
  paymentMethod: z.string().min(1),
  paymentStatus: z.string().min(1),
  totalAmount: z.string().min(1),
  paidAmount: z.string().optional(),
  paymentId: z.string().optional(),
  courierId: z.string().optional(),
});
export type FirstStepApplicationFormSchemaType = z.infer<typeof firstStepApplicationFormSchema>;

export const secondStepApplicationFormSchema = z.object({
  processingTime: z.string().min(1),
  services: z.array(z.string()).optional(),
  passportScan: z.any().optional(),
  proofOfAddress: z.any().optional(),
  signature: z.any().optional(),
  serviceForm: z.any().optional(),
  visaDocument: z.any().optional(),
  photograph: z.any().optional(),
  embassyDocument: z.any().optional(),
});
export type SecondStepApplicationFormSchemaType = z.infer<typeof secondStepApplicationFormSchema>;

const ApplicationForm = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Add New Application</p>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Application Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-3 bg-blue-200 rounded-md">
        <p className="font-medium">Application ID: 00816551</p>
      </div>
      <div className={cn(step !== 1 && 'sr-only')}>
        <ApplicationForm_FirstStep setStep={setStep} />
      </div>
      <div className={cn(step !== 2 && 'sr-only')}>
        <ApplicationForm_SecondStep setStep={setStep} />
      </div>
    </div>
  );
};

export default ApplicationForm;

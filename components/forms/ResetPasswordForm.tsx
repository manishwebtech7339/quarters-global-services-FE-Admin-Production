'use client';

import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormWrapper from '../common/FormWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import handleAsync from '@/lib/handleAsync';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import UserStatusModal, { UserStatus } from '../common/UserStatusModal';
import Link from 'next/link';
import { Loader } from 'lucide-react';

// ---------------- Schema ----------------
const formSchema = z
  .object({
    code: z.string().min(4, 'OTP must be 4 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ---------------- Helper ----------------
async function apiRequest(url: string, data: any) {
  const res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Something went wrong');
  }

  return res.json();
}

// ---------------- Component ----------------
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';

  const [userStatusModalOpen, setUserStatusModalOpen] = useState<UserStatus>(null);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
      code: '',
    },
  });

  // ------------ Submit Handler ------------
  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    setUserStatusModalOpen(null);

    await apiRequest('/auth/reset-password', { ...values, userId });

    toast.success('Password has been reset successfully');
    router.push('/login');
  });

  // ------------ Resend OTP Handler ------------
  const handleResendOtp = handleAsync(async () => {
    setResendLoading(true);
    setUserStatusModalOpen(null);

    await apiRequest('/auth/resend-otp', { userId });

    toast.success('Password reset code resent successfully');
    setResendLoading(false);
  });

  // ---------------- JSX ----------------
  return (
    <>
      {userStatusModalOpen && <UserStatusModal status={userStatusModalOpen} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col py-6 gap-4 mt-3">
          {/* OTP Field */}
          <FormWrapper
            control={form.control}
            name="code"
            type="number"
            placeholder="Enter Code"
            require
            cssStyles="mb-4"
          />

          {/* Password Field */}
          <FormWrapper
            control={form.control}
            name="newPassword"
            type="password"
            placeholder="New Password"
            require
            cssStyles="mb-4"
          />

          {/* Confirm Password Field */}
          <FormWrapper
            control={form.control}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            require
            cssStyles="mb-4"
          />

          {/* Resend */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading || form.formState.isSubmitting}
            className="w-fit flex items-center gap-2 text-sm text-primary font-medium"
          >
            Resend code
            {resendLoading && <Loader className="animate-spin size-4" />}
          </button>

          {/* Submit Button */}
          <div className="grid grid-cols-2 items-center gap-4">
            <Button type="button" variant="outline" disabled={form.formState.isSubmitting}>
              <Link href="/forget-password">Back</Link>
            </Button>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordForm;

'use client';
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormWrapper from '../common/FormWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import handleAsync from '@/lib/handleAsync';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UserStatusModal, { UserStatus } from '../common/UserStatusModal';

// ---------------- Schema ----------------
const formSchema = z.object({
  email: z.string().email('Invalid email'),
});

// ---------------- Component ----------------
const ForgetPasswordForm = () => {
  const route = useRouter();
  const [userStatusModalOpen, setUserStatusModalOpen] = useState<UserStatus>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    try {
      setUserStatusModalOpen(null);
      // 🔑 Call your backend login route
      const res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const response = await res.json();

        throw new Error(response.message || 'Invalid credentials');
      }

      const data = await res.json();
      const userId = data?.data?.userId;
      if (!userId) {
        throw new Error('User ID not found in response');
      }
      toast.success('Password reset code sent to your email');
      route.push('/reset-password' + `?userId=${userId}&email=${values.email}`);
    } finally {
      console.log('done');
    }
  });

  return (
    <>
      {userStatusModalOpen && <UserStatusModal status={userStatusModalOpen} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col py-6 gap-4 mt-3">
          {/* Email */}
          <FormWrapper
            control={form.control}
            name="email"
            type="text"
            placeholder="Email"
            require={true}
            cssStyles="mb-4"
          />

          {/* Submit Button */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ForgetPasswordForm;

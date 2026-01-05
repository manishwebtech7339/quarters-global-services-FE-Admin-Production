'use client';
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import FormWrapper from '../common/FormWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import handleAsync from '@/lib/handleAsync';
import { saveSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserTypeENUM } from '@/lib/types';
import UserStatusModal, { UserStatus } from '../common/UserStatusModal';
import Link from 'next/link';

// ---------------- Schema ----------------
const formSchema = z.object({
  email: z
    .string()
    .email('Invalid email')
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must be lowercase and valid'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

// ---------------- Component ----------------
const LoginForm = () => {
  const route = useRouter();
  const [userStatusModalOpen, setUserStatusModalOpen] = useState<UserStatus>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = handleAsync(async (values: z.infer<typeof formSchema>) => {
    setUserStatusModalOpen(null);
    // 🔑 Call your backend login route
    const res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    // For onboarding use
    sessionStorage.setItem('email', values.email);
    sessionStorage.setItem('isNewUser', 'false');

    if (!res.ok) {
      const response = await res.json();

      if (response.data === 'agency:not-found') {
        setUserStatusModalOpen('NOT_ASSIGNED');
        sessionStorage.setItem('isNewUser', 'true');
        return;
      }
      if (response.data === 'agency:pending') {
        setUserStatusModalOpen('PENDING');
        return;
      }
      if (response.data === 'agency:rejected') {
        setUserStatusModalOpen('REJECTED');
        return;
      }
      throw new Error(response.message || 'Invalid credentials');
    }

    const data = await res.json();
    const userDataId = data?.data?._id;
    const userDataToken = data?.data?.token?.split(' ')?.[1];
    const userDataRole = data?.data?.role || UserTypeENUM.ADMIN;

    if (!userDataToken || !userDataId) {
      throw new Error('User data not found');
    }
    // Save user token
    saveSession({ id: userDataId, token: userDataToken }, userDataRole);
    toast.success('Login successfully');
    route.push('/admin/home');
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

          {/* Password */}
          <FormWrapper
            control={form.control}
            name="password"
            type="password"
            placeholder="Password"
            require={true}
            cssStyles="mb-4"
          />

          {/* Remember Me */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center flex-wrap gap-3">
              <Checkbox
                id="remember"
                checked={form.watch('remember')}
                onCheckedChange={(val) => form.setValue('remember', Boolean(val))}
              />
              <Label htmlFor="remember" className="text-primary text-xs md:text-sm">
                Remember me
              </Label>
            </div>
            <Link href="/forget-password" className="font-normal text-xs md:text-sm text-primary">
              Forget Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="text-xl text-white h-16"
            disabled={form.formState.isSubmitting}
          >
            Login
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;

'use client';
import React from 'react';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import FormWrapper from '../common/FormWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/Store';
import { userInfo } from '@/store/slices/registerUserSlice';
import { passwordSchema } from '@/lib/formSchemaFunctions';

const formSchema = z
  .object({
    username: z.string(),
    password: passwordSchema(),
    confirmPassword: passwordSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const AgencyRegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [onSubmitLoading, setOnSubmitLoading] = React.useState<boolean>(false);
  const [showOtpBox, setShowOtpBox] = React.useState<boolean>(false);
  const [otp, setOtp] = React.useState<string>('');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    setOnSubmitLoading(true);
    try {
      // #### Email verification ####
      const res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/auth/agency-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.username, password: values.password, role: 'agent' }),
      });

      const resData = await res.json();

      // #### When email is already verified ####
      if (resData?.status && resData?.message?.includes('verified')) {
        throw new Error(resData?.message || 'Error while verifying otp');
      }

      // #### Error while verifying email ####
      if (!resData.status) {
        throw new Error(resData?.message || 'Email does not exist');
      }

      // #### OTP Sent ####
      toast.success(resData?.message, { duration: 4000, position: 'top-center' });
      setShowOtpBox(true);
    } catch (error) {
      console.log('!!! Error while verifying email !!!', error);
      toast.error(
        error instanceof Error ? error?.message : 'Something went wrong while verifying email',
        { duration: 4000, position: 'top-center' },
      );
    } finally {
      setOnSubmitLoading(false);
    }
  };

  const [otpLoading, setOtpLoading] = React.useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = React.useState<boolean>(false);
  const handleVerifyOtp = async (otpValue: string) => {
    setOtpLoading(true);
    if (otpValue.length !== 6) {
      toast.error('OTP should be 6 digits', { duration: 4000, position: 'top-center' });
      setOtpLoading(false);
      return;
    }
    // handle case when otp is not valid it should be number only
    if (!/^\d+$/.test(otpValue)) {
      toast.error('OTP should be number only', { duration: 4000, position: 'top-center' });
      setOtpLoading(false);
      return;
    }
    try {
      // #### Email verification ####
      const res = await fetch(process.env.NEXT_PUBLIC_QUARTUS_API_URL + '/user/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.getValues('username'),
          otp: otpValue,
          password: form.getValues('password'),
        }),
      });

      const resData = await res.json();

      // #### Error while verifying otp ####
      if (!resData.status) {
        throw new Error(resData?.message || 'Error while verifying otp');
      }

      // #### OTP verified successfully ####
      setIsOtpVerified(true);
      sessionStorage.setItem('email', form.getValues('username'));
      sessionStorage.setItem('isNewUser', 'true');
      dispatch(userInfo(form.getValues('username')));

      toast.success(resData?.message, { duration: 4000, position: 'top-center' });

      // #### Navigating to onboard page ####
      router.push('/agent/onboard');
    } catch (error) {
      console.log('!!! Error while verifying email !!!', error);
      toast.error(
        error instanceof Error ? error?.message : 'Something went wrong while verifying OTP',
        { duration: 4000, position: 'top-center' },
      );
    } finally {
      setOtpLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col py-6 gap-4 mt-3">
        <FormWrapper
          control={form.control}
          name="username"
          type="email"
          placeholder="Email"
          require={true}
          cssStyles="mb-4"
        />
        <FormWrapper
          control={form.control}
          name="password"
          type="password"
          placeholder="Password"
          require={true}
          cssStyles="mb-4"
        />
        <FormWrapper
          control={form.control}
          name="confirmPassword"
          type="password"
          placeholder="confirm Password"
          require={true}
          cssStyles="mb-4"
        />

        {/* Show OTP input only when showOtpBox is true */}
        {showOtpBox && (
          <div className="mb-4">
            <Label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
              Enter OTP
            </Label>
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
              <InputOTPGroup className="w-full gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <React.Fragment key={index}>
                    <InputOTPSlot index={index} className="flex-1 h-12 text-center text-lg" />
                    {/* Add separator after 3rd OTP box */}
                    {index === 2 && <InputOTPSeparator className="mx-1 text-gray-400" />}
                  </React.Fragment>
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center flex-wrap gap-3">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-primary text-xs md:text-sm">
              Remember me
            </Label>
          </div>
          {/* <p className="font-normal text-xs md:text-sm text-primary">Forget Password?</p> */}
        </div>

        {!showOtpBox ? (
          <Button disabled={onSubmitLoading} type="submit" className="text-xl text-white h-16">
            {onSubmitLoading ? 'Registering...' : 'Register'}
          </Button>
        ) : (
          <Button
            onClick={() => handleVerifyOtp(otp)}
            disabled={otpLoading || otp.length !== 6 || isOtpVerified}
            type="button"
            className="text-xl text-white h-16"
          >
            {isOtpVerified ? 'Redirecting...' : otpLoading ? 'Verifying...' : 'Verify'}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AgencyRegisterForm;

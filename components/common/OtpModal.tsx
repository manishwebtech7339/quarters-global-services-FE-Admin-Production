import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReactNode, useState } from 'react';
import DeleteConfirm from './DeleteConfirm';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
type DeleteConfirmProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  triggerLabel?: string;
};

export function OtpModal({
  isOpen,
  onClose,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}) {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('OTP entered:', otp);
  const handleVerifyOtp = async () => {
    try {
      setIsSubmitting(true);
      const result = await fetcher('/user/validate-otp', {
        method: 'POST',
        body: { email, otp },
      });
      const data = await result;
      if (data.status) {
        toast.success(data.message || 'OTP verified successfully');
        setIsSubmitting(false);
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsSubmitting(false);
      throw error;
    }
  };
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Otp sent to <span className="opacity-60 text-primary">{email} </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            <InputOTP maxLength={6} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleVerifyOtp}
            disabled={isSubmitting}
            className="bg-destructive hover:bg-destructive/70"
          >
            {isSubmitting ? 'Verifying...' : 'Verify '}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfirm;

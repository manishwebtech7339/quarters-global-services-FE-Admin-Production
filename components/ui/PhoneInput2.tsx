'use client';

import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '@/lib/utils';
import './Phoneinput2.css';
import { FormMessage } from '@/components/ui/form';

interface PhoneInput2Props {
  value?: string;
  onChange?: (value: string, country: any) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export const PhoneInput2: React.FC<PhoneInput2Props> = ({
  value,
  onChange,
  disabled = false,
  error,
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <div
        className={cn(
          'flex items-center rounded-md border border-input bg-background px-2 h-12',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-all',
          disabled && 'opacity-50 pointer-events-none',
          error && 'border-red-500',
        )}
      >
        <PhoneInput
          country={'us'}
          value={value}
          onChange={onChange}
          inputProps={{
            required,
            name: 'phone',
            autoFocus: false,
          }}
          containerClass="!w-full "
          inputClass="!w-full !bg-transparent !border-0 !shadow-none !text-sm !h-10 !focus:ring-0 !focus:outline-none  !pl-12"
          buttonClass="!bg-transparent !border-0 !pr-1 !pl-1 !hover:bg-accent/10"
          dropdownClass="!bg-popover !border !border-border !text-sm !shadow-md"
          searchClass="!z-[99]"
          disabled={disabled}
          enableSearch={true}
          disableSearchIcon={true}
        />
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
};

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import flags from 'react-phone-number-input/flags';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ComboOption {
  value: string;
  label: string;
  [key: string]: any;
}

type CommonComboBoxProps = {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  initialOptions?: any[];
  formatLabel?: (item: any) => string;
  disabled?: boolean;
  renderOption?: (item: any) => React.ReactNode;
};

const CommonComboBox: React.FC<CommonComboBoxProps> = ({
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  initialOptions,
  formatLabel,
  disabled = false,
  renderOption,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ComboOption[]>([]);

  // Initialize options ONCE
  React.useEffect(() => {
    if (initialOptions) {
      const mapped = initialOptions.map((item) => ({
        value: item._id ?? item.value ?? item.code ?? item.slug ?? item.name,
        label: formatLabel
          ? formatLabel(item)
          : (item.name ?? item.label ?? item.displayName ?? ''),
        ...item,
      }));
      setOptions(mapped);
    }
  }, [initialOptions, formatLabel]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="justify-between rounded-sm h-8 w-full"
        >
          <span className="truncate">{value ? selectedLabel : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[300px]">
        <Command>
          {/* 🔥 Auto search handled by Command */}
          <CommandInput placeholder={searchPlaceholder} />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label} // 🔥 searchable text
                  onSelect={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  {renderOption ? (
                    renderOption(opt)
                  ) : (
                    <div className="flex items-center gap-2">
                      <Flag country={opt.code || opt.country || opt.slug} countryName={opt.label} />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                  )}

                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === opt.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Flag: React.FC<{ country?: string; countryName?: string }> = ({ country, countryName }) => {
  if (!country) return <span className="flex h-4 w-6" />;

  const key = String(country).toLowerCase();
  const C = (flags as any)[key] || (flags as any)[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {C ? <C title={countryName} /> : null}
    </span>
  );
};

export default CommonComboBox;

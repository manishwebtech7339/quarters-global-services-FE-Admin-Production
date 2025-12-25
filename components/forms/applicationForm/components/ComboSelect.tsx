import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { fetcher } from '@/lib/fetcher';

import { ChevronsUpDown, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateApplicationType } from '../schemas';

interface ComboSelectOption {
  label: string;
  value: string;
}

interface ComboSelectProps {
  name?: keyof CreateApplicationType;
  fieldLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  apiPath: string;
  staticOptions?: ComboSelectOption[];
  labelKey?: string;
  valueKey?: string;
  enable?: boolean;
  onSelectIsHaveSubCategory?: (v: boolean) => void;
  onSelect?: VoidFunction;
  onSlugSelect?: (v: string) => void;
}

const ComboSelect = ({
  name = 'firstName',
  fieldLabel = '',
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  apiPath,
  staticOptions,
  labelKey = 'label',
  valueKey = 'value',
  enable = true,
  onSelectIsHaveSubCategory,
  onSelect,
  onSlugSelect,
}: ComboSelectProps) => {
  const form = useFormContext<CreateApplicationType>();
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSlugSetRef = React.useRef<string | null>(null);

  // Default static options (fallback)
  const defaultOptions: ComboSelectOption[] = [];

  // Fetch data from API or use static options
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!apiPath || apiPath.trim() === '') {
          setOptions([]);
          return;
        }
        const response = await fetcher(apiPath, {
          cache: 'no-cache',
          revalidate: 60,
        });
        if (name === 'platformServiceCategoryPackageId') {
          console.log(response, 'response');
        }
        let fetchedOptions: any[] = [];
        if (name === 'platformServiceSubCategoryId') {
          fetchedOptions = response?.data?.data?.[0]?.subCategories || [];
        } else {
          fetchedOptions = response?.data?.data || [];
        }

        setOptions(fetchedOptions);

        // Handle different response structures
      } catch (err) {
        console.error('Error fetching options:', err);
        setError('Failed to load options');
        setOptions(defaultOptions); // Fallback to default options
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiPath, staticOptions, labelKey, valueKey]);

  // Handle slug selection for existing values in edit mode
  useEffect(() => {
    const currentValue = form.getValues(name as keyof CreateApplicationType);

    if (currentValue && options.length > 0 && onSlugSelect) {
      const selectedOption = options.find((option) => {
        const optionValue = option[valueKey] || option._id;
        return optionValue === currentValue;
      });

      if (selectedOption && selectedOption.slug && selectedOption.slug !== lastSlugSetRef.current) {
        lastSlugSetRef.current = selectedOption.slug;
        onSlugSelect(selectedOption.slug);
      }
    }
  }, [options, form, name, valueKey, onSlugSelect]);

  return (
    <FormField
      control={form.control}
      name={name as keyof CreateApplicationType}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldLabel || placeholder}</FormLabel>
          <Popover>
            <PopoverTrigger disabled={!enable} className="h-12 !w-full" asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(' justify-between', !field.value && 'text-muted-foreground')}
                >
                  <span>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : field.value ? (
                      options.find((option) => option._id === field.value)?.name
                    ) : (
                      placeholder
                    )}
                  </span>
                  {!loading && <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
              <Command shouldFilter={true}>
                <CommandInput placeholder={searchPlaceholder} className="h-9" />
                <CommandList>
                  <CommandEmpty>{error ? error : emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options?.length > 0 &&
                      options.map((option) => {
                        const optionValue = option[valueKey] || option._id;
                        const optionLabel = option[labelKey] || option.name;
                        const optionSlug = option.slug;

                        return (
                          <CommandItem
                            key={optionValue}
                            value={optionLabel}
                            onSelect={() => {
                              field.onChange(optionValue);
                              if (onSelect) {
                                onSelect();
                              }
                              if (onSlugSelect) {
                                onSlugSelect(optionSlug);
                              }
                              if (onSelectIsHaveSubCategory) {
                                const selected = options.find(
                                  (f) => (f[valueKey] || f._id) === optionValue,
                                );
                                onSelectIsHaveSubCategory?.(
                                  Array.isArray(selected?.subCategories) &&
                                    selected.subCategories.length > 0,
                                );
                              }
                            }}
                          >
                            <div className="flex flex-col w-full">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{optionLabel}</span>
                                {name === 'platformServiceCategoryPackageId' && option.price && (
                                  <span className="text-sm font-semibold text-green-600">
                                    ${option.price}
                                  </span>
                                )}
                              </div>
                              {name === 'platformServiceCategoryPackageId' &&
                                option.priceDescription && (
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {option.priceDescription}
                                  </span>
                                )}
                            </div>
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ComboSelect;

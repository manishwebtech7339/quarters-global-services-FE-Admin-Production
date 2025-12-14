'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fetcher } from '@/lib/fetcher';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: any;
}

interface FormComboboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
  apiUrl?: string;
  filter?: Record<string, any>;
  defaultValue?: any; // expects {_id:"", name:""}
  formatLabel?: (item: any) => string;
  onSelect?: (selectedItem: ComboboxOption) => void;
  initialOptions?: any[];
}

export function FormCombobox<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  initialOptions,
  labelClassName = '',
  required = false,
  disabled = false,
  apiUrl,
  filter,
  defaultValue,
  formatLabel,
  onSelect,
}: FormComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [options, setOptions] = React.useState<ComboboxOption[]>(initialOptions || []);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);

  const hasNextPage = page < totalPages;

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Set default options
  React.useEffect(() => {
    if (initialOptions) {
      const mappedOptions: ComboboxOption[] = initialOptions.map((item) => ({
        value: item._id ?? item.value ?? '',
        label: formatLabel ? formatLabel(item) : (item.name ?? item.label ?? ''),
        ...item,
      }));
      setOptions(mappedOptions);
    }
  });

  // Helper to get label from item
  const getItemLabel = React.useCallback(
    (item: any): string => {
      if (formatLabel) return formatLabel(item);
      return item.name ?? item.label ?? item.fullName ?? item.hotelName ?? '';
    },
    [formatLabel],
  );

  /* --------------------------- Create Default Option --------------------------- */
  const defaultOption = React.useMemo<ComboboxOption | null>(() => {
    if (!defaultValue) return null;
    return {
      value: defaultValue._id,
      label: getItemLabel(defaultValue),
      ...defaultValue,
    };
  }, [defaultValue, getItemLabel]);

  /* ----------------------------- Fetch Options ----------------------------- */
  const fetchOptions = React.useCallback(
    async (pageNum: number, searchQuery: string, reset = false) => {
      if (!apiUrl) return;

      if (pageNum === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        const separator = apiUrl.includes('?') ? '&' : '?';
        const filterParams = filter
          ? Object.entries(filter)
              .map(([k, v]) => `${k}=${v}`)
              .join('&')
          : '';
        const url = `${apiUrl}${separator}page=${pageNum}${searchQuery ? `&search=${searchQuery}` : ''}${filterParams ? `&${filterParams}` : ''}`;

        const response = await fetcher(url, { method: 'GET' });

        const newItems: any[] = response?.data?.data || response?.data || [];
        const total = response?.data?.totalPages || 1;

        const mappedOptions: ComboboxOption[] = newItems.map((item) => ({
          value: item._id ?? item.value ?? '',
          label: getItemLabel(item),
          ...item,
        }));

        // Filter out default option from results
        const filtered = defaultOption
          ? mappedOptions.filter((o) => o.value !== defaultOption.value)
          : mappedOptions;

        if (reset) {
          setOptions(filtered);
        } else {
          setOptions((prev) => [...prev, ...filtered]);
        }

        setTotalPages(total);
        setPage(pageNum);
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [apiUrl, filter, getItemLabel, defaultOption],
  );

  // Fetch on open or search change
  React.useEffect(() => {
    if (open && apiUrl) {
      setPage(1);
      fetchOptions(1, debouncedSearch, true);
    }
  }, [open, debouncedSearch, apiUrl, fetchOptions]);

  // Fetch next page
  const fetchNextPage = React.useCallback(() => {
    if (hasNextPage && !isFetchingMore) {
      fetchOptions(page + 1, debouncedSearch, false);
    }
  }, [hasNextPage, isFetchingMore, page, debouncedSearch, fetchOptions]);

  // Infinite scroll hook
  const { loaderRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isFetchingMore,
  });

  /* ----------------------- Final Options (Default on Top) ----------------------- */
  const finalOptions = React.useMemo(() => {
    return defaultOption ? [defaultOption, ...options] : options;
  }, [defaultOption, options]);

  const getSelectedLabel = React.useCallback(
    (value: string) => {
      const opt = finalOptions.find((o) => o.value === value);
      return opt?.label || placeholder;
    },
    [finalOptions, placeholder],
  );

  /* ----------------------------- JSX Render ----------------------------- */
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="gap-1 relative w-full">
          {label && (
            <FormLabel className={cn('gap-0', labelClassName)}>
              {label}
              {required && <span className=" text-xl!">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  aria-expanded={open}
                  className={cn(
                    'justify-between rounded-sm text-text-black h-full border border-gray-300',
                  )}
                >
                  <span className="truncate">
                    {field.value ? getSelectedLabel(field.value as string) : placeholder}
                  </span>
                  <div className="flex">
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 h-[300px] shadow-2xl  border-gray-200 w-(--radix-popover-trigger-width)">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9 !border-b-gray-100"
                    value={search}
                    onValueChange={setSearch}
                  />

                  <CommandList>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : finalOptions.length === 0 ? (
                      <CommandEmpty>No results found.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {finalOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              field.onChange(option.value);
                              onSelect?.(option);
                              setOpen(false);
                              setSearch('');
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value === option.value ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}

                        {hasNextPage && (
                          <div ref={loaderRef} className="flex items-center justify-center py-2">
                            {isFetchingMore && (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>

          <FormMessage className="font-semibold text-xs text-red-500 ms-1" />
        </FormItem>
      )}
    />
  );
}

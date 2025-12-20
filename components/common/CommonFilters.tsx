'use client';

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Search as SearchIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Option = { label: string; value: string };
export type FilterSelectConfig = {
  name: string;
  label: string;
  paramKey?: string; // URL key (default: name)
  placeholder?: string;
  options: Option[];
};

type Props = {
  className?: string;
  triggerClassName?: string;
  placeholder?: string; // search placeholder
  isReplaceExistFilters?: boolean;
  debounceMs?: number; // search debounce
  searchKey?: string; // default "q"
  dateFromKey?: string; // default "from"
  dateToKey?: string; // default "to"
  selects?: FilterSelectConfig[];
  children?: React.ReactNode; // any extra custom filters
  autoCloseOnChange?: boolean; // close popover after any change (default false)
  showDateFilters?: boolean; // show date filters (default true)
};

const buildURL = (
  current: URLSearchParams,
  updates: Record<string, string | null>,
  replaceAll: boolean,
) => {
  const params = replaceAll
    ? new URLSearchParams()
    : new URLSearchParams(Array.from(current.entries()));
  for (const [k, v] of Object.entries(updates)) {
    if (!v) params.delete(k);
    else params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '?';
};

export default function QueryFiltersPopover({
  className,
  triggerClassName,
  placeholder = 'Search…',
  isReplaceExistFilters = false,
  debounceMs = 300,
  searchKey = 'q',
  dateFromKey = 'from',
  dateToKey = 'to',
  selects = [],
  children,
  autoCloseOnChange = false,
  showDateFilters = true,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  // local state mirrors URL
  const [query, setQuery] = useState(searchParams.get(searchKey) ?? '');
  const [from, setFrom] = useState<string>(searchParams.get(dateFromKey) ?? '');
  const [to, setTo] = useState<string>(searchParams.get(dateToKey) ?? '');
  const [selectValues, setSelectValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    for (const s of selects) {
      const key = s.paramKey ?? s.name;
      obj[s.name] = searchParams.get(key) ?? '';
    }
    return obj;
  });

  // keep local state in sync on back/forward
  useEffect(() => {
    setQuery(searchParams.get(searchKey) ?? '');
    setFrom(searchParams.get(dateFromKey) ?? '');
    setTo(searchParams.get(dateToKey) ?? '');
    setSelectValues((prev) => {
      const next: Record<string, string> = {};
      for (const s of selects) {
        const key = s.paramKey ?? s.name;
        next[s.name] = searchParams.get(key) ?? '';
      }
      return { ...prev, ...next };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // --- debounced search like your pattern
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        const href = buildURL(searchParams, { [searchKey]: query || null }, isReplaceExistFilters);
        router.replace(href);
      });
      setLoading(false);
      if (autoCloseOnChange) setOpen(false);
    }, debounceMs);

    // ✅ always return void
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null; // optional: reset
      }
    };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // dates & selects update immediately
  const pushDates = (nf?: string, nt?: string) => {
    const updates: Record<string, string | null> = {
      [dateFromKey]: nf || null,
      [dateToKey]: nt || null,
    };
    startTransition(() => {
      router.replace(buildURL(searchParams, updates, isReplaceExistFilters));
    });
    if (autoCloseOnChange) setOpen(false);
  };

  const onFromChange = (v: string) => {
    setFrom(v);
    pushDates(v, to);
  };
  const onToChange = (v: string) => {
    setTo(v);
    pushDates(from, v);
  };

  const onSelectChange = (name: string, value: string) => {
    setSelectValues((p) => ({ ...p, [name]: value }));
    const conf = selects.find((s) => s.name === name)!;
    const key = conf.paramKey ?? conf.name;
    startTransition(() => {
      router.replace(buildURL(searchParams, { [key]: value || null }, isReplaceExistFilters));
    });
    if (autoCloseOnChange) setOpen(false);
  };

  const clearAll = () => {
    setQuery('');
    setFrom('');
    setTo('');
    const cleared: Record<string, string | null> = {
      [searchKey]: null,
      [dateFromKey]: null,
      [dateToKey]: null,
    };
    for (const s of selects) cleared[s.paramKey ?? s.name] = null;

    startTransition(() => {
      router.replace(buildURL(searchParams, cleared, true));
    });
  };

  // active filter count for trigger badge
  const activeCount = useMemo(() => {
    let n = 0;
    if (query) n++;
    if (from) n++;
    if (to) n++;
    for (const v of Object.values(selectValues)) if (v) n++;
    return n;
  }, [query, from, to, selectValues]);

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('justify-between md:w-auto', triggerClassName)}>
            <span className="flex items-center gap-2">
              {/* <SlidersHorizontal className="h-4 w-4" /> */}
              Filters
              {activeCount > 0 && (
                <span className="ml-1 inline-flex items-center rounded-full border px-2 text-xs">
                  {activeCount}
                </span>
              )}
            </span>
            {(loading || isPending) && <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-70" />}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[min(92vw,400px)] p-4" align="end">
          <div className="grid grid-cols-1 gap-4">
            {/* Search */}
            <div>
              <Label className="mb-1 block">Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="pl-9 pr-10"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Dates */}
            {showDateFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 block">From</Label>
                  <Input type="date" value={from} onChange={(e) => onFromChange(e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">To</Label>
                  <Input
                    type="date"
                    min={from}
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Selects */}
            {selects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selects.map((s) => (
                  <div key={s.name}>
                    <Label className="mb-1 block">{s.label}</Label>
                    <Select
                      value={selectValues[s.name] ?? ''}
                      onValueChange={(v) => onSelectChange(s.name, v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={s.placeholder ?? 'All'} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* <SelectItem >All</SelectItem> */}
                        {s.options.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Extra custom filters */}
            {children ? <div className="border-t pt-3">{children}</div> : null}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="ghost" type="button" onClick={clearAll}>
                Clear all
              </Button>
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

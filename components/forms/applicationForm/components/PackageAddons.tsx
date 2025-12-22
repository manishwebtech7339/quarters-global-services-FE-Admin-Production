import React, { useState, useEffect, useCallback, memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { fetcher } from '@/lib/fetcher';
import { CreateApplicationType } from '../schemas';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface PackageAddon {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  priceDescription?: string;
}

interface PackageAddonsProps {
  packageId: string;
  enable?: boolean;
  isEdit?: boolean;
}

const PackageAddonsSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <Skeleton className="h-5 w-36" />
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-dashed border-gray-200 flex-shrink-0 min-w-[280px]">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-4 mt-1 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full max-w-xs" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
};

const PackageAddons = ({ packageId, enable = true, isEdit = false }: PackageAddonsProps) => {
  const form = useFormContext<CreateApplicationType>();
  const [addons, setAddons] = useState<PackageAddon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the checkbox change handler to prevent unnecessary re-renders
  const handleAddonToggle = useCallback(
    (addonId: string, checked: boolean) => {
      const currentValue = form.getValues('platformServiceCategoryPackageAddonsId') || [];
      if (checked) {
        form.setValue('platformServiceCategoryPackageAddonsId', [...currentValue, addonId], {
          shouldValidate: false,
        });
      } else {
        form.setValue(
          'platformServiceCategoryPackageAddonsId',
          currentValue.filter((id) => id !== addonId),
          { shouldValidate: false },
        );
      }
    },
    [form],
  );

  // Fetch addons when packageId changes
  useEffect(() => {
    const fetchAddons = async () => {
      if (!packageId || !enable) {
        setAddons([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetcher(
          `/platform-service-category-package-addon/get-platform-service-category-package-addon?platformServiceCategoryPackageId=${packageId}`,
          {
            cache: 'no-cache',
            revalidate: 60,
          },
        );

        const fetchedAddons = response?.data?.data || [];
        setAddons(fetchedAddons);
      } catch (err) {
        console.error('Error fetching package addons:', err);
        setError('Failed to load package addons');
        setAddons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, [packageId, enable]);

  // Show component if packageId exists OR if there are existing addon IDs
  const currentAddonIds = form.getValues('platformServiceCategoryPackageAddonsId') || [];
  const shouldShow = packageId || currentAddonIds.length > 0;

  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return <PackageAddonsSkeleton />;
  }

  if (error) {
    return <div className="text-sm text-red-600 p-3 bg-red-50 rounded-md">{error}</div>;
  }

  if (addons.length === 0) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="platformServiceCategoryPackageAddonsId"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="text-base font-semibold">Additional Addons</FormLabel>
            <div className="flex flex-wrap gap-3">
              {addons.map((addon) => (
                <Card
                  key={addon._id}
                  className="border-dashed hover:border-solid transition-colors flex-shrink-0 min-w-[280px]"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={(field.value || []).includes(addon._id)}
                        onCheckedChange={(checked) => handleAddonToggle(addon._id, !!checked)}
                        disabled={!!isEdit}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{addon.name}</span>
                          {addon.price && (
                            <span className="text-sm font-semibold text-green-600">
                              +${addon.price}
                            </span>
                          )}
                        </div>
                        {addon.description && (
                          <p className="text-xs text-muted-foreground">{addon.description}</p>
                        )}
                        {addon.priceDescription && (
                          <p className="text-xs text-blue-600">{addon.priceDescription}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default memo(PackageAddons);

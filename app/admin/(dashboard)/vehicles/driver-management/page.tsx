import React from 'react';
import DriverManagement from './DriverManagement';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getDriverList } from '@/services/vehicleservice';
import { redirect } from 'next/navigation';

const page = async ({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) => {
  const page = (await searchParams).page || '1';
  const query = (await searchParams).q || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.vehicles });
  if (!access) {
    return redirect('/?access=false');
  }
  const driverList = await getDriverList({
    page,
    search: query || '',
  });
  return <DriverManagement driverData={driverList} />;
};

export default page;

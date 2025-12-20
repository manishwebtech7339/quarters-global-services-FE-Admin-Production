import React from 'react';
import VehiclesManagement from './VehiclesManagement';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getVehicleList } from '@/services/vehicleservice';
import { redirect } from 'next/navigation';

const page = async ({ searchParams }: { searchParams: Promise<{ page?: string; q?: string }> }) => {
  const page = (await searchParams).page || '1';
  const search = (await searchParams).q || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets });
  if (!access) {
    return redirect('/?access=false');
  }
  const vehicleList = await getVehicleList({
    page,
    search,
  });
  return <VehiclesManagement vehicleList={vehicleList} />;
};

export default page;

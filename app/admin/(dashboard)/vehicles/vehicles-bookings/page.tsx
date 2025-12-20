import React from 'react';
import VehiclesBookings from './VehiclesBookings';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { redirect } from 'next/navigation';
import { getVehicleBookings } from '@/services/vehicleservice';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; from?: string; to?: string }>;
}) => {
  const page = (await searchParams).page || '1';
  const q = (await searchParams).q || '';
  const from = (await searchParams).from || '';
  const to = (await searchParams).to || '';

  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets });
  if (!access) {
    return redirect('/?access=false');
  }
  const bookings = await getVehicleBookings({
    page,
    search: q || '',
    from: from || '',
    to: to || '',
  });
  return <VehiclesBookings bookingData={bookings} />;
};

export default page;

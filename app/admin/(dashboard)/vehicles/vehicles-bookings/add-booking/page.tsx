import VehicleBookingForm from '@/components/forms/vehicleBookingForm/VehicleBookingForm';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { redirect } from 'next/navigation';
import { getVehicleList, getDriverList } from '@/services/vehicleservice';
import React from 'react';

const page = async () => {
  const access = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.vehicles });
  if (!access) {
    return redirect('/?access=false');
  }

  // Fetch vehicles and drivers data
  const [vehiclesResponse, driversResponse] = await Promise.all([
    getVehicleList({ page: '1' }),
    getDriverList({ page: '1' }),
  ]);

  return (
    <div>
      <p className="py-4 text-lg font-semibold">Add New Booking</p>
      <VehicleBookingForm
        vehicles={vehiclesResponse.data || []}
        drivers={driversResponse.data || []}
      />
    </div>
  );
};

export default page;

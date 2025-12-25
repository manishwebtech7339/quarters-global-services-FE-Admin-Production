'use client';

import CommonTable from '@/components/common/CommonTable';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TabButton from '../TabButton';
import { ApiPagination, VehicleDataType } from '@/lib/types';
import { deleteVehicle } from '@/services/vehicleservice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Paginator from '@/components/shared/paginator';
import CommonFilters from '@/components/common/CommonFilters';

// ============================
// Main Component
// ============================
const VehiclesManagement = ({
  vehicleList,
}: {
  vehicleList: ApiPagination & { data: VehicleDataType[] };
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteVehicle(id);
      if (success) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================
  // Table Columns (match API response)
  // ============================
  const columns = [
    {
      header: 'Vehicle ID',
      accessor: '_id',
    },
    {
      header: 'Vehicle Name',
      accessor: 'vehicleName',
    },
    {
      header: 'Type',
      accessor: 'vehicleType',
    },
    {
      header: 'License Plate',
      accessor: 'licensePlateNumber',
    },
    {
      header: 'Seating Capacity',
      accessor: 'seatingCapacity',
    },
    {
      header: 'AC / Non-AC',
      accessor: 'ACorNONAC',
    },
    {
      header: 'Fuel Type',
      accessor: 'fuelType',
    },
    {
      header: 'Transmission',
      accessor: 'transmissionType',
    },
    {
      header: 'Insurance Expiry',
      accessor: 'insuranceExpiryDate',
      render: (row: any) =>
        new Date(row.insuranceExpiryDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={'/admin/vehicles/vehicles-management/' + row._id}>
            <Icon name="view" />
          </Link>
          <Link href={'/admin/vehicles/vehicles-management/edit/' + row._id}>
            <Icon name="edit" />
          </Link>
          <DeleteConfirm
            title="Delete Vehicle"
            description="Are you sure you want to delete this vehicle? This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDelete(row._id)}
          >
            <span className="cursor-pointer hover:opacity-70 transition-opacity">
              <Icon name="delete" />
            </span>
          </DeleteConfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <TabButton />
        <div className="flex items-center gap-2">
          <CommonFilters showDateFilters={false} />

          <Button asChild>
            <Link href="/admin/vehicles/vehicles-management/add-vehicle">
              <Plus />
              <span>Add Vehicle</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={vehicleList?.data || []} />
        <Paginator totalItems={vehicleList.totalPages} />
      </div>
    </div>
  );
};

export default VehiclesManagement;

'use client';

import CommonTable from '@/components/common/CommonTable';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TabButton from '../TabButton';
import { ApiPagination, DriverDataType } from '@/lib/types';
import { deleteDriver } from '@/services/vehicleservice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Paginator from '@/components/shared/paginator';
import CommonFilters from '@/components/common/CommonFilters';
import { Badge } from '@/components/ui/badge';

// ============================
// Main Component
// ============================
const DriverManagement = ({
  driverData,
}: {
  driverData: ApiPagination & { data: DriverDataType[] };
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteDriver(id);
      if (success) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error('Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================
  // Table Columns (match API response)
  // ============================
  const columns = [
    {
      header: 'Driver ID',
      accessor: '_id',
    },
    {
      header: 'Name',
      accessor: 'fullName',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'License Number',
      accessor: 'licenseNumber',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => (
        <Badge variant="outline">{row.status === 'active' ? 'Available' : 'Not Available'}</Badge>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={'/admin/vehicles/driver-management/' + row._id}>
            <Icon name="view" />
          </Link>
          <Link href={'/admin/vehicles/driver-management/edit/' + row._id}>
            <Icon name="edit" />
          </Link>
          <DeleteConfirm
            title="Delete Driver"
            description="Are you sure you want to delete this driver? This action cannot be undone."
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
            <Link href="/admin/vehicles/driver-management/add-driver">
              <Plus />
              <span>Add Driver</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={driverData?.data || []} />
        <Paginator totalItems={driverData.totalPages} />
      </div>
    </div>
  );
};

export default DriverManagement;

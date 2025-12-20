'use client';

import CommonTable from '@/components/common/CommonTable';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import TabButton from '../TabButton';
import { ApiPagination, BookingDataType } from '@/lib/types';
import { deleteBooking } from '@/services/vehicleservice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Paginator from '@/components/shared/paginator';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';

const VehiclesBookings = ({
  bookingData,
}: {
  bookingData: ApiPagination & { data: BookingDataType[] };
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  console.log(isDeleting);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteBooking(id);
      console.log(success, 'succes');
      if (success) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Booking ID',
      accessor: '_id',
    },
    {
      header: 'Name',
      accessor: 'fullName',
      render: (row: any) => (
        <div className="flex items-center gap-2 font-medium">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt={row.fullName} />
            <AvatarFallback>{row.fullName?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p>{row.fullName}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row: any) => `${row.countryCode} ${row.phone}`,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Pickup Location',
      accessor: 'pickupLocation',
    },
    {
      header: 'Drop Location',
      accessor: 'dropLocation',
    },
    {
      header: 'Pickup Date',
      accessor: 'pickupDate',
      render: (row: any) =>
        new Date(row.pickupDate).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
    },
    {
      header: 'Drop Date',
      accessor: 'dropDate',
      render: (row: any) =>
        new Date(row.dropDate).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
    },
    {
      header: 'Trip Purpose',
      accessor: 'tripPurpose',
    },
    {
      header: 'Amount',
      accessor: 'amount',
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
    },
    {
      header: 'Booking Status',
      accessor: 'bookingStatus',
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={'/admin/vehicles/vehicles-bookings/' + row._id}>
            <Icon name="view" />
          </Link>
          <Link href={'/admin/vehicles/vehicles-bookings/edit/' + row._id}>
            <Icon name="edit" />
          </Link>
          <DeleteConfirm
            title="Delete Booking"
            description="Are you sure you want to delete this booking? This action cannot be undone."
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <TabButton />
        <div className="flex items-center gap-2">
          <ExcelExportButton rows={bookingData?.data || []} filename="vehicles-bookings.xlsx" />

          <CommonFilters />

          <Button asChild>
            <Link href="/admin/vehicles/vehicles-bookings/add-booking">
              <Plus />
              <span>Add Booking</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Common Table */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={bookingData?.data || []} />
        <Paginator totalItems={bookingData.totalPages} />
      </div>
    </div>
  );
};

export default VehiclesBookings;

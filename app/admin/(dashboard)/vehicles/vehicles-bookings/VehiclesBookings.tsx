'use client';

import CommonTable from '@/components/common/CommonTable';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Icon from '@/components/common/Icon';
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
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { format } from 'date-fns';

const VehiclesBookings = ({
  bookingData,
}: {
  bookingData: ApiPagination & { data: BookingDataType[] };
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  console.log(bookingData, 'bookingData');
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const success = await deleteBooking(id);
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
      header: 'First Name',
      accessor: 'firstName',
    },
    {
      header: 'Last Name',
      accessor: 'lastName',
    },
    {
      header: 'Phone',
      accessor: 'phone',
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
      render: (row: any) => <span>{formatCurrency({ amount: row.amount })}</span>,
    },
    {
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (row: any) => {
        return <Badge variant="outline">{row.paymentStatus}</Badge>;
      },
    },
    {
      header: 'Booking Status',
      accessor: 'bookingStatus',
      render: (row: any) => {
        return <Badge variant="outline">{row.bookingStatus}</Badge>;
      },
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
  console.log(bookingData?.data, 'bookingData?.data');
  return (
    <div className="space-y-2">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <TabButton />
        <div className="flex items-center gap-2">
          <ExcelExportButton
            columns={[
              { header: 'Booking ID', key: 'bookingId' },
              { header: 'Name', key: 'name' },
              { header: 'Phone', key: 'phone' },
              { header: 'Email', key: 'email' },
              { header: 'Pickup Location', key: 'pickupLocation' },
              { header: 'Drop Location', key: 'dropLocation' },
              { header: 'Pickup Date', key: 'pickupDate' },
              { header: 'Drop Date', key: 'dropDate' },
              { header: 'Trip Purpose', key: 'tripPurpose' },
              { header: 'Amount', key: 'amount' },
              { header: 'Payment Status', key: 'paymentStatus' },
              { header: 'Booking Status', key: 'bookingStatus' },
            ]}
            rows={
              bookingData?.data?.map((e) => ({
                bookingId: e._id,
                name: e.firstName + ' ' + e.lastName,
                phone: e.phone,
                email: e.email,
                pickupLocation: e.pickupLocation,
                dropLocation: e.dropLocation,
                pickupDate: format(new Date(e.pickupDate), 'dd MMM yyyy, hh:mm a'),
                dropDate: format(new Date(e.dropDate), 'dd MMM yyyy, hh:mm a'),
                tripPurpose: e.tripPurpose,
                amount: e.amount,
                paymentStatus: e.paymentStatus,
                bookingStatus: e.bookingStatus,
              })) || []
            }
            filename="vehicles-bookings.xlsx"
          />

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

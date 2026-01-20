'use client';

import CommonTable from '@/components/common/CommonTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronDownIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/common/Icon';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import {
  ApiPagination,
  ApostilleApplicationDataType,
  ApostilleBookingSources,
  apostilleBookingSources,
  applicationStatuses,
} from '@/lib/types';
import Paginator from '@/components/shared/paginator';
import { deleteApplication } from '@/services/applicatonService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/formatCurrency';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Component
const ApostillePage = ({
  applicationsData,
  bookingSource,
}: {
  applicationsData: ApiPagination & { data: ApostilleApplicationDataType[] };
  bookingSource: ApostilleBookingSources;
}) => {
  console.log(applicationsData, 'applicationsData');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Delete handler function
  const handleDeleteApplication = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteApplication(id);
      toast.success('Application deleted successfully!');
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      header: 'Application ID',
      accessor: 'id',
    },
    {
      header: 'Applicant Name',
      accessor: 'name',
    },
    {
      header: 'Destination',
      accessor: 'destination',
    },
    {
      header: 'Documents',
      accessor: 'documents',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row: any) => <span>{formatCurrency({ amount: row.amount })}</span>,
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
      header: 'Created At',
      accessor: 'date',
      render: (row: any) => (row.date ? format(new Date(row.date), 'dd/MM/yyyy hh:mm a') : '-'),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => <Badge variant="default">{row.status}</Badge>,
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/admin/apostille/edit?application=${row.id}`}>
            <Icon name="edit" />
          </Link>

          <Link href={`/admin/apostille/edit?application=${row.id}&isView=1`}>
            <Icon name="view" />
          </Link>

          <DeleteConfirm
            title="Delete Application"
            description="Are you sure you want to delete this application?"
            confirmLabel="Delete"
            onConfirm={() => handleDeleteApplication(row.id)}
          >
            <span className="cursor-pointer">
              <Icon name="delete" />
            </span>
          </DeleteConfirm>
        </div>
      ),
    },
  ];

  // Dummy data
  const applications = (applicationsData.data || []).map((data: ApostilleApplicationDataType) => ({
    id: data._id,

    name: `${data.customer.firstName} ${data.customer.lastName}`,

    destination: data.serviceSelection.destinationCountry || '-',

    documents: data.serviceSelection.documentCount || 0,

    amount: data.pricing?.grandTotal || 0,

    phone: `${data.customer.phone}`,

    email: data.customer.email,

    date: data.createdAt,

    status: data.status,
  }));
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Tabs */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full max-w-32 capitalize flex items-center justify-between"
            >
              {(bookingSource || apostilleBookingSources[0])?.replace(/_/g, ' ')?.toLowerCase()}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {apostilleBookingSources.map((source) => (
                <DropdownMenuItem key={source} asChild>
                  <Link
                    href={`/admin/apostille?bookingSource=${source}`}
                    className="flex items-center gap-2 justify-between capitalize"
                  >
                    {source?.replace(/_/g, ' ')?.toLowerCase()}
                    {(bookingSource || apostilleBookingSources[0]) === source && (
                      <Check className="size-4" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ExcelExportButton rows={applications} filename="applications.xlsx" />

          <CommonFilters
            selects={[
              {
                name: 'status',
                label: 'Status',
                options: applicationStatuses.map((status) => ({ label: status, value: status })),
              },
            ]}
          />

          <Button asChild>
            <Link href="/admin/apostille/create">
              <Plus className="mr-2 h-4 w-4" />
              New Apostille Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <CommonTable columns={columns} data={applications} />
      <Paginator totalItems={applicationsData?.totalPages ?? 0} />
    </div>
  );
};

export default ApostillePage;

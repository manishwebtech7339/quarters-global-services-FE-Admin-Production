'use client';
import CommonTable from '@/components/common/CommonTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/common/Icon';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import { ApiPagination, ApplicationSource, applicationStatuses } from '@/lib/types';
import Paginator from '@/components/shared/paginator';
import { deleteApplication } from '@/services/applicatonService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';

// Component
const ServicesPage = ({
  applicationsData,
  selectedApplicationSources,
}: {
  applicationsData: ApiPagination & { data: any[] };
  selectedApplicationSources: ApplicationSource;
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
    // {
    //   header: 'Applicant Name',
    //   accessor: 'name',
    //   render: (row: any) => (
    //     <div className="flex items-center gap-2 font-medium">
    //       <Avatar>
    //         <AvatarImage src={row.avatar || 'https://github.com/shadcn.png'} />
    //         <AvatarFallback>CN</AvatarFallback>
    //       </Avatar>
    //       <span>{row.name}</span>
    //     </div>
    //   ),
    // },
    {
      header: 'Applicant Name',
      accessor: 'name',
    },
    {
      header: 'Service',
      accessor: 'service',
    },
    {
      header: 'Service Type',
      accessor: 'serviceType',
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
      header: 'Application Date',
      accessor: 'date',
      render: (row: any) => {
        return <span>{row.date ? format(new Date(row.date), 'dd/MM/yyyy hh:mm a') : '-'}</span>;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => <Badge variant={'default'}>{row.status}</Badge>,
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/agent/services/edit?application=${row.id}`}>
            <Icon name="edit" />
          </Link>
          <Link href={`/agent/services/edit?application=${row.id}&isView=1`}>
            <Icon name="view" />
          </Link>
          <DeleteConfirm
            title="Delete Application"
            description="Are you sure you want to delete this application? This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDeleteApplication(row.id)}
          >
            <button
              type="button"
              className="cursor-pointer hover:opacity-70 transition-opacity"
              disabled={isDeleting}
            >
              {isDeleting ? <Icon name="loading" /> : <Icon name="delete" />}
            </button>
          </DeleteConfirm>
        </div>
      ),
    },
  ];

  // Dummy data
  const applications = (applicationsData.data || []).map((data) => ({
    id: data._id,
    name: data.firstName,
    avatar: '/avatars/avatar1.jpg',
    service: data.serviceFields.serviceType,
    serviceType: data.serviceFields?.service,
    phone: data.phone,
    email: data.email,
    date: new Date(data.createdAt).toISOString(),
    status: data.status,
  }));
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-end flex-wrap gap-2">
        {/* Actions */}
        <div className="flex items-center gap-2">
          <ExcelExportButton
            rows={applicationsData?.data || []}
            filename="services-applications.xlsx"
          />

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
            <Link href="/agent/services/add-service">
              <Plus />
              <span className="ml-1">Add Service</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <CommonTable columns={columns} data={applications} />
      <Paginator totalItems={applicationsData.totalPages} />
    </div>
  );
};

export default ServicesPage;

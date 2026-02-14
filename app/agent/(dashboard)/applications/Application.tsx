'use client';

import CommonTable from '@/components/common/CommonTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Loader, Plus } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/common/Icon';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import { ApiPagination, applicationStatuses } from '@/lib/types';
import Paginator from '@/components/shared/paginator';
import { deleteApplication } from '@/services/applicatonService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';
import { format } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ApplicationRecipePdf } from '@/components/common/ApplicationRecipePdf';

// Component
const ApplicationsPage = ({
  applicationsData,
  // selectedApplicationSources,
  // isShippingAvailable,
}: {
  applicationsData: ApiPagination & { data: any[] };
  // selectedApplicationSources: ApplicationSource;
  // isShippingAvailable?: string;
}) => {
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
      header: 'Service',
      accessor: 'service',
    },
    {
      header: 'Service Type',
      accessor: 'serviceType',
    },
    {
      header: 'From',
      accessor: 'from',
    },
    {
      header: 'To',
      accessor: 'to',
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Payments',
      accessor: 'totalAmount',
      render: (row: any) => {
        return <span>{row.totalAmount ? `${row.totalAmount}$` : '0$'}</span>;
      },
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
      header: 'Recipe',
      accessor: 'recipe',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <PDFDownloadLink
            document={<ApplicationRecipePdf data={row.recipe} />}
            fileName="application.pdf"
          >
            {({ loading }) =>
              loading ? (
                <Button size="sm" variant="ghost" disabled>
                  {' '}
                  <Loader className="animate-spin" />{' '}
                </Button>
              ) : (
                <Button size="sm" variant="ghost">
                  {' '}
                  <Download size={16} />{' '}
                </Button>
              )
            }
          </PDFDownloadLink>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <Link href={`/agent/applications/edit?application=${row.id}`}>
            <Icon name="edit" />
          </Link>
          <Link href={`/agent/applications/edit?application=${row.id}&isView=1`}>
            <Icon name="view" />
          </Link>
          <DeleteConfirm
            title="Delete Application"
            description="Are you sure you want to delete this application? This action cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => handleDeleteApplication(row.id)}
          >
            <span className="cursor-pointer hover:opacity-70 transition-opacity">
              <Icon name="delete" />
            </span>
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
    service: data.serviceFields?.service,
    serviceType: data.serviceFields.serviceType,
    from: data?.fromCountryId?.name || '-',
    to: data?.toCountryId?.name || '-',
    phone: data.phone,
    email: data.email,
    totalAmount: data?.totalAmount,
    date: data.createdAt,
    recipe: data,
    status: data.status,
  }));

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Tabs */}
        <div />
        {/* <Tabs
          defaultValue={
            (selectedApplicationSources || applicationSources[0]) +
            (isShippingAvailable === '1' ? '-shipping' : '')
          }
          className="w-auto"
        >
          <TabsList className="bg-primary-300 text-primary-100 p-0">
            <TabsTrigger
              asChild
              value={applicationSources[0]}
              className="data-[state=active]:bg-primary-100 data-[state=active]:text-white"
            >
              <Link href={`/admin/applications?applicationSources=${applicationSources[0]}`}>
                Walk-in
              </Link>
            </TabsTrigger>
            <TabsTrigger
              asChild
              value={applicationSources[1]}
              className="data-[state=active]:bg-primary-100 data-[state=active]:text-white"
            >
              <Link href={`/admin/applications?applicationSources=${applicationSources[1]}`}>
                Agency
              </Link>
            </TabsTrigger>
            <TabsTrigger
              asChild
              value={applicationSources[2]}
              className="data-[state=active]:bg-primary-100 data-[state=active]:text-white"
            >
              <Link href={`/admin/applications?applicationSources=${applicationSources[2]}`}>
                Online
              </Link>
            </TabsTrigger>
            <TabsTrigger
              asChild
              value={applicationSources[2] + '-shipping'}
              className="data-[state=active]:bg-primary-100 data-[state=active]:text-white"
            >
              <Link
                href={`/admin/applications?applicationSources=${applicationSources[2]}&isShippingAvailable=1`}
              >
                Shipping
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs> */}

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
            <Link href="/agent/applications/create">
              <Plus className="mr-2 h-4 w-4" />
              New Application
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

export default ApplicationsPage;

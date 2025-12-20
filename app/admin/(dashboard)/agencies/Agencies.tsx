'use client';
import CommonTable from '@/components/common/CommonTable';
import Icon from '@/components/common/Icon';
import { Badge } from '@/components/ui/badge';
import { AgencyDataType } from '@/lib/types';
import Link from 'next/link';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';
import Paginator from '@/components/shared/paginator';
import { statusBadgeColor } from '@/lib/statusBadgeColor';
import DeleteAgency from './DeleteAgency';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const columns = [
  {
    header: 'Agency Name',
    accessor: 'name',
  },
  {
    header: 'Contact Person Name',
    accessor: 'authorizedRepresentativeName',
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
    header: 'Credit Limit',
    accessor: 'creditLimit',
    render: (row: AgencyDataType) => {
      return <span>{row?.creditDetails?.creditLimit || 0}</span>;
    },
  },
  {
    header: 'Available Credit',
    accessor: 'availableCredit',
    render: (row: AgencyDataType) => {
      return <span>{row?.creditDetails?.availableCredit || 0}</span>;
    },
  },
  {
    header: 'Credit Used',
    accessor: 'creditUsed',
    render: (row: AgencyDataType) => {
      return <span>{row?.creditDetails?.creditUsed || 0}</span>;
    },
  },
  {
    header: 'Country',
    accessor: 'country',
    render: (row: AgencyDataType) => {
      return <span>{row.address.country}</span>;
    },
  },
  {
    header: 'CreatedAt',
    accessor: 'createdAt',
    render: (row: AgencyDataType) => {
      return <span>{format(new Date(row.createdAt), 'dd-MM-yyyy')}</span>;
    },
  },
  {
    header: 'Registration Status',
    accessor: 'registrationStatus',
    render: (row: AgencyDataType) => {
      const registrationStatus = row.registrationStatus;
      return (
        <Badge
          variant={
            registrationStatus === 'PENDING'
              ? 'waiting'
              : registrationStatus === 'REJECTED'
                ? 'cancelled'
                : 'completed'
          }
          className="capitalize"
        >
          {row?.registrationStatus?.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (row: AgencyDataType) => {
      return <Badge variant={statusBadgeColor[row.status] || 'default'}>{row.status}</Badge>;
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    render: (row: AgencyDataType) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={'/admin/agencies/' + row._id}>
          <Icon name="view" />
        </Link>
        <Link href={'/admin/agencies/edit/' + row._id}>
          <Icon name="edit" />
        </Link>
        <DeleteAgency id={row._id} />
      </div>
    ),
  },
];

const Agencies = ({
  agencyData,
  totalPages,
}: {
  agencyData: AgencyDataType[];
  totalPages: number;
}) => {
  console.log(agencyData, 'agencyData');
  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="flex items-center justify-end gap-2">
        <ExcelExportButton rows={agencyData} filename="agencies.xlsx" />
        <CommonFilters
          selects={[
            {
              name: 'status',
              label: 'Status',
              options: [
                { label: 'Active', value: 'ACTIVE' },
                { label: 'In Active', value: 'INACTIVE' },
              ],
            },
          ]}
        />
        <Button asChild className="bg-primary-100 text-white">
          <Link href="/admin/agencies/create">
            <Plus />
            <span>Create New Agencies</span>
          </Link>
        </Button>
      </div>

      {/* Data */}
      <CommonTable columns={columns} data={agencyData} />
      <Paginator totalItems={totalPages} />
    </div>
  );
};

export default Agencies;

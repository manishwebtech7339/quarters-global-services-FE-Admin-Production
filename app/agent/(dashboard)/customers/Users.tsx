import CommonTable from '@/components/common/CommonTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Icon from '@/components/common/Icon';
import { CustomerDataType } from '@/services/customerService';

import Paginator from '@/components/shared/paginator';
import { statusBadgeColor } from '@/lib/statusBadgeColor';
import DeleteCustomer from './DeleteCustomer';
import CommonFilters from '@/components/common/CommonFilters';
import { format } from 'date-fns';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
interface UsersProps {
  customersData: {
    data: CustomerDataType[];
    count: number;
    currentPage: number;
    totalPages: number;
  };
  currentPage: number;
}

// Component
const UsersPage = ({ customersData, currentPage }: UsersProps) => {
  // Filter only users with role "user"
  const customers = customersData.data;

  // Table columns
  const columns = [
    {
      header: 'Customer ID',
      accessor: '_id',
    },
    {
      header: 'Name',
      accessor: 'firstName',
      render: (row: CustomerDataType) => (
        <div className="flex items-center gap-2 font-medium">
          <span>
            {row.firstName} {row.lastName || ''}
          </span>
        </div>
      ),
    },
    {
      header: 'Phone Number',
      accessor: 'phone',
      render: (row: CustomerDataType) => (
        <span>
          {row.countryCode} {row.phone}
        </span>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Verified',
      accessor: 'isVerified',
      render: (row: CustomerDataType) => (
        <Badge variant={row.isVerified ? 'completed' : 'secondary'}>
          {row.isVerified ? 'Verified' : 'Not Verified'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: CustomerDataType) => (
        <Badge variant={statusBadgeColor[row.status] || 'default'}>{row.status}</Badge>
      ),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row: CustomerDataType) => (
        <span>{format(new Date(row?.createdAt), 'dd-MM-yyyy')}</span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      className: 'text-center',
      render: (row: CustomerDataType) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={'/agent/customers/view/' + row._id}>
            <Icon name="view" />
          </Link>
          <Link href={'/agent/customers/edit/' + row._id}>
            <Icon name="edit" />
          </Link>
          <DeleteCustomer id={row._id} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-end flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ExcelExportButton
            columns={[
              { key: '_id', header: 'Customer ID' },
              { key: 'firstName', header: 'First Name' },
              { key: 'lastName', header: 'Last Name' },
              { key: 'email', header: 'Email' },
              { key: 'countryCode', header: 'Country Code' },
              { key: 'phone', header: 'Phone Number' },
              {
                key: 'isVerified',
                header: 'Verified',
              },
              { key: 'status', header: 'Status' },
              {
                key: 'createdAt',
                header: 'Created At',
              },
            ]}
            rows={customers}
            filename="users.xlsx"
          />

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

          <Button asChild>
            <Link href="/agent/customers/create">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <CommonTable columns={columns} data={customers} />

      {/* Pagination */}
      <Paginator totalItems={customersData.totalPages} />
    </div>
  );
};

export default UsersPage;

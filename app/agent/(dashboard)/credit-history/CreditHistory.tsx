'use client';
import CommonTable from '@/components/common/CommonTable';
import Paginator from '@/components/shared/paginator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const columns = [
  {
    header: 'Customer',
    accessor: 'newUsed.firstName',
    render: (row: any) => {
      return row?.usedFor?.firstName + ' ' + row?.usedFor?.lastName;
    },
  },
  {
    header: 'Service',
    accessor: 'service',
    render: (row: any) => {
      return row?.relatedApplicationIds?.[0]?.platformServiceId?.name || '-';
    },
  },
  {
    header: 'Service Type',
    accessor: 'category',
    render: (row: any) => {
      return row?.relatedApplicationIds?.[0]?.platformServiceCategoryId?.name || '-';
    },
  },
  {
    header: 'Previous Limit',
    accessor: 'previousLimit',
  },
  {
    header: 'Previous Available',
    accessor: 'previousAvailable',
  },
  {
    header: 'Credit Used',
    accessor: 'amount',
    render: (row: any) => {
      return <strong>{row.amount}</strong>;
    },
  },
  {
    header: 'Available',
    accessor: 'newAvailable',
  },
  {
    header: 'Date',
    accessor: 'createdAt',
    render: (row: any) => {
      return format(new Date(row.createdAt), 'dd-MM-yyyy hh:mm aa');
    },
  },
];

const CreditHistory = ({ data, totalPages }: { data: any[]; totalPages: number }) => {
  return (
    <div className="space-y-2">
      <Button>Credit History</Button>
      {/* Filters */}
      <div className="flex items-center justify-end gap-2">
        {/* <CommonFilters
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
        /> */}
      </div>

      {/* Data */}
      <CommonTable columns={columns} data={data} />
      <Paginator totalItems={totalPages} />
    </div>
  );
};

export default CreditHistory;

'use client';
import CommonTable from '@/components/common/CommonTable';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import Paginator from '@/components/shared/paginator';
import { format } from 'date-fns';
import CommonFilters from '@/components/common/CommonFilters';

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
      {/* Filters */}
      <div className="flex items-center justify-end gap-2">
        <ExcelExportButton
          rows={
            data.map((e) => ({
              Name: e.usedFor?.firstName + ' ' + e?.usedFor?.lastName,
              Email: e.usedFor?.email,

              Service: e.relatedApplicationIds?.[0]?.platformServiceId?.name || '-',
              'Service Type': e.relatedApplicationIds?.[0]?.platformServiceCategoryId?.name || '-',
              'Previous Limit': e.previousLimit,
              'Previous Available': e.previousAvailable,
              'Credit Used': e.amount,
              Available: e.newAvailable,
              Date: format(new Date(e.createdAt), 'dd-MM-yyyy hh:mm aa'),
            })) || []
          }
          filename="payments.xlsx"
        />
        <CommonFilters showDateFilters={false} />
      </div>

      {/* Data */}
      <CommonTable columns={columns} data={data} />
      <Paginator totalItems={totalPages} />
    </div>
  );
};

export default CreditHistory;

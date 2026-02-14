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
              Name: e.newUsed.firstName + ' ' + e.newUsed.lastName,
              Email: e.newUsed.email,

              Amount: e.amount,

              'Payment Mode': e.paymentMode,
              'Payment Status': e.paymentStatus,
              'Payment Type': e.paymentType,

              Date: e.date,
              Time: e.time,

              Applications: e.transaction.relatedApplicationIds,
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

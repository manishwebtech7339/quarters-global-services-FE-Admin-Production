'use client';
import CommonTable from '@/components/common/CommonTable';
import Paginator from '@/components/shared/paginator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiPagination } from '@/lib/types';
import { TransactionDataType } from '@/services/transactionService';
import { Eye } from 'lucide-react';
import CommonFilters from '@/components/common/CommonFilters';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import { format } from 'date-fns';
import PaymentDetailsModal from './PaymentDetailsModal';

// Columns
const columns = [
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'Amount',
    accessor: 'amount',
  },
  {
    header: 'Payment Method',
    accessor: 'paymentMode',
    render: (row: any) => (
      <Badge variant="outline" className="capitalize">
        {row.paymentMode}
      </Badge>
    ),
  },
  {
    header: 'Payment Type',
    accessor: 'paymentType',
    render: (row: any) => (
      <Badge variant="outline" className="capitalize">
        {row.paymentType}
      </Badge>
    ),
  },
  {
    header: 'Date',
    accessor: 'date',
  },
  {
    header: 'Time',
    accessor: 'time',
  },
  {
    header: 'Payment Status',
    accessor: 'paymentStatus',
    render: (row: any) => (
      <Badge variant="default" className="capitalize">
        {row.paymentStatus}
      </Badge>
    ),
  },

  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex justify-center">
        <PaymentDetailsModal transaction={row.transaction}>
          <Button variant="ghost" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
        </PaymentDetailsModal>
      </div>
    ),
  },
];

// Component
const Payments = ({
  transactionsData,
}: {
  transactionsData: ApiPagination & { data: TransactionDataType[] };
}) => {
  const payments = transactionsData.data.map((e) => ({
    name: (e.user?.firstName || '-') + ' ' + (e.user?.lastName || ''),
    email: e.user?.email || '-',

    amount: `${e.amount}$` || '0',

    paymentMode: e.paymentMode,
    paymentStatus: e.paymentStatus,
    paymentType: e.paymentType,

    date: e.updatedAt ? format(new Date(e.updatedAt), 'dd-MM-yyyy') : '-',
    time: e.updatedAt ? format(new Date(e.updatedAt), 'hh:mm a') : '-',

    transaction: e,
  }));

  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="flex items-center justify-end gap-2">
        <ExcelExportButton
          rows={
            payments.map((e) => ({
              Name: e.name,
              Email: e.email,

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

      {/* Table */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={payments} />
        <Paginator totalItems={transactionsData.totalPages} />
      </div>
    </div>
  );
};

export default Payments;

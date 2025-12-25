'use client';
import CommonTable from '@/components/common/CommonTable';
import Paginator from '@/components/shared/paginator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiPagination } from '@/lib/types';
import { TransactionDataType } from '@/services/transactionService';
import { Eye } from 'lucide-react';
import PaymentDetailsModal from './PaymentDetailsModal';
import CommonFilters from '@/components/common/CommonFilters';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import { format } from 'date-fns';

// Dummy Data

// Columns
const columns = [
  {
    header: 'Name',
    accessor: 'name',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2 font-medium">
        {/* <Avatar>
          <AvatarImage src={row.avatar || 'https://github.com/shadcn.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
        <span>{row.name}</span>
      </div>
    ),
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
    header: 'Service',
    accessor: 'service',
  },
  {
    header: 'Service Type',
    accessor: 'serviceType',
  },
  {
    header: 'Payment Method',
    accessor: 'mode',
    render: (row: any) => <span className="capitalize">{row.mode}</span>,
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
    accessor: 'status',
    render: (row: any) => (
      <Badge variant="default" className="capitalize">
        {row.status}
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
    service: e.paymentMode,
    serviceType: e.paymentMode,
    mode: e.paymentMode,
    date: e.updatedAt ? format(new Date(e.updatedAt), 'dd-MM-yyyy') : '-',
    time: e.updatedAt ? format(new Date(e.updatedAt), 'hh:mm a') : '-',
    status: e.paymentStatus,
    avatar: '',
    transaction: e,
  }));
  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="flex items-center justify-end gap-2">
        <ExcelExportButton rows={transactionsData?.data || []} filename="payments.xlsx" />
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

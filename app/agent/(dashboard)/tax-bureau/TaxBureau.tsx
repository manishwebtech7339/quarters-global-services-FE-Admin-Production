import CommonTable from '@/components/common/CommonTable';
import Icon from '@/components/common/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteTaxBureau from './DeleteTaxBureau';
import { TaxBureauListResponse } from '@/services/taxBureauService';
import Paginator from '@/components/shared/paginator';
import CommonFilters from '@/components/common/CommonFilters';
import { format } from 'date-fns';

const columns = [
  {
    header: 'ID',
    accessor: '_id',
    render: (row: any) => <span className="font-mono text-sm">#{row._id.slice(-8)}</span>,
  },
  {
    header: 'Full Name',
    accessor: 'fullName',
    render: (row: any) => <span className="capitalize">{row.fullName}</span>,
  },
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'Business Name',
    accessor: 'businessName',
  },
  {
    header: 'Business Email',
    accessor: 'businessEmail',
  },
  {
    header: 'Selected Package',
    accessor: 'selectedPackage',
    render: (row: any) => <span>{(row?.selectedPackage || '').replaceAll('_', ' ')}</span>,
  },
  {
    header: 'Created Date',
    accessor: 'createdAt',
    render: (row: any) => <span>{format(new Date(row.createdAt), 'dd-MM-yyyy')}</span>,
  },

  {
    header: 'Status',
    accessor: 'status',
    render: (row: any) => {
      const base = 'px-2 py-1 rounded-full text-xs';
      const value = row.status?.toLowerCase();
      return (
        <Badge variant={value === 'approved' ? 'default' : 'outline'}>{row.status || '-'}</Badge>
      );
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={`/agent/tax-bureau/edit/${row._id}`}>
          <Icon name="edit" />
        </Link>
        <Link href={`/agent/tax-bureau/${row._id}`}>
          <Icon name="view" />
        </Link>
        <DeleteTaxBureau id={row._id} />
      </div>
    ),
  },
];

const TaxBureau = ({ data }: { data: TaxBureauListResponse }) => {
  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="flex justify-between  ">
        <div></div>
        <div className="flex items-center gap-2">
          <CommonFilters />

          <Button asChild className="bg-primary-100 text-white">
            <Link href="/agent/tax-bureau/create">
              <Plus />
              <span>Add New</span>
            </Link>
          </Button>
        </div>
      </div>
      {/* Tickets Data */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={data.data.data || []} />
      </div>

      {/* Pagination */}
      <Paginator totalItems={data?.data?.totalPages || 0} />
    </div>
  );
};

export default TaxBureau;

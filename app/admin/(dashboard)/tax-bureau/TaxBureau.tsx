import CommonTable from '@/components/common/CommonTable';
import Icon from '@/components/common/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TaxBureauDataType } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteTaxBureau from './DeleteTaxBureau';

const columns = [
  {
    header: 'ID',
    accessor: '_id',
    render: (row: any) => <span className="font-mono text-sm">#{row._id.slice(-8)}</span>,
  },
  {
    header: 'Full Name',
    accessor: 'fullName',
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
    render: (row: any) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
  },

  {
    header: 'Status',
    accessor: 'status',
    render: (row: any) => {
      const base = 'px-2 py-1 rounded-full text-xs';
      const value = row.status?.toLowerCase();

      switch (value) {
        case 'open':
          return <Badge className={`${base} bg-blue-100 text-blue-600`}>Open</Badge>;
        case 'closed':
          return <Badge className={`${base} bg-gray-100 text-gray-600`}>Closed</Badge>;
        case 'resolved':
          return <Badge className={`${base} bg-green-100 text-green-600`}>Resolved</Badge>;
        case 'waiting on customer':
          return <Badge className={`${base} bg-yellow-100 text-yellow-600`}>Waiting</Badge>;
        default:
          return <Badge variant="outline">{row.status || '-'}</Badge>;
      }
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={`/admin/tax-bureau/edit/${row._id}`}>
          <Icon name="edit" />
        </Link>
        <Link href={`/admin/tax-bureau/${row._id}`}>
          <Icon name="view" />
        </Link>
        <DeleteTaxBureau id={row._id} />
      </div>
    ),
  },
];

const TaxBureau = ({ data }: { data: TaxBureauDataType[] }) => {
  return (
    <div className="space-y-2">
      {/* Filters */}
      <div className="flex justify-between  ">
        <div></div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" className="border-primary-100 text-primary-100">
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-fit" align="end">
              <div className="flex items-center gap-2">Filters...</div>
            </PopoverContent>
          </Popover>

          <Button asChild className="bg-primary-100 text-white">
            <Link href="/admin/tax-bureau/create">
              <Plus />
              <span>Add New</span>
            </Link>
          </Button>
        </div>
      </div>
      {/* Tickets Data */}
      <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
        <CommonTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default TaxBureau;

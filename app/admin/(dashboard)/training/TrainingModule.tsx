import CommonTable from '@/components/common/CommonTable';
import Icon from '@/components/common/Icon';
import { Button } from '@/components/ui/button';
import { ApiPagination } from '@/lib/types';
import { TrainingDataType } from '@/services/trainigsService';
import { format } from 'date-fns';
import { FileText, Image as ImageIcon, Video, File, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import DeleteTraining from './DeleteTraining';

// Utility to get file type and corresponding icon
const getFileIcon = (url: string) => {
  if (!url) return <File className="w-4 h-4" />;

  const extension = url.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return <FileText className="w-4 h-4 text-red-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
      return <Video className="w-4 h-4 text-purple-500" />;
    default:
      return <File className="w-4 h-4 text-gray-500" />;
  }
};

// Columns for Training Table
const columns = [
  {
    header: 'Title (Service Name)',
    accessor: 'title',
  },
  {
    header: 'Country',
    accessor: 'country',
  },
  {
    header: 'Service',
    accessor: 'service',
  },
  {
    header: 'Category',
    accessor: 'category',
  },
  {
    header: 'Subcategory',
    accessor: 'subcategory',
  },
  {
    header: 'Last Updated Date',
    accessor: 'lastUpdated',
  },
  {
    header: 'Resources',
    accessor: 'resource',
    className: 'text-center',
    render: (row: any) => {
      const fileIcon = getFileIcon(row.resource);
      return (
        <div className="flex justify-center gap-2 items-center">
          {fileIcon}
          {row.resource ? (
            <Link
              href={row.resource}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              View <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="text-gray-400 italic text-sm">No file</span>
          )}
        </div>
      );
    },
  },
  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={'/admin/training/edit/' + row.id}>
          <Icon name="edit" />
        </Link>
        <Link href={'/admin/training/' + row.id}>
          <Icon name="view" />
        </Link>
        <DeleteTraining id={row.id} />
      </div>
    ),
  },
];

interface IProps {
  data: ApiPagination & { data: TrainingDataType[] };
}
const Training = ({ data }: IProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/training/create">
            <Plus className="mr-1" />
            <span>Add New Training</span>
          </Link>
        </Button>
      </div>
      <CommonTable
        columns={columns}
        data={(data?.data || []).map((e) => ({
          id: e._id,
          title: e.title,
          country: e.country?.name || '-',
          service: e.service?.name || '-',
          category: e.category?.name || '-',
          subcategory: e.subCategory?.name || '-',
          lastUpdated: format(e.updatedAt, 'dd/MM/yyyy'),
          resource: e.resource,
        }))}
      />
    </div>
  );
};

export default Training;

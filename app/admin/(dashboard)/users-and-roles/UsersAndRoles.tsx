import CommonTable from '@/components/common/CommonTable';
import Icon from '@/components/common/Icon';
import Paginator from '@/components/shared/paginator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleDataType, UserDataType, ApiPagination } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import UserDeleteButton from './UserDeleteButton';
import RoleDeleteButton from './RoleDeleteButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye } from 'lucide-react';
import { ExcelExportButton } from '@/components/shared/ExcelExportButton';
import CommonFilters from '@/components/common/CommonFilters';

const formatPermission = (perm: string) => {
  return perm
    .replace(/_/g, ' ') // replace underscores with spaces
    .toLowerCase() // make lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
};

/* ---------------- USERS TABLE ---------------- */
const userColumns = [
  {
    header: 'User ID',
    accessor: 'userId',
  },
  // {
  //   header: 'Name',
  //   accessor: 'name',
  //   render: (row: any) => (
  //     <div className="flex items-center gap-2 font-medium">
  //       <Avatar>
  //         <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
  //         <AvatarFallback>AB</AvatarFallback>
  //       </Avatar>
  //       <p>{row.name}</p>
  //     </div>
  //   ),
  // },
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'Role',
    accessor: 'role',
  },
  {
    header: 'User Creation Date',
    accessor: 'createdAt',
  },
  {
    header: 'Verified',
    accessor: 'isVerified',
    render: (row: any) => <Badge variant={'outline'}>{row.isVerified}</Badge>,
  },
  {
    header: 'Status',
    accessor: 'status',
    render: (row: any) => <Badge variant={'outline'}>{row.status}</Badge>,
  },
  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={`/admin/users-and-roles/edit?id=${row.userId}`}>
          <Icon name="edit" />
        </Link>
        <Link href={`/admin/users-and-roles/view?id=${row.userId}`}>
          <Icon name="view" />
        </Link>
        <UserDeleteButton id={row.userId} />
      </div>
    ),
  },
];

/* ---------------- ROLES TABLE ---------------- */
const roleColumns = [
  {
    header: 'Role',
    accessor: 'role',
  },
  {
    header: 'Description',
    accessor: 'description',
  },
  {
    header: 'Permissions',
    accessor: 'permissions',
    className: 'break-normal',
    render: (row: any) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <p className="font-semibold">Permissions</p>
            <div className="flex flex-wrap gap-1">
              {row.permissions?.split(',').map((perm: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {formatPermission(perm.trim())}
                </Badge>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    header: 'Members',
    accessor: 'members',
  },
  {
    header: 'Action',
    accessor: 'action',
    className: 'text-center',
    render: (row: any) => (
      <div className="flex items-center justify-center gap-2">
        <Link href={`/admin/users-and-roles/edit-role?id=${row.id}`}>
          <Icon name="edit" />
        </Link>
        <RoleDeleteButton id={row.id} />
      </div>
    ),
  },
];

/* ---------------- MAIN PAGE ---------------- */
const UsersAndRolesPage = ({
  activeTab,
  usersData,
  rolesList,
  accessUsers,
  accessRoles,
}: {
  activeTab: string;
  usersData: ApiPagination & { data: UserDataType[] };
  rolesList: RoleDataType[];
  accessUsers: boolean;
  accessRoles: boolean;
}) => {
  const preparedUsers = usersData.data.map((user) => ({
    userId: user._id,
    name: user.fullName || `${user.firstName} ${user.lastName}` || 'N/A',
    email: user.email,
    role: user.subAdminRoleId?.name || user.role,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    isVerified: user.isVerified ? 'Yes' : 'No',
    status: user.status,
  }));

  const preparedRoles = rolesList.map((role) => ({
    id: role._id,
    role: role.name,
    description: role.description,
    permissions: role.permissions.join(', '),
    members: 0,
  }));

  return (
    <Tabs defaultValue={activeTab}>
      <div className="space-y-4">
        {/* Top Tabs & Buttons */}
        <div className="flex items-center justify-between">
          <TabsList className="bg-primary-300 text-primary-100 p-0">
            {accessUsers && (
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-primary-100 data-[state=active]:text-white cursor-pointer"
                asChild
              >
                <Link href={'/admin/users-and-roles?activeTab=users'}>Users</Link>
              </TabsTrigger>
            )}
            {accessRoles && (
              <TabsTrigger
                value="roles"
                className="data-[state=active]:bg-primary-100 data-[state=active]:text-white cursor-pointer"
                asChild
              >
                <Link href={'/admin/users-and-roles?activeTab=roles'}>Roles</Link>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <ExcelExportButton
              rows={(activeTab === 'users' ? preparedUsers : preparedRoles) as any}
              filename={activeTab === 'users' ? 'users.xlsx' : 'roles.xlsx'}
            />

            {activeTab === 'users' && <CommonFilters />}

            {activeTab === 'users' ? (
              <>
                {accessUsers && (
                  <Button asChild>
                    <Link href="/admin/users-and-roles/create">
                      <Plus className="mr-1" />
                      <span>Add Users</span>
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                {accessRoles && (
                  <Button asChild>
                    <Link href="/admin/users-and-roles/create-role">
                      <Plus className="mr-1" />
                      <span>Add Role</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs Content */}
        {accessUsers && (
          <TabsContent value="users">
            <div className="space-y-4 min-h-[60svh] flex flex-col justify-between">
              <CommonTable columns={userColumns} data={preparedUsers} />
              <Paginator totalItems={usersData.totalPages} />
            </div>
          </TabsContent>
        )}
        {accessRoles && (
          <TabsContent value="roles">
            <CommonTable columns={roleColumns} data={preparedRoles} />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default UsersAndRolesPage;

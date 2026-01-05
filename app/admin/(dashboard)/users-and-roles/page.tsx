import React from 'react';
import UsersAndRolesPage from './UsersAndRoles';
import { getUsers } from '@/services/usersService';
import { redirect } from 'next/navigation';
import hasAccess from '@/hooks/useAccessControl/hasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';
import { getRoles } from '@/services/rolesService';

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    activeTab?: string;
    q?: string;
    from?: string;
    to?: string;
  }>;
}) => {
  const page = (await searchParams).page || '1';
  const activeTab = (await searchParams).activeTab || 'users';
  const search = (await searchParams).q || '';
  const from = (await searchParams).from || '';
  const to = (await searchParams).to || '';

  const accessUsers = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.users });
  const accessRoles = await hasAccess({ permission: PERMISSIONS_LIST_ENUM.roles });
  if (!accessUsers && !accessRoles) {
    return redirect('/admin/home');
  }
  const users = await getUsers({
    page,
    search,
    from,
    to,
  });
  const roles = await getRoles();
  return (
    <UsersAndRolesPage
      accessUsers={accessUsers}
      accessRoles={accessRoles}
      activeTab={activeTab}
      usersData={users}
      rolesList={roles.data}
    />
  );
};

export default page;

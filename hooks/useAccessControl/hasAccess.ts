import { getUserById } from '@/services/usersService';
import { PERMISSIONS_LIST_ENUM } from './permissions';
import { getSession } from '@/lib/session'; // 👈 our secure cookie helpers
import { UserTypeENUM } from '@/lib/types';

type IProps = {
  permission: PERMISSIONS_LIST_ENUM;
};

const hasAccess = async ({ permission }: IProps): Promise<boolean> => {
  const session = await getSession();

  if (!session) {
    console.log('Access denied: No session');
    return false;
  }

  const userData = await getUserById(session.id);
  const permissions = userData?.subAdminRoleId?.permissions;

  if (!userData) {
    console.log(`Access denied: No userData found`);
    return false;
  }

  if (userData.role === UserTypeENUM.ADMIN) {
    console.log(`Access: Admin can access all`);
    return true;
  }

  if (userData.role === UserTypeENUM.AGENT) {
    console.log(`Access: Agent can access all`);
    return true;
  }

  if (!permissions || permissions.length === 0) {
    console.log(`Access denied: No permissions defined for role`);
    return false;
  }

  const hasPermission = permissions.includes(permission);

  // if (process.env.NODE_ENV === 'development') {
  //   console.log(
  //     `Access check for role and permission [${PERMISSIONS_LIST_ENUM[permission]}]:`,
  //     hasPermission ? '✅ ALLOWED' : '❌ DENIED',
  //   );
  // }

  return hasPermission;
};

export default hasAccess;

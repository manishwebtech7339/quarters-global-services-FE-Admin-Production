import { useEffect, useState } from 'react';
import { PERMISSIONS_LIST_ENUM } from './permissions';
import { getSession } from '@/lib/session';
import { getUserById } from '@/services/usersService';
import { UserDataType, UserTypeENUM } from '@/lib/types';

const useHasAccess = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserDataType | null>(null);

  useEffect(() => {
    async function getSessionFun() {
      try {
        setIsLoading(true);

        const session = await getSession();

        if (!session) {
          console.log('Access denied: No session ');
          return false;
        }

        const userData = await getUserById(session.id);

        setUserData(userData);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsLoading(false);
      }
    }
    getSessionFun();
  }, []);

  const hasAccess = ({ permission }: { permission: PERMISSIONS_LIST_ENUM }): boolean => {
    if (isError) {
      console.log('Access denied: No session ');
      return false;
    }

    if (!userData) {
      console.log('Access denied: No session ');
      return false;
    }

    if (userData.role === UserTypeENUM.ADMIN) {
      // console.log(`Access: Admin can access all`);
      return true;
    }

    if (userData.role === UserTypeENUM.AGENT) {
      // console.log(`Access: Agent can access all`);
      return true;
    }

    const permissions = userData?.subAdminRoleId?.permissions || [];

    const hasPermission = permissions.includes(permission);

    // if (process.env.NODE_ENV === 'development') {
    //   console.log(
    //     `Access check for role  and permission [${PERMISSIONS_LIST_ENUM[permission]}]:`,
    //     hasPermission ? '✅ ALLOWED' : '❌ DENIED',
    //   );
    // }

    return hasPermission;
  };

  return { hasAccess, isLoading, userData };
};

export default useHasAccess;

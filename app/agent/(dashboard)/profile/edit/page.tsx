import ProfileForm from '@/components/forms/profileForm/ProfileForm';
import { getSession } from '@/lib/session';
import { getUserById } from '@/services/usersService';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const session = await getSession();

  const userData = await getUserById(session?.id || '');
  if (!userData) {
    return redirect('/admin/profile');
  }

  return (
    <div>
      <p className="py-4 text-lg font-semibold">Edit Profile</p>
      <ProfileForm userData={userData} />
    </div>
  );
};

export default page;

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import UserLogoutButton from '@/components/UserLogoutButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      Dashboard {session?.user?.username}
      <UserLogoutButton />
    </div>
  );
}
 
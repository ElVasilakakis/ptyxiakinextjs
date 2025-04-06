import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      Dashboard {session?.user?.username}
    </div>
  );
}

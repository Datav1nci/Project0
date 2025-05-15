import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      router.push('/clients');
    }
  }, [status, router]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    </Layout>
  );
}
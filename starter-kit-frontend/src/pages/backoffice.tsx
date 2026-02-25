import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BackofficeEntry() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return null;
}

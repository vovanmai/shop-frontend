'use client'
import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import qs from "qs"
import { toast } from 'react-toastify';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        const params = Array.from(searchParams.entries());
        const queryParams = Object.fromEntries(params);
        const queryString = qs.stringify(queryParams)
        sessionStorage.setItem('redirect', `${pathname}?${queryString}`)
        toast.error('Vui lòng đăng nhập.')
        router.push('/login/email');
      }
    }, [router, pathname, searchParams]);

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;

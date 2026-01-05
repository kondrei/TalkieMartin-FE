import { JSX, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService, UserData } from './auth.service';


export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedInn] = useState<UserData | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const isLoggedIn = await authService.getUserData();
        if (mounted) {setIsLoggedInn(isLoggedIn);}
      } finally {
        if (mounted) {setChecking(false);}
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {return null;}

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../utils/store';
import { setUser } from '../utils/store/userReducer';

import AuthService from '../utils/services/Auth.service';
import LocalService from '../utils/services/Local.service';

type Props = {
  children: React.ReactNode;
};

export default function RouterGuard({ children }: Props) {
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pathname } = useRouter();

  useEffect(() => {
    if (pathname === '/login') {
      return;
    }

    const setUserMeToStore = async () => {
      try {
        const { data } = await AuthService.getMe();
        dispatch(setUser(data));
      } catch (err) {
        console.log('에러 발생');
      }
    };

    const isUserIdInLocal = LocalService.has('userId');
    const isUserState = !!userState;
    const wasLogged = !isUserState && isUserIdInLocal;

    if (wasLogged) {
      setUserMeToStore();
      AuthService.autoSignOut(router);
    }
  }, [pathname]);
  return <>{children}</>;
}

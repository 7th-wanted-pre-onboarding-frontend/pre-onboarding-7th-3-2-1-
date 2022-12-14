import { NextRouter } from 'next/router';
import { IAuth } from '../models/interfaces/IAuth';
import { IUser } from '../models/interfaces/IUser';
import request from '../request';
import CookieService from './Cookie.service';
import LocalService from './Local.service';

class AuthService {
  signIn({ email, password }: { email: string; password: string }) {
    return request.post<IAuth>('/api/login', {
      email,
      password
    });
  }

  signOut() {
    return request.post('/api/logout');
  }

  autoSignOut(router: NextRouter) {
    const expiredDate = Number(CookieService.get('expiredDate'));
    const diff = expiredDate - Date.now();

    setTimeout(async () => {
      try {
        await this.signOut();
        router.push('/login');
      } catch (e) {
        console.log(e);
      }
    }, diff);
  }

  getMe() {
    const id = LocalService.get('userId');
    return request.get<IUser>(`/api/users/${id}`, {
      params: {
        id
      }
    });
  }
}

export default new AuthService();

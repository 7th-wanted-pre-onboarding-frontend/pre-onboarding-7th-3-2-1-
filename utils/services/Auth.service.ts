import { NextRouter } from 'next/router';
import { IAuth } from '../models/interfaces/IAuth';
import { IUser } from '../models/interfaces/IUser';
import request from '../request';
import CookieService from './Cookie.service';
import LocalService from './Local.service';

class AuthService {
  signIn() {
    return request.post<IAuth>('api/login', {
      email: 'mason@gollala.com',
      password: '123123as'
    });
  }

  signOut() {
    return request.post('api/logout');
  }

  autoSignOut(router: NextRouter) {
    const expiredDate = Number(CookieService.get('expiredDate'));
    const diff = expiredDate - Date.now();

    setTimeout(async () => {
      try {
        await request.post('api/logout');
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

import { IAccount } from '../models/interfaces/IAccount';
import request from '../request';

class AccountService {
  getList() {
    return request.get<IAccount[]>('/api/accounts');
  }
}

export default new AccountService();

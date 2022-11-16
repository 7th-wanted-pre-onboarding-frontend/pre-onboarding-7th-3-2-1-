import { QueryFunctionContext } from '@tanstack/react-query';
import { AccountResponse } from '../models/types/AccountResponse';
import request from '../request';

class AccountService {
  private _statusMap = new Map([
    [9999, '관리자확인필요'],
    [1, '입금대기'],
    [2, '운용중'],
    [3, '투자중지'],
    [4, '해지']
  ]);

  getList(
    context: QueryFunctionContext<
      [
        string,
        {
          page: number;
          keyword?: string;
          broker_id?: string;
          is_active?: string;
          status?: string;
        }
      ]
    >
  ) {
    const {
      queryKey: [_, { page, keyword, broker_id, is_active, status }]
    } = context;

    const params: {
      page: number;
      keyword?: string;
      broker_id?: string;
      is_active?: string;
      status?: string;
    } = { page };

    if (keyword) {
      params.keyword = keyword;
    }

    if (broker_id) {
      params['broker_id'] = broker_id;
    }

    if (is_active) {
      params['is_active'] = is_active;
    }

    if (status) {
      params['status'] = status;
    }

    return request.get<AccountResponse>('/api/accounts', {
      params: params
    });
  }

  getStatus(key: number) {
    return this._statusMap.get(key);
  }

  getStatusNames() {
    return [...this._statusMap.entries()];
  }
}

export default new AccountService();

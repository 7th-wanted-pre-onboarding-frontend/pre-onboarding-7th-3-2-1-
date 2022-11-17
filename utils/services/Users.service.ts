import { QueryFunctionContext } from '@tanstack/react-query';
import { UserResponse } from '../models/types/UserResponse';
import request from '../request';

class UsersService {
  get(
    context: QueryFunctionContext<
      [
        string,
        {
          page: number;
          keyword?: string;
        }
      ]
    >
  ) {
    const {
      queryKey: [_, { page, keyword }]
    } = context;

    const params: {
      page: number;
      keyword?: string;
    } = { page };

    if (keyword) {
      params.keyword = keyword;
    }

    return request.get<UserResponse>('/api/users', {
      params: params
    });
  }

  convertSecretName(fullName: string) {
    const [firstName, lastName] = fullName.split(/\s/);
    let convertedFirstName = '';

    if (firstName.length > 1) {
      convertedFirstName =
        firstName.slice(0, firstName.length - 1).replace(/./g, '*') +
        firstName.slice(-1);
    } else {
      convertedFirstName = '*';
    }

    return lastName + convertedFirstName;
  }
}

export default new UsersService();

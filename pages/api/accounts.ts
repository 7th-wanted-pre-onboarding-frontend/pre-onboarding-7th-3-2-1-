import { ConnectingAirportsOutlined } from '@mui/icons-material';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Map } from 'typescript';
import { IAccount } from '../../utils/models/interfaces/IAccount';
import { IDAccount } from '../../utils/models/interfaces/IDAccount';
import { IUser } from '../../utils/models/interfaces/IUser';
import { AccountResponse } from '../../utils/models/types/AccountResponse';
import { Error } from '../../utils/models/types/Error';
import request from '../../utils/request';
import AccountService from '../../utils/services/Account.service';
import BrokerService from '../../utils/services/Broker.service';
import DateService from '../../utils/services/Date.service';

const LIMIT = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountResponse | Error>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const cookies = req.headers.cookie;
  const token =
    cookies && cookies.split('; ').find((c) => c.startsWith('token='));

  if (token) {
    const promises = [
      request.get<IUser[]>('http://localhost:4000/users', {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        }
      }),
      request.get<IAccount[]>('http://localhost:4000/accounts', {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        },
        params: {
          _limit: LIMIT,
          _page: req.query.page,
          q: req.query.keyword,
          broker_id: req.query.broker_id,
          is_active: req.query.is_active,
          status: req.query.status
        }
      })
    ];
    const [usersResponse, accountsResponse] = await Promise.all(promises);
    const usersMap = (usersResponse.data as IUser[]).reduce(
      (map, user: IUser, index) => {
        map.set(user.id, user);
        return map;
      },
      new Map()
    );
    const { headers, data } = accountsResponse;

    const totalCount = Number(headers['x-total-count']);
    const accounts: IDAccount[] = (data as IAccount[]).map((account) => {
      const { name } = usersMap.get(account.user_id);
      const {
        id,
        broker_id,
        number,
        status,
        name: accountName,
        assets,
        payments,
        is_active,
        created_at
      } = account;
      const accountNumber =
        number.slice(0, 2) +
        number.slice(2, number.length - 2).replace(/[0-9]/g, '*') +
        number.slice(-2);
      const accountStatus = AccountService.getStatus(status) || '정보없음';
      const convertedAsset = Math.ceil(+assets).toLocaleString() + ' 원';
      const convertedPayments = Math.ceil(+payments).toLocaleString() + ' 원';
      const createdAt = DateService.convertDateString(new Date(created_at));

      return {
        id,
        userName: name,
        brokerName: BrokerService.getBrandName(+broker_id) || '정보 없음',
        accountNumber: BrokerService.convertNumberFormat(
          +broker_id,
          accountNumber
        ),
        accountStatus,
        accountName: accountName,
        assets: convertedAsset,
        payments: convertedPayments,
        isActive: is_active ? '활성' : '비활성',
        createdAt
      };
    });

    const totalPage = Math.ceil(totalCount / LIMIT);

    return res.status(200).json({
      totalPage,
      totalCount,
      currentPage: +req.query.page!,
      data: accounts
    });
  }

  res.status(401).json({
    status: 401,
    message: 'Unauthorized Error'
  });
}

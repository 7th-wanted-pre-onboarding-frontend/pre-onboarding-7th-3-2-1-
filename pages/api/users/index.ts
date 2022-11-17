import type { NextApiRequest, NextApiResponse } from 'next';
import { hidePhoneNumber } from '../../../utils/common/functions';
import { IAccount } from '../../../utils/models/interfaces/IAccount';
import { IUser } from '../../../utils/models/interfaces/IUser';
import { IUserSetting } from '../../../utils/models/interfaces/IUserSetting';
import request from '../../../utils/request';
import DateService from '../../../utils/services/Date.service';
import UsersService from '../../../utils/services/Users.service';

const LIMIT = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const cookies = req.headers.cookie;
  const token =
    cookies && cookies.split('; ').find((c) => c.startsWith('token='));

  if (token) {
    try {
      const users = await request.get<IUser[]>(`http://localhost:4000/users`, {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        },
        params: {
          _limit: LIMIT,
          _page: req.query.page,
          q: req.query.keyword
        }
      });

      const userIds = users.data.map((user) => ({
        uuid: user.uuid,
        id: user.id
      }));

      const acccountsPromises = userIds.map(({ id }) =>
        request.get<IAccount[]>('http://localhost:4000/accounts', {
          params: {
            user_id: id
          },
          headers: {
            Authorization: token.replace('token=', 'Bearer ')
          }
        })
      );

      const settingsPromises = userIds.map(({ uuid }) =>
        request.get<IUserSetting[]>('http://localhost:4000/userSetting', {
          params: {
            uuid: uuid
          },
          headers: {
            Authorization: token.replace('token=', 'Bearer ')
          }
        })
      );

      const accountResponses = await Promise.all(acccountsPromises);
      const settingReponses = await Promise.all(settingsPromises);

      const result = users.data.map((user, index) => {
        const accountCounts = accountResponses[index].data.length;

        const allowMarketingPush = settingReponses[index].data.length
          ? settingReponses[index].data[0].allow_marketing_push
          : false;
        const isActive = settingReponses[index].data.length
          ? settingReponses[index].data[0].is_active
          : false;

        return {
          userName: UsersService.convertSecretName(user.name || '티드 원'),
          accountCounts,
          email: user.email,
          genderOrigin: user.gender_origin,
          birthDate: DateService.convertBirthDateString(
            new Date(user.birth_date)
          ),
          phoneNumber: hidePhoneNumber(user.phone_number),
          lastLogin: DateService.convertDateString(new Date(user.last_login)),
          allowMarketingPush,
          isActive,
          createdAt: DateService.convertDateString(new Date(user.created_at))
        };
      });
      const totalCount = Number(users.headers['x-total-count']);
      const totalPage = Math.ceil(totalCount / LIMIT);

      return res.status(200).json({
        totalPage,
        totalCount,
        currentPage: req.query.page || 1,
        data: result
      });
    } catch (err) {
      // console.log(err);
      throw new Error('Somethin went wrong');
    }
  }
}

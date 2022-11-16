import type { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../../../utils/models/interfaces/IUser';
import { Error } from '../../../utils/models/types/Error';
import request from '../../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUser | Error>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const cookies = req.headers.cookie;
  const token =
    cookies && cookies.split('; ').find((c) => c.startsWith('token='));

  if (token) {
    const { userId } = req.query;
    const { data } = await request.get<{ password?: string } & IUser>(
      `http://localhost:4000/users/${userId}`,
      {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        }
      }
    );
    delete data['password'];
    return res.status(200).json(data);
  }

  res.status(401).json({
    status: 401,
    message: 'Unauthorized Error'
  });
}

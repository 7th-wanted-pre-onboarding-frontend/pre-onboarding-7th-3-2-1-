import type { NextApiRequest, NextApiResponse } from 'next';
import { IAccount } from '../../utils/models/interfaces/IAccount';
import { Error } from '../../utils/models/types/Error';
import request from '../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAccount[] | Error>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const cookies = req.headers.cookie;
  const token =
    cookies && cookies.split('; ').find((c) => c.startsWith('token='));

  if (token) {
    const { data } = await request.get('http://localhost:4000/accounts', {
      headers: {
        Authorization: token.replace('token=', 'Bearer ')
      }
    });
    res.status(200).json(data);
  }

  res.status(401).json({
    status: 401,
    message: 'Unauthorized Error'
  });
}

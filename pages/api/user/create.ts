// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import request from '../../../utils/request';

type Error = {
  status: number;
  message: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    name: string;
    phone_number: string;
    address: string;
    detail_address: string;
    birth_date: string;
    age: number;
    uuid: string;
    gender_origin: number;
    created_at: string;
    last_login: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<any | Error>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const cookies = req.headers.cookie;
  const token =
    cookies && cookies.split('; ').find((c) => c.startsWith('token='));

  const body = {
    ...req.body,
    password: 'admin'
  };

  if (token) {
    try {
      const { data } = await request.post('http://localhost:4000/users', body, {
        headers: {
          Authorization: token.replace('token=', 'Bearer ')
        }
      });

      return res.status(200).json(data);
    } catch (e) {
      throw new Error('fail to create user');
    }
  }

  res.status(401).json({
    status: 401,
    message: 'Unauthorized Error'
  });
}

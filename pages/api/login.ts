// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import request from '../../utils/request';
import { IAuth } from '../../utils/models/interfaces/IAuth';

type Error = {
  status: number;
  message: string;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const START_LOGIN_BECASUE_OF_NOT_ERROR_CASE = 'Email already exists';

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<IAuth | Error>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  const { email, password } = req.body;
  try {
    const { data } = await request.post<IAuth>('http://localhost:4000/signup', {
      email,
      password,
      name: '원티드'
    });

    const expiredTime = 3600;
    const expiredDate = new Date(Date.now() + expiredTime * 1000);

    res.setHeader('Set-Cookie', [
      `token=${data.accessToken}; HttpOnly; path=/; max-age=${expiredTime};`,
      `expiredDate=${+expiredDate}; path=/;`
    ]);

    res.status(200).json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data;
      if (message === START_LOGIN_BECASUE_OF_NOT_ERROR_CASE) {
        return Login(res, { email, password });
      }
    }
    console.log(error);
    res.status(400).json({ status: 400, message: 'Fail Login' });
  }
}

async function Login(
  res: NextApiResponse<IAuth | Error>,
  { email, password }: { email: string; password: string }
) {
  const { data } = await request.post<IAuth>('http://localhost:4000/signin', {
    email,
    password
  });

  const expiredTime = 3600;
  const expiredDate = new Date(Date.now() + expiredTime * 1000);

  res.setHeader('Set-Cookie', [
    `token=${data.accessToken}; HttpOnly; path=/; max-age=${expiredTime};`,
    `expiredDate=${+expiredDate}; path=/;`
  ]);

  return res.status(200).json(data);
}

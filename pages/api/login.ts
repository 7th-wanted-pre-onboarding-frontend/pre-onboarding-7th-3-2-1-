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

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<IAuth | Error>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  try {
    const { data } = await request.post<IAuth>('http://localhost:4000/login', {
      email: 'mason@gollala.com',
      password: '123123as'
    });

    const expiredTime = 10;
    const expiredDate = new Date(Date.now() + expiredTime * 1000);

    res.setHeader('Set-Cookie', [
      `token=${data.accessToken}; HttpOnly; path=/; max-age=${expiredTime};`,
      `expiredDate=${+expiredDate}; path=/;`
    ]);

    res.status(200).json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    }
    console.log(error);
    res.status(400).json({ status: 400, message: 'Fail Login' });
  }
}

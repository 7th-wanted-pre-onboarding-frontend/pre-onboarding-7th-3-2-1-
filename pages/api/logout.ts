// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

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
  res: NextApiResponse<boolean | Error>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Not allowed method' });
  }

  res.setHeader('Set-Cookie', [
    `token=null; HttpOnly; path=/; max-age=${-1};`,
    `expiredDate=null; path=/; max-age=${-1};`
  ]);
  return res.status(200).json(true);
}

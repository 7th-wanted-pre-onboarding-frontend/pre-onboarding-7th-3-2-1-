import { IUser } from './IUser';

export interface IAuth {
  accessToken: string;
  user: IUser;
}

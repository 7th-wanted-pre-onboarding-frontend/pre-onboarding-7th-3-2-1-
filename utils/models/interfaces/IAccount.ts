import { IUser } from './IUser';

export interface IAccount {
  id: number;
  number: string;
  status: number;
  assets: string;
  payments: string;
  name: string;
  uuid: string;
  user_id: number;
  broker_id: number;
  allow_marketing_push: boolean;
  allow_invest_push: boolean;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
  user?: IUser;
}

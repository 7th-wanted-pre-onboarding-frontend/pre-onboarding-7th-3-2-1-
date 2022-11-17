import { IDUser } from '../interfaces/IDUser';

export type UserResponse = {
  totalPage: number;
  totalCount: number;
  currentPage: number;
  data: IDUser[];
};

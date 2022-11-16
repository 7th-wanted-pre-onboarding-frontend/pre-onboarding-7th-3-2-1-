import { IDAccount } from '../interfaces/IDAccount';

export type AccountResponse = {
  totalPage: number;
  totalCount: number;
  currentPage: number;
  data: IDAccount[];
};

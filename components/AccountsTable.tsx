import React from 'react';
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { IDAccount } from '../utils/models/interfaces/IDAccount';

type Props = {
  accounts: IDAccount[];
};

export default function AccountsTable({ accounts }: Props) {
  return (
    <section
      style={{
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <TableContainer component={Paper} sx={{ minWidth: 800 }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>고객명</TableCell>
              <TableCell align='center'>브로커명</TableCell>
              <TableCell align='center'>계좌번호</TableCell>
              <TableCell align='center'>계좌상태</TableCell>
              <TableCell align='center'>계좌명</TableCell>
              <TableCell align='center'>평가금액</TableCell>
              <TableCell align='center'>입금금액</TableCell>
              <TableCell align='center'>계좌 활성화 여부</TableCell>
              <TableCell align='center'>계좌개설일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map(
              (
                {
                  userName,
                  brokerName,
                  accountNumber,
                  accountStatus,
                  accountName,
                  assets,
                  payments,
                  isActive,
                  createdAt
                },
                index
              ) => (
                <TableRow key={`table-row-${index + 1}`}>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {userName}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {brokerName}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {accountNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {accountStatus}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 150 }}
                    >
                      {accountName}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' component='div' noWrap>
                      {assets}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' component='div' noWrap>
                      {payments}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' component='div' noWrap>
                      {isActive}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' component='div' noWrap>
                      {createdAt}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}

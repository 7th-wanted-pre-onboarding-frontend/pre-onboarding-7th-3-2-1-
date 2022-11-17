import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { IDUser } from '../utils/models/interfaces/IDUser';

type Props = {
  users: IDUser[];
};

export default function UsersTable({ users }: Props) {
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
              <TableCell align='center'>보유 계좌 수</TableCell>
              <TableCell align='center'>이메일</TableCell>
              <TableCell align='center'>성별코드</TableCell>
              <TableCell align='center'>생년월일</TableCell>
              <TableCell align='center'>휴대폰 번호</TableCell>
              <TableCell align='center'>최근 로그인</TableCell>
              <TableCell align='center'>혜택 수신 동의 여부</TableCell>
              <TableCell align='center'>활성화 여부</TableCell>
              <TableCell align='center'>가입일</TableCell>
              <TableCell align='center'>설정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(
              (
                {
                  userName,
                  accountCounts,
                  email,
                  genderOrigin,
                  birthDate,
                  phoneNumber,
                  lastLogin,
                  allowMarketingPush,
                  isActive,
                  createdAt
                },
                index
              ) => (
                <TableRow key={`table-row-${index + 1}`} role='checkbox'>
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
                      {accountCounts}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {email}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 50 }}
                    >
                      {genderOrigin}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 100 }}
                    >
                      {birthDate}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 150 }}
                    >
                      {phoneNumber}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' component='div' noWrap>
                      {lastLogin}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 120 }}
                    >
                      {allowMarketingPush ? '동의' : '비동의'}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant='body2'
                      component='div'
                      noWrap
                      sx={{ width: 80 }}
                    >
                      {isActive ? '활성' : '비활성'}
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

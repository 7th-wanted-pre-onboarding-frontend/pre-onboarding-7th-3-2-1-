import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  FormGroup,
  Button,
  Avatar,
  Card,
  CardContent,
  Box,
  Typography
} from '@mui/material';
import {
  AccountCircle,
  Lock,
  Person,
  Login as LoginIcon
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import AuthService from '../utils/services/Auth.service';
import { useRouter } from 'next/router';
import { useAppDispatch } from '../utils/store';
import LocalService from '../utils/services/Local.service';
import { setUser } from '../utils/store/userReducer';
import React, { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useMutation(AuthService.signIn, {
    onSuccess: (response) => {
      const {
        data: { user }
      } = response;

      LocalService.set('userId', user.id);
      dispatch(setUser(user));

      AuthService.autoSignOut(router);
      router.push('/');
    }
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  const onInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        border: '1px solid #ddd'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '25px'
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#1565C0'
            }}
          >
            <Person />
          </Avatar>
          <Typography
            variant='subtitle1'
            component='h2'
            sx={{ color: '#999999' }}
          >
            로그인을 해주세요.
          </Typography>
        </Box>
        <form onSubmit={onSubmit}>
          <FormGroup row>
            <FormControl variant='standard' fullWidth required margin='dense'>
              <OutlinedInput
                placeholder='이메일 주소를 입력해주세요.'
                startAdornment={
                  <InputAdornment position='start'>
                    <AccountCircle />
                  </InputAdornment>
                }
                type='email'
                onChange={onInputEmail}
                value={email}
              />
            </FormControl>
            <FormControl variant='standard' fullWidth required margin='dense'>
              <OutlinedInput
                placeholder='비밀번호를 입력해주세요.'
                startAdornment={
                  <InputAdornment position='start'>
                    <Lock />
                  </InputAdornment>
                }
                type='password'
                autoComplete='true'
                onChange={onInputPassword}
                value={password}
              />
            </FormControl>
            <FormControl variant='standard' fullWidth required margin='dense'>
              <Button
                type='submit'
                variant='contained'
                fullWidth
                startIcon={<LoginIcon />}
                size='large'
              >
                로그인
              </Button>
            </FormControl>
          </FormGroup>
        </form>
      </CardContent>
    </Card>
  );
}

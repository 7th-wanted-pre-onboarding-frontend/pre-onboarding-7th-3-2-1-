import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { faker } from '@faker-js/faker';
import 'react-phone-input-2/lib/style.css';
import {
  Box,
  Button,
  FormControl,
  Modal,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material';

import PhoneInput from 'react-phone-input-2';
import ko from 'react-phone-input-2/lang/ko.json';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UsersService from '../utils/services/Users.service';

export default function CreateUserButton() {
  const queryClient = useQueryClient();
  const createUser = useMutation(UsersService.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    }
  });
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [mainAddr, setMainAddr] = useState('');
  const [subAddr, setSubAddr] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [birthDate, setBirthDate] = useState<Dayjs | string | null>(
    dayjs(new Date().toISOString())
  );

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #ddd',
    boxShadow: 24,
    p: 4
  };

  const handleBirthDateChange = (value: any) => {
    const newValue = new Date(value.$d).toISOString();
    setBirthDate(newValue);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const age =
      new Date().getFullYear() -
      new Date(birthDate as string).getFullYear() +
      1;

    const createdAt = new Date().toISOString();

    const body = {
      email,
      name: `${lastName} ${firstName}`,
      phone_number: phone.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      address: mainAddr,
      detail_address: subAddr,
      birth_date: birthDate as string,
      age,
      uuid: faker.datatype.uuid(),
      gender_origin: 1,
      created_at: createdAt,
      last_login: createdAt
    };

    createUser.mutate(body);
  };

  return (
    <>
      <Button
        variant='contained'
        sx={{
          height: '28px'
        }}
        onClick={handleOpen}
      >
        사용자 생성
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <header>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              사용자 생성
            </Typography>
          </header>
          <main>
            <form onSubmit={onSubmit}>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  이메일
                </Typography>
                <OutlinedInput
                  placeholder='이메일 주소'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  성
                </Typography>
                <OutlinedInput
                  placeholder='성'
                  type='type'
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  이름
                </Typography>
                <OutlinedInput
                  placeholder='이름'
                  type='type'
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  전화번호
                </Typography>
                <PhoneInput
                  country={'kr'}
                  localization={ko}
                  countryCodeEditable={false}
                  disableDropdown={true}
                  inputStyle={{
                    width: '100%',
                    height: '56px',
                    fontSize: '16px'
                  }}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  생년월일
                </Typography>
                <DesktopDatePicker
                  inputFormat='MM/DD/YYYY'
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  주소1
                </Typography>
                <OutlinedInput
                  placeholder='주소1'
                  type='type'
                  required
                  value={mainAddr}
                  onChange={(e) => setMainAddr(e.target.value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Typography
                  variant='body2'
                  component='h6'
                  color='#999'
                  sx={{
                    marginBottom: '4px'
                  }}
                >
                  주소2
                </Typography>
                <OutlinedInput
                  placeholder='주소2'
                  type='type'
                  required
                  value={subAddr}
                  onChange={(e) => setSubAddr(e.target.value)}
                />
              </FormControl>
              <FormControl variant='standard' fullWidth required margin='dense'>
                <Button type='submit' variant='contained'>
                  생성
                </Button>
              </FormControl>
            </form>
          </main>
        </Box>
      </Modal>
    </>
  );
}

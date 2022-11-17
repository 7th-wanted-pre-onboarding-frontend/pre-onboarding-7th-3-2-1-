import {
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { getParams } from '../utils/common/functions';

export default function AccountSearchForm() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: { [key: string]: any } = { ...router.query, page: 1 };
    if (ref.current) {
      query.q = ref.current.value;
      const params = getParams(query);
      router.push(router.pathname + params);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '28px',
          gap: '8px',
          justifyContent: 'flex-end'
        }}
      >
        <FormControl variant='standard' required margin='dense'>
          <OutlinedInput
            placeholder='계좌명을 입력해주세요.'
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
            sx={{
              height: '28px'
            }}
            type='text'
            inputRef={ref}
          />
        </FormControl>
        <FormControl variant='standard' required margin='dense'>
          <Button
            type='submit'
            variant='contained'
            fullWidth
            sx={{
              height: '28px'
            }}
          >
            검색
          </Button>
        </FormControl>
      </section>
    </form>
  );
}

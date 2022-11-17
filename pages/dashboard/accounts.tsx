import Head from 'next/head';
import AccountService from '../../utils/services/Account.service';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { Pagination } from '@mui/material';
import AccountsTable from '../../components/AccountsTable';
import { useMemo } from 'react';
import AccountSearchForm from '../../components/AccountSearchForm';
import AccountFilters from '../../components/AccountFilters';
import { getParams } from '../../utils/common/functions';

export default function Accounts() {
  const router = useRouter();
  const query = useMemo(() => {
    const page = router.query.page ? +router.query.page : 1;
    const q = router.query.q;
    const broker_id = router.query.broker_id;
    const is_active = router.query.is_active;
    const status = router.query.status;

    const result: any = {
      page: page
    };

    if (q) {
      result.keyword = q;
    }

    if (broker_id) {
      result['broker_id'] = broker_id;
    }

    if (is_active) {
      result['is_active'] = is_active;
    }

    if (status) {
      result['status'] = status;
    }

    return result;
  }, [router.query]);

  const { isLoading, data, isError } = useQuery(
    ['accounts', query],
    AccountService.getList,
    {
      onError: (error) => {
        console.log('에러');
        if (axios.isAxiosError(error)) {
          const response = error.response;
          const status = response ? response.status : 400;

          if (status === 401) {
            router.push('/login');
            return;
          }
        }
      }
    }
  );

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const query: { [key: string]: any } = {
      ...router.query,
      page: value
    };
    const params = getParams(query);
    router.push(router.pathname + params);
  };

  return (
    <article>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Layout title='계좌 목록'>
          <section
            style={{
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'space-between',
              justifyContent: 'center',
              gap: '30px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <AccountFilters />
              <AccountSearchForm />
            </div>
            <AccountsTable accounts={data?.data.data || []} />
            <Pagination
              count={data?.data.totalPage || 1}
              page={query.page}
              variant='outlined'
              shape='rounded'
              onChange={handleChange}
              sx={{
                margin: '0 auto'
              }}
            />
          </section>
        </Layout>
      </main>
    </article>
  );
}

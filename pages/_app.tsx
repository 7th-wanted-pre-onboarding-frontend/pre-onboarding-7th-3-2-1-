import '../styles/globals.css';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../utils/store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RouterGuard from '../components/RouterGuard';
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterGuard>
              <Component {...pageProps} />
            </RouterGuard>
          </LocalizationProvider>
        </Provider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

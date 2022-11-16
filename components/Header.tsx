import { AppBar, Avatar, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu, Person } from '@mui/icons-material';
import { RootState, useAppSelector } from '../utils/store';
import { IUser } from '../utils/models/interfaces/IUser';
import { UserState } from '../utils/store/userReducer';
import { useSelector } from 'react-redux';

type Props = {
  drawerWidth: 240;
  handleDrawerToggle: () => void;
  title: string;
};

export default function Header({
  drawerWidth,
  handleDrawerToggle,
  title
}: Props) {
  const userState = useSelector((state: RootState) => state.user);

  return (
    <AppBar
      position='fixed'
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            {title}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Avatar sx={{ bgcolor: 'white', width: '36px', height: '36px' }}>
            <Person sx={{ fill: '#1976d2' }} />
          </Avatar>
          <Typography variant='body2' noWrap component='div'>
            {userState?.name || '이름 없음'}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
}

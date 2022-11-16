import {
  Drawer,
  Box,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { AccountBalance, Person, ExitToApp } from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import AuthService from '../utils/services/Auth.service';
import Link from 'next/link';

type Props = {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};
export default function SideDrawer({
  drawerWidth,
  mobileOpen,
  handleDrawerToggle
}: Props) {
  return (
    <Box
      component='nav'
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label='mailbox folders'
    >
      <Drawer
        variant='temporary'
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        open={mobileOpen}
        onClose={handleDrawerToggle}
      >
        <DrawerContent />
      </Drawer>
      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </Box>
  );
}

function DrawerContent() {
  const router = useRouter();
  const { mutate } = useMutation(AuthService.signOut, {
    onSuccess: () => {
      router.push('/login');
    }
  });

  const menu = [
    {
      id: 'menu-1',
      icon: <AccountBalance />,
      text: '계좌 목록',
      href: '/dashboard/accounts'
    },
    {
      id: 'menu-2',
      icon: <Person />,
      text: '사용자',
      href: '/dashboard/users'
    }
  ];
  return (
    <section>
      <Toolbar>
        <Image src='/images/logo.png' alt='logo' width='191' height='30' />
      </Toolbar>
      <Divider />
      <List>
        {menu.map(({ id, text, icon, href }) => (
          <Link href={href} key={id}>
            <ListItem disablePadding>
              <ListItemButton selected={router.pathname === href}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => mutate()}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary='로그아웃' />
          </ListItemButton>
        </ListItem>
      </List>
    </section>
  );
}

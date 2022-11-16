import { Container, Drawer, Box } from '@mui/material';
import React, { useState } from 'react';
import Header from './Header';
import SideDrawer from './SideDrawer';

type Props = {
  children: React.ReactNode;
  title: string;
};

const drawerWidth = 240;

export default function Layout({ children, title }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <section
      style={{
        display: 'flex',
        minHeight: '100vh'
      }}
    >
      <section>
        <Header
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          title={title}
        />
        <SideDrawer
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      </section>
      <Box
        component='section'
        sx={{
          width: '100%',
          margin: '0 auto',
          overflowX: 'hidden',
          marginTop: { sm: '64px', xs: '56px' }
        }}
      >
        {children}
      </Box>
    </section>
  );
}

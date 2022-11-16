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
        display: 'flex'
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
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: { sm: '64px', xs: '56px' }
        }}
      >
        {children}
      </Box>
    </section>
  );
}

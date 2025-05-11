import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Toolbar,
  Box,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';

// ForwardRef for RouterLink to work with MUI
const LinkBehavior = React.forwardRef<HTMLAnchorElement, { to: string }>((props, ref) => {
  return <RouterLink ref={ref} {...props} />;
});
LinkBehavior.displayName = 'LinkBehavior';

const drawerWidth = 240;

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const navItems = [
    { text: 'Dashboard', to: '/' },
    { text: 'Manage Students', to: '/students' },
    { text: 'Vaccination Drives', to: '/vaccination-drives' },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Toolbar>
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
        <Divider />

        {/* Navigation Links */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={open ? '' : item.text} placement="right">
                <ListItemButton
                  component={LinkBehavior}
                  to={item.to}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Logout Button */}
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={open ? '' : 'Logout'} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <LogoutIcon sx={{ mr: open ? 1 : 0, opacity: 0.7 }} />
                <ListItemText
                  primary="Logout"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

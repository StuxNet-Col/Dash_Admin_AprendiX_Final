import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemText, Collapse, ListItemIcon, Divider, IconButton, Menu, MenuItem, Toolbar
} from '@mui/material';
import {
  ExpandLess, ExpandMore, People, School, Topic, MoreVert
} from '@mui/icons-material';

const Sidebar = ({ drawerWidth, handleCreateCourseOpen, handleCreateTopicOpen }) => {
  const [openUsers, setOpenUsers] = useState(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [openTopics, setOpenTopics] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggle = (setter) => () => {
    setter(prev => !prev);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={handleToggle(setOpenUsers)}>
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Usuarios" />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/usuarios">
              <ListItemText primary="Ver Usuarios" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleToggle(setOpenCourses)}>
          <ListItemIcon><School /></ListItemIcon>
          <ListItemText primary="Cursos" />
          {openCourses ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openCourses} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/cursos">
              <ListItemText primary="Ver Cursos" />
            </ListItem>
            <ListItem button onClick={handleCreateCourseOpen}>
              <ListItemText primary="Crear Curso" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handleToggle(setOpenTopics)}>
          <ListItemIcon><Topic /></ListItemIcon>
          <ListItemText primary="Temáticas" />
          {openTopics ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openTopics} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/tematicas">
              <ListItemText primary="Ver Temáticas" />
            </ListItem>
            <ListItem button onClick={handleCreateTopicOpen}>
              <ListItemText primary="Crear Temática" />
            </ListItem>
          </List>
        </Collapse>
      </List>
      <IconButton onClick={handleMenuClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
      </Menu>
    </Drawer>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Body from './components/Body';
import Users from './components/Users';
import Courses from './components/Courses';
import Topics from './components/Topics';
import CreateCourse from './components/CreateCourse';
import CreateTopic from './components/CreateTopic';
import Sidebar from './components/Sidebar';
import theme from './theme';
import './Dashboard.css';

const drawerWidth = 240;

const Dashboard = () => {
  const [openCreateCourse, setOpenCreateCourse] = useState(false);
  const [openCreateTopic, setOpenCreateTopic] = useState(false);

  const handleCreateCourseOpen = () => {
    setOpenCreateCourse(true);
  };

  const handleCreateCourseClose = () => {
    setOpenCreateCourse(false);
  };

  const handleCreateTopicOpen = () => {
    setOpenCreateTopic(true);
  };

  const handleCreateTopicClose = () => {
    setOpenCreateTopic(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header />
          <Sidebar
            drawerWidth={drawerWidth}
            handleCreateCourseOpen={handleCreateCourseOpen}
            handleCreateTopicOpen={handleCreateTopicOpen}
          />
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, marginTop: '64px' }}
          >
            <Switch>
              <Route path="/" exact component={Body} />
              <Route path="/usuarios" component={Users} />
              <Route path="/cursos" component={Courses} />
              <Route path="/tematicas" component={Topics} />
              {/* Agregar otras rutas aquí */}
            </Switch>
          </Box>
        </Box>
        <CreateCourse open={openCreateCourse} handleClose={handleCreateCourseClose} />
        <CreateTopic open={openCreateTopic} handleClose={handleCreateTopicClose} />
      </Router>
    </ThemeProvider>
  );
};

export default Dashboard;

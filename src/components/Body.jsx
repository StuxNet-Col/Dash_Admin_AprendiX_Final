// src/components/Body.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Body = () => {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);

  useEffect(() => {
    // Obtener el número de usuarios
    axios.get('https://nodebackend-vv0e.onrender.com/api/v1/users')
      .then(response => {
        setUserCount(response.data.data.length);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

    // Obtener el número de cursos
    axios.get('https://nodebackend-vv0e.onrender.com/api/v1/courses')
      .then(response => {
        setCourseCount(response.data.data.length);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });

    // Obtener el número de temáticas
    axios.get('https://nodebackend-vv0e.onrender.com/api/v1/test')
      .then(response => {
        setTopicCount(response.data.data.length);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Usuarios</Typography>
            <Typography variant="h4">{userCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Cursos</Typography>
            <Typography variant="h4">{courseCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Temáticas</Typography>
            <Typography variant="h4">{topicCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;
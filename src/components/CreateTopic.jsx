import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Alert, Modal, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { registerTopic } from '../api';

// Asegúrate de tener esta función en tu archivo de API
const fetchCourses = async () => {
  const response = await fetch('https://nodebackend-vv0e.onrender.com/api/v1/courses');
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al cargar los cursos');
  }
  return data.data; // Asegúrate de devolver solo los cursos
};

const CreateTopic = ({ open, handleClose }) => {
  const [topicData, setTopicData] = useState({ topic_name: '', topic_description: '', course: '' });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseList = await fetchCourses();
        setCourses(courseList);
      } catch (err) {
        setError('Error al cargar los cursos.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setTopicData({ ...topicData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log('Form data before submission:', topicData);
      const response = await registerTopic(topicData);
      console.log('Response from API:', response);
      setSuccess('Temática creada con éxito.');
      setTopicData({ topic_name: '', topic_description: '', course: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Submit Error:', error);
      setError(error.message || 'Error al crear la temática. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-topic-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Temática
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            label="Nombre de la temática"
            name="topic_name"
            value={topicData.topic_name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción de la temática"
            name="topic_description"
            value={topicData.topic_description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="course-select-label">ID del curso</InputLabel>
            <Select
              labelId="course-select-label"
              name="course"
              value={topicData.course}
              onChange={handleChange}
              required
            >
              {courses.length > 0 ? (
                courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.coure_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No se encontraron cursos
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Temática
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTopic;

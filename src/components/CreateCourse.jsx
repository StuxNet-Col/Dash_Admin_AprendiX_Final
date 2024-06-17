import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, Modal } from '@mui/material';
import { registerCourse } from '../api';

const CreateCourse = ({ open, handleClose }) => {
  const [courseData, setCourseData] = useState({ coure_name: '', coure_description: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log('Form data before submission:', courseData);
      const response = await registerCourse(courseData);
      console.log('Response from API:', response);
      setSuccess('Curso creado con éxito.');
      setCourseData({ coure_name: '', coure_description: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Submit Error:', error);
      setError(error.message || 'Error al crear el curso. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-course-modal">
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
            Crear Curso
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            label="Nombre del curso"
            name="coure_name"
            value={courseData.course_name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción del curso"
            name="coure_description"
            value={courseData.course_description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Crear Curso
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCourse;


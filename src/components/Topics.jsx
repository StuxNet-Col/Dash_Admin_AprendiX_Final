// src/components/Topics.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './Topics.css';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminAction, setAdminAction] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);  // Estado para almacenar el archivo seleccionado

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTRiMjMyZDRmOGMxODgxMGU3OTMyOCIsImlhdCI6MTcxODE2MTQzMSwiZXhwIjoxNzE4MjQ3ODMxfQ.7--dVUCUDbRNTJ9PmQm45HEDRuXBDcBQy0mNqeSxI0c";

  const parseJSON = useCallback(async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Error al parsear JSON:', text);
      throw new Error('Respuesta no es JSON válido');
    }
  }, []);

  const handleResponse = useCallback(async (response) => {
    if (response.status === 404) {
      throw new Error('Recurso no encontrado (404)');
    }
    return parseJSON(response);
  }, [parseJSON]);

  const fetchAPI = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      return handleResponse(response);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      throw error;
    }
  }, [handleResponse]);

  const fetchCourses = useCallback(async () => {
    const url = 'https://nodebackend-vv0e.onrender.com/api/v1/courses/';
    const options = {
      headers: { 'x-access-token': token },
    };

    try {
      const data = await fetchAPI(url, options);
      setCourses(data.data);
    } catch (error) {
      setError('Error al obtener cursos.');
    }
  }, [fetchAPI, token]);

  const fetchTopics = useCallback(async (courseId) => {
    const url = `https://nodebackend-vv0e.onrender.com/api/v1/courses/find/${courseId}`;
    const options = {
      headers: { 'x-access-token': token },
    };

    try {
      const data = await fetchAPI(url, options);
      setTopics(data.data.course_topics);
    } catch (error) {
      if (error.message.includes('Unexpected token')) {
        setError('Error al obtener temáticas: respuesta inesperada del servidor.');
      } else {
        setError('Error al obtener temáticas.');
      }
      console.error('Error al obtener temáticas:', error);
    }
  }, [fetchAPI, token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourse) {
      fetchTopics(selectedCourse);
    }
  }, [selectedCourse, fetchTopics]);

  const handleAdminAction = (topic, action) => {
    setSelectedTopic(topic);
    setAdminAction(action);
    setShowAdminModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedTopic((prevTopic) => ({
      ...prevTopic,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);  // Almacenar el archivo seleccionado en el estado
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let url = '';
    let method = '';
    const payload = { ...selectedTopic };

    if (adminAction === 'createMaterial') {
      url = `https://nodebackend-vv0e.onrender.com/api/v1/courses/registerMaterialTopic/`;
      payload.idTopic = selectedTopic._id;
      method = 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Material creado con éxito:', data);
          const materialId = data.data._id;

          if (file) {
            const formData = new FormData();
            formData.append('file', file);

            const uploadUrl = `https://nodebackend-vv0e.onrender.com/api/v1/courses/uploadFileMaterialTopic/${materialId}/materials-topic`;

            const uploadResponse = await fetch(uploadUrl, {
              method: 'POST',
              headers: {
                'x-access-token': token,
              },
              body: formData,
            });

            if (uploadResponse.ok) {
              console.log('Archivo subido con éxito');
            } else {
              console.error('Error al subir el archivo:', await uploadResponse.text());
            }
          }

          fetchTopics(selectedCourse);
          setShowAdminModal(false);
          setSelectedTopic(null);
          setFile(null);  // Limpiar el archivo seleccionado
        } else {
          console.error('Error al crear material:', data.message);
        }
      } catch (error) {
        console.error('Error al crear material:', error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="topics-container">
      <h2 className="topics-heading">Lista de Temáticas AprendiX</h2>

      <div className="course-selector">
        <label htmlFor="courseSelect">Seleccionar Curso:</label>
        <select
          id="courseSelect"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Seleccione un curso</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.coure_name}
            </option>
          ))}
        </select>
      </div>

      <div className="topics-grid">
        {topics.length > 0 && topics.map((topic) => (
          <div key={topic._id} className="topic-card">
            <div className="topic-details">
              <h3>{topic.topic_name}</h3>
              <p>{topic.topic_description}</p>
              <div className="admin-buttons">
                <button onClick={() => handleAdminAction(topic, 'createMaterial')}>Crear Material</button>
              </div>
            </div>
          </div>
        ))}
        {topics.length === 0 && !error && (
          <p className="no-topics-message">No se encontraron temáticas.</p>
        )}
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>

      {showAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAdminModal(false)}>&times;</span>
            <h3>{adminAction === 'createMaterial' ? 'Crear Material' : 'Acción Administrativa'}</h3>
            <form onSubmit={handleSubmit}>
              <label htmlFor="materialName">Nombre del Material:</label>
              <input
                type="text"
                id="materialName"
                name="material_name"
                value={selectedTopic ? selectedTopic.material_name : ''}
                onChange={handleInputChange}
              />
              <label htmlFor="materialDescription">Descripción del Material:</label>
              <textarea
                id="materialDescription"
                name="material_description"
                value={selectedTopic ? selectedTopic.material_description : ''}
                onChange={handleInputChange}
              />
              <label htmlFor="materialStyle">Estilo del Material:</label>
              <input
                type="text"
                id="materialStyle"
                name="material_style"
                value={selectedTopic ? selectedTopic.material_style : ''}
                onChange={handleInputChange}
              />
              <label htmlFor="file">Subir Archivo:</label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
              />
              <button type="submit" className="submit-button">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topics;

import React, { useState, useEffect, useCallback } from 'react';
import CreateTopic from './CreateTopic';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [adminAction, setAdminAction] = useState('');
  const [error, setError] = useState(null);

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
    const url = 'https://nodebackend-vv0e.onrender.com/api/v1/courses';
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

  const fetchUsers = useCallback(async () => {
    const url = 'https://nodebackend-vv0e.onrender.com/api/v1/users';
    const options = {
      headers: { 'x-access-token': token },
    };

    try {
      const data = await fetchAPI(url, options);
      setUsers(data.data);
    } catch (error) {
      setError('Error al obtener usuarios.');
    }
  }, [fetchAPI, token]);

  useEffect(() => {
    fetchCourses();
    fetchUsers();
  }, [fetchCourses, fetchUsers]);

  const handleAdminAction = (course, action) => {
    setSelectedCourse(course);
    setAdminAction(action);
    setShowCreateTopic(action === 'createTheme');
    setShowAdminModal(action !== 'createTheme');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handleUserSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedUsers((prevSelectedUsers) =>
      checked ? [...prevSelectedUsers, value] : prevSelectedUsers.filter((user) => user !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let url = '';
    let method = 'POST';
    const payload = { ...selectedCourse };

    switch (adminAction) {
      case 'editCourse':
        url = `https://nodebackend-vv0e.onrender.com/api/v1/courses/find/edit/${selectedCourse._id}`;
        break;
      case 'assignCourse':
        url = `https://nodebackend-vv0e.onrender.com/api/v1/courses/find/course_topic${selectedCourse._id}`;
        payload.users = selectedUsers;
        break;
      case 'registerMaterial':
        url = `https://nodebackend-vv0e.onrender.com/api/v1/courses/registerMaterialTopic`;
        break;
      default:
        return;
    }

    try {
      const data = await fetchAPI(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(payload),
      });
      console.log('Acción realizada con éxito:', data);
      fetchCourses();
      setShowAdminModal(false);
      setSelectedCourse(null);
      setSelectedUsers([]);
    } catch (error) {
      setError('Error al realizar la acción.');
    }
  };

  return (
    <div className="courses-container">
      <h2 className="courses-heading">Lista de Cursos AprendiX</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-details">
              <h3>{course.coure_name}</h3>
              <p><strong>Descripción:</strong> {course.coure_description}</p>
              <div className="admin-buttons">
                <button onClick={() => handleAdminAction(course, 'createTheme')}>Crear Temática</button>
                <button onClick={() => handleAdminAction(course, 'editCourse')}>Editar Curso</button>
                <button onClick={() => handleAdminAction(course, 'assignCourse')}>Asignar Curso</button>
                <button onClick={() => handleAdminAction(course, 'registerMaterial')}>Registrar Material</button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && !error && (
          <p className="no-courses-message">No se encontraron cursos.</p>
        )}
      </div>

      {showAdminModal && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAdminModal(false)}>&times;</span>
            <h3>
              {adminAction === 'editCourse'
                ? 'Editar Curso'
                : adminAction === 'assignCourse'
                ? 'Asignar Curso'
                : 'Registrar Material'}
            </h3>
            <form onSubmit={handleSubmit}>
              {adminAction === 'editCourse' && selectedCourse && (
                <>
                  <label htmlFor="courseName">Nombre del Curso:</label>
                  <input
                    type="text"
                    id="courseName"
                    name="coure_name"
                    value={selectedCourse.coure_name}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                  <label htmlFor="courseDescription">Descripción del Curso:</label>
                  <textarea
                    id="courseDescription"
                    name="coure_description"
                    value={selectedCourse.coure_description}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                </>
              )}
              {adminAction === 'assignCourse' && (
                <>
                  <label>Asignar Usuarios:</label>
                  {users.map((user) => (
                    <div key={user._id} className="checkbox-group">
                      <input
                        type="checkbox"
                        id={user._id}
                        value={user._id}
                        onChange={handleUserSelection}
                        className="modal-checkbox"
                      />
                      <label htmlFor={user._id}>{user.name}</label>
                    </div>
                  ))}
                </>
              )}
              {adminAction === 'registerMaterial' && (
                <>
                  <label htmlFor="materialName">Nombre del Material:</label>
                  <input
                    type="text"
                    id="materialName"
                    name="material_name"
                    value={selectedCourse.material_name || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                  <label htmlFor="materialDescription">Descripción del Material:</label>
                  <textarea
                    id="materialDescription"
                    name="material_description"
                    value={selectedCourse.material_description || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                  <label htmlFor="idTopic">ID de la Temática:</label>
                  <input
                    type="text"
                    id="idTopic"
                    name="idTopic"
                    value={selectedCourse.idTopic || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                  <label htmlFor="materialStyle">Estilo del Material:</label>
                  <input
                    type="text"
                    id="materialStyle"
                    name="material_style"
                    value={selectedCourse.material_style || ''}
                    onChange={handleInputChange}
                    className="modal-input"
                  />
                </>
              )}
              <button type="submit" className="modal-submit-button">Guardar</button>
            </form>
          </div>
        </div>
      )}

      {showCreateTopic && (
        <CreateTopic courseId={selectedCourse._id} onClose={() => setShowCreateTopic(false)} />
      )}
    </div>
  );
};

export default Courses;

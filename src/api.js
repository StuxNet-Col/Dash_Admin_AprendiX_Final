const fetchApi = 'https://nodebackend-vv0e.onrender.com/api/v1/';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTRiMjMyZDRmOGMxODgxMGU3OTMyOCIsImlhdCI6MTcxODE2MTQzMSwiZXhwIjoxNzE4MjQ3ODMxfQ.7--dVUCUDbRNTJ9PmQm45HEDRuXBDcBQy0mNqeSxI0c';

const fetchApiWithAuth = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud a la API');
  }

  return response.json();
};

export const registerCourse = async (courseData) => {
  return fetchApiWithAuth(`${fetchApi}courses/registerCourse`, {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

export const login = async (email, password) => {
  const response = await fetch(`${fetchApi}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud de inicio de sesión');
  }

  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${fetchApi}auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud de registro');
  }

  return response.json();
};

export const fetchTests = async () => {
  const response = await fetch(`${fetchApi}test`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener los tests');
  }

  return response.json();
};

export const fetchTestById = async (testId) => {
  const response = await fetch(`${fetchApi}test/find/${testId}`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener el test');
  }

  return response.json();
};

export const registerTest = async (testData) => {
  const response = await fetch(`${fetchApi}test/registerTest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData),
  });

  if (!response.ok) {
    throw new Error('Error al registrar el test');
  }

  return response.json();
};

export const registerQuestion = async (questionData) => {
  const response = await fetch(`${fetchApi}test/registerQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });

  if (!response.ok) {
    throw new Error('Error al registrar la pregunta');
  }

  return response.json();
};

export const registerAnswer = async (answerData) => {
  const response = await fetch(`${fetchApi}test/registerAnswerQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerData),
  });

  if (!response.ok) {
    throw new Error('Error al registrar la respuesta');
  }

  return response.json();
};

export const fetchCourses = async () => {
  const response = await fetch(`${fetchApi}courses`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }

  return response.json();
};

export const fetchCourseById = async (courseId) => {
  const response = await fetch(`${fetchApi}courses/find/${courseId}`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener el curso');
  }

  return response.json();
};

export const registerTopic = async (topicData) => {
  return fetchApiWithAuth(`${fetchApi}courses/registerTopic`, {
    method: 'POST',
    body: JSON.stringify(topicData),
  });
};

export const fetchUsers = async () => {
  const response = await fetch(`${fetchApi}users`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }

  return response.json();
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`${fetchApi}users/find/${userId}`, { method: 'GET' });

  if (!response.ok) {
    throw new Error('Error al obtener el usuario');
  }

  return response.json();
};

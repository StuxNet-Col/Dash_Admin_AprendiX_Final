import React, { useState, useEffect } from 'react';
import './Users.css'; // Archivo de estilos CSS para este componente

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://nodebackend-vv0e.onrender.com/api/v1/users');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.data); // Suponiendo que el array de usuarios está bajo la clave 'data'
        } else {
          console.error('Error al obtener usuarios:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2 className="users-heading">Lista de Usuarios AprendiX</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-avatar">
              {/* Puedes agregar una imagen de perfil del usuario aquí */}
            </div>
            <div className="user-details">
              <h3>{`${user.name} ${user.lastname}`}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              {/* Puedes mostrar más detalles aquí si es necesario */}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="no-users-message">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};

export default Users;

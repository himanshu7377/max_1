import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate=useNavigate();

  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user');
        setUser(response.data);
        console.log('Fetched user:', response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';

import { useUser } from '../UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        setError(`Please enter ${!email ? 'username' : ''}${!email && !password ? ' and ' : ''}${!password ? 'password' : ''}.`);
      }
      else{
        setError(null);
      }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, { withCredentials: true });
      console.log(response.data);
      const response2 = await axios.get('http://localhost:5000/api/auth/user', { withCredentials: true }); // Fetch user details
      setUser(response2.data); // Set user context
      console.log(response2.data);
      // Handle successful login (e.g., redirect to dashboard)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure (e.g., display error message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mx-auto">
        <h2 className="text-3xl mb-4 text-center ">Login</h2>
        <form onSubmit={handleLogin}>
            <div className='text-red-500 text-center text-xl'>{error}</div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <p className='text-center  pt-4'>New User ? <Link to="/register" className='text-blue-500'>Register</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Login;

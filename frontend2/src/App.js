import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreatePost from './components/Post';
import UserProfile from './components/UserProfile.jsx';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserContext.js'; // Import UserProvider
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<CreatePost />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Routes>
        <ToastContainer />
        </UserProvider>
      </BrowserRouter>
   
    </div>
  );
}

export default App;

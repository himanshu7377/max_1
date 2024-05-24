// UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from './Post'; // Assume Post component is used to display individual posts
import { Link } from 'react-router-dom';

import { FaUserCircle } from 'react-icons/fa';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userId) {
      // Fetch user info
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then(response => setUser(response.data))
        .catch(error => console.error('Error fetching user data:', error));

      // Fetch user's posts
      axios.get(`http://localhost:5000/api/users/${userId}/posts`)
        .then(response => setPosts(response.data))
        .catch(error => console.error('Error fetching user posts:', error));
    }
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-100 shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between space-x-4">
            <div className='flex flex-row space-x-4'>
            <FaUserCircle className="text-6xl text-blue-500 " />
          <div className='text-3xl font-bold mt-2'>
          {user.name.toUpperCase()}
          </div>
            </div>
         
         <div>
            <Link to="/" className='text-3xl font-bold'>HOME</Link>
         </div>
           
        
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600 text-2xl font-semibold"> Email: {user.email}</p>
            <p className="text-gray-600 text-2xl font-semibold">Role: {user.role}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
        <div className="flex flex-wrap">
          {posts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

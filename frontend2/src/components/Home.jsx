import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import PostEditor from './PostEditor';
import Post from './Post';
import Pagination from './Pagination';
import PostSearchFilter from './PostSearchFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState('');
  let [totalposts, setTotalposts] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts', { withCredentials: true })
      .then(response => {
        setPosts(response.data);
        setFilteredPosts(response.data);
        setTotalposts(response.data.length);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  

  const handleSavePost = (post) => {
    axios.post('http://localhost:5000/api/posts', post, { withCredentials: true })
      .then(response => {
        setPosts([...posts, response.data]);
        setFilteredPosts([...posts, response.data]); // Update filtered posts as well
        setIsModalOpen(false);
       toast.success('Post added successfully!');
      })
      .catch(error => console.error('Error saving post:', error));
  };

  const handleUpdatePost = (updatedPost) => {
    axios.put(`http://localhost:5000/api/posts/${updatedPost._id}`, updatedPost, { withCredentials: true })
      .then(response => {
        setPosts(posts.map(post => post._id === updatedPost._id ? response.data : post));
        setFilteredPosts(posts.map(post => post._id === updatedPost._id ? response.data : post)); // Update filtered posts as well
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          toast.error('You are not authorized to update this post');
        } else {
          toast.error('Error updating post');
        }
        console.error('Error updating post:', error);
      });
  };

  const handleDeletePost = (postId) => {
    axios.delete(`http://localhost:5000/api/posts/${postId}`, { withCredentials: true })
      .then(() => {
        setPosts(posts.filter(post => post._id !== postId));
        setFilteredPosts(filteredPosts.filter(post => post._id !== postId)); // Update filtered posts as well
        totalposts=totalposts-1
        toast.success('Post Deleted successfully!');
      })
      .catch(error => {
        if (error.response && error.response.status === 403) {
          toast.error('You are not authorized to delete this post');
        } else {
          toast.error('Error deleting post');
        }
        console.error('Error updating post:', error);
      });
  };


  // Function to handle page change
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

   // Get current posts for the current page
   const indexOfLastPost = currentPage * postsPerPage;
   const indexOfFirstPost = indexOfLastPost - postsPerPage;
   const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
 
   // Filter the posts for the current page based on the search term
   const currentFilteredPosts = searchTerm
     ? currentPosts.filter(post =>
         post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         post.body.toLowerCase().includes(searchTerm.toLowerCase())
       )
     : currentPosts;;

  return (
    <>
  <Navbar />
  <div className="container bg-slate-400 mx-auto px-4 py-8">
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold">Welcome to Our Blog</h1>
    </header>
    <main>
      <section className="blog-posts">
        <h2 className="text-2xl mb-4 text-center">Latest Posts</h2>
        
        <div className="flex justify-center items-center mb-4">
          <PostSearchFilter onFilter={setSearchTerm} />
        </div>

        {currentFilteredPosts.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {currentFilteredPosts.map(post => (
              <Post key={post._id} post={post} onDelete={handleDeletePost} onUpdate={handleUpdatePost} />
            ))}
          </div>
        ) : (
          <p className="text-center">No posts found.</p>
        )}
        
        <div className="flex justify-center mt-4">
          <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredPosts.length / postsPerPage)} onPageChange={onPageChange} />
        </div>
      </section>
    </main>
    
    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-green-500 text-white p-2 rounded fixed bottom-4 right-4 shadow-lg hover:bg-green-600 focus:outline-none"
    >
      Add Post
    </button>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 shadow-lg">
          <h2 className="text-2xl mb-4">Create New Post</h2>
          <PostEditor onSave={handleSavePost} onCancel={() => setIsModalOpen(false)} />
        </div>
      </div>
    )}
  </div>
</>

  );
}

export default Home;

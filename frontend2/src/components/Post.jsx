import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import PostEditor from './PostEditor';
import Comment from './Comment';
import axios from 'axios';
import moment from 'moment';
import { useUser } from '../UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = ({ post, onUpdate, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments.length);
  const [showAllComments, setShowAllComments] = useState(false);
  const { user } = useUser();
  let authorName= user.name  || 'Anonymous'
  // console.log('post', post);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${post._id}/comments`, { withCredentials: true })
      .then(response => {
        setComments(response.data);
        setCommentsCount(response.data.length);
      })
      .catch(error => console.error('Error fetching comments:', error));
  }, [post._id]);

  const handleUpdate = (updatedPost) => {
    onUpdate({ ...post, ...updatedPost });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(post._id);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      axios.post(`http://localhost:5000/api/posts/${post._id}/comments`, { text: newComment }, { withCredentials: true })
        .then(response => {
          setComments([...comments, response.data]);
          setNewComment('');
          setCommentsCount(commentsCount + 1);
          toast.success('Comment added successfully!');
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
          toast.error('Error adding comment');
        });
    }
  };

  const handleDeleteComment = (commentId) => {
    axios.delete(`http://localhost:5000/api/comments/${commentId}`, { withCredentials: true })
      .then(() => {
        setComments(comments.filter(comment => comment._id !== commentId));
        setCommentsCount(commentsCount - 1);
        toast.success('Comment deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
        toast.error('Error deleting comment');
      });
  };

  const handleLike = () => {
    axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, { withCredentials: true })
      .then(response => {
        setLikes(response.data.likes);
      })
      .catch(error => console.error('Error liking post:', error));
  };
  
  const handleDislike = () => {
    axios.post(`http://localhost:5000/api/posts/${post._id}/dislike`, {}, { withCredentials: true })
      .then(response => {
        setLikes(response.data.likes);
      })
      .catch(error => console.error('Error disliking post:', error));
  };

  return (
    <>
    <div className={`w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 ${isEditing ? 'col-span-1' : ''}`}>
      <div className={`bg-gray-300 rounded-lg overflow-hidden shadow-md h-full flex flex-col ${isEditing ? 'p-4' : ''}`}>
        <div className="p-4 flex flex-col flex-grow">
          {isEditing ? (
            <PostEditor post={post} onSave={handleUpdate} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">Tittle : {post.title}</h3>
              <div className="flex-grow mb-4">
                <div className="text-black text-2xl mb-4" dangerouslySetInnerHTML={{ __html: post.body }} />
              </div>
  
              <p className="text-black font-bold text-lg mb-2">Author: {post.author.name || authorName}</p>
              <p className="text-black font-bold text-sm  mb-4">Created: {moment(post.createdAt).fromNow()}</p>
            </>
          )}
          {!isEditing && (
            <div className="flex justify-between items-center space-x-2">
              <div className="flex flex-col items-end space-y-2">
                <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button onClick={handleDelete} className="flex items-center text-sm text-red-500 hover:text-red-700 focus:outline-none">
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
              <div className="flex flex-col space-y-2">
                <button onClick={handleLike} className="flex items-center text-sm text-blue-500 hover:text-blue-700 focus:outline-none">
                  <FaThumbsUp className="mr-1" /> Like
                </button>
                <button onClick={handleDislike} className="flex items-center text-sm text-green-500 hover:text-green-700 focus:outline-none">
                  <FaThumbsDown className="mr-1" /> Dislike
                </button>
              </div>
              <div>
                <p className="text-sm">Total Likes: {likes}</p>
                <p className="text-sm">Total Comments: {commentsCount}</p>
              </div>
            </div>
          )}
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
              {showAllComments ? (
                <>
                  {comments.map(comment => (
                    <Comment key={comment._id} comment={comment} currentUserId={currentUserId} deleteComment={handleDeleteComment} />
                  ))}
                  <button onClick={() => setShowAllComments(false)} className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none">Hide comments</button>
                </>
              ) : (
                <>
                  {comments.slice(0, 4).map(comment => (
                    <Comment key={comment._id} comment={comment} currentUserId={currentUserId} deleteComment={handleDeleteComment} />
                  ))}
                  {comments.length > 4 && (
                    <button onClick={() => setShowAllComments(true)} className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none">View previous comments</button>
                  )}
                </>
              )}
            </div>
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  
  
  
  );
};

export default Post;

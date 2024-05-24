import React from 'react';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';
import { useUser } from '../UserContext';

const Comment = ({ comment, deleteComment }) => {
  const { user } = useUser();

  if (!comment || !comment.author) {
    return null; // Or render some placeholder or error message
  }

  const isAuthor = user && user._id === comment.author._id;

  return (
    <div className="relative bg-white p-4 rounded-lg shadow mb-2">
      <p className="text-gray-800">{comment.text}</p>
      <div className="text-sm text-gray-600 flex justify-between items-center mt-2">
        <span>By {comment.author.name}</span>
        <span>{moment(comment.createdAt).fromNow()}</span>
      </div>
      {isAuthor && (
        <button
          onClick={() => deleteComment(comment._id)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 flex items-center"
        >
          <FaTrash className="mr-1" />
        </button>
      )}
    </div>
  );
};

export default Comment;

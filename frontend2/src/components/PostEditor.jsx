import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify'; // Import DOMPurify library

const PostEditor = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post ? post.title : '');
  const [body, setBody] = useState(post ? post.body : '');
  

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const handleSave = () => {
    if (!title || !body) {
      alert('Title and Body are required');
      return;
    }

    // Sanitize the HTML content
    const sanitizedBody = DOMPurify.sanitize(body);
    onSave({ ...post, title, body: sanitizedBody });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <ReactQuill
        value={body}
        onChange={setBody}
        className="mb-4"
      />
      <div className='flex justify-between'>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PostEditor;

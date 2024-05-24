import React, { useState } from 'react';

const PostSearchFilter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onFilter(value); // Pass the search term to the parent component for filtering
  };

  const handleClear = () => {
    setSearchTerm('');
    onFilter(''); // Pass an empty string to clear the filter in the parent component
  };

  return (
    <div className="p-5 w-full flex justify-center items-center">
      <h2 className="text-xl font-bold">Search Posts:</h2>
      <input
        type="text"
        placeholder="Search posts by title or body"
        value={searchTerm}
        onChange={handleChange}
        className="px-4 h-10 border float-end border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
      <button onClick={handleClear} className="ml-2 px-4 py-2 bg-gray-200 rounded-md">Clear</button>
    </div>
  );
};

export default PostSearchFilter;

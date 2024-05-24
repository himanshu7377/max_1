import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination flex items-center space-x-4 text-2xl">
        {currentPage > 1 && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage - 1)} className="page-link focus:outline-none">
              &laquo; {/* Left arrow */}
            </button>
          </li>
        )}
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'page-item active' : 'page-item'}>
            <button onClick={() => onPageChange(number)} className={`page-link ${currentPage === number ? 'bg-gray-500 text-white' : 'text-gray-700 hover:bg-gray-100'} focus:outline-none`}>
              {number}
            </button>
          </li>
        ))}
        {currentPage < totalPages && (
          <li className="page-item">
            <button onClick={() => onPageChange(currentPage + 1)} className="page-link focus:outline-none">
              &raquo; {/* Right arrow */}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;

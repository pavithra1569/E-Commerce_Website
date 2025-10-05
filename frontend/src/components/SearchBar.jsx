import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, placeholder = "Search products..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  useEffect(() => {
    const id = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm, onSearch]);

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') handleClear(); }}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-24 flex items-center text-gray-400 hover:text-gray-600 px-2"
            aria-label="Clear search"
            title="Clear"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors">
            Search
          </div>
        </button>
      </div>
    </form>
  );
}

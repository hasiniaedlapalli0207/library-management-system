import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch } from 'react-icons/hi';
import API from '../api/axios';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await API.get(`/books/search/suggestions?q=${encodeURIComponent(q)}`);
      setSuggestions(res.data.data);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) onSearch(query);
  };

  const handleSelect = (book) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/books/${book._id}`);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <HiOutlineSearch className="search-icon" />
        <input
          type="text"
          className="form-input"
          placeholder="Search books by title, author, ISBN..."
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          id="search-books"
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((book) => (
            <div
              key={book._id}
              className="suggestion-item"
              onClick={() => handleSelect(book)}
            >
              <div className="book-color" style={{ background: book.coverColor }} />
              <div className="suggestion-info">
                <div className="suggestion-title">{book.title}</div>
                <div className="suggestion-author">{book.author}</div>
              </div>
              {book.availableCopies > 0 ? (
                <span className="badge badge-available">
                  <span className="pulse-dot" />
                  {book.availableCopies} avail
                </span>
              ) : (
                <span className="badge badge-issued">Issued</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

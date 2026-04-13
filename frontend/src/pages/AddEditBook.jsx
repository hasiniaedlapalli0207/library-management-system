import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    quantity: 1,
    rackNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      const b = res.data.data;
      setForm({
        title: b.title,
        author: b.author,
        category: b.category,
        isbn: b.isbn,
        quantity: b.quantity,
        rackNumber: b.rackNumber,
      });
    } catch (err) {
      setError('Failed to load book');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/books/${id}`, { ...form, quantity: parseInt(form.quantity) });
      } else {
        await API.post('/books', { ...form, quantity: parseInt(form.quantity) });
      }
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1>{isEdit ? '✏️ Edit Book' : '📕 Add New Book'}</h1>
        <p>{isEdit ? 'Update book information' : 'Add a new title to the library'}</p>
      </div>

      <div className="card">
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="book-title">Title</label>
            <input
              id="book-title"
              name="title"
              className="form-input"
              placeholder="Book title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-author">Author</label>
            <input
              id="book-author"
              name="author"
              className="form-input"
              placeholder="Author name"
              value={form.author}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="book-category">Category</label>
              <input
                id="book-category"
                name="category"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-isbn">ISBN</label>
              <input
                id="book-isbn"
                name="isbn"
                className="form-input"
                placeholder="978-0000000000"
                value={form.isbn}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="book-quantity">Quantity</label>
              <input
                id="book-quantity"
                name="quantity"
                type="number"
                min="0"
                className="form-input"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-rack">Rack Number</label>
              <input
                id="book-rack"
                name="rackNumber"
                className="form-input"
                placeholder="e.g. A1-Shelf2"
                value={form.rackNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
            </button>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/books')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

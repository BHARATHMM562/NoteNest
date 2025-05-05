import React, { useState, useEffect } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NoteNestLogo from './NoteNest.png';

const API_URL = 'http://localhost:3001/notes';

// Define colors for each category
const categoryColors = {
  Personal: '#f39c12',
  Work: '#3498db',
  Ideas: '#2ecc71',
  'To-Do': '#e74c3c',
  'All Notes': '#95a5a6', // Default for All Notes
};

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [categories, setCategories] = useState(['All Notes', 'Personal', 'Work', 'Ideas', 'To-Do']);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('Personal');
  
  const [errorMessage, setErrorMessage] = useState('');

  const [editNoteId, setEditNoteId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        updateCategories(data);
      });
  }, []);

  const updateCategories = (notes) => {
    const uniqueCategories = new Set(['All Notes', ...notes.map(note => note.category)]);
    setCategories(Array.from(uniqueCategories));
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'All Notes' || note.category === selectedCategory;
    const matchesSearchQuery = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearchQuery;
  });

  const resetForm = () => {
    setFormTitle('');
    setFormContent('');
    setFormCategory('Personal');
    setIsAdding(false);
    setErrorMessage('');
    setEditNoteId(null);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      setErrorMessage('Please type something in both title and content!');
      return;
    }

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const noteData = {
      title: formTitle,
      content: formContent,
      category: formCategory,
      date
    };

    let updatedNotes;
    if (editNoteId) {
      const res = await fetch(`${API_URL}/${editNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });

      const updated = await res.json();
      updatedNotes = notes.map(n => (n.id === editNoteId ? updated : n));
    } else {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      });

      const savedNote = await res.json();
      updatedNotes = [...notes, savedNote];

      // Add new category if it's not already in the list
      if (!categories.includes(formCategory)) {
        setCategories(prev => [...prev, formCategory]);
      }
    }

    setNotes(updatedNotes);
    updateCategories(updatedNotes);  // Update categories after adding or editing
    resetForm();
  };

  const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    updateCategories(updatedNotes);  // Update categories after deletion
  };

  const startEdit = (note) => {
    setEditNoteId(note.id);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
  };

  return (
    <div className="App">
      <aside className="sidebar" style={{ backgroundColor: '#2c6b3f' }}> {/* Dark Green */}
        <div className="logo-section">
          <img src={NoteNestLogo} alt="NoteNest" className="logo" />
        </div>
        <div className="category-list">
          {categories.map(cat => (
            (cat === 'All Notes' || notes.some(note => note.category === cat)) && (
              <button
                key={cat}
                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            )
          ))}
        </div>
      </aside>

      <main className="main-content" style={{ backgroundColor: '#f1c40f' }}> {/* Yellow */}
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search notes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="new-note-btn"
            onClick={() => {
              setIsAdding(true);
              setFormTitle('');
              setFormContent('');
              setFormCategory('Personal');
            }}
          >
            + New Note
          </button>
        </div>

        {(isAdding || editNoteId) && (
          <div className="fullscreen-editor">
            <div className="editor-content">
              <input
                type="text"
                placeholder="Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
              <div className="category-buttons">
                {['Personal', 'Work', 'Ideas', 'To-Do'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-btn ${formCategory === cat ? 'selected' : ''}`}
                    onClick={() => setFormCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {errorMessage && <div className="error-message">{errorMessage}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={resetForm} className="save-btn" style={{ backgroundColor: '#6c757d' }}>
                  Cancel
                </button>
                <button onClick={handleSave} className="save-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div key={note.id} className="note-card" style={{ backgroundColor: '#f5f5dc' }}> {/* Ivory */}
              <div className="note-actions">
                <i className="fas fa-pen edit-icon" onClick={() => startEdit(note)}></i>
                <i className="fas fa-trash delete-icon" onClick={() => deleteNote(note.id)}></i>
              </div>
              <h3>{note.title}</h3>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <span className="note-tag" style={{ backgroundColor: categoryColors[note.category] }}>
                  {note.category}
                </span>
                <span className="note-date">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

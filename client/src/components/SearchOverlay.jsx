import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, X, Loader2, Users, Calendar, MessageSquare, Briefcase, Bot, BookOpen } from 'lucide-react';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/search?q=${query}`);
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <Search className="search-icon-bg" size={24} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                handleNavigate(`/search?q=${encodeURIComponent(query)}`);
              }
            }}
            style={{ flex: 1, display: 'flex', alignItems: 'center' }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for clubs, events, faculty, or posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input-field"
              style={{ width: '100%' }}
            />
          </form>
          <button className="close-search" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="search-results-area">
          {loading && (
            <div className="search-loading">
              <Loader2 className="animate-spin" size={32} />
              <p>Searching college database...</p>
            </div>
          )}

          {!loading && results && results.aiSuggestion && (
            <div className="ai-suggestion-card" style={{ background: 'linear-gradient(to right, #eff6ff, #f8fafc)', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', margin: '0 0 0.5rem 0' }}>
                 <Bot size={18} /> AI Insights
              </h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)' }}>
                {results.aiSuggestion}
              </p>
            </div>
          )}

          {!loading && results && (
            <div className="results-grid">
              {/* CLUBS SECTION */}
              {results.clubs?.length > 0 && (
                <div className="result-category">
                  <h3><Users size={18} /> Clubs & Organizations</h3>
                  <div className="result-items">
                    {results.clubs.map(club => (
                      <div key={club._id} className="result-item" onClick={() => handleNavigate(`/clubs/${club._id}`)}>
                        <div className="item-icon">{club.name.charAt(0)}</div>
                        <div className="item-info">
                          <span className="item-title">{club.name}</span>
                          <span className="item-meta">{club.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVENTS SECTION */}
              {results.events?.length > 0 && (
                <div className="result-category">
                  <h3><Calendar size={18} /> Campus Events</h3>
                  <div className="result-items">
                    {results.events.map(event => (
                      <div key={event._id} className="result-item" onClick={() => handleNavigate(`/events/${event._id}`)}>
                        <div className="item-icon bg-blue">{new Date(event.startDate).getDate()}</div>
                        <div className="item-info">
                          <span className="item-title">{event.title}</span>
                          <span className="item-meta">{event.venue} • {event.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FACULTY SECTION */}
              {results.faculty?.length > 0 && (
                <div className="result-category">
                  <h3><Briefcase size={18} /> Faculty Directory</h3>
                  <div className="result-items">
                    {results.faculty.map(fac => (
                      <div key={fac._id} className="result-item" onClick={() => handleNavigate(`/faculty?search=${encodeURIComponent(fac.name)}`)}>
                        <div className="item-icon bg-green">{fac.name.charAt(0)}</div>
                        <div className="item-info">
                          <span className="item-title">{fac.name}</span>
                          <span className="item-meta">{fac.department} • {fac.designation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORUM POSTS SECTION */}
              {results.posts?.length > 0 && (
                <div className="result-category">
                  <h3><MessageSquare size={18} /> Forum Discussions</h3>
                  <div className="result-items">
                    {results.posts.map(post => (
                      <div key={post._id} className="result-item" onClick={() => handleNavigate(`/forum/${post._id}`)}>
                        <div className="item-icon bg-orange"><MessageSquare size={14} /></div>
                        <div className="item-info">
                          <span className="item-title">{post.title}</span>
                          <span className="item-meta">By {post.author?.name || 'Anonymous'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STUDY RESOURCES SECTION */}
              {results.resources?.length > 0 && (
                <div className="result-category">
                  <h3><BookOpen size={18} /> Study Resources</h3>
                  <div className="result-items">
                    {results.resources.map(res => (
                      <div key={res._id} className="result-item" onClick={() => handleNavigate(`/resources?search=${encodeURIComponent(res.title)}`)}>
                        <div className="item-icon bg-purple"><BookOpen size={14} /></div>
                        <div className="item-info">
                          <span className="item-title">{res.title}</span>
                          <span className="item-meta">{res.subject} • {res.department}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {!loading && query.trim().length >= 2 && results && 
            Object.values(results).every(arr => arr.length === 0) && (
             <div className="search-empty">
               <p>No internal matches found for "<strong>{query}</strong>"</p>
               <button 
                 className="btn-external-search"
                 onClick={() => handleNavigate(`/search?q=${encodeURIComponent(query)}`)}
               >
                 Search Everything (Web + Campus)
               </button>
             </div>
          )}

          {!query && (
            <div className="search-placeholder">
              <div className="placeholder-content">
                <Search size={48} className="fade-icon" />
                <p>Type to find clubs, events, or faculty members.</p>
                <div className="search-hints">
                  <span>Quick search:</span>
                  <code>/clubs</code>
                  <code>/events</code>
                  <code>Support</code>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search as SearchIcon, Loader2, Globe, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Search.css';

const GOOGLE_CSE_CX = '03ba70a97049b46f6';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cseReady, setCseReady] = useState(false);
  const cseContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  // Google CSE Initialization
  useEffect(() => {
    const scriptId = 'google-cse-script';

    // Set the callback BEFORE loading the script
    window.__gcse = window.__gcse || {};
    window.__gcse.parsetags = 'explicit';
    window.__gcse.callback = () => {
      setCseReady(true);
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://cse.google.com/cse.js?cx=${GOOGLE_CSE_CX}`;
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Script already loaded from previous mount
      if (window.google?.search?.cse) setCseReady(true);
    }

    return () => {
      // Cleanup: reset callback
      if (window.__gcse) window.__gcse.callback = null;
    };
  }, []);

  // Render CSE element when ready
  useEffect(() => {
    if (cseReady && cseContainerRef.current) {
      // Clear previous content
      cseContainerRef.current.innerHTML = '';

      // Create the search element
      const div = document.createElement('div');
      div.className = 'gcse-searchresults-only';
      div.setAttribute('data-queryParameterName', 'q');
      cseContainerRef.current.appendChild(div);

      // Render the CSE element
      if (window.google?.search?.cse?.element) {
        window.google.search.cse.element.render({
          div: div,
          tag: 'searchresults-only',
        });
      }
    }
  }, [cseReady]);

  // Execute CSE search when query changes
  const executeCseSearch = useCallback((query) => {
    if (!cseReady || !query) return;

    // Method 1: Use element API
    try {
      const element = window.google?.search?.cse?.element?.getElement('searchresults-only0')
        || window.google?.search?.cse?.element?.getAllElements()?.searchresults?.[0];

      if (element) {
        element.execute(query);
        return;
      }
    } catch (e) {
      // fallback below
    }

    // Method 2: Re-render with query
    if (cseContainerRef.current) {
      cseContainerRef.current.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'gcse-searchresults-only';
      div.setAttribute('data-as_q', query);
      cseContainerRef.current.appendChild(div);
      if (window.google?.search?.cse?.element) {
        window.google.search.cse.element.go(cseContainerRef.current);
      }
    }
  }, [cseReady]);

  const performSearch = (query) => {
    if (!query || query.trim().length < 2) return;
    executeCseSearch(query);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="page-container search-page">
      <section className="unified-search-header">
        <div className="header-bg"></div>
        <div className="header-content">
          <h1>What can we help you find?</h1>
          <form className="unified-search-bar" onSubmit={handleSubmit}>
            <SearchIcon size={22} className="bar-icon" />
            <input
              type="text"
              placeholder="Search the web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="unified-search-input"
            />
            <button type="submit" id="unified-search-btn">
              Search
            </button>
          </form>
          <div className="search-mode-indicator">
            <Globe size={14} /> Google Custom Search Engine
          </div>
        </div>
      </section>

      <div className="web-results-container" style={{ maxWidth: '1000px', margin: '0 auto 3rem' }}>
        {/* Google CSE Web Results */}
        <main className="web-results-main" style={{ minHeight: '60vh' }}>
          <div className="web-results-header">
            <Globe size={18} />
            <h3>Web & External Resources</h3>
            <a
              href={`https://cse.google.com/cse?cx=${GOOGLE_CSE_CX}#gsc.q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cse-external-link"
              title="Open in Google Custom Search"
            >
              <ExternalLink size={14} /> Open in Google
            </a>
          </div>
          <div className="search-container integrated" id="google-cse-container" ref={cseContainerRef}>
            {!cseReady && (
              <div className="cse-loading">
                <Loader2 size={24} className="animate-spin" />
                <p>Loading Google Search Engine...</p>
              </div>
            )}
          </div>
          {cseReady && !searchQuery && (
            <div className="cse-placeholder">
              <Globe size={48} className="fade-icon" />
              <p>Enter a search query to find web results from your college network</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;

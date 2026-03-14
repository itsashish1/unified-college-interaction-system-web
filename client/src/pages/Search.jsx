import React, { useEffect } from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import './Search.css';

const Search = () => {
  useEffect(() => {
    const cx = '03ba70a97049b46f6';
    
    // Clean up previous Google Custom Search instances to prevent React routing issues
    const container = document.getElementById('google-cse-container');
    if (container) {
      container.innerHTML = '<div class="gcse-search"></div>';
    }

    const scriptId = 'google-cse-script';
    let existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.remove(); // Force reload script on navigation for fresh parse
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://cse.google.com/cse.js?cx=${cx}`;
    script.async = true;
    
    // Slight delay to ensure React has fully painted the DOM before parsing
    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.search && window.google.search.cse) {
          window.google.search.cse.element.go();
        }
      }, 300);
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <h1>What are you looking for?</h1>
          <p>Search across academic resources, campus events, clubs, and college directories instantly.</p>
        </div>
      </section>
      
      <div className="search-layout">
        <div className="search-main">
          <div className="search-container" id="google-cse-container">
            {/* The Google Custom Search widget will render inside this div */}
            <div className="gcse-search"></div>
          </div>
        </div>

        <aside className="search-sidebar">
          <div className="search-tips-card">
            <h3><Lightbulb size={20} /> Search Tips</h3>
            <ul>
              <li>Use <strong>"quotes"</strong> for exact matches (e.g., "Tech Fest 2026")</li>
              <li>Type <strong>ext:pdf</strong> to find only document files</li>
              <li>Include <strong>department codes</strong> (e.g., CSE, MECH) for specific faculty</li>
              <li>Use <strong>OR</strong> to combine searches (e.g., Event OR Workshop)</li>
            </ul>
          </div>
          
          <div className="search-tips-card">
            <h3><TrendingUp size={20} /> Popular Topics</h3>
            <div className="popular-tags">
              <span className="tag">Tech Fest 2026</span>
              <span className="tag">Hostel Guidelines</span>
              <span className="tag">Previous Year Papers</span>
              <span className="tag">Library Timings</span>
              <span className="tag">Placement Cell</span>
              <span className="tag">Academic Calendar</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Search;

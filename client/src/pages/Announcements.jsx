import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Bell, Calendar, User, AlertCircle, Pin } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/announcements', { params: category ? { category } : {} })
      .then(({ data }) => setAnnouncements(data))
      .catch(() => toast.error('Failed to load announcements'))
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ['academic', 'exam', 'event', 'holiday', 'placement', 'general'];
  
  // Custom styling mappings
  const priorityMap = {
    low: { color: '#64748b', bg: '#f1f5f9', icon: <Bell size={16} /> },
    medium: { color: '#2563eb', bg: '#eff6ff', icon: <Bell size={16} /> },
    high: { color: '#ea580c', bg: '#fff7ed', icon: <AlertCircle size={16} /> },
    urgent: { color: '#dc2626', bg: '#fef2f2', icon: <AlertCircle size={16} /> }
  };

  return (
    <div className="page-container">
      <div className="module-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
        <h1>Notice Board</h1>
        <p>Stay updated with the latest college announcements, schedules, and important alerts.</p>
      </div>

      <div className="filter-section" style={{ marginBottom: '2rem' }}>
        <div className="filter-pills">
          <button className={`filter-pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>All Notices</button>
          {categories.map((c) => (
            <button key={c} className={`filter-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading notices...</p>
        </div>
      ) : (
        <div className="list-layout">
          {announcements.map((ann) => {
            const pStyle = priorityMap[ann.priority] || priorityMap.low;
            
            return (
              <div key={ann._id} className="list-card" style={{ 
                borderLeft: ann.isPinned ? '4px solid #eab308' : `4px solid ${pStyle.color}`,
                backgroundColor: ann.isPinned ? '#fefce8' : 'var(--surface)'
              }}>
                <div className="list-card-content flex-1">
                  <h3 style={{ color: 'var(--text)' }}>
                    {ann.isPinned && <Pin size={18} color="#eab308" style={{ transform: 'rotate(45deg)' }}/>}
                    {ann.title}
                  </h3>
                  <p className="list-card-snippet" style={{ color: 'var(--text)' }}>{ann.content}</p>
                  
                  <div className="list-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={16} /> By {ann.author?.name || 'Admin'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'capitalize' }}><Calendar size={16} /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                    <span className="badge" style={{ backgroundColor: '#e2e8f0', color: 'var(--text)' }}>{ann.category}</span>
                  </div>
                </div>
                
                <span className="badge" style={{ 
                  backgroundColor: pStyle.bg, 
                  color: pStyle.color, 
                  border: `1px solid ${pStyle.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem'
                }}>
                  {pStyle.icon} {ann.priority.toUpperCase()}
                </span>
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="empty-state">
              <h2>No announcements right now</h2>
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;

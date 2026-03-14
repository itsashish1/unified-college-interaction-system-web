import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Search, ChevronRight } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events', { params: status ? { status } : {} });
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [status]);

  const statuses = ['upcoming', 'ongoing', 'completed'];

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="module-hero">
        <h1>Campus Events</h1>
        <p>Register for tech fests, cultural nights, academic workshops, and more.</p>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search events by name or venue..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-pills">
          <button className={`filter-pill ${!status ? 'active' : ''}`} onClick={() => setStatus('')}>All Events</button>
          {statuses.map((s) => (
            <button key={s} className={`filter-pill ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="module-card event-card">
              <div className={`card-banner bg-gradient-${event.status}`}>
                <span className="card-category badge">{event.status}</span>
                <div className="card-date-float">
                  <strong>{new Date(event.startDate).getDate()}</strong>
                  <span>{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                </div>
              </div>
              <div className="card-body">
                <h3>{event.title}</h3>
                <p className="card-desc">{event.description?.slice(0, 100)}...</p>
                
                <div className="card-metadata-col">
                  <span className="meta-item"><MapPin size={16} /> {event.venue}</span>
                  <span className="meta-item"><Calendar size={16} /> {new Date(event.startDate).toLocaleDateString()}</span>
                  <span className="meta-item"><Users size={16} /> {event.registeredParticipants?.length || 0} Registered</span>
                </div>
                
                <div className="card-actions-bottom">
                  <Link to={`/events/${event._id}`} className="btn-primary flex-1">
                    View Details & Register <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <h2>No events found</h2>
              <p>Try adjusting your search criteria or status filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;

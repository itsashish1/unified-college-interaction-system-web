import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, BookOpen, Search } from 'lucide-react';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty').then(({ data }) => {
      setFaculty(data);
      const depts = [...new Set(data.map((f) => f.department).filter(Boolean))];
      setDepartments(depts);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load faculty');
      setLoading(false);
    });
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faculty', { params: { search: search || undefined, department: department || undefined } });
      setFaculty(data);
    } catch {
      toast.error('Failed to filter faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, [search, department]);

  return (
    <div className="page-container">
      <div className="module-hero">
        <h1>Faculty Directory</h1>
        <p>Connect with professors, find office hours, and explore academic departments.</p>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            placeholder="Search faculty by name or subject..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input" 
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${!department ? 'active' : ''}`} onClick={() => setDepartment('')}>All Departments</button>
          {departments.map((d) => (
            <button key={d} className={`filter-pill ${department === d ? 'active' : ''}`} onClick={() => setDepartment(d)}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading directory...</p>
        </div>
      ) : (
        <div className="card-grid">
          {faculty.map((f) => (
            <div key={f._id} className="module-card">
              <div className="card-body" style={{ borderTop: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.4rem' }}>{f.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.25rem' }}>{f.designation}</p>
                <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem', backgroundColor: '#e2e8f0', color: 'var(--text)' }}>
                  {f.department}
                </span>

                <div className="faculty-meta-grid">
                  <div className="faculty-meta-item">
                    <Mail size={16} /> <a href={`mailto:${f.email}`}>{f.email?.split('@')[0]}</a>
                  </div>
                  {f.phone && (
                    <div className="faculty-meta-item">
                      <Phone size={16} /> <span>{f.phone}</span>
                    </div>
                  )}
                  {f.cabin && (
                    <div className="faculty-meta-item">
                      <MapPin size={16} /> <span>{f.cabin}</span>
                    </div>
                  )}
                  {f.officeHours && (
                    <div className="faculty-meta-item">
                      <Clock size={16} /> <span>{f.officeHours}</span>
                    </div>
                  )}
                </div>

                {f.subjects?.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <BookOpen size={16} /> <strong>Teaching Subjects</strong>
                    </div>
                    <div className="popular-tags">
                      {f.subjects.map(sub => (
                        <span key={sub} className="tag" style={{ background: 'transparent', padding: '0.2rem 0.5rem' }}>{sub}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {faculty.length === 0 && (
            <div className="empty-state">
              <h2>No faculty found</h2>
              <p>Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Faculty;

import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Building2, Search, Briefcase, MapPin, IndianRupee, ExternalLink } from 'lucide-react';

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const fetchPlacements = async () => {
    try {
      const { data } = await api.get('/placements', { params: type ? { type } : {} });
      setPlacements(data);
    } catch { toast.error('Failed to load opportunities'); }
    finally { setLoading(false); }
  };

  const handleApply = async (jobId, applyUrl) => {
    try {
      await api.post(`/placements/${jobId}/apply`);
      setPlacements(placements.map(p => 
        p._id === jobId ? { ...p, applicants: [...(p.applicants || []), user?._id] } : p
      ));
      toast.success('Successfully applied!');
      window.open(applyUrl, '_blank');
    } catch (err) {
      if (err.response?.status === 400) {
         window.open(applyUrl, '_blank');
      } else {
         toast.error(err.response?.data?.message || 'Failed to apply');
      }
    }
  };

  useEffect(() => { fetchPlacements(); }, [type]);

  const categories = ['internship', 'full-time', 'part-time'];

  const filteredPlacements = placements.filter(job => 
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container animate-in">

      <div className="module-hero" style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.2) 0%, rgba(20,184,166,0.2) 100%)' }}>
        <h1>Career & Placements</h1>
        <p>Discover internships, full-time roles, and placement drives hosted by leading companies.</p>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by company, role, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-pills">
          <button className={`filter-pill ${!type ? 'active' : ''}`} onClick={() => setType('')}>All Opportunities</button>
          {categories.map((c) => (
            <button key={c} className={`filter-pill ${type === c ? 'active' : ''}`} onClick={() => setType(c)}>
              {c === 'full-time' ? 'Full-Time' : c === 'part-time' ? 'Part-Time' : 'Internships'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading opportunities...</p>
        </div>
      ) : (
        <div className="card-grid staggered-entry">

          {filteredPlacements.map((job) => (
            <div key={job._id} className="module-card">
              <div className="card-banner" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
                <span className="card-category" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{job.type.toUpperCase()}</span>
              </div>
              <div className="card-body">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={20} color="var(--primary)" />
                    {job.company}
                </h3>
                <h4 style={{ color: 'var(--text-color)', marginBottom: '8px', fontSize: '1.1rem' }}>{job.role}</h4>
                <p className="card-desc">{job.description?.slice(0, 100)}...</p>
                
                <div className="placement-metadata-grid">
                  <span className="meta-item"><MapPin size={16} /> {job.location}</span>
                  <span className="meta-item"><IndianRupee size={16} /> {job.packageStipend}</span>
                  <span className="meta-item" style={{ gridColumn: '1 / -1' }}><Briefcase size={16} /> {job.eligibility}</span>
                </div>
                
                <div className="card-actions" style={{ marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleApply(job._id, job.applyUrl)} 
                    className={`btn-primary flex-1 ${job.applicants?.includes(user?._id) ? 'btn-success' : ''}`}
                    style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', width: '100%', padding: '0.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold' 
                    }}
                  >
                    {job.applicants?.includes(user?._id) ? 'Applied' : 'Apply Now'} <ExternalLink size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredPlacements.length === 0 && (
            <div className="empty-state">
              <h2>No opportunities found</h2>
              <p>Try adjusting your search criteria or checking back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Placements;

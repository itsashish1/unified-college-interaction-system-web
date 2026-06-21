import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Download, 
  Trash2, 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  User as UserIcon, 
  Upload, 
  X, 
  FileCode,
  Layers,
  HardDrive
} from 'lucide-react';
import './Resources.css';

const DEPARTMENTS = [
  'School of Engineering & Technology',
  'School of Management',
  'School of Law',
  'School of Medical & Allied Sciences',
  'School of Basic & Applied Sciences',
  'School of Emerging Media & Creator Economy',
  'CSE',
  'ECE',
  'MECH',
  'IT'
];

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    department: DEPARTMENTS[0],
    file: null
  });

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
  }, [searchParams]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: search || undefined,
        department: department || undefined
      };
      const { data } = await api.get('/resources', { params });
      setResources(data.data || data.docs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load study resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, department, page]);

  const handleDownload = (resourceId) => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${apiBase}/resources/${resourceId}/download`, '_blank');
    
    // Optimistically increment local downloads count
    setResources(prev => 
      prev.map(r => r._id === resourceId ? { ...r, downloadsCount: r.downloadsCount + 1 } : r)
    );
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this study resource? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/resources/${resourceId}`);
      toast.success('Resource deleted successfully');
      setResources(prev => prev.filter(r => r._id !== resourceId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      toast.error('Invalid file type. Only PDFs, Word docs, PPTs, and Images are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit.');
      return;
    }

    setForm(prev => ({ ...prev, file }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('subject', form.subject);
    formData.append('department', form.department);
    formData.append('file', form.file);

    try {
      await api.post('/resources', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Study resource uploaded successfully!');
      setShowUploadModal(false);
      setForm({
        title: '',
        description: '',
        subject: '',
        department: DEPARTMENTS[0],
        file: null
      });
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload resource');
    } finally {
      setUploadLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="page-container animate-in">
      {/* Hero Section */}
      <div className="module-hero" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #0369a1 100%)' }}>
        <h1>Study Resource Hub</h1>
        <p>Access notes, lecture slides, research materials, and previous year questions shared by faculty and classmates.</p>
        {user && (
          <button onClick={() => setShowUploadModal(true)} className="btn-primary" style={{ marginTop: '1.5rem', background: '#fff', color: '#1e3a8a', fontWeight: '600' }}>
            <Plus size={18} /> Share Resource
          </button>
        )}
      </div>

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            placeholder="Search resources by title, description or subject..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input" 
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${!department ? 'active' : ''}`} onClick={() => setDepartment('')}>All Departments</button>
          {DEPARTMENTS.slice(0, 6).map((d) => (
            <button key={d} className={`filter-pill ${department === d ? 'active' : ''}`} onClick={() => setDepartment(d)}>
              {d.replace('School of ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Card Grid */}
      {loading ? (
        <div className="loading-screen" style={{ minHeight: '30vh' }}>
          <div className="loading-spinner"></div>
          <p>Loading shared materials...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} className="file-dropzone-icon" />
          <h3>No Study Resources Found</h3>
          <p>Be the first to upload lecture notes or exam preparation guides for this category.</p>
          {user && (
            <button onClick={() => setShowUploadModal(true)} className="btn-primary" style={{ marginTop: '1.5rem' }}>
              Upload Resource
            </button>
          )}
        </div>
      ) : (
        <div className="resources-grid staggered-entry">
          {resources.map((resource) => {
            const isOwner = user && resource.uploadedBy && resource.uploadedBy._id === user._id;
            const isAdmin = user && user.role === 'admin';
            
            return (
              <div key={resource._id} className="resource-card">
                <div className="resource-header">
                  <div className="resource-icon-wrapper">
                    <FileText size={24} />
                  </div>
                  <div className="resource-title-section">
                    <h3 className="resource-title" title={resource.title}>{resource.title}</h3>
                    <div className="resource-subject">{resource.subject}</div>
                  </div>
                </div>
                
                {resource.description && (
                  <p className="resource-desc" title={resource.description}>{resource.description}</p>
                )}
                
                <div className="resource-tags">
                  <span className="resource-tag dept-tag">{resource.department}</span>
                  <span className="resource-tag">{resource.fileType.toUpperCase()}</span>
                </div>
                
                <div className="resource-meta">
                  <div className="resource-meta-row">
                    <span><UserIcon size={14} /> Shared by {resource.uploadedBy?.name || 'Anonymous'} ({resource.uploadedBy?.role || 'User'})</span>
                  </div>
                  <div className="resource-meta-row" style={{ justifyContent: 'space-between' }}>
                    <span><Calendar size={14} /> {new Date(resource.createdAt).toLocaleDateString()}</span>
                    <span><HardDrive size={14} /> {formatBytes(resource.fileSize)}</span>
                  </div>
                  <div className="resource-meta-row" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    <span><Download size={14} /> {resource.downloadsCount} downloads</span>
                  </div>
                </div>
                
                <div className="resource-actions">
                  <button onClick={() => handleDownload(resource._id)} className="btn-download">
                    <Download size={16} /> Download
                  </button>
                  {(isOwner || isAdmin) && (
                    <button 
                      onClick={() => handleDelete(resource._id)} 
                      className="btn-delete-icon" 
                      title="Delete Study Resource"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="filter-pill"
            style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', px: '1rem', fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="filter-pill"
            style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Share/Upload Modal Overlay */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Share Study Resource</h2>
              <button className="btn-close-modal" onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="res-title">Resource Title *</label>
                  <input 
                    id="res-title"
                    className="form-control"
                    placeholder="e.g. Artificial Intelligence Lecture 1 Notes" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="res-desc">Description</label>
                  <textarea 
                    id="res-desc"
                    className="form-control"
                    placeholder="Brief description of what is included (syllabus topics, format, etc.)" 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="res-subj">Subject *</label>
                    <input 
                      id="res-subj"
                      className="form-control"
                      placeholder="e.g. Operating Systems" 
                      value={form.subject} 
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="res-dept">Department *</label>
                    <select 
                      id="res-dept"
                      className="form-control"
                      value={form.department} 
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      required
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Document File * (Max 10MB)</label>
                  <div 
                    className={`file-dropzone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                  >
                    <Upload size={32} className="file-dropzone-icon" />
                    <p>Drag and drop your file here, or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse</span></p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
                    </span>
                    
                    {form.file && (
                      <div className="file-name-preview" style={{ marginTop: '0.5rem' }}>
                        Selected: {form.file.name} ({formatBytes(form.file.size)})
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploadLoading}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={uploadLoading}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius)', background: 'var(--primary)', color: 'white' }}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload & Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;

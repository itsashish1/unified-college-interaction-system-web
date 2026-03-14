import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PlusCircle, MessageSquare, Clock, Tag } from 'lucide-react';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', priority: 'medium' });
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/support');
      setTickets(data);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', form);
      toast.success('Ticket raised successfully!');
      setShowForm(false);
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
      fetchTickets();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit ticket'); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/support/${selected._id}/reply`, { message: reply });
      toast.success('Reply sent!');
      setReply('');
      const { data } = await api.get(`/support/${selected._id}`);
      setSelected(data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send reply'); }
  };

  const statusColor = { 
    open: { bg: '#fee2e2', text: '#ef4444' }, 
    in_progress: { bg: '#fef3c7', text: '#f59e0b' }, 
    resolved: { bg: '#dcfce7', text: '#10b981' }, 
    closed: { bg: '#f1f5f9', text: '#64748b' } 
  };

  return (
    <div className="page-container">
      <div className="module-hero">
        <h1>Help & Support</h1>
        <p>Raise tickets for IT issues, campus registration, or general queries.</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ marginTop: '1.5rem', background: '#fff', color: 'var(--primary)', fontWeight: '600' }}>
          {showForm ? 'Cancel Ticket' : <><PlusCircle size={18} /> New Ticket</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="list-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{color: 'var(--primary)', marginBottom: '1rem'}}>Create Support Request</h3>
          
          <input 
            placeholder="Subject summary (e.g. Can't access LMS)" 
            value={form.subject} 
            onChange={(e) => setForm({ ...form, subject: e.target.value })} 
            required 
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
          />
          
          <textarea 
            placeholder="Describe the issue in detail..." 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            required 
            rows="5"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical'}}
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
              >
                {['technical', 'academic', 'registration', 'account', 'other'].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Priority</label>
              <select 
                value={form.priority} 
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
              >
                {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn-primary">Submit Ticket</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading your tickets...</p>
        </div>
      ) : (
        <div className="list-layout">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Your Tickets</h2>
          {tickets.map((t) => {
            const statusStyle = statusColor[t.status] || statusColor.closed;
            
            return (
              <div key={t._id} className="list-card" onClick={() => setSelected(t)} style={{ cursor: 'pointer' }}>
                <div className="list-card-content flex-1">
                  <h3 style={{ color: 'var(--text)', marginBottom: '0.75rem' }}>{t.subject}</h3>
                  <div className="list-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'capitalize' }}><Tag size={16} /> {t.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={16} /> {new Date(t.createdAt).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={16} /> {t.replies?.length || 0} Replies</span>
                  </div>
                </div>
                
                <span className="badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            );
          })}
          {tickets.length === 0 && (
            <div className="empty-state">
              <h2>No support tickets yet</h2>
              <p>Experiencing issues? Create a new ticket to get help.</p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', flex: 1, paddingRight: '1rem' }}>{selected.subject}</h2>
              <span className="badge" style={{ backgroundColor: (statusColor[selected.status] || statusColor.closed).bg, color: (statusColor[selected.status] || statusColor.closed).text, whiteSpace: 'nowrap' }}>
                {selected.status.replace('_', ' ')}
              </span>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{selected.description}</p>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> Discussion ({selected.replies?.length || 0})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {selected.replies?.map((r, i) => (
                <div key={i} style={{ 
                  background: r.isAdminReply ? '#eff6ff' : '#f1f5f9', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius)',
                  borderLeft: r.isAdminReply ? '4px solid #3b82f6' : '4px solid #94a3b8',
                  alignSelf: r.isAdminReply ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: r.isAdminReply ? '#2563eb' : '#64748b', marginBottom: '0.25rem' }}>
                    {r.isAdminReply ? 'Support Staff' : 'You'}
                  </strong>
                  <p style={{ margin: 0 }}>{r.message}</p>
                </div>
              ))}
              {(!selected.replies || selected.replies.length === 0) && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem' }}>No replies yet. Staff will respond shortly.</p>
              )}
            </div>
            
            {selected.status !== 'closed' && selected.status !== 'resolved' && (
              <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea 
                  placeholder="Type your reply here..." 
                  value={reply} 
                  onChange={(e) => setReply(e.target.value)} 
                  required 
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Close</button>
                  <button type="submit" className="btn-primary">Send Message</button>
                </div>
              </form>
            )}
            
            {(selected.status === 'closed' || selected.status === 'resolved') && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;

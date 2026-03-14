import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user.name, department: user.department, year: user.year, enrollmentNo: user.enrollmentNo });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-card">
        {['name', 'department', 'year', 'enrollmentNo'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
            <input value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </div>
        ))}
        <button type="submit" className="btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;

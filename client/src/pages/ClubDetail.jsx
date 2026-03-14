import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClubDetail = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);

  useEffect(() => {
    api.get(`/clubs/${id}`).then((r) => setClub(r.data)).catch(() => toast.error('Club not found'));
  }, [id]);

  if (!club) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container detail-page">
      <h1>{club.name}</h1>
      <span className="badge">{club.category}</span>
      <p className="description">{club.description}</p>
      {club.coordinator && (
        <p><strong>Coordinator:</strong> {club.coordinator.name} ({club.coordinator.email})</p>
      )}
      <p><strong>Members:</strong> {club.members?.length || 0}</p>
      {club.socialLinks?.instagram && <p><strong>Instagram:</strong> {club.socialLinks.instagram}</p>}
      {club.socialLinks?.email && <p><strong>Contact:</strong> {club.socialLinks.email}</p>}
    </div>
  );
};

export default ClubDetail;

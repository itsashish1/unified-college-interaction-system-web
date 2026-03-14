import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);

  const fetchEvent = async () => {
    const { data } = await api.get(`/events/${id}`);
    setEvent(data);
    if (user) setRegistered(data.registeredParticipants?.some((p) => p._id === user._id));
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleRegister = async () => {
    try {
      await api.post(`/events/${id}/register`);
      toast.success('Registered successfully!');
      fetchEvent();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  const handleUnregister = async () => {
    try {
      await api.post(`/events/${id}/unregister`);
      toast.success('Unregistered');
      fetchEvent();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (!event) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container detail-page">
      <h1>{event.title}</h1>
      <span className={`badge badge-${event.status}`}>{event.status}</span>
      <p className="description">{event.description}</p>
      <div className="detail-info">
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Start:</strong> {new Date(event.startDate).toLocaleString()}</p>
        <p><strong>End:</strong> {new Date(event.endDate).toLocaleString()}</p>
        {event.registrationDeadline && <p><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleString()}</p>}
        <p><strong>Participants:</strong> {event.registeredParticipants?.length || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''}</p>
        <p><strong>Organizer:</strong> {event.organizer?.name}</p>
      </div>
      {user && event.status === 'upcoming' && (
        registered
          ? <button onClick={handleUnregister} className="btn-secondary">Unregister</button>
          : <button onClick={handleRegister} className="btn-primary">Register for this Event</button>
      )}
    </div>
  );
};

export default EventDetail;

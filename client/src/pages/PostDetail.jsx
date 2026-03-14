import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const { user } = useAuth();

  const fetchPost = async () => {
    const { data } = await api.get(`/forum/${id}`);
    setPost(data);
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/forum/${id}/reply`, { content: reply });
      toast.success('Reply added!');
      setReply('');
      fetchPost();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleUpvote = async () => {
    try {
      await api.post(`/forum/${id}/upvote`);
      fetchPost();
    } catch { toast.error('Login to upvote'); }
  };

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container detail-page">
      <h1>{post.title}</h1>
      <p className="meta">by {post.author?.name} · {post.views} views · <span className="badge">{post.category}</span></p>
      <div className="post-content">{post.content}</div>
      <button onClick={handleUpvote} className="btn-secondary">{post.upvotes?.length || 0} Upvotes</button>

      <h2>Replies ({post.replies?.length || 0})</h2>
      <div className="reply-list">
        {post.replies?.map((r) => (
          <div key={r._id} className="reply-item">
            <p className="meta"><strong>{r.author?.name}</strong> · {new Date(r.createdAt).toLocaleDateString()}</p>
            <p>{r.content}</p>
          </div>
        ))}
      </div>

      {user && !post.isClosed && (
        <form onSubmit={handleReply} className="inline-form">
          <textarea placeholder="Write your reply..." value={reply} onChange={(e) => setReply(e.target.value)} required />
          <button type="submit" className="btn-primary">Submit Reply</button>
        </form>
      )}
    </div>
  );
};

export default PostDetail;

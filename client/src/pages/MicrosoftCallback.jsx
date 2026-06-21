import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const MicrosoftCallback = () => {
  const [searchParams] = useSearchParams();
  const { loginWithMicrosoft } = useAuth();
  const navigate = useNavigate();
  const effectRan = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (effectRan.current) return;
    effectRan.current = true;

    const code = searchParams.get('code');
    if (!code) {
      toast.error('No authorization code found');
      navigate('/login');
      return;
    }

    const processLogin = async () => {
      try {
        const redirectUri = window.location.origin + '/auth/microsoft/callback';
        await loginWithMicrosoft(code, redirectUri);
        toast.success('Successfully logged in with Microsoft!', { icon: '🔑' });
        navigate('/');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Microsoft authentication failed');
        navigate('/login');
      }
    };

    processLogin();
  }, [searchParams, loginWithMicrosoft, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 72px)',
      background: 'radial-gradient(circle at top right, #f1f5f9 0%, #e2e8f0 100%)',
      color: 'var(--primary)'
    }}>
      <div className="auth-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Loader2 className="loading-spinner" size={48} style={{ color: 'var(--primary-light)' }} />
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Authenticating with Microsoft</h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>Please wait while we set up your session...</p>
      </div>
    </div>
  );
};

export default MicrosoftCallback;

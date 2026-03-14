import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container" style={{ textAlign: 'center', paddingTop: '80px' }}>
    <h1 style={{ fontSize: '4rem' }}>404</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFound;

import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      <aside className="admin-sidebar glass" style={{ width: '280px', padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border)', borderRadius: '0' }}>
        <div className="nav-logo" style={{ marginBottom: '40px' }}>
           <span>Admin</span> Dashboard
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="/admin" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', background: 'rgba(193,127,69,0.1)', color: 'var(--color-accent)' }}>
            <i className="fas fa-images"></i> Portfolio Manager
          </a>
        </nav>
        
        <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: 'auto' }}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </aside>

      <main className="admin-content" style={{ flex: 1, padding: '40px', overflowY: 'auto', height: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

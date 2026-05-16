import { useState } from 'react';
import { Navigate, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="admin-header-mobile">
        <div className="nav-logo">
          <span>Alpha</span>Energy
        </div>
        <button className="hamburger active" onClick={toggleSidebar} style={{ display: 'flex', background: 'none', border: 'none', padding: '10px' }}>
          <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar glass ${isSidebarOpen ? 'open' : ''}`}>
        <div className="nav-logo" style={{ marginBottom: '40px' }}>
           <span>Admin</span> Dashboard
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link 
            to="/admin" 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', border: 'none', background: 'rgba(193,127,69,0.1)', color: 'var(--color-accent)' }}
            onClick={closeSidebar}
          >
            <i className="fas fa-images" style={{ width: '20px' }}></i> Portfolio Manager
          </Link>
          <Link 
            to="/admin/testimonials" 
            className="btn btn-outline" 
            style={{ justifyContent: 'flex-start', border: 'none', background: 'rgba(193,127,69,0.1)', color: 'var(--color-accent)' }}
            onClick={closeSidebar}
          >
            <i className="fas fa-comment-dots" style={{ width: '20px' }}></i> Testimonials
          </Link>
        </nav>
        
        <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: 'auto' }}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

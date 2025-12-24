import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, redirectToDashboard } = useRoleBasedAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (profile) {
      redirectToDashboard();
    }
  }, [user, profile, loading, navigate, redirectToDashboard]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Dashboard;

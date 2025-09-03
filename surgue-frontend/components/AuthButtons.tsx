import { useAuthStore } from '../stores/useAuthStore';
import { logout } from '../lib/api';

const AuthButtons = () => {
  const { isAuthenticated, user, isLoading, setUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (isLoading) {
    return <div className="h-10 w-32 bg-gray-700 rounded-md animate-pulse"></div>;
  }
  
  const googleLoginUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;

  return (
    <div className="absolute top-4 right-4">
      {isAuthenticated && user ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.display_name}!</span>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      ) : (
        <a href={googleLoginUrl} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Sign in with Google
        </a>
      )}
    </div>
  );
};

export default AuthButtons;
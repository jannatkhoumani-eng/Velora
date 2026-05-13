import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user session
    const savedUser = localStorage.getItem('velora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('velora_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    
    // Create a simple user ID from the name (lowercase, no spaces)
    const userId = trimmed.toLowerCase().replace(/\s+/g, '_');
    const userData = {
      name: trimmed,
      userId: userId,
      initial: trimmed.charAt(0).toUpperCase(),
      joinedAt: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('velora_user', JSON.stringify(userData));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('velora_user');
    sessionStorage.removeItem('velora_splash_seen');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

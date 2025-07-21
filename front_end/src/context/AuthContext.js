import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load từ EncryptedStorage khi app khởi động
    (async () => {
      try {
        const stored = await EncryptedStorage.getItem('auth');
        if (stored) {
          const { role, userId, token } = JSON.parse(stored);
          setRole(role);
          setUserId(userId);
          setToken(token);
        }
      } catch (e) { 
        Alert.alert('Error', 'Failed to load authentication data.');
      }
      setLoading(false);
    })();
  }, []);

  // Lưu cả token khi login
  const login = async (role, userId, token) => {
    setRole(role);
    setUserId(userId);
    setToken(token);
    await EncryptedStorage.setItem('auth', JSON.stringify({ role, userId, token }));
  };

  const logout = async () => {
    setRole(null);
    setUserId(null);
    setToken(null);
    await EncryptedStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ role, userId, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
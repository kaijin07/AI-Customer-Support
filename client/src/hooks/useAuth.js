import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, signup, googleLogin as googleLoginThunk, logout, getMe, reset } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isInitialized } = useSelector((state) => state.auth);

  const handleSignup = useCallback((userData) => dispatch(signup(userData)), [dispatch]);
  const handleLogin = useCallback((credentials) => dispatch(login(credentials)), [dispatch]);
  const handleGoogleLogin = useCallback((idToken, businessName) => dispatch(googleLoginThunk({ idToken, businessName })), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const handleGetMe = useCallback(() => dispatch(getMe()), [dispatch]);
  const handleReset = useCallback(() => dispatch(reset()), [dispatch]);

  return {
    user,
    loading,
    error,
    isInitialized,
    signup: handleSignup,
    login: handleLogin,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    getMe: handleGetMe,
    reset: handleReset,
  };
};

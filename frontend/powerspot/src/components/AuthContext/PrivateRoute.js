import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { currentUser, isFirstLogin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (isFirstLogin) {
    return <Navigate to="/profile-setup" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;

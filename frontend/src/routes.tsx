import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Transactions from './pages/Transactions.tsx';
import Login from './pages/Login.tsx';
import Landing from './pages/Landing.tsx';
import Signup from './pages/Signup.tsx';
import Reports from './pages/Reports.tsx'
import Settings from './pages/Settings.tsx';
import About from './pages/About.tsx';
import { useAuth } from './contexts/AuthContext.tsx';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      <Route 
        path="/transactions" 
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } 
      />
            
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } 
      />            
      
      <Route 
        path="/about" 
        element={
          <PrivateRoute>
            <About />
          </PrivateRoute>
        } 
      />

      <Route path="/" element={<Landing />} />
    
    </Routes>
  );
};

export default AppRoutes; 
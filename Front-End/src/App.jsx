// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIPlanner from './pages/AIPlanner';
import Recommendations from './pages/Recommendations';
import Expenses from './pages/Expenses';
import Profile from './pages/Profile';
import Emergency from './pages/Emergency';
import InteractiveMap from './pages/Map';
import { useAuthStore } from './store/useAuthStore';



const Protected = ({ children }) => {
  const auth = useAuthStore(state => state.isAuthenticated);
  return auth ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<AIPlanner />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="map" element={<InteractiveMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
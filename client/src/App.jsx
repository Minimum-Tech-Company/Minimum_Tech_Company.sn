import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Realisations from './pages/Realisations';
import FutursProjets from './pages/FutursProjets';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFutureProjects from './pages/admin/AdminFutureProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminHero from './pages/admin/AdminHero';
import AdminCompany from './pages/admin/AdminCompany';
import AdminContact from './pages/admin/AdminContact';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="future-projects" element={<AdminFutureProjects />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="hero" element={<AdminHero />} />
            <Route path="company" element={<AdminCompany />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/realisations" element={<Realisations />} />
                <Route path="/futurs-projets" element={<FutursProjets />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

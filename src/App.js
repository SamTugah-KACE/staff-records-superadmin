import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import MultiStepForm from './components/MultiStepForm/MultiStepForm';
import AccountRecovery from './components/AccountRecovery';
import Header from './components/Dashboard/Header';
import ProfileHeader from './components/Dashboard/ProfileHeader';
import Sidebar from './components/Dashboard/Sidebar';
import Footer from './components/Dashboard/Footer';
import { OrganizationProvider } from './components/OrganizationContext'; 
import './App.css';
import SuperAdminLogin from './components/SuperAdmin';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const MainLayout = ({ children }) => (
    <div className="main-layout">
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="content-wrapper">
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={toggleSidebar} 
          isDarkMode={isDarkMode} 
        />
        <main className="main-content">
          <ProfileHeader 
            toggleDarkMode={toggleDarkMode} 
            isDarkMode={isDarkMode} 
          />
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <OrganizationProvider>
          <Routes>
            <Route path="/" element={
              
                <SuperAdminLogin />
            } />

            

            <Route path="/dashboard" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />

             <Route path="/organization-registration" element={
              <MainLayout>
                <MultiStepForm />
              </MainLayout>
            } />
            <Route path="/organizations" element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } />
            
            
           
            <Route path="/account-recovery" element={
              <MainLayout>
                <AccountRecovery />
              </MainLayout>
            } /> 
             <Route path="*" element={<Navigate to="/" replace />} />
          </Routes> 
        </OrganizationProvider>
      </div>
    </Router>
  );
}

export default App;
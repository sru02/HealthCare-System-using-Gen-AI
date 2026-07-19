import React, { useState, useEffect } from 'react';
import './App.css';
import SymptomChecker from './components/SymptomChecker';
import MentalHealthChat from './components/MentalHealthChat';
import ReportSummarizer from './components/ReportSummarizer';
import AppointmentBooking from './components/AppointmentBooking';
import MedicalRequirements from './components/MedicalRequirements';
import ConnectionStatus from './components/ConnectionStatus';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('symptoms');
  };

  const renderActiveComponent = () => {
    if (user?.email === 'admin@admin.com') {
      return <AdminDashboard />;
    }
    
    switch(activeTab) {
      case 'symptoms':
        return <SymptomChecker />;
      case 'mental-health':
        return <MentalHealthChat />;
      case 'reports':
        return <ReportSummarizer />;
      case 'appointments':
        return <AppointmentBooking user={user} />;
      case 'requirements':
        return <MedicalRequirements user={user} />;
      default:
        return <SymptomChecker />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <ConnectionStatus />
      <div className="header">
        <h1 className="heading-1">🏥 Real-time Healthcare Assistant</h1>
        <div className="user-header">
          <span className="text-gradient">Welcome, {user?.name || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      {user?.email !== 'admin@admin.com' && (
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'symptoms' ? 'active' : ''}`}
            onClick={() => setActiveTab('symptoms')}
          >
            Symptom Checker
          </button>
          <button 
            className={`tab ${activeTab === 'mental-health' ? 'active' : ''}`}
            onClick={() => setActiveTab('mental-health')}
          >
            AI Mood Companion
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Report Summarizer
          </button>
          <button 
            className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Book Appointment
          </button>
          <button 
            className={`tab ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            Medical Requirements
          </button>
        </div>
      )}

      <div className="container">
        <div className="glass-card">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default App;
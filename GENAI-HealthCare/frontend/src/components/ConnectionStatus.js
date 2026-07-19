import React, { useState, useEffect } from 'react';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/appointments/test@test.com');
        setIsConnected(response.ok || response.status === 404);
      } catch (error) {
        setIsConnected(false);
      }
      setChecking(false);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  if (checking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: isConnected ? '#28a745' : '#dc3545',
      zIndex: 1000
    }}>
      {isConnected ? '🟢 Backend Connected' : '🔴 Backend Offline'}
    </div>
  );
};

export default ConnectionStatus;
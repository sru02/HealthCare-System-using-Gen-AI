import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await fetch(`http://localhost:8080/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setMessage(result.response);
      
      if (result.success) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(result.data));
          onLogin(result.data);
        } else {
          setIsLogin(true);
          setFormData({ email: '', password: '', name: '' });
        }
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center" style={{minHeight: '100vh', padding: '2rem'}}>
      <div className="glass-card" style={{maxWidth: '400px', width: '100%'}}>
        <h2 className="heading-1 text-center">🏥 Healthcare System</h2>
        <h3 className="heading-3 text-center text-gradient">{isLogin ? 'Login' : 'Register'}</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
              required
            />
          )}
          <input
            type="email"
            placeholder="Gmail Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="form-input"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <div className="flex items-center justify-center gap-sm">
                <div className="loading-spinner" style={{width: '20px', height: '20px'}}></div>
                Please wait...
              </div>
            ) : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        <p className="text-center" style={{marginTop: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)'}} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="text-gradient">{isLogin ? 'Register' : 'Login'}</span>
        </p>
        
        {message && (
          <div className="glass-card" style={{
            marginTop: '1rem', 
            padding: '1rem', 
            background: message.includes('successful') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: message.includes('successful') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
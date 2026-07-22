import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const MentalHealthChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'sad', emoji: '😢', label: 'Sad' },
    { id: 'anxious', emoji: '😰', label: 'Anxious' },
    { id: 'stressed', emoji: '😤', label: 'Stressed' },
    { id: 'angry', emoji: '😠', label: 'Angry' },
    { id: 'confused', emoji: '🤔', label: 'Confused' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage = { 
      type: 'user', 
      content: currentMessage, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setCurrentMessage('');

    try {
      const result = await axios.post(`${API_BASE_URL}/api/mental-health/session`, {
        message: currentMessage,
        mood: mood,
        history: messages.map(m => ({ type: m.type, content: m.content }))
      });
      
      setTimeout(() => {
        const aiMessage = { 
          type: 'ai', 
          content: result.data.response, 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        const errorMessage = { 
          type: 'ai', 
          content: 'I apologize, but I encountered an error. Please try again.', 
          timestamp: new Date() 
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex gap-lg" style={{minHeight: '70vh'}}>
      <div className="glass-card" style={{minWidth: '280px', maxWidth: '300px'}}>
        <div style={{marginBottom: '2rem'}}>
          <h2 className="heading-2 text-gradient">Mood Companion</h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>AI therapy assistant</p>
        </div>
        
        <div>
          <h3 className="heading-3" style={{fontSize: '1rem', marginBottom: '0.75rem'}}>How are you feeling?</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem'}}>
            {moods.map((moodOption) => (
              <div
                key={moodOption.id}
                className={`glass-card ${mood === moodOption.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMood(moodOption.id)}
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition)',
                  background: mood === moodOption.id ? 'var(--gradient-primary)' : 'var(--glass-bg)'
                }}
              >
                <div style={{fontSize: '1.25rem', marginBottom: '0.2rem'}}>{moodOption.emoji}</div>
                <div style={{fontSize: '0.75rem'}}>{moodOption.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{flex: '1', display: 'flex', flexDirection: 'column'}}>
        <div className="flex items-center gap-md" style={{marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)'}}>
          <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gradient-primary)', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'}}></div>
          <div>
            <h3 className="heading-3 text-gradient">AI Mood Companion</h3>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Providing empathetic support & coping strategies</p>
          </div>
        </div>

        <div style={{flex: '1', overflowY: 'hidden', marginBottom: '1rem'}}>
          {messages.length === 0 && (
            <div className="glass-card" style={{textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
              <h3 className="heading-3 text-gradient">Welcome to your AI Mood Companion</h3>
              <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>
                I'm here to provide empathetic support and help you develop coping strategies. 
                Share how you're feeling, and I'll offer personalized comfort and actionable steps to improve your day.
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              {message.content}
            </div>
          ))}
          
          {loading && (
            <div className="chat-typing">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-sm">
            <textarea
              ref={inputRef}
              className="form-input"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me how you're feeling today..."
              disabled={loading}
              rows={2}
              style={{flex: '1', resize: 'none'}}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !currentMessage.trim()}
              style={{alignSelf: 'flex-end', padding: '0.75rem'}}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentalHealthChat;
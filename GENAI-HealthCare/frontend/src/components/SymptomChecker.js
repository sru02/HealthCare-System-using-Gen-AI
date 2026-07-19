import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const RiskGauge = ({ score }) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const angle = (clampedScore / 100) * 180 - 90;
  const color = clampedScore <= 30 ? '#22c55e' : clampedScore <= 60 ? '#f59e0b' : clampedScore <= 80 ? '#f97316' : '#ef4444';
  const label = clampedScore <= 30 ? 'Low Risk' : clampedScore <= 60 ? 'Moderate Risk' : clampedScore <= 80 ? 'High Risk' : 'Critical';

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Health Risk Score</h4>
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
        <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${(clampedScore / 100) * 220} 220`} />
        <g transform={`rotate(${angle}, 90, 90)`}>
          <line x1="90" y1="90" x2="90" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="90" cy="90" r="5" fill="white" />
        </g>
        <text x="90" y="78" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold">{clampedScore}</text>
      </svg>
      <div style={{ color, fontWeight: '600', fontSize: '1rem', marginTop: '-0.5rem' }}>{label}</div>
    </div>
  );
};

const SymptomChecker = () => {
  const [formData, setFormData] = useState({ symptoms: '', age: '', gender: '' });
  const [response, setResponse] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseRiskScore = (text) => {
    const match = text.match(/RISK SCORE:\s*(\d+)/i);
    return match ? parseInt(match[1]) : null;
  };

  const parseFollowUpQuestions = (text) => {
    const section = text.match(/FOLLOW UP QUESTIONS:([\s\S]*?)(?:\n\n|$)/i);
    if (!section) return [];
    return section[1].trim().split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRiskScore(null);
    setFollowUpQuestions([]);
    try {
      const result = await axios.post(`${API_BASE_URL}/api/symptoms`, formData);
      const text = result.data.response;
      setResponse(text);
      setRiskScore(parseRiskScore(text));
      setFollowUpQuestions(parseFollowUpQuestions(text));
    } catch (error) {
      setResponse('Error analyzing symptoms. Please try again.');
    }
    setLoading(false);
  };

  const handleFollowUp = async (question) => {
    setLoading(true);
    setFollowUpQuestions([]);
    try {
      const result = await axios.post(`${API_BASE_URL}/api/symptoms`, {
        ...formData,
        symptoms: `${formData.symptoms}. Additional context: ${question} - Yes`
      });
      const text = result.data.response;
      setResponse(text);
      setRiskScore(parseRiskScore(text));
      // Don't regenerate follow-up questions after a follow-up answer
    } catch (error) {
      setResponse('Error analyzing symptoms. Please try again.');
    }
    setLoading(false);
  };

  const cleanResponse = (text) => {
    return text
      .replace(/FOLLOW UP QUESTIONS:[\s\S]*$/i, '')
      .replace(/RISK SCORE:.*\n/i, '')
      .trim();
  };

  return (
    <div>
      <h2 className="heading-2 text-center">🩺 Health Symptom Analyzer</h2>
      <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Get AI-powered analysis of your symptoms with personalized recommendations
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="form-group">
          <label className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🩺</span> Describe Your Symptoms
          </label>
          <textarea
            className="form-input"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            placeholder="Please describe your symptoms in detail (e.g., headache, fever, cough, sore throat, fatigue...)"
            rows="4"
            style={{ resize: 'vertical', minHeight: '100px' }}
            required
          />
        </div>

        <div className="flex gap-md" style={{ flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
            <label className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📅</span> Age
            </label>
            <input type="number" className="form-input" value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter your age" min="1" max="120" required />
          </div>

          <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
            <label className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👤</span> Gender
            </label>
            <select className="form-input" value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
              <option value="">Choose your gender</option>
              <option value="male">👨 Male</option>
              <option value="female">👩 Female</option>
              <option value="other">🧑 Other</option>
            </select>
          </div>
        </div>

        <button type="submit" className={`btn-primary ${loading ? 'btn-loading' : ''}`}
          disabled={loading} style={{ alignSelf: 'center', minWidth: '200px' }}>
          <span style={{ opacity: loading ? 0 : 1 }}>✨ Analyze Symptoms</span>
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {riskScore !== null && (
            <div className="glass-card" style={{ minWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiskGauge score={riskScore} />
            </div>
          )}

          <div className="glass-card" style={{ flex: '1', minWidth: '280px', background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
            <h3 className="heading-3 text-gradient">Analysis Results:</h3>
            <div className="text-mono" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {cleanResponse(response)}
            </div>
          </div>
        </div>
      )}

      {followUpQuestions.length > 0 && (
        <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <h3 className="heading-3 text-gradient">🤔 Follow-up Questions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Click a question to refine your analysis:
          </p>
          <div className="flex flex-col gap-sm">
            {followUpQuestions.map((q, i) => (
              <button key={i} className="btn-secondary" onClick={() => handleFollowUp(q)}
                disabled={loading} style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;

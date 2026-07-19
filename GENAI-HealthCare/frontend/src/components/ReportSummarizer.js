import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const ReportSummarizer = () => {
  const [patientName, setPatientName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);

  const [pastReports, setPastReports] = useState([]);
  const [pastLoading, setPastLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { setSummary('Please select a file to upload.'); return; }
    setLoading(true);
    setSummary('');
    setQaHistory([]);
    try {
      const formDataFile = new FormData();
      formDataFile.append('file', selectedFile);
      formDataFile.append('patientName', patientName);
      const result = await axios.post(`${API_BASE_URL}/api/summarize-report-file`, formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSummary(result.data.response);
    } catch {
      setSummary('Error summarizing report. Please try again.');
    }
    setLoading(false);
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !summary) return;
    const userQ = question;
    setQaHistory(prev => [...prev, { type: 'user', text: userQ }]);
    setQuestion('');
    setQaLoading(true);
    try {
      const result = await axios.post(`${API_BASE_URL}/api/ask-report`, {
        question: userQ,
        reportContent: summary,
        patientName
      });
      setQaHistory(prev => [...prev, { type: 'ai', text: result.data.response }]);
    } catch {
      setQaHistory(prev => [...prev, { type: 'ai', text: 'Error getting answer. Please try again.' }]);
    }
    setQaLoading(false);
  };

  const fetchPastReports = async () => {
    if (!patientName.trim()) { alert('Enter patient name first.'); return; }
    setPastLoading(true);
    setShowPast(true);
    try {
      const result = await axios.get(`${API_BASE_URL}/api/report-history/${patientName}`);
      setPastReports(result.data.data || []);
    } catch {
      setPastReports([]);
    }
    setPastLoading(false);
  };

  return (
    <div>
      <h2 className="heading-2 text-center">📋 Medical Report Analyzer</h2>
      <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Transform complex medical reports into clear, understandable summaries using advanced AI
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="form-group">
          <label className="heading-3" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👤</span> Patient Name
          </label>
          <input type="text" className="form-input" value={patientName}
            onChange={e => setPatientName(e.target.value)}
            placeholder="Enter patient's full name" required />
        </div>

        <div className="glass-card" style={{ background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)', textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 className="heading-3 text-gradient">Upload Medical Document</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select your medical report file</p>
          <input type="file" accept=".txt,.docx,.pdf" onChange={e => setSelectedFile(e.target.files[0])}
            className="form-input" style={{ marginBottom: '1rem' }} required />
          <div className="text-mono" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Supported: PDF, DOCX, TXT • Maximum size: 10MB
          </div>
        </div>

        {selectedFile && (
          <div className="glass-card" style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
            <div className="flex items-center gap-md">
              <div style={{ fontSize: '2rem' }}>📄</div>
              <div>
                <div className="heading-3">{selectedFile.name}</div>
                <div className="text-mono" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="submit" className={`btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading} style={{ minWidth: '200px' }}>
            <span style={{ opacity: loading ? 0 : 1 }}>✨ Generate Summary</span>
          </button>
          <button type="button" className="btn-secondary" onClick={fetchPastReports}
            style={{ minWidth: '180px' }}>
            🕓 Past Reports
          </button>
        </div>
      </form>

      {/* Past Reports */}
      {showPast && (
        <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h3 className="heading-3 text-gradient" style={{ marginBottom: '1rem' }}>🕓 Previous Reports for {patientName}</h3>
          {pastLoading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : pastReports.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No previous reports found for this patient.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {pastReports.map((r, i) => (
                <div key={i} className="glass-card" style={{ cursor: 'pointer' }}
                  onClick={() => { setSummary(r.summaryContent); setQaHistory([]); setShowPast(false); }}>
                  <div className="flex items-center gap-md">
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <div>
                      <div className="heading-3" style={{ fontSize: '0.95rem' }}>{r.fileName}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {r.summaryContent?.substring(0, 100)}...
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Result */}
      {summary && (
        <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
          <div className="flex items-center gap-md" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📊</div>
            <h3 className="heading-3 text-gradient">Analysis Results</h3>
          </div>
          <div className="text-mono" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            {summary}
          </div>
        </div>
      )}

      {/* Ask About Report */}
      {summary && (
        <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h3 className="heading-3 text-gradient" style={{ marginBottom: '0.5rem' }}>💬 Ask About This Report</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Have questions about the report? Ask the AI for clarification.
          </p>

          {qaHistory.length > 0 && (
            <div className="flex flex-col gap-sm" style={{ marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {qaHistory.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.type}`} style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  {msg.text}
                </div>
              ))}
              {qaLoading && (
                <div className="chat-typing">
                  <div className="typing-dots"><span></span><span></span><span></span></div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleAskQuestion} className="flex gap-sm">
            <input className="form-input" value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. What does my cholesterol level mean? Should I be worried?"
              disabled={qaLoading} style={{ flex: 1 }} />
            <button type="submit" className="btn-primary" disabled={qaLoading || !question.trim()}
              style={{ padding: '0.75rem 1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReportSummarizer;

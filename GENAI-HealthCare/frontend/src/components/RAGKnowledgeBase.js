import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RAGKnowledgeBase = ({ userEmail }) => {
  const [activeTab, setActiveTab] = useState('query');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);

  const [docForm, setDocForm] = useState({ title: '', category: 'general', content: '' });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const categories = ['general', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'dermatology', 'psychiatry', 'oncology'];

  const fetchDocuments = async () => {
    setDocsLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/rag/documents');
      setDocuments(res.data.data || []);
    } catch { setDocuments([]); }
    setDocsLoading(false);
  };

  useEffect(() => { if (activeTab === 'documents') fetchDocuments(); }, [activeTab]);

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setQueryLoading(true);
    setQueryResult('');
    try {
      const res = await axios.post('http://localhost:8080/api/rag/query', { query });
      setQueryResult(res.data.response);
    } catch { setQueryResult('Error querying knowledge base. Please try again.'); }
    setQueryLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadMsg('');
    try {
      const res = await axios.post('http://localhost:8080/api/rag/upload', {
        ...docForm, uploadedBy: userEmail || 'admin'
      });
      setUploadMsg(res.data.response);
      setDocForm({ title: '', category: 'general', content: '' });
    } catch { setUploadMsg('Error uploading document.'); }
    setUploadLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/rag/documents/${id}`);
      fetchDocuments();
    } catch { alert('Error deleting document.'); }
  };

  return (
    <div>
      <h2 className="heading-2 text-center">🧠 RAG Medical Knowledge Base</h2>
      <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Upload medical documents and query them with AI-powered retrieval augmented generation
      </p>

      {/* How RAG works banner */}
      <div className="glass-card" style={{ background: 'rgba(99,102,241,0.07)', borderColor: 'rgba(99,102,241,0.25)', marginBottom: '1.5rem' }}>
        <h3 className="heading-3 text-gradient" style={{ marginBottom: '0.75rem' }}>⚡ How RAG Works Here</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {['1️⃣ Upload medical documents (guidelines, research, protocols)', '2️⃣ Documents are chunked into 500-char segments', '3️⃣ Your query retrieves the most relevant chunks', '4️⃣ Gemini AI answers using retrieved context'].map((step, i) => (
            <div key={i} style={{ flex: '1', minWidth: '200px', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>{step}</div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[{ id: 'query', label: '🔍 Query Knowledge Base' }, { id: 'upload', label: '📤 Upload Document' }, { id: 'documents', label: '📚 View Documents' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: '1', padding: '0.6rem' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Query Tab */}
      {activeTab === 'query' && (
        <div>
          <form onSubmit={handleQuery} className="flex flex-col gap-lg">
            <div className="form-group">
              <label className="heading-3" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'block' }}>
                🔍 Ask a Medical Question
              </label>
              <textarea className="form-input" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="e.g. What are the symptoms of hypertension? What is the treatment for diabetes type 2?"
                rows="3" style={{ resize: 'vertical' }} required />
            </div>
            <button type="submit" className={`btn-primary ${queryLoading ? 'btn-loading' : ''}`}
              disabled={queryLoading} style={{ alignSelf: 'center', minWidth: '200px' }}>
              <span style={{ opacity: queryLoading ? 0 : 1 }}>🧠 Query with RAG</span>
            </button>
          </form>

          {queryResult && (
            <div className="glass-card" style={{ marginTop: '1.5rem', background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ background: 'rgba(99,102,241,0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ✅ Retrieved from Knowledge Base + Gemini AI
                </span>
              </div>
              <h3 className="heading-3 text-gradient">AI Response:</h3>
              <div className="text-mono" style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: 'var(--text-primary)' }}>
                {queryResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <form onSubmit={handleUpload} className="flex flex-col gap-lg">
          <div className="form-group">
            <label className="heading-3" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'block' }}>Document Title</label>
            <input className="form-input" value={docForm.title} onChange={e => setDocForm({ ...docForm, title: e.target.value })}
              placeholder="e.g. Hypertension Treatment Guidelines 2024" required />
          </div>
          <div className="form-group">
            <label className="heading-3" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'block' }}>Medical Category</label>
            <select className="form-input" value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value })}>
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="heading-3" style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'block' }}>Document Content</label>
            <textarea className="form-input" value={docForm.content} onChange={e => setDocForm({ ...docForm, content: e.target.value })}
              placeholder="Paste medical document content here (guidelines, research papers, treatment protocols, drug information...)"
              rows="8" style={{ resize: 'vertical' }} required />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Content will be automatically chunked into 500-character segments for retrieval
            </p>
          </div>
          <button type="submit" className={`btn-primary ${uploadLoading ? 'btn-loading' : ''}`}
            disabled={uploadLoading} style={{ alignSelf: 'center', minWidth: '200px' }}>
            <span style={{ opacity: uploadLoading ? 0 : 1 }}>📤 Upload & Chunk Document</span>
          </button>
          {uploadMsg && (
            <div className="glass-card" style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)', textAlign: 'center' }}>
              ✅ {uploadMsg}
            </div>
          )}
        </form>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          {docsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No documents uploaded yet.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Upload medical documents to build your knowledge base.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {documents.map(doc => (
                <div key={doc.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 className="heading-3" style={{ fontSize: '1rem', margin: 0 }}>{doc.title}</h3>
                      <span style={{ background: 'rgba(99,102,241,0.2)', padding: '0.15rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {doc.category}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                      {doc.content?.substring(0, 120)}...
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                      Chunks: {doc.chunks?.split('|||').length || 0} | Uploaded by: {doc.uploadedBy}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(doc.id)} className="btn-secondary"
                    style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RAGKnowledgeBase;

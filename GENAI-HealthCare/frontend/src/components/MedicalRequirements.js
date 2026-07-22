import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const MedicalRequirements = ({ user = {} }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    requirementType: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: ''
  });
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requirementTypes = [
    'Prescription Refill',
    'Lab Test',
    'Medical Certificate',
    'Referral Letter',
    'Insurance Form',
    'Medical Records',
    'Vaccination Certificate',
    'Other'
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', color: '#28a745' },
    { value: 'MEDIUM', label: 'Medium', color: '#ffc107' },
    { value: 'HIGH', label: 'High', color: '#fd7e14' },
    { value: 'URGENT', label: 'Urgent', color: '#dc3545' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const requirementData = {
        ...formData,
        userEmail: user?.email || ''
      };
      
      const response = await fetch(`${API_BASE_URL}/api/medical-requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirementData)
      });
      
      const result = await response.json();
      setMessage(result.response);
      
      if (result.success) {
        setFormData({
          patientName: '',
          requirementType: '',
          description: '',
          priority: 'MEDIUM',
          dueDate: ''
        });
        loadRequirements();
      }
    } catch (error) {
      setMessage('Backend server not running. Please start the backend server first.');
    }
    
    setLoading(false);
  };

  const loadRequirements = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/medical-requirements/${user.email}`);
        const result = await response.json();
        if (result.success) {
          setRequirements(result.data || []);
        }
      } catch (error) {
        console.error('Error loading requirements:', error);
      }
    }
  };

  useEffect(() => {
    loadRequirements();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#6c757d';
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#ffc107',
      'IN_PROGRESS': '#17a2b8',
      'COMPLETED': '#28a745',
      'CANCELLED': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="flex gap-lg" style={{flexWrap: 'wrap'}}>
      <div className="glass-card" style={{flex: '1', minWidth: '400px'}}>
        <h2 className="heading-2 text-gradient">📋 Medical Requirements</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          
          <select
            name="requirementType"
            value={formData.requirementType}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">Select Requirement Type</option>
            {requirementTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <textarea
            name="description"
            placeholder="Describe your medical requirement in detail"
            value={formData.description}
            onChange={handleInputChange}
            className="form-input"
            rows="4"
            style={{resize: 'vertical'}}
            required
          />
          
          <div className="flex gap-md">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="form-input"
              style={{flex: '1'}}
              required
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="form-input"
              style={{flex: '1'}}
              placeholder="Due Date (Optional)"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`btn-primary ${loading ? 'btn-loading' : ''}`}
          >
            <span style={{opacity: loading ? 0 : 1}}>Create Requirement</span>
          </button>
        </form>
        
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

      <div className="glass-card" style={{flex: '1', minWidth: '400px'}}>
        <h3 className="heading-2 text-gradient">Your Medical Requirements</h3>
        {requirements.length > 0 ? (
          <div className="flex flex-col gap-md">
            {requirements.map(requirement => (
              <div key={requirement.id} className="glass-card" style={{background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.2)'}}>
                <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                  <h4 className="heading-3 text-gradient">{requirement.requirementType}</h4>
                  <div className="flex gap-sm">
                    <div 
                      className="glass-card"
                      style={{ 
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        background: `${getPriorityColor(requirement.priority)}20`,
                        borderColor: `${getPriorityColor(requirement.priority)}50`,
                        color: getPriorityColor(requirement.priority)
                      }}
                    >
                      {requirement.priority}
                    </div>
                    <div 
                      className="glass-card"
                      style={{ 
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        background: `${getStatusColor(requirement.status)}20`,
                        borderColor: `${getStatusColor(requirement.status)}50`,
                        color: getStatusColor(requirement.status)
                      }}
                    >
                      {(requirement.status || 'PENDING').replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <div style={{marginBottom: '1rem', lineHeight: '1.6'}}>
                  {requirement.description}
                </div>
                <div className="flex justify-between text-mono" style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                  <span>Created: {new Date(requirement.createdAt).toLocaleDateString()}</span>
                  {requirement.dueDate && (
                    <span>Due: {new Date(requirement.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
            <p style={{color: 'var(--text-secondary)'}}>No medical requirements found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRequirements;
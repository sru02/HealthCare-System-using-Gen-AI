import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ name: '', specialty: '', email: '', phone: '', availability: '', experience: '' });

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings`);
      const result = await response.json();
      if (result.success) {
        setBookings(result.data || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const loadRequirements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/requirements`);
      const result = await response.json();
      if (result.success) {
        setRequirements(result.data || []);
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
    }
    setLoading(false);
  };

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors`);
      const result = await response.json();
      if (result.success) {
        setDoctors(result.data || []);
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
    setLoading(false);
  };

  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/patients`);
      const result = await response.json();
      if (result.success) {
        setPatients(result.data || []);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    }
    setLoading(false);
  };



  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        loadBookings();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctorForm)
      });
      
      const result = await response.json();
      if (result.success) {
        setDoctorForm({ name: '', specialty: '', email: '', phone: '', availability: '', experience: '' });
        setShowAddDoctor(false);
        loadDoctors();
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const removeDoctor = async (id) => {
    if (!window.confirm('Remove this doctor?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/doctors/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        loadDoctors();
      }
    } catch (error) {
      console.error('Error removing doctor:', error);
    }
  };

  const markAsIssued = async (id) => {
    if (!window.confirm('Mark this requirement as issued?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/requirements/${id}/issue`, {
        method: 'PUT'
      });
      
      const result = await response.json();
      if (result.success) {
        loadRequirements();
      }
    } catch (error) {
      console.error('Error marking as issued:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') loadBookings();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'requirements') loadRequirements();
    else if (activeTab === 'doctors') loadDoctors();
    else if (activeTab === 'patients') loadPatients();
  }, [activeTab]);



  return (
    <div>
      <h2 className="heading-1 text-center">🔧 Admin Dashboard</h2>
      
      <div className="flex gap-sm" style={{marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          👨‍⚕️ Doctors ({doctors.length})
        </button>
        <button 
          className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Patients ({patients.length})
        </button>
        <button 
          className={`tab ${activeTab === 'requirements' ? 'active' : ''}`}
          onClick={() => setActiveTab('requirements')}
        >
          Requirements ({requirements.length})
        </button>
      </div>

      <div>
        {loading && (
          <div className="flex justify-center" style={{padding: '2rem'}}>
            <div className="loading-spinner"></div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-md">
            {bookings.map(booking => (
              <div key={booking.id} className="glass-card">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-sm" style={{flex: '1'}}>
                    <h3 className="heading-3 text-gradient">👤 {booking.patientName}</h3>
                    <div><span className="text-gradient">📧 Email:</span> {booking.userEmail}</div>
                    <div><span className="text-gradient">👨‍⚕️ Doctor:</span> {booking.doctorName} ({booking.specialty})</div>
                    <div><span className="text-gradient">📅 Date:</span> {new Date(booking.appointmentDateTime).toLocaleString()}</div>
                    <div><span className="text-gradient">💬 Symptoms:</span> {booking.symptoms}</div>
                  </div>
                  <div style={{marginLeft: '1rem'}}>
                    <div className="glass-card" style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} onClick={() => cancelBooking(booking.id)}>
                      <div className="flex items-center gap-sm" style={{color: '#ef4444'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Cancel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="flex flex-col gap-md">
            {users.map(user => (
              <div key={user.id} className="glass-card">
                <h3 className="heading-3 text-gradient">👤 {user.name}</h3>
                <div className="flex flex-col gap-sm">
                  <div><span className="text-gradient">📧 Email:</span> {user.email}</div>
                  <div><span className="text-gradient">🔑 Role:</span> {user.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'doctors' && (
          <div>
            <button onClick={() => setShowAddDoctor(true)} className="btn-primary" style={{marginBottom: '2rem'}}>+ Add Doctor</button>
            
            {showAddDoctor && (
              <div className="glass-card" style={{marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
                <h3 className="heading-3 text-gradient">👨‍⚕️ Add New Doctor</h3>
                <form onSubmit={addDoctor} className="flex flex-col gap-md">
                  <div className="flex gap-md" style={{flexWrap: 'wrap'}}>
                    <input placeholder="👤 Name" value={doctorForm.name} onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})} className="form-input" style={{flex: '1', minWidth: '200px'}} required />
                    <input placeholder="🩺 Specialty" value={doctorForm.specialty} onChange={(e) => setDoctorForm({...doctorForm, specialty: e.target.value})} className="form-input" style={{flex: '1', minWidth: '200px'}} required />
                  </div>
                  <div className="flex gap-md" style={{flexWrap: 'wrap'}}>
                    <input placeholder="📧 Email" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} className="form-input" style={{flex: '1', minWidth: '200px'}} required />
                    <input placeholder="📞 Phone" value={doctorForm.phone} onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})} className="form-input" style={{flex: '1', minWidth: '200px'}} required />
                  </div>
                  <input placeholder="🕒 Availability" value={doctorForm.availability} onChange={(e) => setDoctorForm({...doctorForm, availability: e.target.value})} className="form-input" required />
                  <input placeholder="⭐ Experience" value={doctorForm.experience} onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})} className="form-input" required />
                  <div className="flex gap-md">
                    <button type="submit" className="btn-primary">Add Doctor</button>
                    <button type="button" onClick={() => setShowAddDoctor(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="flex flex-col gap-md">
              {doctors.map(doctor => (
                <div key={doctor.id} className="glass-card">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-sm" style={{flex: '1'}}>
                      <h3 className="heading-3 text-gradient">👨‍⚕️ {doctor.name}</h3>
                      <div><span className="text-gradient">🩺 Specialty:</span> {doctor.specialty}</div>
                      <div><span className="text-gradient">📧 Email:</span> {doctor.email}</div>
                      <div><span className="text-gradient">📞 Phone:</span> {doctor.phone}</div>
                      <div><span className="text-gradient">🕒 Availability:</span> {doctor.availability}</div>
                      <div><span className="text-gradient">⭐ Experience:</span> {doctor.experience}</div>
                    </div>
                    <div style={{marginLeft: '1rem'}}>
                      <div className="glass-card" style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }} onClick={() => removeDoctor(doctor.id)}>
                        <div className="flex items-center gap-sm" style={{color: '#ef4444'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                          <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Remove</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="flex flex-col gap-md">
            {patients.map(patient => (
              <div key={patient.id} className="glass-card">
                <h3 className="heading-3 text-gradient">{patient.name}</h3>
                <div className="flex flex-col gap-sm">
                  <div><span className="text-gradient">📧 Email:</span> {patient.email}</div>
                  <div><span className="text-gradient">🔑 Role:</span> {patient.role || 'USER'}</div>
                </div>
              </div>
            ))}
          </div>
        )}



        {activeTab === 'requirements' && (
          <div className="flex flex-col gap-md">
            {requirements.map(req => (
              <div key={req.id} className="glass-card">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-sm" style={{flex: '1'}}>
                    <h3 className="heading-3 text-gradient">{req.patientName}</h3>
                    <div><span className="text-gradient">📧 Email:</span> {req.userEmail}</div>
                    <div><span className="text-gradient">🏷️ Type:</span> {req.requirementType}</div>
                    <div><span className="text-gradient">⚡ Priority:</span> {req.priority}</div>
                    <div><span className="text-gradient">📝 Description:</span> {req.description}</div>
                    <div><span className="text-gradient">Due:</span> {req.dueDate ? new Date(req.dueDate).toLocaleString() : 'No due date'}</div>
                  </div>
                  <div style={{marginLeft: '1rem'}}>
                    {req.status !== 'ISSUED' && (
                      <div className="glass-card" style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderColor: 'rgba(34, 197, 94, 0.3)',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }} onClick={() => markAsIssued(req.id)}>
                        <div className="flex items-center gap-sm" style={{color: '#22c55e'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          <span style={{fontSize: '0.875rem', fontWeight: '500'}}>Mark Issued</span>
                        </div>
                      </div>
                    )}
                    {req.status === 'ISSUED' && (
                      <div className="glass-card" style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        borderColor: 'rgba(34, 197, 94, 0.5)',
                        padding: '0.5rem 1rem'
                      }}>
                        <div className="flex items-center gap-sm" style={{color: '#22c55e'}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span style={{fontSize: '0.875rem', fontWeight: '500'}}>ISSUED</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';

const AppointmentBooking = ({ user = {} }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    specialty: '',
    appointmentDateTime: '',
    symptoms: ''
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const specialties = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Neurology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Radiology'
  ];

  const doctors = {
    'General Medicine': ['Dr. Smith', 'Dr. Johnson'],
    'Cardiology': ['Dr. Brown', 'Dr. Davis'],
    'Dermatology': ['Dr. Wilson', 'Dr. Miller'],
    'Neurology': ['Dr. Garcia', 'Dr. Martinez'],
    'Orthopedics': ['Dr. Anderson', 'Dr. Taylor'],
    'Pediatrics': ['Dr. Thomas', 'Dr. Jackson'],
    'Psychiatry': ['Dr. White', 'Dr. Harris'],
    'Radiology': ['Dr. Martin', 'Dr. Thompson']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'specialty' && { doctorName: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bookingData = {
        ...formData,
        userEmail: user?.email || ''
      };
      
      if (editingId) {
        await handleUpdate();
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.response} Check your email (${user?.email}) for confirmation details.`);
        setFormData({
          patientName: '',
          doctorName: '',
          specialty: '',
          appointmentDateTime: '',
          symptoms: ''
        });
        if (editingId) {
          setEditingId(null);
        }
        loadAppointments();
      } else {
        setMessage(`❌ ${result.response}`);
      }
    } catch (error) {
      setMessage('❌ Backend server not running. Please start the backend server first.');
    }
    
    setLoading(false);
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      appointmentDateTime: appointment.appointmentDateTime.slice(0, 16),
      symptoms: appointment.symptoms || ''
    });
    setEditingId(appointment.id);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      setMessage(result.response);
      
      if (result.success) {
        loadAppointments();
      }
    } catch (error) {
      setMessage('Error cancelling appointment');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setMessage(result.response);
      
      if (result.success) {
        setFormData({
          patientName: '',
          doctorName: '',
          specialty: '',
          appointmentDateTime: '',
          symptoms: ''
        });
        setEditingId(null);
        loadAppointments();
      }
    } catch (error) {
      setMessage('Error updating appointment');
    }
    
    setLoading(false);
  };

  const loadAppointments = async () => {
    if (user?.email) {
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${user.email}`);
        const result = await response.json();
        if (result.success) {
          setAppointments(result.data || []);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  return (
    <div className="flex gap-lg" style={{flexWrap: 'wrap'}}>
      <div className="glass-card" style={{flex: '1', minWidth: '400px'}}>
        <h2 className="heading-2 text-gradient">📅 Book Appointment</h2>
        
        <div className="glass-card" style={{marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
          <div className="text-gradient">Booking for:</div>
          <div>{user?.name || 'User'} ({user?.email || 'No email'})</div>
        </div>
        
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
            name="specialty"
            value={formData.specialty}
            onChange={handleInputChange}
            className="form-input"
            required
          >
            <option value="">Select Specialty</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          
          <select
            name="doctorName"
            value={formData.doctorName}
            onChange={handleInputChange}
            className="form-input"
            required
            disabled={!formData.specialty}
          >
            <option value="">Select Doctor</option>
            {formData.specialty && doctors[formData.specialty]?.map(doctor => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
          
          <input
            type="datetime-local"
            name="appointmentDateTime"
            value={formData.appointmentDateTime}
            onChange={handleInputChange}
            className="form-input"
            required
          />
          
          <textarea
            name="symptoms"
            placeholder="Describe your symptoms or reason for visit"
            value={formData.symptoms}
            onChange={handleInputChange}
            className="form-input"
            rows="3"
            style={{resize: 'vertical'}}
          />
          
          <div className="flex gap-md">
            <button 
              type="submit" 
              disabled={loading} 
              className={`btn-primary ${loading ? 'btn-loading' : ''}`}
              style={{flex: '1'}}
            >
              <span style={{opacity: loading ? 0 : 1}}>
                {editingId ? 'Update Appointment' : 'Book Appointment'}
              </span>
            </button>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setFormData({
                  patientName: '',
                  doctorName: '',
                  specialty: '',
                  appointmentDateTime: '',
                  symptoms: ''
                });
              }} className="btn-secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
        
        {message && (
          <div className="glass-card" style={{
            marginTop: '1rem', 
            padding: '1rem', 
            background: message.includes('✅') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: message.includes('✅') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
          }}>
            {message}
          </div>
        )}
      </div>

      <div className="glass-card" style={{flex: '1', minWidth: '400px'}}>
        <h3 className="heading-2 text-gradient">Your Appointments</h3>
        {appointments.length > 0 ? (
          <div className="flex flex-col gap-md">
            {appointments.map(appointment => (
              <div key={appointment.id} className="glass-card" style={{background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)'}}>
                <div className="flex justify-between items-center" style={{marginBottom: '1rem'}}>
                  <div>
                    <h4 className="heading-3 text-gradient">{appointment.doctorName}</h4>
                    <div style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>{appointment.specialty}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-sm" style={{marginBottom: '1rem'}}>
                  <div><span className="text-gradient">Date:</span> {new Date(appointment.appointmentDateTime).toLocaleString()}</div>
                  <div><span className="text-gradient">Patient:</span> {appointment.patientName}</div>
                  <div><span className="text-gradient">Symptoms:</span> {appointment.symptoms}</div>
                </div>
                <div className="flex gap-sm">
                  <button onClick={() => handleEdit(appointment)} className="btn-secondary" style={{flex: '1'}}>Edit</button>
                  <button onClick={() => handleCancel(appointment.id)} className="btn-secondary" style={{background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444', flex: '1'}}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)'}}>
            <p style={{color: 'var(--text-secondary)'}}>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
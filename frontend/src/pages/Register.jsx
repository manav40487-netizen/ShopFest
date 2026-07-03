import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = register form, 2 = OTP form
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Step 1 - Send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('OTP sent to your email! Please check your inbox.');
        setStep(2); // show OTP input
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Step 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {step === 1 ? (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="auth-form">
          <h2>Verify Email</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '16px' }}>
            OTP sent to <strong>{email}</strong>
          </p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '12px', cursor: 'pointer', color: '#666' }}
            onClick={() => setStep(1)}>
            ← Go back
          </p>
        </form>
      )}
    </div>
  );
};

export default Register;
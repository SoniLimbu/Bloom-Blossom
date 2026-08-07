import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(res.data);
      toast.success(`Welcome to Bloom & Blossom, ${res.data.name}! 🌸`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Register — Bloom & Blossom</title></Helmet>
      <div className="auth-page">
        <div className="auth-page__left">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌹</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Join Our Garden!</h2>
          <p style={{ opacity: 0.9, lineHeight: 1.8, maxWidth: '320px' }}>Create your account to unlock exclusive offers, track orders, and enjoy a personalized floral experience.</p>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['🎁 Buy 2 Get 1 FREE offer', '🎀 Free gift hamper on ₹10,000+', '🚚 Free delivery on ₹2,000+', '⭐ Member exclusive discounts'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.9, fontSize: '0.95rem' }}>{f}</div>
            ))}
          </div>
        </div>
        <div className="auth-page__right">
          <div className="auth-form">
            <h1 className="auth-form__title">Create Account</h1>
            <p className="auth-form__subtitle">Join thousands of flower lovers!</p>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                  <input name="name" className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.name} onChange={handle} required placeholder="Your full name" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                  <input name="email" type="email" className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.email} onChange={handle} required placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <FiPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                  <input name="phone" className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.phone} onChange={handle} placeholder="98XXXXXXXX" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                    <input name="password" type={show ? 'text' : 'password'} className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.password} onChange={handle} required placeholder="Min 6 chars" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                    <input name="confirm" type={show ? 'text' : 'password'} className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.confirm} onChange={handle} required placeholder="Repeat password" />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? '⌛ Creating Account...' : '🌸 Create Account'}
              </button>
            </form>
            <div className="auth-form__footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

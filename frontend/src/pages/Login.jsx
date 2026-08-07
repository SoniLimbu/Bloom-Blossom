import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}! 🌸`);
      navigate(res.data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Login — Bloom & Blossom</title></Helmet>
      <div className="auth-page">
        {/* Left */}
        <div className="auth-page__left">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌸</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Welcome Back!</h2>
          <p style={{ opacity: 0.9, lineHeight: 1.8, maxWidth: '320px' }}>Sign in to your Bloom & Blossom account and continue your floral journey.</p>
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['🎁 Exclusive member offers', '🚚 Track your orders', '⭐ Save your favorites'].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.9, fontSize: '0.95rem' }}>{f}</div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="auth-page__right">
          <div className="auth-form">
            <h1 className="auth-form__title">Sign In</h1>
            <p className="auth-form__subtitle">Enter your credentials to access your account</p>
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                  <input name="email" type="email" className="form-input" style={{ paddingLeft: '2.75rem' }} value={form.email} onChange={handle} required placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9E7A8C' }} />
                  <input name="password" type={show ? 'text' : 'password'} className="form-input" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} value={form.password} onChange={handle} required placeholder="••••••••" />
                  <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9E7A8C' }}>
                    {show ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              {/* Demo credentials */}
              <div style={{ background: '#FFF8F0', border: '1px solid #f0d0e0', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#6B4C5E' }}>
                <strong>Demo:</strong> admin@bloomblossom.com / admin123 &nbsp;|&nbsp; customer@test.com / customer123
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? '⌛ Signing In...' : 'Sign In 🌸'}
              </button>
            </form>
            <div className="auth-form__footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

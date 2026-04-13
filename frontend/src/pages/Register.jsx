import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { registerUser } from '../services/authService.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await registerUser({ name, email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 text-sm transition-all';

  return (
    <div className="min-h-screen bg-black flex">
      <div className="hidden md:flex w-[45%] bg-[#111] border-r border-white/10 flex-col items-center justify-center p-12">
        <img src="/CH Digital Solutions.svg" alt="CHDS Logo" className="w-16 h-16 rounded mb-6 object-contain" />
        <h1 className="text-2xl font-bold text-white text-center">CH Digital Solutions</h1>
        <p className="text-[#888] text-sm mt-2 text-center">Simplifying Operations. One lead at a time.</p>
        <div className="flex flex-col gap-2 mt-8 items-center">
          {['Message Templates', 'Follow-up Alerts', 'Pipeline Tracking'].map((f) => (
            <span key={f} className="bg-black border border-white/10 text-[#888] text-xs px-3 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-white">Create account</h2>
          <p className="text-[#888] text-sm mt-2 mb-8">Start managing your LinkedIn leads</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#888] mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-3 text-sm transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-[#888] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:text-gray-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

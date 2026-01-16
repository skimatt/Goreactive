import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Proteksi: Jika sudah login, jangan boleh ke halaman login lagi
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password
      });

      // Simpan token dan data user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Pindah ke Dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || "Koneksi ke server gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
      <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ViteGo Admin
          </h1>
          <p className="text-slate-400 mt-2">Silakan masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98]"
          >
            {loading ? "Memproses..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8">
          &copy; 2026 Belajar Fullstack Go-React
        </p>
      </div>
    </div>
  );
};

export default Login;
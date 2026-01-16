import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { FaUserPlus, FaTrash, FaUserShield, FaTimes } from 'react-icons/fa';

interface User {
  id?: number;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  password?: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<User>({ username: '', email: '', role: 'editor', password: '' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await api.get('/admin/users/');
    setUsers(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', formData);
      setUsers(prev => [...prev, res.data.data]);
      setIsModalOpen(false);
      setFormData({ username: '', email: '', role: 'editor', password: '' });
    } catch (err) { alert("Gagal tambah user. Mungkin email sudah terdaftar."); }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus akses user ini?")) {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaUserShield className="text-emerald-500" /> User Management
        </h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
          <FaUserPlus /> Tambah User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-blue-400 uppercase">
                {user.username.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white">{user.username}</h3>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {user.role}
              </span>
              <button onClick={() => handleDelete(user.id!)} className="text-slate-500 hover:text-red-400 transition-colors p-2">
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between">
              <h3 className="text-xl font-bold text-white">Undang Admin Baru</h3>
              <button onClick={() => setIsModalOpen(false)}><FaTimes className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" placeholder="Username" required className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              <input type="email" placeholder="Email Address" required className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              
              <select className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none"
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'admin' | 'editor'})}>
                <option value="editor">Editor (Akses Terbatas)</option>
                <option value="admin">Admin (Akses Penuh)</option>
              </select>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4">
                Buat Akun
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UsersPage;
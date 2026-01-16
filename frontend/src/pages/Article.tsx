import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { FaPlus, FaTrash, FaEdit, FaTimes, FaNewspaper } from 'react-icons/fa';

interface Article {
  id?: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  slug?: string;
}

const ArticlePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Article>({ title: '', content: '', status: 'draft' });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    const res = await api.get('/admin/articles/');
    setArticles(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await api.put(`/admin/articles/${editingId}`, formData);
      setArticles(prev => prev.map(a => a.id === editingId ? res.data.data : a));
    } else {
      const res = await api.post('/admin/articles/', formData);
      setArticles(prev => [...prev, res.data.data]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus artikel ini?")) {
      await api.delete(`/admin/articles/${id}`);
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaNewspaper className="text-blue-500" /> Manajemen Artikel
        </h2>
        <button onClick={() => { setEditingId(null); setFormData({title:'', content:'', status:'draft'}); setIsModalOpen(true); }} 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
          <FaPlus /> Tulis Artikel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {articles.map(art => (
          <div key={art.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 flex justify-between items-center hover:border-blue-500/50 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${art.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {art.status}
                </span>
                <h3 className="text-xl font-semibold text-white">{art.title}</h3>
              </div>
              <p className="text-slate-400 text-sm line-clamp-1">{art.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingId(art.id!); setFormData(art); setIsModalOpen(true); }} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-blue-400 transition-all"><FaEdit /></button>
              <button onClick={() => handleDelete(art.id!)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-red-400 transition-all"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL ARTIKEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><FaTimes className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input type="text" placeholder="Judul Artikel" required className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              
              <select className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <textarea rows={6} placeholder="Tulis konten artikel di sini..." required className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg">
                {editingId ? 'Simpan Perubahan' : 'Terbitkan Sekarang'}
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ArticlePage;
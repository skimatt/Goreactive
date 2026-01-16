import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';

interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State untuk form
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: 0,
    stock: 0,
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id!);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData({ name: '', price: 0, stock: 0, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
      } else {
        await api.post('/admin/products/', formData);
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Gagal menghapus");
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Manajemen Produk</h2>
          <p className="text-slate-400">Kelola inventaris barang secara real-time.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <FaPlus /> Tambah Produk
        </button>
      </div>

      {/* Tabel Produk */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#0f172a]/50 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Produk</th>
              <th className="px-6 py-4 font-semibold">Harga</th>
              <th className="px-6 py-4 font-semibold">Stok</th>
              <th className="px-6 py-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">Rp {p.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-300">{p.stock} Unit</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleOpenModal(p)}
                      className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id!)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Harga (IDR)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Stok</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Deskripsi</label>
                <textarea 
                  rows={3}
                  className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                >
                  {editingId ? 'Simpan Perubahan' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProductPage;
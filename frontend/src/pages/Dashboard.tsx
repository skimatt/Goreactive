import MainLayout from '../components/MainLayout';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-slate-400">Selamat datang kembali di panel kendali sistem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Stats */}
        {[
          { label: 'Total Revenue', value: '$45,231', color: 'text-emerald-400' },
          { label: 'Active Users', value: '2,345', color: 'text-blue-400' },
          { label: 'New Orders', value: '+124', color: 'text-orange-400' },
          { label: 'System Health', value: '99.9%', color: 'text-purple-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder untuk Grafik atau Tabel */}
      <div className="mt-8 bg-[#1e293b] h-64 rounded-2xl border border-slate-700 border-dashed flex items-center justify-center text-slate-500">
        Area Chart / Statistik Akan Muncul Di Sini
      </div>
    </MainLayout>
  );
};

export default Dashboard;
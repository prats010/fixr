'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function OwnerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Hardcoded demo hotel ID
        const res = await fetch('/api/analytics?hotelId=54e9fa70-9570-4510-85a1-011948a30420');
        if (res.ok) setData(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted">Loading Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-danger">Failed to load analytics.</div>;

  const chartData = {
    labels: Object.keys(data.categoryCounts),
    datasets: [
      {
        label: 'Number of Complaints',
        data: Object.values(data.categoryCounts),
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // accent-primary
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { precision: 0 }
        }
    }
  };

  return (
    <div className="container mt-4 mb-8">
      <div className="navbar mb-8" style={{ borderRadius: 'var(--radius-md)' }}>
         <div className="brand">Fixr Owner Analytics</div>
         <button className="btn btn-secondary" onClick={() => {
             fetch('/api/auth', {method: 'DELETE'}).then(() => router.push('/staff/login'));
         }}>Logout</button>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card text-center shadow-sm">
              <h3 className="text-sm text-muted mb-2 font-bold uppercase">Total Complaints</h3>
              <p className="text-2xl font-bold">{data.summary.total}</p>
          </div>
          <div className="card text-center shadow-sm">
              <h3 className="text-sm text-muted mb-2 font-bold uppercase">Avg Resolution</h3>
              <p className="text-2xl font-bold">{data.summary.avgResolutionTime > 0 ? `${data.summary.avgResolutionTime} min` : 'N/A'}</p>
          </div>
          <div className="card text-center shadow-sm">
              <h3 className="text-sm text-muted mb-2 font-bold uppercase">Top Category</h3>
              <p className="text-2xl font-bold text-danger">{data.summary.topCategory}</p>
          </div>
          <div className="card text-center shadow-sm">
              <h3 className="text-sm text-muted mb-2 font-bold uppercase">Most Issues (Room)</h3>
              <p className="text-2xl font-bold">{data.summary.topRoom}</p>
          </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card shadow-sm">
              <h2 className="text-lg font-bold mb-4">Complaints by Category</h2>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                 <Bar data={chartData} options={chartOptions} />
              </div>
          </div>
      </div>

      <div className="card shadow-sm mb-8">
          <h2 className="text-lg font-bold mb-4">10 Most Recent Complaints</h2>
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          <th className="p-2 pb-3 text-sm">Date</th>
                          <th className="p-2 pb-3 text-sm">Room</th>
                          <th className="p-2 pb-3 text-sm">Category</th>
                          <th className="p-2 pb-3 text-sm">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {data.recentComplaints.map((c: any) => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td className="p-3 text-sm">{new Date(c.createdAt).toLocaleDateString()}</td>
                              <td className="p-3 font-bold">{c.room}</td>
                              <td className="p-3 text-sm text-muted">{c.category}</td>
                              <td className="p-3">
                                  <span className={`badge ${c.status === 'Resolved' ? 'badge-resolved' : c.status === 'New' ? 'badge-new' : 'badge-progress'}`}>
                                      {c.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}

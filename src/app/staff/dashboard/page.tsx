'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications API Check
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch initial active complaints
  useEffect(() => {
      const fetchInitial = async () => {
          try {
              // Quick hack for demo: get hotelId from first result or default
              const res = await fetch('/api/complaints?hotelId=54e9fa70-9570-4510-85a1-011948a30420'); 
              if (res.ok) {
                  const data = await res.json();
                  const active = data.filter((c: any) => c.status !== 'Resolved');
                  setComplaints(active);
              }
          } catch(e) { console.error(e) } finally { setLoading(false); }
      }
      fetchInitial();
  }, []);

  // SSE Listner
  useEffect(() => {
    const evtSource = new EventSource('/api/complaints/stream');
    evtSource.onmessage = (event) => {
      const newComplaint = JSON.parse(event.data);
      setComplaints((prev) => [newComplaint, ...prev.filter(c => c.id !== newComplaint.id)]);
      
      // Trigger Notification
      if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Fixr: New Complaint', {
              body: `Room ${newComplaint.room} - ${newComplaint.category}`,
              icon: '/globe.svg'
          });
      }
    };
    return () => evtSource.close();
  }, []);

  const handleUpdate = async (id: string, updates: any) => {
     try {
         const res = await fetch(`/api/complaints/${id}`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(updates)
         });
         
         if (res.ok) {
            setComplaints(prev => {
                const updatedList = prev.map(c => c.id === id ? { ...c, ...updates } : c);
                // Remove from list if resolved
                if (updates.status === 'Resolved') {
                    return updatedList.filter(c => c.id !== id);
                }
                return updatedList;
            })
         }
     } catch(e) { console.error(e) }
  };

  if (loading) return <div className="p-8 text-center">Loading Fixr Dashboard...</div>;

  return (
    <div className="container mt-4 mb-8">
      <div className="navbar mb-8" style={{ borderRadius: 'var(--radius-md)' }}>
         <div className="brand">Fixr Front Desk</div>
         <button className="btn btn-secondary" onClick={() => {
             fetch('/api/auth', {method: 'DELETE'}).then(() => router.push('/staff/login'));
         }}>Logout</button>
      </div>

      <h1 className="text-xl mb-6">Active Issues</h1>

      {complaints.length === 0 ? (
          <div className="p-12 text-center text-muted card">
             All caught up! No active complaints right now.
          </div>
      ) : (
          <div className="flex flex-col gap-4">
              {complaints.map((c) => (
                  <div key={c.id} className="card animate-slide-in" style={{ borderLeft: c.status === 'New' ? '4px solid var(--accent-primary)' : '4px solid #3b82f6' }}>
                      <div className="flex justify-between items-center mb-4">
                          <div>
                              <span className={`badge ${c.status === 'New' ? 'badge-new' : 'badge-progress'} mr-2`}>{c.status}</span>
                              <span className="text-muted text-sm">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold" style={{ margin: 0 }}>Room {c.room}</h2>
                        <h3 className="text-lg font-bold" style={{ margin: 0 }}>{c.category}</h3>
                      </div>
                      
                      {c.description && <p className="mb-4">"{c.description}"</p>}

                      <div className="p-4 mb-4" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                          <p className="text-sm font-bold mb-2">✨ AI Suggestion</p>
                          <p className="mb-0">{c.aiSuggestion || 'No suggestion available.'}</p>
                      </div>

                      <div className="flex gap-2">
                          {c.status === 'New' && (
                              <button className="btn btn-primary" onClick={() => handleUpdate(c.id, { status: 'In Progress', staffAction: c.aiSuggestion })}>
                                  Accept & Start
                              </button>
                          )}
                          {c.status === 'In Progress' && (
                              <button className="btn btn-success" onClick={() => handleUpdate(c.id, { status: 'Resolved' })}>
                                  Mark Resolved
                              </button>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}

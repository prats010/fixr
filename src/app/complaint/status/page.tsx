'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function StatusContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/complaints/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComplaint(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (!id) return <div className="p-8 text-center">Invalid link.</div>;
  if (loading) return <div className="p-8 text-center animate-pulse-new">Loading...</div>;
  if (!complaint) return <div className="p-8 text-center">Request not found.</div>;

  const getStatusColor = () => {
    switch (complaint.status) {
      case 'New': return 'var(--accent-primary)';
      case 'In Progress': return '#3b82f6'; // Blue
      case 'Resolved': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="container-narrow mt-8 px-4" style={{ backgroundColor: '#fff', minHeight: '100vh', margin: 0, width: '100vw', maxWidth: '100%' }}>
      <div className="navbar" style={{ justifyContent: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', margin: '0 -1rem 1.5rem -1rem', padding: '1rem' }}>
        <div className="brand" style={{ fontSize: '1.75rem' }}>Fixr</div>
      </div>

      <div className="card text-center" style={{ boxShadow: 'var(--shadow-md)', border: 'none' }}>
        <h2 className="text-xl mb-4 font-bold">Request Status</h2>
        
        <div className="mb-6 flex justify-center">
            <div 
                style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundColor: getStatusColor(),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    boxShadow: complaint.status === 'New' ? 'var(--shadow-md)' : 'none'
                }}
                className={complaint.status === 'New' ? 'animate-pulse-new' : ''}
            >
                {complaint.status === 'Resolved' ? '✓' : (complaint.status === 'In Progress' ? '⚙' : '!')}
            </div>
        </div>

        <h3 className="text-2xl mb-2 font-bold" style={{ color: getStatusColor() }}>
            {complaint.status}
        </h3>

        <div className="mb-6">
            <strong className="text-lgblock mb-1">{complaint.category}</strong>
            <p className="text-sm">Room {complaint.room}</p>
        </div>

        {complaint.status === 'New' && (
            <p className="p-4" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', fontWeight: 500 }}>
                We're on it. Expect a resolution in ~15 minutes.
            </p>
        )}

        {complaint.status === 'In Progress' && (
            <p className="p-4" style={{ backgroundColor: '#e0f2fe', borderRadius: 'var(--radius-md)', color: '#0369a1', fontWeight: 500 }}>
                Staff is actively working on this right now.
            </p>
        )}

        {complaint.status === 'Resolved' && (
            <div>
                {complaint.staffAction && (
                    <div className="p-4 mb-4 text-left" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid var(--success)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-sm font-bold mb-1" style={{color: 'var(--text-main)', margin:0}}>Resolution Notes:</p>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{complaint.staffAction}</p>
                    </div>
                )}
                <div className="mt-6 p-4 rounded card" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                    <p className="mb-2 font-bold" style={{ color: '#b45309' }}>Were you happy with the fix?</p>
                    <p className="text-sm mb-4" style={{ color: '#b45309' }}>Help us by leaving a review!</p>
                    <button className="btn w-full font-bold" style={{ backgroundColor: '#fff', color: '#b45309', border: '1px solid #fde68a' }}>
                        Leave a Google Review
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default function GuestComplaintStatus() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading Status...</div>}>
      <StatusContent />
    </Suspense>
  );
}

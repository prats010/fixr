'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', alignItems: 'center' }}>
      
      <div className="text-center mb-8 pb-8 pt-12" style={{ maxWidth: '600px', borderBottom: '1px solid var(--border-color)' }}>
         <h1 style={{ fontSize: '4rem', color: 'var(--accent-primary)', marginBottom: '1rem', letterSpacing: '-0.05em' }}>Fixr.</h1>
         <p className="text-xl text-muted font-bold">AI-Powered Guest Complaint Management for Budget Hotels</p>
         <p className="mt-4">Resolve guest issues seamlessly. No app download. Instant front-desk updates. AI co-pilot resolution suggestions.</p>
      </div>

      <div className="grid gap-6 w-full" style={{ maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          
          <div className="card text-center justify-center items-center flex flex-col hover:shadow-lg transition-fast hover:-translate-y-1">
             <h2 className="text-xl font-bold mb-4">Front Desk Staff</h2>
             <p className="text-muted text-sm mb-6">Live dashboard with AI suggestions to handle guest requests instantly.</p>
             <Link href="/staff/login" className="btn btn-primary w-full">Staff Login</Link>
          </div>

          <div className="card text-center justify-center items-center flex flex-col hover:shadow-lg transition-fast hover:-translate-y-1">
             <h2 className="text-xl font-bold mb-4">Hotel Owner</h2>
             <p className="text-muted text-sm mb-6">Analytics dashboard to view resolution times and biggest issues.</p>
             <Link href="/staff/login" className="btn btn-primary w-full" style={{ backgroundColor: '#10b981' }}>Owner Login</Link>
          </div>

          <div className="card text-center justify-center items-center flex flex-col hover:shadow-lg transition-fast hover:-translate-y-1">
             <h2 className="text-xl font-bold mb-4">System Setup</h2>
             <p className="text-muted text-sm mb-6">Manage rooms, generate QR codes, and add new staff members.</p>
             <Link href="/admin" className="btn btn-secondary w-full">Admin Dashboard</Link>
          </div>
      </div>

      <div className="card mt-12 w-full text-center" style={{ maxWidth: '800px', border: '1px dashed var(--accent-primary)' }}>
          <h3 className="font-bold mb-2">Want to try the Demo Guest Flow?</h3>
          <p className="text-sm mb-4">Scan the QR below or click the link to see what the guest sees when they run into a problem in Room 204.</p>
          <div className="flex justify-center mb-4">
              {/* Note: This is an example placeholder, actual QR needs to be generated in admin area */}
              <div style={{ width: '150px', height: '150px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <p className="text-muted text-sm">QR Code<br/>(See Admin)</p>
              </div>
          </div>
          <Link href="/complaint?room=204&hotel=54e9fa70-9570-4510-85a1-011948a30420" className="btn btn-secondary">
             Open Guest Form (Room 204)
          </Link>
      </div>
      
    </div>
  );
}

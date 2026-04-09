'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const room = searchParams.get('room') || '';
  const hotelId = searchParams.get('hotel') || '';

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Hot Water', 'Wi-Fi', 'Cleanliness', 'Staff', 'Noise', 'Other'];

  if (!room || !hotelId) {
    return (
      <div className="container-narrow mt-8 text-center px-4">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Invalid Link</h2>
          <p>Please scan the QR code in your room again.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      setError('Please select a problem category');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId,
          room,
          category,
          description,
          guestName,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      
      const data = await res.json();
      router.push(`/complaint/status?id=${data.id}`);
    } catch (err) {
      setError('Failed to submit your request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-narrow mt-8 mb-8 pb-8 px-4" style={{ backgroundColor: '#fff', minHeight: '100vh', margin: 0, width: '100vw', maxWidth: '100%' }}>
        <div className="navbar" style={{ justifyContent: 'center', boxShadow: 'var(--shadow-sm)', backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)', margin: '0 -1rem 1.5rem -1rem', padding: '1rem' }}>
          <div className="brand" style={{ fontSize: '1.75rem' }}>Fixr</div>
        </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-md)', border: 'none' }}>
        <h2 className="text-xl mb-2 font-bold">Having an issue?</h2>
        <p className="mb-6">Room {room} &middot; We'll fix it right away.</p>

        {error && <div className="mb-4 text-sm font-bold" style={{ color: 'var(--danger)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">What's the problem? *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3"
              required
              style={{ fontSize: '1rem', padding: '0.875rem', backgroundColor: '#f8fafc' }}
            >
              <option value="" disabled>Select an option...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="description">Details (optional)</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The shower has no hot water"
              maxLength={200}
              style={{ resize: 'none', backgroundColor: '#f8fafc' }}
            />
          </div>

          <div className="form-group mb-6">
            <label htmlFor="guestName">Your Name (optional)</label>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Name"
              style={{ backgroundColor: '#f8fafc' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
            style={{ fontSize: '1.125rem', padding: '0.875rem' }}
          >
            {isSubmitting ? 'Sending...' : 'Fix this'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GuestComplaintForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading Complaint Form...</div>}>
      <FormContent />
    </Suspense>
  );
}

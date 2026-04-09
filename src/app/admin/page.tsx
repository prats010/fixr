'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [newRoom, setNewRoom] = useState('');
  
  // demo fixed layout
  const hotelId = '82050ef4-0ef4-4a13-9c0a-1c1a911bf6c0';

  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', role: 'staff' });

  const fetchData = async () => {
      try {
        const [roomsRes, staffRes] = await Promise.all([
            fetch(`/api/rooms?hotelId=${hotelId}`),
            fetch(`/api/staff?hotelId=${hotelId}`)
        ]);
        if (roomsRes.ok) setRooms(await roomsRes.json());
        if (staffRes.ok) setStaffList(await staffRes.json());
      } catch(e) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newRoom) return;
      await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotelId, roomNumber: newRoom })
      });
      setNewRoom('');
      fetchData();
  }

  const handleDeleteRoom = async (id: string) => {
      await fetch(`/api/rooms?id=${id}`, { method: 'DELETE' });
      fetchData();
  }

  const handleAddStaff = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hotelId, ...staffForm })
      });
      setStaffForm({ name: '', email: '', password: '', role: 'staff' });
      fetchData();
  }

  const handleDeleteStaff = async (id: string) => {
      await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
      fetchData();
  }

  return (
    <div className="container mt-4 mb-8">
      <div className="navbar mb-8" style={{ borderRadius: 'var(--radius-md)' }}>
         <div className="brand">Fixr Admin Setup</div>
         <button className="btn btn-secondary" onClick={() => router.push('/')}>Home</button>
      </div>

      <div className="grid flex-col gap-8">
          
          {/* Room Management Section */}
          <div className="card shadow-md">
              <h2 className="text-xl font-bold mb-4">Manage Rooms & QR Codes</h2>
              
              <form onSubmit={handleAddRoom} className="flex gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="e.g. 101" 
                    value={newRoom} 
                    onChange={e => setNewRoom(e.target.value)} 
                    style={{ maxWidth: '200px' }}
                  />
                  <button className="btn btn-primary" type="submit">Add Room</button>
              </form>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {rooms.map(room => (
                      <div key={room.id} className="card p-4 text-center" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                          <h3 className="text-lg font-bold mb-2">Room {room.roomNumber}</h3>
                          {room.qrCode && (
                              <img src={room.qrCode} alt={`QR for Room ${room.roomNumber}`} className="mb-4 mx-auto" style={{ width: '120px', height: '120px' }} />
                          )}
                          <div className="flex gap-2 justify-center">
                              {room.qrCode && (
                                <a href={room.qrCode} download={`Room_${room.roomNumber}_QR.png`} className="btn btn-secondary text-sm p-1">Download</a>
                              )}
                              <button onClick={() => handleDeleteRoom(room.id)} className="btn btn-secondary text-sm p-1" style={{ color: 'var(--danger)' }}>Remove</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Staff Management Section */}
          <div className="card shadow-md">
              <h2 className="text-xl font-bold mb-4">Manage Staff Accounts</h2>
              
              <form onSubmit={handleAddStaff} className="flex flex-wrap gap-4 mb-6 align-end items-end">
                  <div className="w-full" style={{ maxWidth: '200px' }}>
                    <label className="text-sm font-bold">Name</label>
                    <input type="text" required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                  </div>
                  <div className="w-full" style={{ maxWidth: '200px' }}>
                    <label className="text-sm font-bold">Email</label>
                    <input type="email" required value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} />
                  </div>
                  <div className="w-full" style={{ maxWidth: '200px' }}>
                    <label className="text-sm font-bold">Password</label>
                    <input type="password" required value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} />
                  </div>
                  <button className="btn btn-primary h-full mt-2" type="submit">Add User</button>
              </form>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          <th className="p-2 pb-3 text-sm">Name</th>
                          <th className="p-2 pb-3 text-sm">Email</th>
                          <th className="p-2 pb-3 text-sm">Role</th>
                          <th className="p-2 pb-3 text-sm text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {staffList.map((staff) => (
                          <tr key={staff.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td className="p-3 font-bold">{staff.name}</td>
                              <td className="p-3 text-sm">{staff.email}</td>
                              <td className="p-3"><span className="badge badge-progress">{staff.role}</span></td>
                              <td className="p-3 text-right">
                                  <button onClick={() => handleDeleteStaff(staff.id)} className="btn btn-secondary text-sm p-1" style={{ color: 'var(--danger)', border: 'none' }}>
                                      Remove
                                  </button>
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

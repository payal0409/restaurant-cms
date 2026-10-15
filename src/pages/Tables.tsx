import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addTable, getTables, updateTable } from '../services/api';
import { useData } from '../hooks';
import QRPlaceholder from '../components/QRPlaceholder';
import type { TableT } from '../types';
export default function Tables() {
  const [tables, reload] = useData<TableT[]>(getTables, []);
  const [seats, setSeats] = useState(4);
  return (
    <>
      <h1>Tables</h1>
      <div className="card row">
        <input type="number" min={1} value={seats} onChange={e => setSeats(+e.target.value)} aria-label="Seats" style={{ width: 90 }} />
        <button onClick={async () => { await addTable({ number: Math.max(0, ...tables.map(t => t.number)) + 1, seats, status: 'available' }); reload(); }}>Add table</button>
      </div>
      <div className="grid">
        {tables.map(t => (
          <div className="card" key={t.id}>
            <div className="row between"><strong>Table {t.number}</strong><span className={`badge ${t.status}`}>{t.status}</span></div>
            <p className="muted">{t.seats} seats</p>
            <QRPlaceholder seed={t.number} />
            <div className="row" style={{ marginTop: 10 }}>
              <Link to={`/order/${t.id}`}><button>Open QR menu</button></Link>
              <button className="ghost" onClick={async () => { await updateTable({ ...t, status: t.status === 'available' ? 'occupied' : 'available' }); reload(); }}>Mark {t.status === 'available' ? 'occupied' : 'available'}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

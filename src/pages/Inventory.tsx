import { useState } from 'react';
import { addInventoryItem, getInventory, updateInventoryItem } from '../services/api';
import { useData } from '../hooks';
import type { InventoryItem } from '../types';
export default function Inventory() {
  const [items, reload] = useData<InventoryItem[]>(getInventory, []);
  const [f, setF] = useState({ name: '', unit: 'kg', qty: 0, minQty: 0 });
  const low = items.filter(i => i.qty <= i.minQty);
  const setQty = async (i: InventoryItem, qty: number) => { await updateInventoryItem({ ...i, qty: Math.max(0, qty) }); reload(); };
  return (
    <>
      <h1>Inventory</h1>
      {low.length > 0 && <div className="alert"><strong>Low stock:</strong> {low.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ')}</div>}
      <div className="card"><h2>Add stock item</h2><div className="row">
        <input placeholder="Item name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
        <input placeholder="Unit" value={f.unit} onChange={e => setF({ ...f, unit: e.target.value })} style={{ width: 80 }} />
        <input type="number" min={0} placeholder="Qty" value={f.qty || ''} onChange={e => setF({ ...f, qty: +e.target.value })} style={{ width: 90 }} />
        <input type="number" min={0} placeholder="Min qty" value={f.minQty || ''} onChange={e => setF({ ...f, minQty: +e.target.value })} style={{ width: 90 }} />
        <button onClick={async () => { if (!f.name.trim()) return alert('Please enter a name'); await addInventoryItem(f); setF({ name: '', unit: 'kg', qty: 0, minQty: 0 }); reload(); }}>Add item</button>
      </div></div>
      <div className="card scroll"><table className="tbl"><thead><tr><th>Item</th><th>Stock</th><th>Min</th><th>Status</th><th>Update quantity</th></tr></thead><tbody>
        {items.map(i => (
          <tr key={i.id}><td>{i.name}</td><td>{i.qty} {i.unit}</td><td>{i.minQty}</td>
            <td><span className={`badge ${i.qty <= i.minQty ? 'low' : 'ok'}`}>{i.qty <= i.minQty ? 'Low stock' : 'In stock'}</span></td>
            <td><div className="qty"><button className="ghost" onClick={() => setQty(i, i.qty - 1)}>−</button>
              <input type="number" min={0} value={i.qty} onChange={e => setQty(i, +e.target.value)} style={{ width: 80 }} aria-label={`${i.name} quantity`} />
              <button onClick={() => setQty(i, i.qty + 1)}>+</button></div></td></tr>
        ))}
      </tbody></table></div>
    </>
  );
}

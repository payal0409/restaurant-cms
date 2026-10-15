import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createOrder, getCategories, getMenu, getTables } from '../services/api';
import { money, useData } from '../hooks';
import type { Category, MenuItem, TableT } from '../types';
// Customer-facing menu: scanning a table QR code opens /#/order/:tableId.
export default function QROrder() {
  const { tableId } = useParams();
  const [tables] = useData<TableT[]>(getTables, []);
  const [cats] = useData<Category[]>(getCategories, []);
  const [menu] = useData<MenuItem[]>(getMenu, []);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [catId, setCatId] = useState(0);
  const [placed, setPlaced] = useState<number | null>(null);
  const [tid, setTid] = useState<number>(Number(tableId) || 1);
  const list = menu.filter(m => m.available && (!catId || m.categoryId === catId));
  const lines = menu.filter(m => cart[m.id] > 0).map(m => ({ menuItemId: m.id, name: m.name, price: m.price, qty: cart[m.id] }));
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const change = (id: number, d: number) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + d) }));
  const place = async () => { const o = await createOrder(tid, lines); setPlaced(o.id); setCart({}); };
  return (
    <>
      <h1>Our menu</h1>
      <div className="row" style={{ marginBottom: 14 }}>
        <label>Table <select value={tid} onChange={e => setTid(+e.target.value)}>{tables.map(t => <option key={t.id} value={t.id}>Table {t.number}</option>)}</select></label>
      </div>
      {placed && <div className="success">Order #{placed} has been placed and sent to the kitchen.</div>}
      <div className="row" style={{ marginBottom: 14 }}>
        <button className={catId ? 'ghost' : ''} onClick={() => setCatId(0)}>All</button>
        {cats.map(c => <button key={c.id} className={catId === c.id ? '' : 'ghost'} onClick={() => setCatId(c.id)}>{c.name}</button>)}
      </div>
      <div className="grid">
        {list.map(m => (
          <div className="card" key={m.id}>
            <strong>{m.name}</strong> <span className="muted">{m.veg ? '(Veg)' : '(Non-veg)'}</span>
            <p>{money(m.price)}</p>
            <div className="qty"><button className="ghost" aria-label="Decrease" onClick={() => change(m.id, -1)}>−</button><span>{cart[m.id] || 0}</span><button aria-label="Increase" onClick={() => change(m.id, 1)}>+</button></div>
          </div>
        ))}
      </div>
      <div className="card"><h2>Your cart</h2>
        {lines.length === 0 ? <p className="muted">Your cart is empty. Add items from the menu.</p> : <>
          {lines.map(l => <div key={l.menuItemId} className="row between"><span>{l.name} x{l.qty}</span><span>{money(l.price * l.qty)}</span></div>)}
          <p className="total">Total: {money(total)}</p>
          <button onClick={place}>Place order</button></>}
      </div>
    </>
  );
}

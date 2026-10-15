import { useState } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';
import { money, useData } from '../hooks';
import type { Order, OrderStatus } from '../types';
const statuses: OrderStatus[] = ['new', 'preparing', 'ready', 'served'];
export default function Orders() {
  const [orders, reload] = useData<Order[]>(getOrders, []);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const shown = [...orders].reverse().filter(o => filter === 'all' || o.status === filter);
  return (
    <>
      <h1>Orders</h1>
      <div className="row" style={{ marginBottom: 14 }}>
        {(['all', ...statuses] as const).map(s => <button key={s} className={filter === s ? '' : 'ghost'} onClick={() => setFilter(s)}>{s}</button>)}
      </div>
      <div className="card scroll"><table className="tbl"><thead><tr><th>Order</th><th>Table</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>
        {shown.map(o => (
          <tr key={o.id}><td>#{o.id}</td><td>{o.tableId}</td><td>{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td>
            <td>{money(o.items.reduce((s, i) => s + i.price * i.qty, 0))}</td>
            <td><span className={`badge ${o.paid ? 'ok' : 'low'}`}>{o.paid ? 'Paid' : 'Unpaid'}</span></td>
            <td><select value={o.status} onChange={async e => { await updateOrderStatus(o.id, e.target.value as OrderStatus); reload(); }}>{statuses.map(s => <option key={s}>{s}</option>)}</select></td></tr>
        ))}
        {shown.length === 0 && <tr><td colSpan={6} className="muted">No orders match this filter.</td></tr>}
      </tbody></table></div>
    </>
  );
}

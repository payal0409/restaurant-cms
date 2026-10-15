import { getOrders, updateOrderStatus } from '../services/api';
import { useData } from '../hooks';
import type { Order, OrderStatus } from '../types';
const cols: { key: OrderStatus; title: string; next?: OrderStatus; label?: string }[] = [
  { key: 'new', title: 'New', next: 'preparing', label: 'Start preparing' },
  { key: 'preparing', title: 'Preparing', next: 'ready', label: 'Mark ready' },
  { key: 'ready', title: 'Ready', next: 'served', label: 'Mark served' },
];
export default function Kitchen() {
  const [orders, reload] = useData<Order[]>(getOrders, []);
  return (
    <>
      <h1>Kitchen display</h1>
      <div className="kcols">
        {cols.map(c => (
          <div key={c.key}><h2>{c.title} ({orders.filter(o => o.status === c.key).length})</h2>
            {orders.filter(o => o.status === c.key).map(o => (
              <div className="card" key={o.id}>
                <div className="row between"><strong>Order #{o.id}</strong><span className="muted">Table {o.tableId}</span></div>
                <ul>{o.items.map(i => <li key={i.menuItemId}>{i.name} x{i.qty}</li>)}</ul>
                <button onClick={async () => { await updateOrderStatus(o.id, c.next!); reload(); }}>{c.label}</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

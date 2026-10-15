import { getBills, getOrders } from '../services/api';
import { money, useData } from '../hooks';
import type { Order, Bill } from '../types';
export default function Dashboard() {
  const [orders] = useData<Order[]>(getOrders, []);
  const [bills] = useData<Bill[]>(getBills, []);
  const today = new Date().toISOString().slice(0, 10);
  const sales = bills.filter(b => b.createdAt.startsWith(today)).reduce((s, b) => s + b.total, 0);
  const todays = orders.filter(o => o.createdAt.startsWith(today));
  const pending = orders.filter(o => o.status === 'new' || o.status === 'preparing');
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="card stat"><div className="v">{money(sales)}</div><div className="l">Today's sales</div></div>
        <div className="card stat"><div className="v">{todays.length}</div><div className="l">Total orders today</div></div>
        <div className="card stat"><div className="v">{pending.length}</div><div className="l">Pending orders</div></div>
      </div>
      <div className="card"><h2>Pending orders</h2>
        {pending.length === 0 ? <p className="muted">No pending orders right now.</p> :
          <div className="scroll"><table className="tbl"><thead><tr><th>Order</th><th>Table</th><th>Items</th><th>Status</th></tr></thead><tbody>
            {pending.map(o => <tr key={o.id}><td>#{o.id}</td><td>{o.tableId}</td><td>{o.items.map(i => `${i.name} x${i.qty}`).join(', ')}</td><td><span className={`badge ${o.status}`}>{o.status}</span></td></tr>)}
          </tbody></table></div>}
      </div>
    </>
  );
}

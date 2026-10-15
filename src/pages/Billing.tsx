import { useState } from 'react';
import { createBill, getBills, getOrders } from '../services/api';
import { TAX_RATE } from '../mock/data';
import { money, useData } from '../hooks';
import type { Bill, Order, PayMethod } from '../types';
export default function Billing() {
  const [orders, ro] = useData<Order[]>(getOrders, []);
  const [bills, rb] = useData<Bill[]>(getBills, []);
  const [orderId, setOrderId] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState<PayMethod>('cash');
  const [done, setDone] = useState<Bill | null>(null);
  const unpaid = orders.filter(o => !o.paid);
  const order = unpaid.find(o => o.id === orderId);
  const subtotal = order ? order.items.reduce((s, i) => s + i.price * i.qty, 0) : 0;
  const disc = +(subtotal * Math.min(100, Math.max(0, discount)) / 100).toFixed(2);
  const tax = +((subtotal - disc) * TAX_RATE / 100).toFixed(2);
  const total = +(subtotal - disc + tax).toFixed(2);
  const pay = async () => { if (!order) return; setDone(await createBill(order.id, discount, method)); setOrderId(0); setDiscount(0); ro(); rb(); };
  return (
    <>
      <h1>Billing</h1>
      {done && <div className="success">Bill #{done.id} generated — {money(done.total)} ({done.method}). Payment received.</div>}
      <div className="card"><h2>Generate bill</h2>
        <div className="row">
          <select value={orderId} onChange={e => setOrderId(+e.target.value)} aria-label="Order">
            <option value={0}>Select unpaid order…</option>
            {unpaid.map(o => <option key={o.id} value={o.id}>Order #{o.id} — Table {o.tableId}</option>)}
          </select>
          <label>Discount % <input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(+e.target.value)} style={{ width: 80 }} /></label>
          <select value={method} onChange={e => setMethod(e.target.value as PayMethod)} aria-label="Payment method">
            <option value="cash">Cash</option><option value="card">Card</option><option value="upi">UPI</option>
          </select>
        </div>
        {order && <div style={{ marginTop: 14, maxWidth: 420 }}>
          {order.items.map(i => <div key={i.menuItemId} className="row between"><span>{i.name} x{i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
          <hr />
          <div className="row between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="row between"><span>Discount ({discount}%)</span><span>− {money(disc)}</span></div>
          <div className="row between"><span>Tax (GST {TAX_RATE}%)</span><span>{money(tax)}</span></div>
          <div className="row between total"><span>Total</span><span>{money(total)}</span></div>
          <button style={{ marginTop: 10 }} onClick={pay}>Collect payment ({method})</button>
        </div>}
      </div>
      <div className="card scroll"><h2>Bill history</h2><table className="tbl"><thead><tr><th>Bill</th><th>Order</th><th>Subtotal</th><th>Discount</th><th>Tax</th><th>Total</th><th>Method</th></tr></thead><tbody>
        {[...bills].reverse().map(b => <tr key={b.id}><td>#{b.id}</td><td>#{b.orderId}</td><td>{money(b.subtotal)}</td><td>{money(b.discountAmount)}</td><td>{money(b.taxAmount)}</td><td>{money(b.total)}</td><td>{b.method}</td></tr>)}
      </tbody></table></div>
    </>
  );
}

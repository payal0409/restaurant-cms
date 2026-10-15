import { useState } from 'react';
import { addExpense, deleteExpense, getExpenses } from '../services/api';
import { money, useData } from '../hooks';
import type { Expense } from '../types';
const CATS = ['Raw material', 'Utilities', 'Salary', 'Rent', 'Maintenance', 'Other'];
export default function Expenses() {
  const [list, reload] = useData<Expense[]>(getExpenses, []);
  const blank = { title: '', category: CATS[0], amount: 0, date: new Date().toISOString().slice(0, 10) };
  const [f, setF] = useState(blank);
  const total = list.reduce((s, e) => s + e.amount, 0);
  return (
    <>
      <h1>Expenses</h1>
      <div className="card"><h2>Add expense</h2><div className="row">
        <input placeholder="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
        <select value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
        <input type="number" min={0} placeholder="Amount" value={f.amount || ''} onChange={e => setF({ ...f, amount: +e.target.value })} style={{ width: 110 }} />
        <input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} />
        <button onClick={async () => { if (!f.title.trim() || f.amount <= 0) return alert('Please enter a title and a valid amount'); await addExpense(f); setF(blank); reload(); }}>Add expense</button>
      </div></div>
      <div className="card scroll"><div className="row between"><h2>All expenses</h2><span className="total">Total: {money(total)}</span></div>
        <table className="tbl"><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th /></tr></thead><tbody>
          {[...list].reverse().map(e => <tr key={e.id}><td>{e.date}</td><td>{e.title}</td><td>{e.category}</td><td>{money(e.amount)}</td>
            <td><button className="danger" onClick={async () => { await deleteExpense(e.id); reload(); }}>Delete</button></td></tr>)}
        </tbody></table></div>
    </>
  );
}

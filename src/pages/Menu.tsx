import { useState } from 'react';
import { addCategory, addMenuItem, deleteCategory, deleteMenuItem, getCategories, getMenu, updateMenuItem } from '../services/api';
import { money, useData } from '../hooks';
import type { Category, MenuItem } from '../types';
const empty: Partial<MenuItem> = { name: '', price: 0, veg: true, available: true };
export default function Menu() {
  const [cats, rc] = useData<Category[]>(getCategories, []);
  const [items, ri] = useData<MenuItem[]>(getMenu, []);
  const [form, setForm] = useState<Partial<MenuItem>>(empty);
  const [catName, setCatName] = useState('');
  const save = async () => {
    if (!form.name?.trim() || !form.price || form.price <= 0) return alert('Please enter a name and a valid price');
    const data = { ...form, categoryId: form.categoryId ?? cats[0]?.id } as MenuItem;
    if (!data.categoryId) return alert('Please add a category first');
    if (data.id) await updateMenuItem(data); else await addMenuItem(data);
    setForm(empty); ri();
  };
  const addCat = async () => { if (!catName.trim()) return; await addCategory({ name: catName.trim() }); setCatName(''); rc(); };
  const delCat = async (c: Category) => {
    if (items.some(i => i.categoryId === c.id)) return alert('This category still has items. Delete or move them first.');
    await deleteCategory(c.id); rc();
  };
  return (
    <>
      <h1>Menu management</h1>
      <div className="card"><h2>Categories</h2>
        <div className="row">
          {cats.map(c => <span key={c.id} className="badge">{c.name} <button className="danger" style={{ padding: '0 6px', marginLeft: 4 }} aria-label={`Delete ${c.name}`} onClick={() => delCat(c)}>×</button></span>)}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <input placeholder="New category" value={catName} onChange={e => setCatName(e.target.value)} />
          <button onClick={addCat}>Add category</button>
        </div>
      </div>
      <div className="card"><h2>{form.id ? 'Edit item' : 'Add item'}</h2>
        <div className="row">
          <input placeholder="Item name" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="number" min={0} placeholder="Price" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} />
          <select value={form.categoryId ?? cats[0]?.id ?? ''} onChange={e => setForm({ ...form, categoryId: +e.target.value })}>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label><input type="checkbox" checked={!!form.veg} onChange={e => setForm({ ...form, veg: e.target.checked })} /> Veg</label>
          <label><input type="checkbox" checked={!!form.available} onChange={e => setForm({ ...form, available: e.target.checked })} /> Available</label>
          <button onClick={save}>{form.id ? 'Update item' : 'Add item'}</button>
          {form.id && <button className="ghost" onClick={() => setForm(empty)}>Cancel</button>}
        </div>
      </div>
      <div className="card scroll"><table className="tbl"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Status</th><th /></tr></thead><tbody>
        {items.map(i => (
          <tr key={i.id}><td>{i.name}</td><td>{cats.find(c => c.id === i.categoryId)?.name}</td><td>{money(i.price)}</td><td>{i.veg ? 'Veg' : 'Non-veg'}</td>
            <td><span className={`badge ${i.available ? 'ok' : 'low'}`}>{i.available ? 'Available' : 'Unavailable'}</span></td>
            <td className="row"><button className="ghost" onClick={() => { setForm(i); window.scrollTo(0, 0); }}>Edit</button>
              <button className="danger" onClick={async () => { if (confirm(`Delete ${i.name}?`)) { await deleteMenuItem(i.id); ri(); } }}>Delete</button></td></tr>
        ))}
      </tbody></table></div>
    </>
  );
}

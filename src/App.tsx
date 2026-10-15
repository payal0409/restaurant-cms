import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Tables from './pages/Tables';
import QROrder from './pages/QROrder';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
import { resetDemoData } from './services/api';

const links = [
  ['/', '🏠 Dashboard'], ['/menu', '🍰 Menu'], ['/tables', '🪑 Tables'], ['/order/1', '📱 QR Ordering'], ['/orders', '🧾 Orders'],
  ['/kitchen', '👩‍🍳 Kitchen'], ['/billing', '💳 Billing'], ['/inventory', '📦 Inventory'], ['/expenses', '💸 Expenses'],
];
export default function App() {
  return (
    <div className="shell">
      <nav className="nav">
        <div className="brand">🌸 Blush Café</div>
        <div className="links">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>)}
        </div>
        <button className="ghost reset" onClick={() => { if (confirm('Reset all demo data to the original sample data?')) { resetDemoData(); location.reload(); } }}>Reset demo data</button>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/order/:tableId" element={<QROrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </main>
    </div>
  );
}

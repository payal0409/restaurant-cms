// MOCK API LAYER — only this file touches data (localStorage).
// When Django REST APIs are ready, replace these functions with fetch()/axios calls; the UI stays unchanged.
import * as seed from '../mock/data';
import type { Category, MenuItem, TableT, Order, OrderStatus, OrderItem, Bill, PayMethod, InventoryItem, Expense } from '../types';

const delay = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 120));
const P = 'rcms_';
function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(P + key); if (s) return JSON.parse(s) as T; } catch { /* ignore */ }
  localStorage.setItem(P + key, JSON.stringify(fallback)); return fallback;
}
const save = (key: string, v: unknown) => localStorage.setItem(P + key, JSON.stringify(v));
const nextId = (a: { id: number }[]) => a.reduce((m, x) => Math.max(m, x.id), 0) + 1;

function crud<T extends { id: number }>(key: string, data: T[]) {
  return {
    list: () => delay(load<T[]>(key, data)),
    add: async (x: Omit<T, 'id'>) => { const a = load<T[]>(key, data); const n = { ...x, id: nextId(a) } as T; save(key, [...a, n]); return delay(n); },
    update: async (x: T) => { save(key, load<T[]>(key, data).map(i => (i.id === x.id ? x : i))); return delay(x); },
    remove: async (id: number) => { save(key, load<T[]>(key, data).filter(i => i.id !== id)); return delay(true); },
  };
}
const cats = crud<Category>('categories', seed.categories);
const items = crud<MenuItem>('menu', seed.menu);
const tbls = crud<TableT>('tables', seed.tables);
const inv = crud<InventoryItem>('inventory', seed.inventory);
const exp = crud<Expense>('expenses', seed.expenses);

// Menu
export const getCategories = cats.list; export const addCategory = cats.add; export const deleteCategory = cats.remove;
export const getMenu = items.list; export const addMenuItem = items.add; export const updateMenuItem = items.update; export const deleteMenuItem = items.remove;
// Tables
export const getTables = tbls.list; export const addTable = tbls.add; export const updateTable = tbls.update;
// Inventory
export const getInventory = inv.list; export const addInventoryItem = inv.add; export const updateInventoryItem = inv.update;
// Expenses
export const getExpenses = exp.list; export const addExpense = exp.add; export const deleteExpense = exp.remove;

// Orders
export const getOrders = () => delay(load<Order[]>('orders', seed.orders));
export async function createOrder(tableId: number, orderItems: OrderItem[]): Promise<Order> {
  const all = load<Order[]>('orders', seed.orders);
  const order: Order = { id: nextId(all), tableId, items: orderItems, status: 'new', paid: false, createdAt: new Date().toISOString() };
  save('orders', [...all, order]);
  const t = load<TableT[]>('tables', seed.tables);
  save('tables', t.map(x => (x.id === tableId ? { ...x, status: 'occupied' } : x)));
  return delay(order);
}
export async function updateOrderStatus(id: number, status: OrderStatus) {
  save('orders', load<Order[]>('orders', seed.orders).map(o => (o.id === id ? { ...o, status } : o)));
  return delay(true);
}

// Billing
export const getBills = () => delay(load<Bill[]>('bills', seed.bills));
export async function createBill(orderId: number, discountPercent: number, method: PayMethod): Promise<Bill> {
  const orders = load<Order[]>('orders', seed.orders);
  const order = orders.find(o => o.id === orderId)!;
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = +(subtotal * discountPercent / 100).toFixed(2);
  const taxAmount = +((subtotal - discountAmount) * seed.TAX_RATE / 100).toFixed(2);
  const bills = load<Bill[]>('bills', seed.bills);
  const bill: Bill = { id: nextId(bills), orderId, subtotal, taxAmount, discountAmount, total: +(subtotal - discountAmount + taxAmount).toFixed(2), method, createdAt: new Date().toISOString() };
  save('bills', [...bills, bill]);
  save('orders', orders.map(o => (o.id === orderId ? { ...o, paid: true, status: 'served' as OrderStatus } : o)));
  const still = orders.some(o => o.tableId === order.tableId && o.id !== orderId && !o.paid);
  if (!still) save('tables', load<TableT[]>('tables', seed.tables).map(t => (t.id === order.tableId ? { ...t, status: 'available' } : t)));
  return delay(bill);
}
export const resetDemoData = () => { Object.keys(localStorage).filter(k => k.startsWith(P)).forEach(k => localStorage.removeItem(k)); };

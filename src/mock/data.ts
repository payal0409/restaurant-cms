import type { Category, MenuItem, TableT, Order, Bill, InventoryItem, Expense } from '../types';
const now = new Date().toISOString();
const today = now.slice(0, 10);
export const TAX_RATE = 5; // percent (GST)
export const categories: Category[] = [
  { id: 1, name: 'Starters' }, { id: 2, name: 'Main Course' }, { id: 3, name: 'Beverages' }, { id: 4, name: 'Desserts' },
];
export const menu: MenuItem[] = [
  { id: 1, categoryId: 1, name: 'Paneer Tikka', price: 220, veg: true, available: true },
  { id: 2, categoryId: 1, name: 'Chicken Wings', price: 260, veg: false, available: true },
  { id: 3, categoryId: 1, name: 'French Fries', price: 120, veg: true, available: true },
  { id: 4, categoryId: 2, name: 'Butter Chicken', price: 340, veg: false, available: true },
  { id: 5, categoryId: 2, name: 'Dal Makhani', price: 240, veg: true, available: true },
  { id: 6, categoryId: 2, name: 'Veg Biryani', price: 230, veg: true, available: true },
  { id: 7, categoryId: 3, name: 'Cold Coffee', price: 130, veg: true, available: true },
  { id: 8, categoryId: 3, name: 'Masala Chai', price: 50, veg: true, available: true },
  { id: 9, categoryId: 3, name: 'Fresh Lime Soda', price: 80, veg: true, available: false },
  { id: 10, categoryId: 4, name: 'Gulab Jamun', price: 90, veg: true, available: true },
  { id: 11, categoryId: 4, name: 'Brownie with Ice Cream', price: 160, veg: true, available: true },
];
export const tables: TableT[] = [
  { id: 1, number: 1, seats: 2, status: 'available' }, { id: 2, number: 2, seats: 4, status: 'occupied' },
  { id: 3, number: 3, seats: 4, status: 'available' }, { id: 4, number: 4, seats: 6, status: 'occupied' },
  { id: 5, number: 5, seats: 2, status: 'available' }, { id: 6, number: 6, seats: 8, status: 'available' },
];
export const orders: Order[] = [
  { id: 1, tableId: 2, status: 'new', paid: false, createdAt: now, items: [{ menuItemId: 4, name: 'Butter Chicken', price: 340, qty: 1 }, { menuItemId: 8, name: 'Masala Chai', price: 50, qty: 2 }] },
  { id: 2, tableId: 4, status: 'preparing', paid: false, createdAt: now, items: [{ menuItemId: 6, name: 'Veg Biryani', price: 230, qty: 2 }, { menuItemId: 7, name: 'Cold Coffee', price: 130, qty: 2 }] },
  { id: 3, tableId: 1, status: 'served', paid: true, createdAt: now, items: [{ menuItemId: 1, name: 'Paneer Tikka', price: 220, qty: 1 }, { menuItemId: 10, name: 'Gulab Jamun', price: 90, qty: 2 }] },
];
export const bills: Bill[] = [
  { id: 1, orderId: 3, subtotal: 400, taxAmount: 20, discountAmount: 0, total: 420, method: 'upi', createdAt: now },
];
export const inventory: InventoryItem[] = [
  { id: 1, name: 'Paneer', unit: 'kg', qty: 12, minQty: 5 }, { id: 2, name: 'Chicken', unit: 'kg', qty: 4, minQty: 8 },
  { id: 3, name: 'Basmati Rice', unit: 'kg', qty: 30, minQty: 10 }, { id: 4, name: 'Milk', unit: 'litre', qty: 6, minQty: 10 },
  { id: 5, name: 'Coffee Powder', unit: 'kg', qty: 3, minQty: 2 },
];
export const expenses: Expense[] = [
  { id: 1, title: 'Vegetables purchase', category: 'Raw material', amount: 2400, date: today },
  { id: 2, title: 'Electricity bill', category: 'Utilities', amount: 6800, date: today },
  { id: 3, title: 'Staff salary advance', category: 'Salary', amount: 5000, date: today },
];

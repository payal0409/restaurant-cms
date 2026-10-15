export type OrderStatus = 'new' | 'preparing' | 'ready' | 'served';
export interface Category { id: number; name: string }
export interface MenuItem { id: number; categoryId: number; name: string; price: number; veg: boolean; available: boolean }
export interface TableT { id: number; number: number; seats: number; status: 'available' | 'occupied' }
export interface OrderItem { menuItemId: number; name: string; price: number; qty: number }
export interface Order { id: number; tableId: number; items: OrderItem[]; status: OrderStatus; paid: boolean; createdAt: string }
export type PayMethod = 'cash' | 'card' | 'upi';
export interface Bill { id: number; orderId: number; subtotal: number; taxAmount: number; discountAmount: number; total: number; method: PayMethod; createdAt: string }
export interface InventoryItem { id: number; name: string; unit: string; qty: number; minQty: number }
export interface Expense { id: number; title: string; category: string; amount: number; date: string }

# Blush Café — Restaurant & Café Management System (Frontend)

React + TypeScript + Vite. **No backend required** — all data lives in a mock service layer backed by localStorage.

## Run
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + production build
```
Requires Node 18+.

## Modules
Dashboard · Menu (items + categories CRUD) · Tables (QR placeholders) · QR Ordering (`/#/order/:tableId`) ·
Orders (status updates) · Kitchen Display · Billing (5% GST, discount, cash/card/UPI) · Inventory (low-stock alerts) · Expenses.

## Project structure
```
src/
  mock/data.ts        # realistic seed data
  services/api.ts     # mock APIs: getMenu, getOrders, createOrder, updateOrderStatus, createBill ...
  pages/              # screens (they only call the service layer)
  components/         # reusable UI (QRPlaceholder)
  hooks.ts  types.ts  styles.css
database/schema.sql   # SQL table design
database/ER_DIAGRAM.md
```

## Demo flow
1. Tables → "Open QR menu" → add items → Place order.
2. Kitchen: move the order New → Preparing → Ready → Served.
3. Billing: pick the order, set discount and payment method, generate the bill.
4. Dashboard updates with sales and order counts. Data survives a refresh; "Reset demo data" in the sidebar restores the samples.

## Moving to Django REST later
Components never fetch data directly; only `services/api.ts` does. Replace each function (e.g. `getOrders`) with a
`fetch('/api/orders/')` call while keeping the same names and return types, and the UI needs no rewrite.

## Screenshots
Run the app and save a screenshot of each module in the `screenshots/` folder.

// Placeholder pattern only (not a real QR code). Deterministic per table number.
export default function QRPlaceholder({ seed }: { seed: number }) {
  const n = 9; const cells: JSX.Element[] = [];
  const corner = (x: number, y: number) => (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const on = corner(x, y) || ((x * 7 + y * 13 + seed * 5 + x * y) % 3 === 0);
    if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#16212b" />);
  }
  return <svg className="qr" viewBox={`0 0 ${n} ${n}`} role="img" aria-label={`QR placeholder for table ${seed}`}>{cells}</svg>;
}

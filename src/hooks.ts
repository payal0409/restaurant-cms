import { useCallback, useEffect, useState } from 'react';
export function useData<T>(fn: () => Promise<T>, init: T): [T, () => void] {
  const [d, setD] = useState<T>(init);
  const reload = useCallback(() => { fn().then(setD); }, [fn]);
  useEffect(reload, [reload]);
  return [d, reload];
}
export const money = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

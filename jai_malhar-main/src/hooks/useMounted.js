import { useEffect, useState } from 'react';

// Returns true once the component has mounted on the client.
// Useful for triggering entrance animations only after hydration.
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

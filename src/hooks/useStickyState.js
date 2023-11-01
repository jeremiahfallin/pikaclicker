import { useEffect, useState } from "react";
import SuperJSON from "superjson";

export default function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? SuperJSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, SuperJSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

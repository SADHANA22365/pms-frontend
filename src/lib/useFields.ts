import { useState, type ChangeEvent } from "react";

type El = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Usage: const { values, bind } = useFields({ name: "" });  <input {...bind("name")} />
export function useFields<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const bind = (name: keyof T) => ({
    value: values[name],
    onChange: (e: ChangeEvent<El>) =>
      setValues((v) => ({ ...v, [name]: e.target.value }) as T),
  });
  return { values, bind };
}
import type { Page } from "../types/api";

export function items<T>(d: T[] | Page<T> | undefined): T[] {
  if (!d) return [];
  return Array.isArray(d) ? d : d.content;
}

export function pageOf<T>(d: T[] | Page<T> | undefined): Page<T> | null {
  return d && !Array.isArray(d) ? d : null;
}
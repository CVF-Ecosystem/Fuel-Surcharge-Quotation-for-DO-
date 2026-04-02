/**
 * API base path — derived from Vite's BASE_URL.
 * Dev:  '' (empty)  → fetch('/api/...')
 * Prod: '/QD209'    → fetch('/QD209/api/...')
 */
export const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

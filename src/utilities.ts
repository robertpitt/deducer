/**
 * trim
 */
export const upper = (s: string) => s.toUpperCase()
export const lower = (s: string) => s.toLowerCase()

/**
 * 
 */
export const pipe = (...functions: Function[]) => (args: any[]) => functions.reduce((arg, fn) => fn(arg), args);
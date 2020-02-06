/**
 *
 */
export const pipe = (...fns: Function[]) => (args: any[]) => fns.reduce((arg, fn) => fn(arg), args)

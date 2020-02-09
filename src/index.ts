import { AnyFunction, Function1 } from '@babakness/pipe-compose-types'
import { pipe } from 'pipe-and-compose'
import * as path from 'object-path'

export type Deduction = {
  source: path.Path
  destination?: path.Path
  reducers?: Function1[]
}

// Transform an input based on a map of transform actions
export const deduce = <I extends object, O extends object>(input: I, deductions: Deduction[]): O => {
  return deductions.reduce<O>((o, { source, destination, reducers = [] }) => {
    // Create a new transform stack that will process the current value
    const transform = pipe(
      () => Array.isArray(source) ? source.map(k => path.get(input, k)) : path.get(input, source),
      ...reducers
    )
  
    // Execute the pipline and set the result to the target key on the output object
    path.set(o, destination || source, transform())
    return o
  }, Object.create({}))
}
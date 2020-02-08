import { AnyFunction } from '@babakness/pipe-compose-types'
import { pipe } from 'pipe-and-compose'
import * as path from 'object-path'

export type Deduction = {
  source: path.Path
  destination: path.Path
  reducers?: AnyFunction[]
}

// Transform an input based on a map of transform actions
export const deduce = (input: object, deductions: Deduction[]): object => {
  return deductions.reduce((o, { source, destination, reducers = [] }) => {
    // Create a new transform stack that will process the current value
    const transform = pipe(
      () => Array.isArray(source) ? source.map(k => path.get(input, k)) : path.get(input, source),
      ...reducers
    )
  
    // Execute the pipline and set the result to the target key on the output object
    path.set(o, destination, transform())
    return o
  }, {})
}

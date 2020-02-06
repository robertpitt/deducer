import { AnyFunction, PipeFn } from '@babakness/pipe-compose-types'
import { pipe } from 'pipe-and-compose'
import * as path from 'object-path'

// Export Types
export type TransformationMap = [path.Path, path.Path, ...AnyFunction[]][]

// Transform an input based on a map of transform actions
export const transform = (input: object, map: TransformationMap): object => {
  // Use Reduce
  return map.reduce((o, [sourcePath, targetPath, ...transforms]) => {
    // Create a new transform stack that will process the current value
    const transform = pipe(
      () =>
        Array.isArray(sourcePath)
          ? sourcePath.map(k => path.get(input, k))
          : path.get(input, sourcePath),
      ...transforms
    )
    // Execute the pipline and set the result to the target key on the output object
    path.set(o, targetPath, transform())
    // Return the
    return o
  }, {})
}

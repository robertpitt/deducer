import { pipe } from 'pipe-and-compose'
import * as invariant from 'invariant'
import * as path from 'object-path'

/**
 * Some generic types
 * @todo Improve the typesystem
 */
export type DestinationKey = string
export type KVObject = { [key: string]: any }
export type InputModel = any[] | KVObject
export type AnyFunction = (arg: any) => any
export type Element = [path.Path, path.Path, ...AnyFunction[]]
export type ElementMap = Element[]

/**
 * Helper function used to curry function call results into the next function (RTL not LTR)
 */
// export const pipe = (...fns: Function[]) => (args: any[]) => fns.reduce((arg, fn) => fn(arg), args)

/**
 * Transform an input based on a map of transform actions
 */
export const transform = (input: InputModel, map: ElementMap): KVObject => {
  invariant(
    input instanceof Array || input instanceof Object,
    'Array or Object only for transformer input.'
  )
  invariant(map instanceof Array, 'Map must be an array of transforms')

  // Use Reduce
  return map.reduce((o, [sourcePath, targetPath, ...transforms]) => {
    // Create a new execution stack that will process the current transfomration
    const executor = pipe(
      () =>
        Array.isArray(sourcePath)
          ? sourcePath.map(key => path.get(input, key))
          : path.get(input, sourcePath),
      ...transforms
    )

    // Execute the pipline and set the result to the target key
    path.set(o, targetPath, executor())

    // Return the
    return o
  }, Object.create({}))
}

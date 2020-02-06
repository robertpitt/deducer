import * as invariant from 'invariant'
import * as path from 'object-path'
import { pipe } from './utilities'
/**
 *
 */
export type DestinationKey = string
export type KVObject = { [key: string]: any }
export type InputModel = any[] | KVObject
export type Element = [path.Path, path.Path, ...Function[]]
export type ElementMap = Element[]

/**
 *
 */
export const transform = (input: InputModel, map: ElementMap): KVObject => {
  invariant(
    input instanceof Array || input instanceof Object,
    'Array or Object only for transformer input.'
  )
  invariant(map instanceof Array, 'Map must be an array of transforms')

  // Use Reduce
  return map.reduce((output, [srcKey, dstKey, ...transformFns]) => {
    const args = Array.isArray(srcKey)
      ? srcKey.map(key => path.get(input, key))
      : path.get(input, srcKey)
    path.set(output, dstKey, pipe(...transformFns)(args))
    return output
  }, {})
}

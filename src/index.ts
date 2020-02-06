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
  const output = {}
  map.forEach(([source, target, ...transformFns]) => {
    const args = Array.isArray(source)
      ? source.map(key => path.get(input, key))
      : path.get(input, source)
    path.set(output, target, pipe(...transformFns)(args))
  })
  return output
}

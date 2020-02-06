import * as path from "object-path"
import { pipe } from './utilities'
/**
 *
 */
export type DestinationKey = string;
export type KVObject = { [key: string]: any; }
export type InputModel = any[] | KVObject
export type Element = [path.Path, path.Path, ...Function[]]
export type ElementMap = Element[]

/**
 *
 */
export const transform = (input: InputModel, transformMap: ElementMap): KVObject => {
  const output = {};
  const outputObjectPath = path(output)
  const inputObjectPath = path(input)

  
  // Loop the transforms, top down
  transformMap.forEach(([source, target, ...transformFns]) => {
    const args = Array.isArray(source) ? source.map(key => inputObjectPath.get(key)) : inputObjectPath.get(source);
    outputObjectPath.set(target, pipe(...transformFns)(args))
  });

  return output
}
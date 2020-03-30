import { pipeline } from 'pipe-and-compose';
import * as path from 'object-path';

/**
 * A deduction can been seen as synonymous with a transformation, except that
 * a deduction also performs movement of the source value(s) via a sequence of reducers
 * to the destination in the output object.
 */
export type Deduction<I, O> = {
  /**
   * Source path is the location of the property in the source object,
   * this can also be an array of paths in order to select multiple values
   * from the source, this is useful for for separate time and date fields
   * or calculating the total from separate price and tax rate.
   *
   * If the source object is an array, you can use integers or array of integers
   * to select values, this is useful for selecting columns with leaderless csv files.
   *
   * If the source object is an object you can use string or array of strings
   * to select values.
   *
   * @example { source: "_id", destination: "id" }
   * @example { source: ["date", "time"], destination: "dateTime", reducers: [ makeDateTime ] }
   * @example { source: 1, destination: "id" }
   * @example { source: [2, 3], destination: "dateTime", reducers: [ madeDateTime ] }
   */
  source: keyof I | keyof I[] | path.Path;

  /**
   * Destination is a string value containing the index you want to save the
   * value to within the output.
   *
   * @example { source: "_id", destination: "id" }
   * @example { source: ["date", "time"], destination: "dateTime", reducers: [ makeDateTime ] }
   * @example { source: 1, destination: "id" }
   * @example { source: [2, 3], destination: "dateTime", reducers: [ madeDateTime ] }
   */
  destination: keyof O | path.Path;

  /**
   * Reducers contain an array of functions that are executed using a pipe,
   * pipe is the exact same as compose apart from ut uses reducerRight instead of reduce,
   * effectively switching the execution from rtl to ltr.
   *
   * @example [
   *    toString,
   *    toUpperCase,
   *    remove('-', '_', ''),
   * ]
   */
  reducers?: Array<(value: any) => any>;
};

/**
 * deduce is a function that executes a set of deductions against an input source,
 * each deduction will be responsible for selecting one or more values from the input source
 * and specifying the destination key in the output object.
 *
 * Deductions are executed sequentially in array order, each deduction will fully
 * complete before the next deduction is executed, during the execution of the deduction
 * the reducer pipeline will be invoked with the initial source value, the final
 * result of the reducer pipeline will be stored in the destination key of hte output object
 *
 * @param input Array or Object that is the input source.
 * @param deductions An array of Deductions that will be executed sequentially.
 */
export const deduce = <I extends object, O extends object>(
  input: I,
  deductions: Deduction<I, O>[],
): O => {
  return deductions.reduce<O>((o, { source, destination, reducers = [] }) => {
    // Create a new transform stack that will process the current value
    const transform = pipeline(
      Array.isArray(source)
        ? source.map(k => path.get(input, k))
        : path.get(input, source as path.Path),
      v => v,
      ...reducers,
    );

    // Execute the pipeline and set the result to the target key on the output object
    path.set(o, destination as string, transform);
    return o;
  }, Object.create({}));
};

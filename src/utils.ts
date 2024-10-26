import type { Logger } from "pino";

/**
 * Checks if a given value is a Pino logger instance.
 *
 * @param value The value to be checked.
 * @returns `true` if the value is a Pino logger instance, `false` otherwise.
 */
export function isPino(value: unknown): value is Logger {
  return (
    typeof value === "object" &&
    value !== null &&
    "child" in value &&
    typeof value.child === "function"
  );
}

/**
 * Checks if the given object is empty.
 *
 * @param obj The object to be checked.
 * @returns `true` if the object is empty, `false` otherwise.
 */
export function isEmpty(obj: any): boolean {
  return (
    [Object, Array].includes((obj || {}).constructor) &&
    !Object.entries(obj || {}).length
  );
}

/**
 * Performs a deep merge of two objects. The properties from the source object
 * are recursively merged into the target object. If a property is an object
 * and exists in both the source and target, the function will merge the two
 * properties. Otherwise, it will overwrite the property in the target object
 * with the property from the source object.
 *
 * @param target The target object to which properties will be merged.
 * @param source The source object whose properties will be merged into the target.
 * @returns The target object after merging.
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (!target[key]) {
        target[key] = {} as T[typeof key];
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key] as T[typeof key];
    }
  }
  return target;
}

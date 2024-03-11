import type { Data } from "../helper/types";
import type { RedditObject } from "./types";

import camelCase from "camelcase";
import ws from "ws";

/**
 * An invalid kind of object
 */
export class InvalidKindError extends Error {
  constructor(expected: string, got: string) {
    super(`Expected '${expected}', got '${got}'`);
  }
}

/**
 * Ensure that a RedditObject is of the correct type.
 *
 * @param kind The expected kind.
 * @param redditObject The RedditObject to check.
 */
export function assertKind(kind: string, redditObject: RedditObject) {
  if (redditObject.kind !== kind)
    throw new InvalidKindError(kind, redditObject.kind);
}

/**
 * Convert a value from a Reddit API response to a snoots data structure.
 *
 * This performs two steps:
 * 1. Replace `null` with `undefined`
 * 2. Convert the key from snake_case to camelCase
 *
 * @param data The data to convert.
 * @returns The converted object.
 */
export function fromRedditData<T>(data: Data): T {
  const out: Data = {};
  for (const key in data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    out[camelCase(key)] = data[key] === null ? undefined : data[key];
  }
  return out as T;
}

/**
 * @returns `true` if the code is running in a browser, `false` otherwise.
 */
export const isBrowser = typeof self === "object";

/**
 * The WebSocket constructor to use.
 */
export const webSocket: typeof self.WebSocket = isBrowser
  ? self.WebSocket
  : (ws as never);

/**
 * Format a Reddit ID to remove the prefix.
 * @param id
 * @returns The formatted ID.
 */
export const formatId = (id: string) => id.replace(/^t\d_/, "");

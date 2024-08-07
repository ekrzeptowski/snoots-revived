import type { ProxyAgent } from "undici";

/**
 * Options for configuring the Shim.
 */
export type ShimOptions = {
  headers: Record<string, string>;
  hooks: Record<
    string,
    {
      /**
       * A function that modifies the response or triggers a retry.
       * @param response The response object.
       * @param retry A function that can be called to retry the request.
       * @returns The modified response object.
       */
      (response: Response, retry: () => void): Response;
    }[]
  >;
  followRedirect: boolean;
  username?: string;
  password?: string;
  form?: Record<string, string>;
  json?: Record<string, string>;
  agent?: ProxyAgent;
};

/** The types of values that are allowed in a query. */
export type QueryValue = string | number | boolean | null | undefined;
/** A mapping of query parameters to add to a request. */
export type Query = Record<string, QueryValue>;

export interface BasicAuth {
  user: string;
  pass: string;
}
export interface BearerAuth {
  bearer: string;
}
export type Auth = BasicAuth | BearerAuth;

/** The information about a connection's last-known rate limit. */
export interface RateLimit {
  /** How many requests are remaining. */
  remaining: number;
  /** When the window will reset. */
  reset: number;
}

interface RedditJsonResponse<T> {
  json: {
    errors: string[];
    data?: T;
  };
}

interface RedditError {
  error: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_description?: string;
}

export type SomeResponse<T> = T | RedditError | RedditJsonResponse<T>;

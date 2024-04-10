import type { Data, Maybe } from "../helper/types";
import type {
  Auth,
  Query,
  RateLimit,
  ShimOptions,
  SomeResponse,
} from "./types";

import { makeDebug } from "../helper/debug";

// #region debug logging
const debug = {
  general: makeDebug("gateway"),
  request: makeDebug("gateway:request"),
  response: makeDebug("gateway:response"),
};

function debugRequest(
  method: string,
  path: string,
  options: Partial<ShimOptions>,
) {
  debug.request(
    "Making %s request to path '%s' with options %O",
    method,
    path,
    options,
  );
}

function debugResponse(method: string, path: string, response: unknown) {
  debug.response(
    "Got response for %s request to '%s': %O",
    method,
    path,
    response,
  );
}
// #endregion debug logging

/**
 * The gateway to the Reddit api.
 *
 * You shouldn't have to use this directly. If you end up needing this class in
 * order to interact with the Reddit API please open an issue or submit a pull
 * request so we can add official support for your use case.
 */
export abstract class Gateway {
  protected rateLimit: Maybe<RateLimit>;
  protected userAgent: string;
  protected endpoint: string;

  /** @internal */
  constructor(endpoint: string, userAgent: string) {
    this.endpoint = endpoint;
    this.userAgent = userAgent;
  }

  protected buildInput(path: string, query: Query = {}) {
    const searchParameters = new URLSearchParams({
      ...query,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      raw_json: "1",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      api_type: "json",
    });
    const searchParametersString = searchParameters.toString(); // Convert URLSearchParams to string
    return new URL(`${path}?${searchParametersString}`, this.endpoint);
  }

  /**
   * Issue a GET request to the Reddit API.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to GET.
   * @param query The query params.
   * @returns The result.
   */
  public async get<T>(path: string, query: Query = {}): Promise<T> {
    const options = await this.buildOptions();
    debugRequest("GET", path, options);
    const response = await fetchShim(
      "get",
      this.buildInput(this.mapPath(path), query),
      options,
    );

    const json = (await response.json()) as T;

    debugResponse("GET", path, json);
    return this.unwrap(json);
  }

  /**
   * Issue a POST request to the Reddit API with x-www-form-urlencoded data.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to POST.
   * @param form The data to POST.
   * @param query The query params.
   * @returns The result.
   */
  public async post<T>(
    path: string,
    form: Data,
    query: Query = {},
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const formOptions = { form: { api_type: "json", ...form } };
    return await this.doPost(
      this.buildInput(this.mapPath(path), query).toString(),
      formOptions,
    );
  }

  /**
   * Issue a POST request to the Reddit API with json data.
   *
   * You can use this method, but you most likely don't want to. If you end up
   * needing this method in order to interact with the Reddit API please open an
   * issue or submit a pull request so we can add official support for your use
   * case.
   *
   * @internal
   *
   * @param path The path to POST.
   * @param json The data to POST.
   * @param query The query params.
   * @returns The result.
   */
  public async postJson<T>(
    path: string,
    json: Data,
    query: Query = {},
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const jsonOptions = { json: { api_type: "json", ...json } };
    return await this.doPost(
      this.buildInput(this.mapPath(path), query).toString(),
      jsonOptions,
    );
  }

  /**
   * Issue a POST request to the Reddit API upload endpoint with form data.
   *
   * @internal
   *
   * @param path The path to POST.
   * @param data The data to POST.
   * @returns The result.
   */
  public async postUpload(path: string, data: FormData): Promise<Response> {
    try {
      debugRequest("POST", path, {});
      const response = await fetch(path, {
        method: "POST",
        body: data,
        mode: "no-cors",
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "user-agent": this.userAgent,
        },
      });
      debugResponse("POST", path, response);
      if (response.status === 201) {
        return (await response.text()) as unknown as Response;
      }
      throw new Error("Failed to upload");
    } catch (error) {
      debugResponse("POST", path, error);
      throw new Error("Failed to upload");
    }
  }

  /** @internal */
  public getRateLimit(): Maybe<RateLimit> {
    return this.rateLimit ? { ...this.rateLimit } : undefined;
  }

  protected abstract auth(): Promise<Maybe<Auth>>;

  protected async doPost<T>(path: string, overrideOptions: Data): Promise<T> {
    const baseOptions = await this.buildOptions();
    const options = { ...baseOptions, ...overrideOptions };
    debugRequest("POST", path, options);
    const response = await fetchShim("post", new URL(path), options);
    const json = (await response.json()) as T;
    debugResponse("POST", path, json);
    return this.unwrap(json);
  }

  protected abstract mapPath(path: string): string;

  protected handleError(message: string, description?: string): never {
    let errorMessage = `Reddit returned an error: ${message}`;
    if (description) errorMessage += `: ${description}`;
    throw new Error(errorMessage);
  }

  protected unwrap<T>(response: SomeResponse<T>): T {
    if (typeof response !== "object" || response == undefined) {
      return response;
    } else if ("json" in response) {
      const { errors, data } = response.json;
      if (errors.length > 0) {
        this.handleError(errors[0]);
      } else {
        return data!;
      }
    } else {
      if ("error" in response) {
        this.handleError(response.error, response.error_description);
      } else {
        return response;
      }
    }
  }

  protected async buildOptions() {
    const options: ShimOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { "user-agent": this.userAgent },

      hooks: {
        afterResponse: [
          r => this.transformRedirect(r),
          r => this.updateRatelimit(r),
        ],
      },
      followRedirect: false,
    };

    const auth = await this.auth();
    if (auth) {
      const authHeader =
        "bearer" in auth
          ? `bearer ${auth.bearer}`
          : `Basic ${Buffer.from(auth.user + ":" + auth.pass).toString("base64")}`;
      options.headers["Authorization"] = authHeader;
    }

    return options;
  }

  protected transformRedirect(response: Response): Response {
    const { status, headers } = response;
    if (headers.get("location") && status >= 300 && status < 400) {
      const updatedBody = Buffer.from(
        JSON.stringify({
          kind: "snoots_redirect",
          data: { location: headers.get("location") },
        }),
      );
      return new Response(updatedBody, response);
    }
    return response;
  }

  protected updateRatelimit(response: Response): Response {
    const { headers } = response;
    const remain = Number.parseInt(
      headers.get("x-ratelimit-remaining") as string,
    );
    const reset = Number.parseInt(headers.get("x-ratelimit-reset") as string);

    // To prevent race conditions, only update the rate limit if either...
    if (
      // ...we don't have one stored
      !this.rateLimit ||
      // ...the stored data is expired
      this.rateLimit.reset < Date.now() ||
      // ...the number of remaining requests has decreased
      this.rateLimit.remaining > remain
    ) {
      this.rateLimit = { remaining: remain, reset: Date.now() + reset * 1000 };
      debug.general(
        "Updated ratelimit: %d requests remaining, resets at %s",
        this.rateLimit.remaining,
        new Date(this.rateLimit.reset),
      );
    }

    return response;
  }
}
async function fetchShim(
  method: "get" | "post",
  path: URL,
  options: ShimOptions,
) {
  const data = await fetch(path, {
    headers: {
      ...options.headers,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "Content-Type":
        method === "post"
          ? options.json
            ? "application/json"
            : "application/x-www-form-urlencoded"
          : undefined,
    } as HeadersInit,
    method,
    redirect: "manual",
    body:
      method === "post"
        ? options.json
          ? JSON.stringify(options.json)
          : new URLSearchParams(options.form).toString()
        : undefined,
  });
  if (options.hooks?.afterResponse)
    for (const hook of options.hooks?.afterResponse ?? [])
      hook(data, () => {
        throw new Error("Retry not supported");
      });
  return data;
}

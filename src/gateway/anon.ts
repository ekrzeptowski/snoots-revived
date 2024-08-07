import { Gateway } from "./gateway";

/** @internal */
export class AnonGateway extends Gateway {
  /** @internal */
  constructor(userAgent: string, proxyUrl?: string | null) {
    super("https://www.reddit.com", userAgent, proxyUrl);
  }

  protected async auth(): Promise<undefined> {
    // Anonymous requests have no auth
    return undefined;
  }

  protected mapPath(path: string): string {
    // api requests against www.reddit.com need to end in .json
    return `${path}.json`;
  }
}

import { Agent } from "undici";

import { AnonGateway } from "../../anon";

describe("Gateway", () => {
  describe("buildOptions()", () => {
    it("should throw an error for unsupported proxy URL", async () => {
      const gateway = new AnonGateway(
        "fake-user-agent",
        "http://proxy.example.com",
      );
      await expect(gateway["buildOptions"]()).rejects.toThrow(
        "Only socks proxies are supported. Provide an URL like 'socks5://",
      );
    });

    it("should return options with socks5 proxy agent", async () => {
      const gateway = new AnonGateway(
        "fake-user-agent",
        "socks5://proxy.example.com:1080",
      );
      const options = await gateway["buildOptions"]();

      expect(options.agent).toBeInstanceOf(Agent);
    });

    it("should return options without proxy agent if proxy URL is not provided", async () => {
      const gateway = new AnonGateway("fake-user-agent");
      const options = await gateway["buildOptions"]();

      expect(options.agent).toBeUndefined();
    });

    it("should return options without proxy agent if proxy URL is empty", async () => {
      const gateway = new AnonGateway("fake-user-agent", "");
      const options = await gateway["buildOptions"]();

      expect(options.agent).toBeUndefined();
    });

    it("should return options without proxy agent if proxy URL is null", async () => {
      // eslint-disable-next-line unicorn/no-null
      const gateway = new AnonGateway("fake-user-agent", null);
      const options = await gateway["buildOptions"]();

      expect(options.agent).toBeUndefined();
    });
  });
});

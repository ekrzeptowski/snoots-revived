import nock from "nock";

import { CredsGateway } from "../../creds";

let gateway: CredsGateway;

beforeAll(() => {
  nock.disableNetConnect();

  const creds = { clientId: "c.id", clientSecret: "c.secret" };
  gateway = new CredsGateway(creds, "fake-user-agent");
});

afterEach(() => nock.cleanAll());

afterAll(() => {
  nock.restore();
  nock.enableNetConnect();
});

const commonNockOptions = {
  reqheaders: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "user-agent": "fake-user-agent",
    authorization: "Basic Yy5pZDpjLnNlY3JldA==",
  },
};

describe("CredsGateway", () => {
  describe(".get()", () => {
    it("should pass common values", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      await gateway.get("foo/bar", {});

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .get("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const request = gateway.get("foo/bar", {});
      await expect(request).resolves.toEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .get("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const request = gateway.get("foo/bar", {});
        await expect(request).rejects.toEqual(
          new Error("Reddit returned an error: whoops"),
        );

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .get("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, {
            error: "whoops",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            error_description: "something went wrong :(",
          });

        const request = gateway.get("foo/bar", {});
        await expect(request).rejects.toEqual(
          new Error(
            "Reddit returned an error: whoops: something went wrong :(",
          ),
        );

        n.done();
      });
    });
  });

  describe(".post()", () => {
    it("should pass common values", async () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const expectedBody = { api_type: "json", bar: "foo" };
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
        .reply(200, { bim: "bom" });

      await gateway.post("foo/bar", { bar: "foo" });

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const request = gateway.post("foo/bar", { bar: "foo" });
      await expect(request).resolves.toEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const request = gateway.post("foo/bar", { bar: "foo" });
        await expect(request).rejects.toEqual(
          new Error("Reddit returned an error: whoops"),
        );

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, {
            error: "whoops",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            error_description: "something went wrong :(",
          });

        const request = gateway.post("foo/bar", { bar: "foo" });
        await expect(request).rejects.toEqual(
          new Error(
            "Reddit returned an error: whoops: something went wrong :(",
          ),
        );

        n.done();
      });
    });
  });

  describe(".postJson()", () => {
    it("should pass common values", async () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const expectedBody = { api_type: "json", bar: "foo" };
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1", expectedBody)
        .reply(200, { bim: "bom" });

      await gateway.postJson("foo/bar", { bar: "foo" }, {});

      n.done();
    });

    it("should give back json data", async () => {
      const n = nock("https://www.reddit.com", commonNockOptions)
        .post("/foo/bar.json?api_type=json&raw_json=1")
        .reply(200, { bim: "bom" });

      const request = gateway.postJson("foo/bar", { bar: "foo" }, {});
      await expect(request).resolves.toEqual({ bim: "bom" });

      n.done();
    });

    describe("when given an api error", () => {
      it("should throw", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, { error: "whoops" });

        const request = gateway.postJson("foo/bar", { bar: "foo" }, {});
        await expect(request).rejects.toEqual(
          new Error("Reddit returned an error: whoops"),
        );

        n.done();
      });

      it("should use the description if available", async () => {
        const n = nock("https://www.reddit.com", commonNockOptions)
          .post("/foo/bar.json?api_type=json&raw_json=1")
          .reply(200, {
            error: "whoops",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            error_description: "something went wrong :(",
          });

        const request = gateway.postJson("foo/bar", { bar: "foo" }, {});
        await expect(request).rejects.toEqual(
          new Error(
            "Reddit returned an error: whoops: something went wrong :(",
          ),
        );

        n.done();
      });
    });
  });
});

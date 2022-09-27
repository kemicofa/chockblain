import chockblain from "./mod.ts";
import { assert, assertEquals, assertThrows } from "./deps.ts";
import Blockchain from "./blockchain.ts";

Deno.test("should initiate a blockchain instance", () => {
  const blockchain = chockblain();
  assert(blockchain instanceof Blockchain);
});

Deno.test("should be able to add a block", () => {
  const blockchain = chockblain();
  const payload = {
    sender: "Kevin",
    receiver: "Jimmy",
    amount: "100",
    currency: "USD",
  };
  blockchain.addBlock(payload);
  assertEquals(blockchain.toArray(), [
    {
      hash: "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
      index: 0,
      payload,
      prevHash: null,
    },
  ]);
});

Deno.test("should be able to add multiple blocks", () => {
  const blockchain = chockblain();
  const payloads = [{
    sender: "Kevin",
    receiver: "Jimmy",
    amount: "100",
    currency: "USD",
  }, {
    sender: "Jimmy",
    receiver: "John",
    amount: "2",
    currency: "USD",
  }];
  payloads.forEach((payload) => blockchain.addBlock(payload));
  assertEquals(blockchain.toArray(), [
    {
      hash: "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
      index: 0,
      payload: payloads[0],
      prevHash: null,
    },
    {
      hash: "4bddcf2b6b47c9ffd116765cf380468184ec527211878398f749db22d8428b9d",
      index: 1,
      payload: payloads[1],
      prevHash:
        "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
    },
  ]);
});

Deno.test("should be able to use SHA-384 algorithm", () => {
  const blockchain = chockblain({
    algorithm: "SHA-384",
  });
  const payload = {
    sender: "Kevin",
    receiver: "Jimmy",
    amount: "100",
    currency: "USD",
  };
  blockchain.addBlock(payload);
  assertEquals(blockchain.toArray(), [
    {
      hash:
        "f82f1916ed37166a9c7ac1de638965c00e459cb286d2679f7a04b0b31124a9e8039bf61ee9ee3362ba4cddf58077e680",
      index: 0,
      payload,
      prevHash: null,
    },
  ]);
});

Deno.test("should be able to load an existing blockchain into memory", () => {
  const payloads = [{
    sender: "Kevin",
    receiver: "Jimmy",
    amount: "100",
    currency: "USD",
  }, {
    sender: "Jimmy",
    receiver: "John",
    amount: "2",
    currency: "USD",
  }];

  const blockchain = chockblain({
    defaultBlockchain: [
      {
        hash:
          "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
        index: 0,
        payload: payloads[0],
        prevHash: null,
      },
      {
        hash:
          "4bddcf2b6b47c9ffd116765cf380468184ec527211878398f749db22d8428b9d",
        index: 1,
        payload: payloads[1],
        prevHash:
          "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
      },
    ],
  });
  assertEquals(blockchain.toArray(), [
    {
      hash: "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
      index: 0,
      payload: payloads[0],
      prevHash: null,
    },
    {
      hash: "4bddcf2b6b47c9ffd116765cf380468184ec527211878398f749db22d8428b9d",
      index: 1,
      payload: payloads[1],
      prevHash:
        "7d81433dddde7264304b852d7b7e6f7213ae9da2d2699b930adba7999963f76d",
    },
  ]);
});

Deno.test("should be able to validate integrity of blockchain", () => {
  const blockchain = chockblain({
    defaultBlockchain: [
      {
        hash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
        index: 0,
        payload: "hello world 1",
        prevHash: null,
      },
      {
        hash:
          "c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092",
        index: 1,
        payload: "hello world 2",
        prevHash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
      },
    ],
  });
  assertEquals(blockchain.validateIntegrity(), undefined);
});

Deno.test("should fail to validate integrity of blockchain if index has been changed", () => {
  const blockchain = chockblain({
    defaultBlockchain: [
      {
        hash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
        index: 0,
        payload: "hello world 1",
        prevHash: null,
      },
      {
        hash:
          "c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092",
        index: 2,
        payload: "hello world 2",
        prevHash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
      },
    ],
  });
  assertThrows(
    () => blockchain.validateIntegrity(),
    Error,
    "Expected hash 27bb35c0540dbe8e1c98c834bd7bed3b3b0ef266119a09e9f99007b5fd267ac7 but got c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092 at index 1",
  );
});

Deno.test("should fail to validate integrity of blockchain if the payload has changed", () => {
  const blockchain = chockblain({
    defaultBlockchain: [
      {
        hash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
        index: 0,
        payload: "hello world 1",
        prevHash: null,
      },
      {
        hash:
          "c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092",
        index: 1,
        payload: "hello world 3",
        prevHash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
      },
    ],
  });
  assertThrows(
    () => blockchain.validateIntegrity(),
    Error,
    "Expected hash 6cfc5ef28e8b45f3a50c541e37648918ccbc61bd44977da01ff6c41fdbca0220 but got c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092 at index 1",
  );
});

Deno.test("should fail to validate integrity of blockchain if the prevHash has changed", () => {
  const blockchain = chockblain({
    defaultBlockchain: [
      {
        hash:
          "1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b",
        index: 0,
        payload: "hello world 1",
        prevHash: null,
      },
      {
        hash:
          "c04861929383eaab83431a32abb04ca226d74bcbf287941e9a4dee73f09fa092",
        index: 1,
        payload: "hello world 2",
        prevHash: "fake",
      },
    ],
  });
  assertThrows(
    () => blockchain.validateIntegrity(),
    Error,
    "Previous hash fake did not match expected value 1aa3af7a2de3ed62a0f4416beeaf4bd375e490e09ccf523e40d910a1557b568b.",
  );
});

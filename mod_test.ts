import chockblain from "./mod.ts";
import { assert } from "testing/asserts.ts";
import Blockchain from "./blockchain.ts";

Deno.test("should initiate a blockchain instance", () => {
  const blockchain = chockblain();
  assert(blockchain instanceof Blockchain);
});

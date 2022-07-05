import Blockchain from "./blockchain.ts";
import { DigestAlgorithm } from "./typings.ts";
import withHasher from "./withHasher.ts";

interface ChockblainConfig {
  /**
   * Algorithm to be used when creating a hash for a block.
   *
   * Defaults to SHA-256.
   * @see {@link https://deno.land/std@0.147.0/crypto#supported-algorithms}
   */
  algorithm?: DigestAlgorithm;
}

const chockblain = (config?: ChockblainConfig) => {
  const { algorithm = "SHA-256" } = config ?? {};
  const useHasher = withHasher(algorithm);
  const blockchain = new Blockchain(useHasher);
  return blockchain;
};

export default chockblain;

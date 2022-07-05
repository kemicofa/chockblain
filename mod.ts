import Block from "./block.ts";
import Blockchain from "./blockchain.ts";
import { DigestAlgorithm } from "./typings.ts";
import withHasher from "./withHasher.ts";

interface ChockblainConfig<T> {
  /**
   * Algorithm to be used when creating a hash for a block.
   *
   * Defaults to SHA-256.
   * @see {@link https://deno.land/std@0.147.0/crypto#supported-algorithms}
   */
  algorithm?: DigestAlgorithm;

  /**
   * Create a blockchain from an existing one.
   * 
   * Defaults to an empty list.
   */
  defaultBlockchain?: Block<T>[];
}

const chockblain = <T>(config?: ChockblainConfig<T>) => {
  const { algorithm = "SHA-256", defaultBlockchain = [] } = config ?? {};
  const useHasher = withHasher(algorithm);
  const blockchain = new Blockchain<T>(useHasher, defaultBlockchain);
  return blockchain;
};

export default chockblain;

import hasher from "./hasher.ts";
import { DigestAlgorithm } from "./typings.ts";

const withHasher = (algorithm: DigestAlgorithm) =>
  (input: Uint8Array) => hasher(input, algorithm);

export default withHasher;

import { crypto } from "crypto/mod.ts";
import { DigestAlgorithm } from "./typings.ts";

const hasher = (input: Uint8Array, algorithm: DigestAlgorithm) => {
  return [
    ...new Uint8Array(
      crypto.subtle.digestSync(
        algorithm,
        input,
      ),
    ),
  ].map((value) => value.toString(16).padStart(2, "0")).join("");
};

export default hasher;

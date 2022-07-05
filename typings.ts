import { crypto } from "crypto/mod.ts";
import withHasher from "./withHasher.ts";

export type DigestAlgorithm = Parameters<typeof crypto.subtle.digestSync>[0];

export type UseHasher = ReturnType<typeof withHasher>;

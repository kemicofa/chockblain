import withHasher from "./withHasher.ts";
import { crypto } from './deps.ts';

export type DigestAlgorithm = Parameters<typeof crypto.subtle.digestSync>[0];

export type UseHasher = ReturnType<typeof withHasher>;

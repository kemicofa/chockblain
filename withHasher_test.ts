import { assertEquals } from "./deps.ts";
import withHasher from "./withHasher.ts";

Deno.test("should generate a string hash from SHA-256 algorithm", () => {
  const useHasher = withHasher("SHA-256");
  const hash = useHasher(new TextEncoder().encode("chockblain"));
  assertEquals(
    hash,
    "537a4f1539e2d668ebf3f9a7d5ed0753eab1590afc7d60b00d54d8aa2745b186",
  );
});

import Block from "./block.ts";
import { UseHasher } from "./typings.ts";

class Blockchain<T> {
  constructor(
    private useHasher: UseHasher,
    private blocks: Block<T>[] = [],
  ) {}

  private buildHash({ payload, index, prevHash }: Omit<Block<T>, "hash">) {
    let formattedDataToHash: Uint8Array;
    const suffix = index + (prevHash ?? "");

    if (payload instanceof Uint8Array) {
      formattedDataToHash = new Uint8Array([
        ...payload,
        ...new TextEncoder().encode(suffix),
      ]);
    } else if (typeof payload === "string") {
      formattedDataToHash = new TextEncoder().encode(payload + suffix);
    } else if (typeof payload === "object") {
      formattedDataToHash = new TextEncoder().encode(
        JSON.stringify(payload) + suffix,
      );
    } else {
      throw new Error(
        "Unrecognized payload format; expected Uint8Array, string or object",
      );
    }

    return this.useHasher(
      formattedDataToHash,
    );
  }

  addBlock(payload: T) {
    const { hash: prevHash = null } = this.blocks[this.blocks.length - 1] ?? {};
    const index = this.blocks.length;

    const hash = this.buildHash({ payload, index, prevHash });

    this.blocks.push({
      index: this.blocks.length,
      payload,
      hash,
      prevHash,
    });
    return this;
  }

  validateIntegrity() {
    let prevHash: string | null = null;

    for (let i = 0; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      if (prevHash !== currentBlock.prevHash) {
        throw new Error(
          `Previous hash ${currentBlock.prevHash} did not match expected value ${prevHash}.`,
        );
      }

      const currentHash = this.buildHash({
        ...currentBlock,
        prevHash,
      });

      if (currentHash !== currentBlock.hash) {
        throw new Error(
          `Expected hash ${currentHash} but got ${currentBlock.hash} at index ${i}`,
        );
      }

      prevHash = currentHash;
    }
  }

  toArray() {
    return structuredClone(this.blocks);
  }
}

export default Blockchain;

interface Block<T> {
  index: number;
  payload: T;
  hash: string;
  prevHash: string | null;
}

export default Block;

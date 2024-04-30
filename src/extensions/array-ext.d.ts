export { }
declare global {
  interface Array<T> {
    // Rotate n elements of an array
    rotate(n: number): Array<T>;

    // Remove the current elements
    clear(): void;

    partition(pred: (x: T) => boolean): [Array<T>, Array<T>];
  }
}

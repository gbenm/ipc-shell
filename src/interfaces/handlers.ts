export type IPCHandler<T> = (...data: T[]) => void;

export interface IPCHandlers<D, E> {
  handleData?: IPCHandler<D>
  handleError?: IPCHandler<E>
}


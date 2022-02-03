import { EventEmitter, Writable } from "stream"
import { IPCNodeError } from "./errors"
import { IPCHandlers } from "./handlers"

export interface IPCBaseNode {
  get name(): string

  _getArgsFromOn(...args: unknown[]): unknown[] // **IMPORTANT** override if it's necessary
  _ipcNodeSend(channel: string, ...args: unknown[]): void // **IMPORTANT** if it's necessary
  subscribe<D = unknown, E = unknown>(channel: string, handlers: IPCHandlers<D, E>): void
  sendError(channel: string, info: unknown, message?: string): void
  writableStream(event: string): IPCNodeWritable
}

export class IPCNodeWritable extends Writable {
  constructor(
    public readonly channel: string,
     private ipc: IPCBaseNode
  ) {
    super({objectMode: true})
  }

  _write(data: unknown, _: unknown, complete: () => void) {
    this.ipc._ipcNodeSend(this.channel, data)
    complete()
  }
}


export type IPCNode<T = unknown> = IPCBaseNode & T

function handleDataOrError<D, E>(this: IPCNode, handlers: IPCHandlers<D, E>, ...args: unknown[]) {
  args = this._getArgsFromOn(args)

  const firstArg = args[0]

  if (firstArg instanceof IPCNodeError) {
    handlers.handleError?.(firstArg.info as E)
    return
  }

  handlers.handleData(...args as D[])
}

type IPCElectron = {
  send: (channel: string, ...args: unknown[]) => void
}

export const ipcNode: IPCBaseNode = {
  name: "IPCNode",
  subscribe(this: IPCNode<EventEmitter>, channel, handlers) {
    this.on(channel, handleDataOrError.bind(this, handlers))
  },
  _getArgsFromOn(...args) {
    args.splice(0, 1)
    return args
  },
  _ipcNodeSend(this: IPCElectron, channel, ...args) {
    this.send(channel, ...args)
  },
  sendError(this: IPCNode<EventEmitter>, channel, info, message) {
    this._ipcNodeSend(channel, new IPCNodeError(channel, info, message))
  },
  writableStream(this: IPCNode<EventEmitter>, channel) {
    return new IPCNodeWritable(channel, this)
  }
}

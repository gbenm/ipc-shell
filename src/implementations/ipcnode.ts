import { EventEmitter } from "stream"
import { IPCBaseNode, IPCNode, IPCHandlers } from "../interfaces"
import { IPCNodeError, IPCNodeWritable } from "../models"
import { IPCNodeFilter } from "../models/filter"
import { IPCNodeReadable } from "../models/readable"

type IPCWWithChannels = {
  send: (channel: string, ...args: unknown[]) => void
}

function handleDataOrError<D, E>(this: IPCNode, handlers: IPCHandlers<D, E>, ...args: unknown[]) {
  args = this._getArgsFromOn(...args)

  const firstArg = args[0]

  if (firstArg instanceof Error && IPCNodeError.isIPCNodeError(firstArg.message)) {
    handlers.handleError?.(IPCNodeError.getInfoFromIPCNodeError(firstArg.message) as E)
    return
  }

  if (this.ipcNodeErrorObjectMode && firstArg instanceof Object && IPCNodeError.isIPCNodeError(firstArg)) {
    handlers.handleError?.(IPCNodeError.getInfoFromIPCNodeError(firstArg) as E)
    return
  }

  handlers.handleData?.(...args as D[])
}

export const ipcNode: IPCBaseNode = {
  name: "IPCNode",
  ipcNodeErrorObjectMode: false,
  subscribe(this: IPCNode<EventEmitter>, channel, handlers) {
    this.on(channel, handleDataOrError.bind(this, handlers))
  },
  _getArgsFromOn(...args) {
    args.splice(0, 1)
    return args
  },
  _ipcNodeSend(this: IPCWWithChannels, channel, ...args) {
    this.send(channel, ...args)
  },
  sendError(this: IPCNode<EventEmitter>, channel, info) {
    this._ipcNodeSend(channel, new IPCNodeError(info))
  },
  writableStream(this: IPCNode<EventEmitter>, channel) {
    return new IPCNodeWritable(channel, this)
  },
  _ipcNodeReadable: {} as IPCNodeReadable, // throws error if not overridden
  readableStream(this: IPCNode<EventEmitter>, channel) {
    this.on(channel, this._ipcNodeReadable.notify.bind(this._ipcNodeReadable, channel))
    return this._ipcNodeReadable.pipe(new IPCNodeFilter(channel))
  }
}

import { IPCNodeWritable } from "../models"
import { IPCHandlers } from "../interfaces"
import { Readable } from "stream"
import { IPCNodeReadable } from "../models/readable"

/**
 * Declare the extensions that will be added to the IPC Object
 */
export interface IPCBaseNode {
  get name(): string

  get _ipcNodeReadable(): IPCNodeReadable

  ipcNodeErrorObjectMode: boolean
  _getArgsFromOn(...args: unknown[]): unknown[] // **IMPORTANT** override if it's necessary
  _ipcNodeSend(channel: string, ...args: unknown[]): void // **IMPORTANT** if it's necessary
  subscribe<D = unknown, E = unknown>(channel: string, handlers: IPCHandlers<D, E>): void
  sendError(channel: string, info: unknown): void
  writableStream(event: string): IPCNodeWritable,
  readableStream(event: string): Readable
}

/**
 * Combine the IPCBaseNode with T to help with type checking
 */
export type IPCNode<T = unknown> = IPCBaseNode & T

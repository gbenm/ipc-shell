import { ChildProcess, Serializable } from "child_process"
import { IPCNode } from "../dist"

type Process = NodeJS.Process

export function prepareIPCNode(ipc: IPCNode<Process | ChildProcess>) {
  ipc._getArgsFromOn = function(this: Process, ...args) {
    return args
  }

  ipc._ipcNodeSend = function(this: Process | ChildProcess, _channel, message: Serializable) {
    return this.send?.(message)
  }
}

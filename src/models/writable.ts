import { Writable } from "stream"
import { IPCBaseNode } from "../interfaces"

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

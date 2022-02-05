import { Readable } from "stream"
import { IPCNodeR2TMessage } from "../interfaces/helpers"

export class IPCNodeReadable extends Readable {
  constructor() {
    super({
      objectMode: true,
    })
  }

  notify(channel: string, info: unknown) {
    this.push({
      channel,
      info,
    } as IPCNodeR2TMessage)
  }

  _read() {
    //
  }
}

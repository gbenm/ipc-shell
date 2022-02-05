import { Readable } from "stream"
import { IPCNodeR2TMessage } from "../interfaces/helpers"

export class IPCNodeReadable extends Readable {
  constructor() {
    super({
      objectMode: true,
      autoDestroy: false,
      emitClose: false,
    })
  }

  notify(channel: string, info: unknown, error = false) {
    this.resume()
    this.push({
      channel,
      info,
      error
    } as IPCNodeR2TMessage)
  }

  _read() {
    //
  }
}

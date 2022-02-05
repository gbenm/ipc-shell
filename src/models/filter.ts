import { Transform, TransformCallback } from "stream"
import { IPCNodeR2TMessage } from "../interfaces/helpers"

export class IPCNodeFilter extends Transform {
  constructor(public channel: string) {
    super({
      objectMode: true,
    })
  }

  _transform(m: IPCNodeR2TMessage, _: unknown, complete: TransformCallback) {
    if (this.channel === m.channel) {
      complete(null, m.info)
      return
    }

    complete()
  }
}

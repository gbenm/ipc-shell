import { Transform, TransformCallback } from "stream"
import { IPCNodeR2TMessage } from "../interfaces/helpers"

export class IPCNodeFilter extends Transform {
  constructor(public channel: string) {
    super({
      objectMode: true
    })
  }

  _transform(m: IPCNodeR2TMessage, _: unknown, complete: TransformCallback) {
    if (this.channel === m.channel) {
      if (m.error) {
        if (m.info instanceof Error) {
          complete(m.info)
        } else {
          complete(new Error(JSON.stringify(m.info)))
        }
        return
      }
      complete(null, m.info)
      return
    }

    complete()
  }
}

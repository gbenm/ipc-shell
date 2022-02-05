import { magic, makeMessage } from "../utils/errors"

export class IPCNodeError extends Error {
  readonly _ipcNodeErrorMagic = magic

  constructor(
    public info: unknown,
  ) {
    super(makeMessage(info))
  }
}

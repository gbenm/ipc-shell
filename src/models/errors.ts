const magic = "1A493BAB6EC01047D1F21F88288B24FD24D2A0AD"

export class IPCNodeError extends Error {
  readonly _ipcNodeErrorMagic = magic

  constructor(
    public info: unknown,
  ) {
    super(IPCNodeError.makeMessage(info))
  }

  private static makeMessage(info: unknown): string {
    return `${magic}${JSON.stringify(info)}`
  }

  public static isIPCNodeError(message: unknown): boolean {
    if (typeof message !== "string") {
      return (message as IPCNodeError)._ipcNodeErrorMagic === magic
    }

    return message.substring(0, 40) === magic
  }

  public static getInfoFromIPCNodeError(message: unknown): unknown {
    if (!this.isIPCNodeError(message)) {
      throw new Error(`${message} is not an IPCNodeError`)
    }

    if (typeof message !== "string") {
      return (message as IPCNodeError).info
    }

    return JSON.parse(message.substring(40))
  }
}

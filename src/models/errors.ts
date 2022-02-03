export class IPCNodeError extends Error {
  constructor(
    public info: unknown,
  ) {
    super(IPCNodeError.makeMessage(info))
  }

  private static makeMessage(info: unknown): string {
    return `1A493BAB6EC01047D1F21F88288B24FD24D2A0AD${JSON.stringify(info)}`
  }

  public static isIPCNodeError(message: string): boolean {
    return message.substring(0, 40) === "1A493BAB6EC01047D1F21F88288B24FD24D2A0AD"
  }

  public static getInfoFromString(message: string): unknown {
    if (!this.isIPCNodeError(message)) {
      throw new Error(`${message} is not an IPCNodeError`)
    }

    return JSON.parse(message.substring(40))
  }
}

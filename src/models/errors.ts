export class IPCNodeError extends Error {
  constructor(
    public channel: string,
    public info: unknown,
    message?: string
  ) {
    super(message)
  }
}

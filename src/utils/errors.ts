import { IPCNodeError } from ".."

export const magic = "1A493BAB6EC01047D1F21F88288B24FD24D2A0AD"

export function makeMessage(info: unknown): string {
  return `${magic}${JSON.stringify(info)}`
}

export function fromError(firstArg: Error): IPCNodeError {
  return new IPCNodeError(getInfoFromIPCNodeError(firstArg.message))
}

export function fromObject(obj: {info: unknown}): IPCNodeError {
  return new IPCNodeError(obj.info)
}

export function isIPCNodeError(message: unknown): boolean {
  if (typeof message !== "string") {
    return (message as IPCNodeError)._ipcNodeErrorMagic === magic
  }

  return message.substring(0, 40) === magic
}

export function getInfoFromIPCNodeError(message: unknown): unknown {
  if (typeof message !== "string") {
    return (message as IPCNodeError).info
  }

  return JSON.parse(message.substring(40))
}

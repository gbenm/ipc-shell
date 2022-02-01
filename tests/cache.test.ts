import { expect } from "chai"
import { IPCNodeRegister, IPCNodeBuilder } from "../dist"

describe("IPC Cache", () => {
  it ("Get registered ipc", () => {
    const ipcBuilder = new IPCNodeBuilder()
    const ipc = ipcBuilder
      .setName("test")
      .build()

    IPCNodeRegister.register(ipc)
    expect(IPCNodeRegister.get("test")).to.equal(ipc)
  })

  it ("Get multiple registered ipcs", () => {
    const ipcBuilder = new IPCNodeBuilder()
    const ipcs = Array(20).fill(0).map(
      (_, i) => ipcBuilder
        .reset()
        .setName(`multiple-${i+1}`)
        .build()
    )

    ipcs.forEach((ipc) => IPCNodeRegister.register(ipc))

    ipcs.forEach((ipc, i) => expect(IPCNodeRegister.get(`multiple-${i+1}`)).to.equal(ipc))
  })

  it ("Throw error if register twice", () => {
    const ipc = new IPCNodeBuilder()
      .setName("test-twice")
      .build()

    IPCNodeRegister.register(ipc)
    expect(() => IPCNodeRegister.register(ipc)).to.throw(Error)
  })

  it ("Throw error getting ipcNode not registered", () => {
    expect(() => IPCNodeRegister.get("test-ghost")).to.throw(Error) 
  })
})

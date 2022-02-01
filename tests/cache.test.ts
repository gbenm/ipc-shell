import { expect } from "chai"
import { IPCNodeRegister } from "../src/cache"
import { IPCNode } from "../src/models"

describe("IPC Cache", () => {
  it ("Get registered ipc", () => {
    const ipc = new IPCNode()
    IPCNodeRegister.register("test", ipc)
    expect(IPCNodeRegister.get("test")).to.equal(ipc)
  })

  it ("Get multiple registered ipcs", () => {
    const ipcs = Array(20).fill(0).map(() => new IPCNode())

    ipcs.forEach((ipc, i) => IPCNodeRegister.register(`multiple-${i+1}`, ipc))

    ipcs.forEach((ipc, i) => expect(IPCNodeRegister.get(`multiple-${i+1}`)).to.equal(ipc))
  })

  it ("Throw error if register twice", () => {
    const ipc = new IPCNode()
    IPCNodeRegister.register("test-twice", ipc)
    expect(() => IPCNodeRegister.register("test-twice", ipc)).to.throw(Error)
  })

  it ("Throw error getting ipcNode not registered", () => {
    expect(() => IPCNodeRegister.get("test-ghost")).to.throw(Error) 
  })
})

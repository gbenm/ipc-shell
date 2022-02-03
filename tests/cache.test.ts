import { expect } from "chai"
import { IPCNodeRegister, IPCNodeOnDuplicateAction } from "../dist"

describe("IPC Cache", () => {
  it ("Get registered ipc", () => {

    IPCNodeRegister.register("test", process)
    expect(IPCNodeRegister.get("test")).to.equal(process)
  })

  it ("Get multiple registered ipcs", () => {
    const ipcs = Array(20).fill(0).map(
      () => Object.create(process)
    )

    ipcs.forEach((ipc, i) => IPCNodeRegister.register(`multiple-${i+1}`, ipc))

    ipcs.forEach((ipc, i) => expect(IPCNodeRegister.get(`multiple-${i+1}`)).to.equal(ipc))
  })

  it ("Throw error if register twice", () => {
    IPCNodeRegister.register("test-twice", process)
    expect(() => IPCNodeRegister.register("test-twice", process, IPCNodeOnDuplicateAction.error)).to.throw(Error)
  })

  it ("Throw error getting ipcNode not registered", () => {
    expect(() => IPCNodeRegister.get("test-ghost")).to.throw(Error) 
  })
})

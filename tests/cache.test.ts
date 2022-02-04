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

  it ("Throw error if register twice (action error)", () => {
    IPCNodeRegister.register("test-twice-error", process)
    expect(() => IPCNodeRegister.register("test-twice-error", process, IPCNodeOnDuplicateAction.error)).to.throw(Error)
  })

  it ("No throw error if register twice (action ignore)", () => {
    IPCNodeRegister.register("test-twice-ignore", process)
    expect(() => IPCNodeRegister.register("test-twice-ignore", process, IPCNodeOnDuplicateAction.ignore)).to.not.throw(Error)
  })

  it ("Replace if register twice (action replace)", () => {
    const ipc = { value: "i'm a IPC" }

    IPCNodeRegister.register("test-twice-replace", ipc)

    const anotherIpc = { value: "i'm another IPC" }

    IPCNodeRegister.register("test-twice-replace", anotherIpc, IPCNodeOnDuplicateAction.replace)

    expect(IPCNodeRegister.get("test-twice-replace")).to.equal(anotherIpc)
  })

  it ("Throw error if register falsy values", () => {
    expect(() => IPCNodeRegister.register("test-falsy1", null)).to.throw(Error)
    expect(() => IPCNodeRegister.register("test-falsy2", undefined)).to.throw(Error)
    expect(() => IPCNodeRegister.register("test-falsy3", false)).to.throw(Error)
    expect(() => IPCNodeRegister.register("test-falsy4", 0)).to.throw(Error)
    expect(() => IPCNodeRegister.register("test-falsy5", "")).to.throw(Error)
  })

  it ("Throw error getting ipcNode not registered", () => {
    expect(() => IPCNodeRegister.get("test-ghost")).to.throw(Error) 
  })
})

import { expect } from "chai"
import { IPCNodeRegister, IPCNodeOnDuplicateAction } from "../dist"

describe("IPC Cache", () => {
  it ("Get registered ipc", () => {
    const ipc = { name: "test" }

    IPCNodeRegister.register(ipc.name, ipc)
    expect(IPCNodeRegister.get(ipc.name)).to.equal(ipc)
  })

  it ("Get multiple registered ipcs", () => {
    const ipcs = Array(20).fill(0).map(
      (_, i) => ({ name:  `multiple-${i+1}` })
    )

    ipcs.forEach((ipc) => IPCNodeRegister.register(ipc.name, ipc))

    ipcs.forEach((ipc) => expect(IPCNodeRegister.get(ipc.name)).to.equal(ipc))
  })

  it ("Throw error if register twice (action error)", () => {
    const ipc = { name: "test-twice-error" }

    IPCNodeRegister.register(ipc.name, process)
    expect(() => IPCNodeRegister.register(ipc.name, process, IPCNodeOnDuplicateAction.error)).to.throw(Error)
  })

  it ("No throw error if register twice (action ignore)", () => {
    const ipc = { name: "test-twice-ignore" }
    IPCNodeRegister.register(ipc.name, process)
    expect(() => IPCNodeRegister.register(ipc.name, process, IPCNodeOnDuplicateAction.ignore)).to.not.throw(Error)
  })

  it ("Replace if register twice (action replace)", () => {
    const ipcName = "test-twice-replace"

    const ipc = { value: "i'm a IPC" }

    IPCNodeRegister.register(ipcName, ipc)

    const anotherIpc = { value: "i'm another IPC" }

    IPCNodeRegister.register(ipcName, anotherIpc, IPCNodeOnDuplicateAction.replace)

    expect(IPCNodeRegister.get(ipcName)).to.equal(anotherIpc)
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

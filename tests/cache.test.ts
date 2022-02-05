import { expect } from "chai"
import { IPCNodeRegister, IPCNodeOnDuplicateAction } from "../dist"
import { uniqueTestName } from "../utils/unique"

describe("IPC Cache", () => {
  it ("Get registered ipc", () => {
    const ipc = { name: uniqueTestName() }

    IPCNodeRegister.register(ipc.name, ipc)
    expect(IPCNodeRegister.get(ipc.name)).to.equal(ipc)
  })

  it ("Get multiple registered ipcs", () => {
    const ipcs = Array(20).fill(0).map(
      () => ({ name:  uniqueTestName() })
    )

    ipcs.forEach((ipc) => IPCNodeRegister.register(ipc.name, ipc))

    ipcs.forEach((ipc) => expect(IPCNodeRegister.get(ipc.name)).to.equal(ipc))
  })

  describe("Register twice", () => {
    it ("Throw error (action error)", () => {
      const ipc = { name: uniqueTestName() }

      IPCNodeRegister.register(ipc.name, ipc)
      expect(() => IPCNodeRegister.register(ipc.name, ipc, IPCNodeOnDuplicateAction.error)).to.throw(Error)
    })

    describe ("No throw error (action ignore)", () => {
      const ipc = { name: uniqueTestName() }
      IPCNodeRegister.register(ipc.name, ipc)

      const ipc2 = { value: 2 }

      it ("No error", () => {
        expect(() => {
          IPCNodeRegister.register(ipc.name, ipc2, IPCNodeOnDuplicateAction.ignore)
        }).to.not.throw(Error)
      })

      it ("No replace", () => {
        expect(IPCNodeRegister.get(ipc.name)).to.equal(ipc)
      })
    })

    it ("Replace (action replace)", () => {
      const ipcName = uniqueTestName()

      const ipc = { value: "i'm a IPC" }

      IPCNodeRegister.register(ipcName, ipc)

      const anotherIpc = { value: "i'm another IPC" }

      IPCNodeRegister.register(ipcName, anotherIpc, IPCNodeOnDuplicateAction.replace)

      expect(IPCNodeRegister.get(ipcName)).to.equal(anotherIpc)
    })
  })

  it ("Throw error if register falsy values", () => {
    expect(() => IPCNodeRegister.register(uniqueTestName(), null)).to.throw(Error)
    expect(() => IPCNodeRegister.register(uniqueTestName(), undefined)).to.throw(Error)
    expect(() => IPCNodeRegister.register(uniqueTestName(), false)).to.throw(Error)
    expect(() => IPCNodeRegister.register(uniqueTestName(), 0)).to.throw(Error)
    expect(() => IPCNodeRegister.register(uniqueTestName(), "")).to.throw(Error)
  })

  it ("Throw error getting ipcNode not registered", () => {
    expect(() => IPCNodeRegister.get(uniqueTestName())).to.throw(Error) 
  })
})

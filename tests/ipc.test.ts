import { expect } from "chai"
import { fork } from "child_process"
import { IPCNodeRegister } from "../dist"
import { prepareIPCNode } from "../utils/prepare"
import { uniqueTestName } from "../utils/unique"

const programPath = "./tests/process"

describe("IPC communication", () => {
  it ("Use send function no error", (done) => {
    const testname = uniqueTestName()
    const child = fork(programPath)
    const ipc = IPCNodeRegister.register(testname, child)

    ipc.once("spawn", () => {
      expect(() => {
        ipc.send("test")
        child.kill()
        done()
      }).to.not.throw(Error) 
    })  
  })

  it ("Use send and get response", (done) => {
    const testname = uniqueTestName()
    const child = fork(programPath)
    const ipc = IPCNodeRegister.register(testname, child)

    const timeout = setTimeout(() => child.kill(), 2000)

    prepareIPCNode(ipc)

    ipc.once("message", () => {
      ipc.on("message", (message) => {
        expect(message).to.equal("pong")
        child.kill()
        clearTimeout(timeout)
        done()
      })

      ipc.send("ping")
    }) 
  })
})

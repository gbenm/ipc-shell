import { IPCNode } from "../models/ipcnode"

export class IPCNodeRegister {
  private static ipcNodes: { [key: string]: IPCNode } = {}

  public static register(ipc: IPCNode) {
    if (this.ipcNodes[ipc.name]) {
      throw new Error(`IPCNode ${name} already registered`)
    }

    this.ipcNodes[ipc.name] = ipc
  }

  public static get(name: string): IPCNode {
    const ipc = this.ipcNodes[name]
    
    if (!ipc) {
      throw new Error(`IPCNode ${name} not registered`)
    }

    return ipc
  }

  public static log() {
    console.log(this.ipcNodes)
  }
}

import { IPCNode } from "@ipc/interfaces"
import { ipcNode } from "@ipc/implementations"
import { IPCNodeMod } from "./ipcmod"

export enum IPCNodeOnDuplicateAction {
  replace,
  ignore,
  error
}

export class IPCNodeRegister {
  private static ipcNodes: { [key: string]: IPCNode } = {}

  public static register<T>(
    name: string, 
    ipc: T,
    onDuplicate: IPCNodeOnDuplicateAction = IPCNodeOnDuplicateAction.ignore
  ): IPCNode<T> {
    if (!ipc) {
      throw new Error(`Can't extend ${ipc} with name ${name}`)
    }

    if (this.ipcNodes[name] && onDuplicate === IPCNodeOnDuplicateAction.error) {
      throw new Error(`IPCNode ${name} already registered`)
    }

    if (this.ipcNodes[name] && onDuplicate === IPCNodeOnDuplicateAction.ignore) {
      return this.ipcNodes[name] as IPCNode<T>
    }

    if (this.ipcNodes[name] && onDuplicate === IPCNodeOnDuplicateAction.replace) {
      const ipcMod = Object.assign(ipc, ipcNode);
      (ipcMod as IPCNodeMod).name = name
      this.ipcNodes[name] = ipcMod
      return ipcMod
    }

    const ipcMod = Object.assign(ipc, ipcNode);
    (ipcMod as IPCNodeMod).name = name
    this.ipcNodes[name] = ipcMod
    return ipcMod
  }

  public static get<T = unknown>(name: string): IPCNode<T> {
    const ipc = this.ipcNodes[name]
    
    if (!ipc) {
      throw new Error(`IPCNode ${name} not registered`)
    }

    return ipc as IPCNode<T>
  }
}

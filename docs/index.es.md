# Home

## Contexto
Este paquete para Nodejs es una extensión de funcionalidades para objetos
que se encargan de **inter-process communication (IPC)**. Un ejemplo de esto
es [ElectronJS](https://electronjs.org) con `ipcMain`, `ipcRenderer` y
`win.webContents`, ya que con ellos se puede realizar la comunicación del proceso
principal con las distintas ventanas y viceversa.

!!! info "Importante"
    La configuración inicial funciona con **ElectronJS** por lo que
    para que funcione por ejemplo con `NodeJS.ChildProcess`, tendrá
    que reimplementar `_getArgsFromOn`, `_ipcNodeSend` y colocar
    `ipcNodeErrorObjectMode` en `true` si quiere que tenga compatibilidad
    con `IPCNodeError`.

!!! warning "Muy importante"
    - Este paquete utiliza `Object.assign()`.
    - Todo en la interfaz `IPCBaseNode` se sobreescribe en el objeto
    que se registra con `IPCNodeRegister.register`.

## Cómo usarlo
Lo primero es que debe registar su IPC, a este se le hará un extensión con
algunos métodos que le pueden ser de utilidad, además le permitirá
tener a su disponibilidad los IPC que registre en un scope global de ese
proceso.

=== "Typescript/Javascript"

```typescript
import { ipcMain } from "electron";
import { IPCNodeRegister } from "ipc-shell"

const ipc = IPCNodeRegister.register("main", ipcMain)
```

!!! info "Nota"
    Se usará `IpcMain` como el tipo de IPC, si
    fuera para el `ipcRenderer` debería usar `IpcRenderer`,
    para el ipc de `win.webContents` debería usar `WebContents`,
    hablando en términos de Electronjs, en general usar
    la clase del IPC que registra

!!! tip "Chequeo de tipo"
    La razón que se coloque el tipo es para que pueda obtener
    la extensión de los tipos sin tener errores antes de 
    compilar si se está usando typescript, claro :smile:.

A partir de ahora puede acceder en el mismo proceso a este
IPC mediante su nombre:

=== "Typescript - Recomendado"

    ```typescript
    // somewhere else
    import { IpcMain } from "electron";
    import { IPCNodeRegister } from "ipc-shell"

    const ipc = IPCNodeRegister.get<IpcMain>("main");
    ```

=== "Typescript - Otro"

    ```typescript
    // somewhere else
    import { IpcMain } from "electron";
    import { IPCNodeRegister, IPCNode } from "ipc-shell"

    const ipc: IPCNode<IpcMain> = IPCNodeRegister.get("main");
    ```

=== "Javascript"

    ```javascript
    import { IpcMain } from "electron";
    import { IPCNodeRegister } from "ipc-shell"

    /**
     * @typedef {import("ipc-shell").IPCNode} IpcNode
     * @typedef {import("electron").IpcMain} IpcMain
     *
     * @type {IpcNode & IpcMain}
     */
    const ipc = IPCNodeRegister.get("main");
    ```

En el caso de Javascript se importó los tipos y se les dio
otro nombre con `@typedef`, así que deberá cambiar
el tipo de `IpcMain` si es que usa JsDoc para sus tipos.

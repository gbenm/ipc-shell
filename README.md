# IPC Shell

Es una envoltura para objetos que realizan la comunicación
entre procesos, en el estado inicial, está configurado para
funcionar con los IPC de [electron](https://www.electronjs.org/),
este comportamiento puede cambiar sobreescribiendo las funciones
`_getArgsFromOn` e `_ipcNodeSend`.

## Como usar
Importe `IPCNodeRegister` y registre el IPC:

```javascript
import { ipcMain } from 'electron';
import { IPCNodeRegister } from "ipc-shell"

const ipc = IPCNodeRegister.register("main", ipcMain)
```

**Nota: se usará `IpcMain` como el tipo de IPC, si
fuera para el `ipcRenderer` debería usar `IpcRenderer`,
para el ipc de `win.webContents` debería usar `WebContents`,
hablando en términos de electronjs, en general usar
la clase del IPC que registra.**

Note que ahora `ipc` fue extendido. Colocando el tipo sería
de la siguiente forma (por la inferencia de tipos lo de arriba
está bien):

```javascript
import { IpcMain, ipcMain } from 'electron';
import { IPCNode, IPCNodeRegister } from "ipc-shell"

const ipc: IPCNode<IpcMain> = IPCNodeRegister.register("main", ipcMain)
```

A partir de ahora puede acceder en el mismo proceso a este
IPC mediante su nombre:

```javascript
// somewhere else

import { IpcMain } from 'electron';
import { IPCNodeRegister } from "ipc-shell"

// using IPCNode type (import from ipc-shell)
const ipc: IPCNode<IpcMain> = IPCNodeRegister.get("main");

// using generic type
const ipc = IPCNodeRegister.get<IpcMain>("main");
```

El hecho de que se agregue `IpcMain` es para que pueda
seguir utilizando todos lo métodos y variables que este
contenga más los extras, si no agrega el tipo únicamente
podrá usar los de `IPCNode`.

## Disclaimer
- This package use `Object.assign()`.
- All in the `IPCBaseNode` interface is overwritten when it extends.

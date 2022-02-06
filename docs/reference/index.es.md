# Compatibilidad ChildProcess y Process

!!! tip "Usuarios de Electronjs"
    Si tu IPC es parte de esta librería, estas
    modificaciones no te interesan.

## No eliminar el primer argumento

ChildProcess y Process no tienen objectos antes de los
mensajes, en el caso de Electron viene un argumento especial,
por lo que la función `_getArgsFromOn` removía este de los
argumentos para usar internamente, este comportamiento ya no
es deseable.

Después regitrar su ipc (esto se hace por instancia) que es
de tipo ChildProcess o Process debe realizar lo siguiente:

=== "Typescript"

    ```typescript
    ipc._getArgsFromOn = function(this: Process, ...args) {
        return args
    }
    ```

=== "Javascript"

    ```typescript
    ipc._getArgsFromOn = function(...args) {
        return args
    }
    ```

Lo anterior es para que no se elimine por defecto el primer argumento.

!!! warning "Cuidado"
    Esto es estrictamente necesario hacerlo después de extender
    el objeto, ya que se sobreescriben las propiedades

## Sólo hay un único canal
En electron la función `send` también recibe el nombre del canal por el que se
va enviar, ChildProcess y Process sólo cuentan con un único canal, entonces
debemos decirle que no use el parámetro del canal y que lo ingore:

=== "Typescript"

    ```typescript
    ipc._ipcNodeSend = function(this: Process | ChildProcess, _channel, message: Serializable) {
        return this.send?.(message)
    }
    ```

=== "Javascript"

    ```Javascript
    ipc._ipcNodeSend = function(message) {
        return this.send(message)
    }
    ```

!!! warning "Cuidado"
    Esto es estrictamente necesario hacerlo después de extender
    el objeto, ya que se sobreescriben las propiedades

## Habilitar la comprobación de objetos para errores
Electron tiene la capacidad de enviar Errores por el canal, sin embargo
no contamos con esto ahora, entonces los errores son enviados como
objetos, por lo que si quiere tener la característica de errores
de este paquete deberá colocar lo siguiente:

```javascript
ipc.ipcNodeErrorObjectMode = true
```

!!! warning "Cuidado"
    Esto es estrictamente necesario hacerlo después de extender
    el objeto, ya que se sobreescriben las propiedades

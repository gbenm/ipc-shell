# Readable (Stream)

Puede crear un stream para recibir los datos de un canal en específico:

```javascript
const readable = ipc.readableStream("notifications")

ipc.on("data", ...) // ok!
ipc.pipe(...) // ok!
```

Lo que devuelve el método es un `stream.Readable`, por lo que
lo puede utilizar como tal (vea [Readable](https://nodejs.org/api/stream.html#class-streamreadable)).

!!! warning "Errores en Stream"
    Cuando manda un `IPCNodeError` esto provoca que cualquier `Readable` (obtenido por
    `.readableStream(channel)`), se cierre, por lo que ya no podrá utilizarlo,
    esto es porque se emite el error, y por comportamiento de NodeJS, al obtener un
    error en un stream este ya no puede seguir usandose.

Si quiere esperar un error puede hacerlo de la siguiente manera:

```javascript
ipc.on("error", (error) => {
    ...
})
```

Recuerde que sólo puede utilizarse una vez por instancia obtenída por
`.readableStream(channel)`, luego de esto se puede subscribir al evento
"close", para saber cuándo deja de funcionar el Stream.

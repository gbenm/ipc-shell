"use strict";
var IPCMain = /** @class */ (function () {
    function IPCMain() {
    }
    IPCMain.prototype.send = function (channel) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log(channel, args);
    };
    return IPCMain;
}());
var ipc = new IPCMain();
function ipcTester(ipc) {
    ipc.send('test', 'argument');
}
ipcTester(ipc);
process.on("message", function (message) {
});

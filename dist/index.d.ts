declare type Process = {
    send(channel: string, ...args: any[]): void;
};
declare class IPCMain {
    send(channel: string, ...args: any[]): void;
}
declare const ipc: IPCMain;
declare function ipcTester(ipc: Process): void;

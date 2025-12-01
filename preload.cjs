const { contextBridge, ipcRenderer } = require("electron");

console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
    createZoomAccount: (settings) => ipcRenderer.invoke("create-zoom-account", settings),
    getAccounts: () => ipcRenderer.invoke("get-accounts"),
    onAutomationLog: (callback) =>
        ipcRenderer.on("automation-log", (event, msg) => callback(msg))
});
// JOHN GALVENSTONE
// No support while be given to forks
import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createZoomAccount } from "./automation/zoom.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 750,
        icon: path.join(__dirname, "assets/icon.png"), // RIP KING
        webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            frame: false,
            titleBarStyle: "hiddenInset",
            devTools: false,
        },
        center: true,
        fullscreen: false,
        autoHideMenuBar: true
    });
    win.loadFile("./renderer/index.html");
}

app.whenReady().then(createWindow);

ipcMain.handle("create-zoom-account", async (event, settings) => {
    const { birthYear, password, firstName, lastName } = settings;
    return await createZoomAccount(
        birthYear,
        password,
        firstName,
        lastName,
        log => win.webContents.send("automation-log", log)
    );
});

ipcMain.handle("get-accounts", async () => {
    const filePath = path.join(__dirname, "accounts.json");
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        const emptyArray = [];
        await fs.writeFile(filePath, JSON.stringify(emptyArray, null, 2), "utf8");
        return emptyArray;
    };
});
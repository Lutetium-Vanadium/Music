import { app, Menu, MenuItemConstructorOptions, BrowserWindow } from "electron";

// interface setMenuProps {
//   pausePlay: Function;
//   seekForward: Function;
//   seekBackward: Function;
//   nextTrack: Function;
//   prevTrack: Function;
// }

const setMenu = (win: BrowserWindow) => {
  const isMac = process.platform === "darwin";

  let template: MenuItemConstructorOptions[] = [
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }, { role: "quit" }]
    },
    {
      label: "Controls",
      submenu: [
        {
          label: "Pause/Play",
          click: () => win.webContents.send("pause-play"),
          accelerator: "Space"
        },
        {
          label: "Seek Backward",
          click: () => win.webContents.send("seek-back"),
          accelerator: "Left"
        },
        {
          label: "Seek Forward",
          click: () => win.webContents.send("seek-ahead"),
          accelerator: "Right"
        },
        {
          label: "Previous Track",
          click: () => win.webContents.send("prev-track"),
          accelerator: "CmdOrCtrl+Left"
        },
        {
          label: "Next Track",
          click: () => win.webContents.send("next-track"),
          accelerator: "CmdOrCtrl+Right"
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" }, // Temp
        { role: "forceReload" }, // Temp
        { role: "toggleDevTools" }, // Temp
        { type: "separator" }, // Temp
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    }
  ];

  if (isMac) {
    template.unshift({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default setMenu;

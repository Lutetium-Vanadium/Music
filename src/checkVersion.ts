import { app, Notification } from "electron";
import axios from "axios";
import * as path from "path";

const REMOTE_PACKAGEJSON = "https://raw.githubusercontent.com/Lutetium-Vanadium/Music/master/package.json";

// Gets version from package.json in the github repo
const getRemoteVersion = async (): Promise<string | null> => {
  try {
    const response = await axios.get(REMOTE_PACKAGEJSON);
    if (response.status !== 200) throw response.headers.status;

    return response.data.version;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Notifies user if their version is out of date
const checkVersion = async () => {
  const currentVersion = app.getVersion();
  const remoteVersion = await getRemoteVersion();

  if (remoteVersion && remoteVersion !== currentVersion) {
    const osSpecificText =
      process.platform === "linux"
        ? "To update the app, run update.sh at the root of the cloned project."
        : "Go to the root of the project, pull the changes and then do the same steps you did to install the project.\nYou can open the changelog.html in the browser to view changes.";

    new Notification({
      title: "Version Update",
      body: `There is a new version of Music available. You are currently using ${currentVersion}. The latest version is ${remoteVersion}.\n${osSpecificText}`,
      icon: path.resolve("resources", "logo.png"),
      timeoutType: "never",
      urgency: "critical",
    }).show();
  }
};

export default checkVersion;

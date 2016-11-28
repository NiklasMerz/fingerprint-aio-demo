export interface ServeConfig {
    httpPort: number;
    host: string;
    rootDir: string;
    wwwDir: string;
    buildDir: string;
    launchBrowser: boolean;
    launchLab: boolean;
    browserToLaunch: string;
    useLiveReload: boolean;
    liveReloadPort: Number;
    notificationPort: Number;
    useServerLogs: boolean;
    notifyOnConsoleLog: boolean;
    useProxy: boolean;
}
export declare const LOGGER_DIR: string;
export declare const IONIC_LAB_URL: string;

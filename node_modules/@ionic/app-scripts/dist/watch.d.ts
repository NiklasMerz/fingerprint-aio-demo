import { BuildContext } from './util/interfaces';
export declare function watch(context?: BuildContext, configFile?: string): Promise<void>;
export declare function prepareWatcher(context: BuildContext, watcher: Watcher): void;
export interface ChangedFile {
    event: string;
    filePath: string;
    ext: string;
}
export declare function buildUpdate(event: string, filePath: string, context: BuildContext): Promise<void>;
export declare function runBuildUpdate(context: BuildContext, changedFiles: ChangedFile[]): {
    event: string;
    filePath: string;
    changedFiles: string[];
};
export interface WatchConfig {
    watchers: Watcher[];
}
export interface Watcher {
    paths?: string[] | string;
    options?: {
        ignored?: string | Function;
        ignoreInitial?: boolean;
        followSymlinks?: boolean;
        cwd?: string;
    };
    eventName?: string;
    callback?: {
        (event: string, filePath: string, context: BuildContext): Promise<any>;
    };
}

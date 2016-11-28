import { FileCache } from '../util/file-cache';
export declare class HybridFileSystem implements FileSystem {
    private fileCache;
    private originalFileSystem;
    constructor(fileCache: FileCache, originalFileSystem: FileSystem);
    isSync(): boolean;
    stat(path: string, callback: Function): any;
    readdir(path: string, callback: Function): any;
    readJson(path: string, callback: Function): any;
    readlink(path: string, callback: Function): any;
    purge(pathsToPurge: string[]): void;
    readFile(path: string, callback: Function): any;
}
export interface FileSystem {
    isSync(): boolean;
    stat(path: string, callback: Function): any;
    readdir(path: string, callback: Function): any;
    readFile(path: string, callback: Function): any;
    readJson(path: string, callback: Function): any;
    readlink(path: string, callback: Function): any;
    purge(what: any): void;
}

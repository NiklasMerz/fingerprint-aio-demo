import { BuildContext } from './util/interfaces';
import * as ts from 'typescript';
export declare function transpile(context?: BuildContext): Promise<void>;
export declare function transpileUpdate(event: string, filePath: string, context: BuildContext): Promise<void>;
/**
 * The full TS build for all app files.
 */
export declare function transpileWorker(context: BuildContext, workerConfig: TranspileWorkerConfig): Promise<{}>;
export declare function canRunTranspileUpdate(event: string, filePath: string, context: BuildContext): boolean;
export declare function transpileDiagnosticsOnly(context: BuildContext): Promise<{}>;
export interface TranspileWorkerMessage {
    rootDir?: string;
    buildDir?: string;
    isProd?: boolean;
    configFile?: string;
    transpileSuccess?: boolean;
}
export declare function getTsConfig(context: BuildContext, tsConfigPath?: string): TsConfig;
export declare function getTsConfigPath(context: BuildContext): string;
export interface TsConfig {
    options: ts.CompilerOptions;
    fileNames: string[];
    typingOptions: ts.TypingOptions;
    raw: any;
}
export interface TranspileWorkerConfig {
    configFile: string;
    writeInMemory: boolean;
    sourceMaps: boolean;
    cache: boolean;
    inlineTemplate: boolean;
}

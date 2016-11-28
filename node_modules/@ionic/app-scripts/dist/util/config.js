"use strict";
var fs_extra_1 = require('fs-extra');
var path_1 = require('path');
var helpers_1 = require('./helpers');
var file_cache_1 = require('./file-cache');
/**
 * Create a context object which is used by all the build tasks.
 * Filling the config data uses the following hierarchy, which will
 * keep going down the list until it, or if it, finds data.
 *
 * 1) Get from the passed in context variable
 * 2) Get from the config file set using the command-line args
 * 3) Get from environment variable
 * 4) Get from package.json config property
 * 5) Get environment variables
 *
 * Lastly, Ionic's default configs will always fill in any data
 * which is missing from the user's data.
 */
function generateContext(context) {
    if (!context) {
        context = {};
        context.fileCache = new file_cache_1.FileCache();
    }
    context.rootDir = path_1.resolve(context.rootDir || getConfigValue(context, '--rootDir', null, ENV_VAR_ROOT_DIR, ENV_VAR_ROOT_DIR.toLowerCase(), processCwd));
    setProcessEnvVar(ENV_VAR_ROOT_DIR, context.rootDir);
    context.tmpDir = path_1.resolve(context.tmpDir || getConfigValue(context, '--tmpDir', null, ENV_VAR_TMP_DIR, ENV_VAR_TMP_DIR.toLowerCase(), path_1.join(context.rootDir, TMP_DIR)));
    setProcessEnvVar(ENV_VAR_TMP_DIR, context.tmpDir);
    context.srcDir = path_1.resolve(context.srcDir || getConfigValue(context, '--srcDir', null, ENV_VAR_SRC_DIR, ENV_VAR_SRC_DIR.toLowerCase(), path_1.join(context.rootDir, SRC_DIR)));
    setProcessEnvVar(ENV_VAR_SRC_DIR, context.srcDir);
    context.wwwDir = path_1.resolve(context.wwwDir || getConfigValue(context, '--wwwDir', null, ENV_VAR_WWW_DIR, ENV_VAR_WWW_DIR.toLowerCase(), path_1.join(context.rootDir, WWW_DIR)));
    setProcessEnvVar(ENV_VAR_WWW_DIR, context.wwwDir);
    context.wwwIndex = path_1.join(context.wwwDir, WWW_INDEX_FILENAME);
    context.buildDir = path_1.resolve(context.buildDir || getConfigValue(context, '--buildDir', null, ENV_VAR_BUILD_DIR, ENV_VAR_BUILD_DIR.toLowerCase(), path_1.join(context.wwwDir, BUILD_DIR)));
    setProcessEnvVar(ENV_VAR_BUILD_DIR, context.buildDir);
    setProcessEnvVar(ENV_VAR_APP_SCRIPTS_DIR, path_1.join(__dirname, '..', '..'));
    var sourceMapValue = getConfigValue(context, '--sourceMap', null, ENV_VAR_SOURCE_MAP, ENV_VAR_SOURCE_MAP.toLowerCase(), 'eval');
    setProcessEnvVar(ENV_VAR_SOURCE_MAP, sourceMapValue);
    if (!isValidBundler(context.bundler)) {
        context.bundler = bundlerStrategy(context);
    }
    context.isProd = getIsProd(context);
    setIonicEnvironment(context.isProd);
    if (typeof context.isWatch !== 'boolean') {
        context.isWatch = hasArg('--watch');
    }
    context.inlineTemplates = true;
    checkDebugMode();
    return context;
}
exports.generateContext = generateContext;
function getIsProd(context) {
    // only check if isProd hasn't already been manually set
    if (typeof context.isProd === 'boolean') {
        return context.isProd;
    }
    if (hasArg('--dev', '-d')) {
        // not production: has a --dev or -d cmd line arg
        return false;
    }
    var val = getPackageJsonConfig(context, ENV_VAR_IONIC_DEV.toLowerCase());
    if (typeof val === 'boolean') {
        return !val;
    }
    val = getProcessEnvVar(ENV_VAR_IONIC_DEV);
    if (typeof val === 'boolean') {
        return !val;
    }
    return true;
}
exports.getIsProd = getIsProd;
function getUserConfigFile(context, task, userConfigFile) {
    if (userConfigFile) {
        return path_1.resolve(userConfigFile);
    }
    var defaultConfig = getConfigValue(context, task.fullArg, task.shortArg, task.envVar, task.packageConfig, null);
    if (defaultConfig) {
        return path_1.join(context.rootDir, defaultConfig);
    }
    return null;
}
exports.getUserConfigFile = getUserConfigFile;
function fillConfigDefaults(userConfigFile, defaultConfigFile) {
    var userConfig = null;
    if (userConfigFile) {
        try {
            // check if exists first, so we can print a more specific error message
            // since required config could also throw MODULE_NOT_FOUND
            fs_extra_1.statSync(userConfigFile);
            // create a fresh copy of the config each time
            userConfig = require(userConfigFile);
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                console.error("Config file \"" + userConfigFile + "\" not found. Using defaults instead.");
            }
            else {
                console.error("There was an error in config file \"" + userConfigFile + "\". Using defaults instead.");
                console.error(e);
            }
        }
    }
    var defaultConfig = require(path_1.join('..', '..', 'config', defaultConfigFile));
    // create a fresh copy of the config each time
    // always assign any default values which were not already supplied by the user
    return helpers_1.objectAssign({}, defaultConfig, userConfig);
}
exports.fillConfigDefaults = fillConfigDefaults;
function bundlerStrategy(context) {
    // 1) User provided a rollup config via cmd line args
    var val = getArgValue('--rollup', '-r');
    if (val) {
        return exports.BUNDLER_ROLLUP;
    }
    // 2) User provided both a rollup config and webpack config in package.json config
    val = getPackageJsonConfig(context, 'ionic_rollup');
    var webpackVal = getPackageJsonConfig(context, 'ionic_webpack');
    if (val && webpackVal) {
        var bundler = getPackageJsonConfig(context, 'ionic_bundler');
        if (isValidBundler(bundler)) {
            return bundler;
        }
    }
    // 3) User provided a rollup config env var
    val = getProcessEnvVar('ionic_rollup');
    if (val) {
        return exports.BUNDLER_ROLLUP;
    }
    // 4) User provided a rollup config in package.json config
    val = getPackageJsonConfig(context, 'ionic_rollup');
    if (val) {
        return exports.BUNDLER_ROLLUP;
    }
    // 5) User set bundler through full arg
    val = getArgValue('--bundler', null);
    if (isValidBundler(val)) {
        return val;
    }
    // 6) User set bundler through package.json config
    val = getPackageJsonConfig(context, 'ionic_bundler');
    if (isValidBundler(val)) {
        return val;
    }
    // 7) User set to use rollup at the bundler
    val = getProcessEnvVar('ionic_bundler');
    if (isValidBundler(val)) {
        return val;
    }
    // 8) Default to use webpack
    return exports.BUNDLER_WEBPACK;
}
exports.bundlerStrategy = bundlerStrategy;
function isValidBundler(bundler) {
    return (bundler === exports.BUNDLER_ROLLUP || bundler === exports.BUNDLER_WEBPACK);
}
function getConfigValue(context, argFullName, argShortName, envVarName, packageConfigProp, defaultValue) {
    // first see if the value was set in the command-line args
    var argVal = getArgValue(argFullName, argShortName);
    if (argVal !== null) {
        return argVal;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return envVar;
    }
    var packageConfig = getPackageJsonConfig(context, packageConfigProp);
    if (packageConfig !== null) {
        return packageConfig;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.getConfigValue = getConfigValue;
function getArgValue(fullName, shortName) {
    for (var i = 2; i < processArgv.length; i++) {
        var arg = processArgv[i];
        if (arg === fullName || (shortName && arg === shortName)) {
            var val = processArgv[i + 1];
            if (val !== undefined && val !== '') {
                return val;
            }
        }
    }
    return null;
}
function hasConfigValue(context, argFullName, argShortName, envVarName, defaultValue) {
    if (hasArg(argFullName, argShortName)) {
        return true;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return true;
    }
    var packageConfig = getPackageJsonConfig(context, envVarName);
    if (packageConfig !== null) {
        return true;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.hasConfigValue = hasConfigValue;
function hasArg(fullName, shortName) {
    if (shortName === void 0) { shortName = null; }
    return !!(processArgv.some(function (a) { return a === fullName; }) || (shortName !== null && processArgv.some(function (a) { return a === shortName; })));
}
exports.hasArg = hasArg;
function replacePathVars(context, filePath) {
    return filePath.replace('{{SRC}}', context.srcDir)
        .replace('{{WWW}}', context.wwwDir)
        .replace('{{TMP}}', context.tmpDir)
        .replace('{{ROOT}}', context.rootDir)
        .replace('{{BUILD}}', context.buildDir);
}
exports.replacePathVars = replacePathVars;
function getNodeBinExecutable(context, cmd) {
    var cmdPath = path_1.join(context.rootDir, 'node_modules', '.bin', cmd);
    try {
        fs_extra_1.accessSync(cmdPath);
    }
    catch (e) {
        cmdPath = null;
    }
    return cmdPath;
}
exports.getNodeBinExecutable = getNodeBinExecutable;
var checkedDebug = false;
function checkDebugMode() {
    if (!checkedDebug) {
        if (hasArg('--debug') || getProcessEnvVar('ionic_debug_mode') === 'true') {
            processEnv.ionic_debug_mode = 'true';
        }
        checkedDebug = true;
    }
}
function isDebugMode() {
    return (processEnv.ionic_debug_mode === 'true');
}
exports.isDebugMode = isDebugMode;
function setIonicEnvironment(isProd) {
    setProcessEnvVar(ENV_VAR_IONIC_ENV, (isProd ? ENV_VAR_PROD : ENV_VAR_DEV));
}
exports.setIonicEnvironment = setIonicEnvironment;
var processArgv;
function setProcessArgs(argv) {
    processArgv = argv;
}
exports.setProcessArgs = setProcessArgs;
setProcessArgs(process.argv);
function addArgv(value) {
    processArgv.push(value);
}
exports.addArgv = addArgv;
var processEnv;
function setProcessEnv(env) {
    processEnv = env;
}
exports.setProcessEnv = setProcessEnv;
setProcessEnv(process.env);
function setProcessEnvVar(key, value) {
    processEnv[key] = value;
}
exports.setProcessEnvVar = setProcessEnvVar;
function getProcessEnvVar(key) {
    var val = processEnv[key];
    if (val !== undefined) {
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }
        return val;
    }
    return null;
}
exports.getProcessEnvVar = getProcessEnvVar;
var processCwd;
function setCwd(cwd) {
    processCwd = cwd;
}
exports.setCwd = setCwd;
setCwd(process.cwd());
function getPackageJsonConfig(context, key) {
    var packageJsonData = getAppPackageJsonData(context);
    if (packageJsonData && packageJsonData.config) {
        var val = packageJsonData.config[key];
        if (val !== undefined) {
            if (val === 'true') {
                return true;
            }
            if (val === 'false') {
                return false;
            }
            return val;
        }
    }
    return null;
}
exports.getPackageJsonConfig = getPackageJsonConfig;
var appPackageJsonData = null;
function setAppPackageJsonData(data) {
    appPackageJsonData = data;
}
exports.setAppPackageJsonData = setAppPackageJsonData;
function getAppPackageJsonData(context) {
    if (!appPackageJsonData) {
        try {
            appPackageJsonData = fs_extra_1.readJSONSync(path_1.join(context.rootDir, 'package.json'));
        }
        catch (e) { }
    }
    return appPackageJsonData;
}
var BUILD_DIR = 'build';
var SRC_DIR = 'src';
var TMP_DIR = '.tmp';
var WWW_DIR = 'www';
var WWW_INDEX_FILENAME = 'index.html';
var ENV_VAR_PROD = 'prod';
var ENV_VAR_DEV = 'dev';
var ENV_VAR_IONIC_ENV = 'IONIC_ENV';
var ENV_VAR_IONIC_DEV = 'IONIC_DEV';
var ENV_VAR_ROOT_DIR = 'IONIC_ROOT_DIR';
var ENV_VAR_TMP_DIR = 'IONIC_TMP_DIR';
var ENV_VAR_SRC_DIR = 'IONIC_SRC_DIR';
var ENV_VAR_WWW_DIR = 'IONIC_WWW_DIR';
var ENV_VAR_BUILD_DIR = 'IONIC_BUILD_DIR';
var ENV_VAR_APP_SCRIPTS_DIR = 'IONIC_APP_SCRIPTS_DIR';
var ENV_VAR_SOURCE_MAP = 'IONIC_SOURCE_MAP';
exports.BUNDLER_ROLLUP = 'rollup';
exports.BUNDLER_WEBPACK = 'webpack';

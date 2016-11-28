"use strict";
var config_1 = require('../util/config');
var config_2 = require('../util/config');
var path_1 = require('path');
describe('config', function () {
    describe('generateContext', function () {
        it('should set isWatch true with isWatch true context', function () {
            var context = config_1.generateContext({
                isWatch: true
            });
            expect(context.isWatch).toEqual(true);
        });
        it('should set isWatch false by default', function () {
            var context = config_1.generateContext();
            expect(context.isWatch).toEqual(false);
        });
        it('should set isProd false with isProd false context', function () {
            var context = config_1.generateContext({
                isProd: false
            });
            expect(context.isProd).toEqual(false);
        });
        it('should set default bundler when invalid value', function () {
            var context = config_1.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set default bundler when not set', function () {
            var context = config_1.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set isProd by default', function () {
            var context = config_1.generateContext();
            expect(context.isProd).toEqual(true);
        });
        it('should create an object when passed nothing', function () {
            var context = config_1.generateContext();
            expect(context).toBeDefined();
        });
    });
    describe('getIsProd', function () {
        it('should set isProd false with env var', function () {
            context = {};
            config_2.setProcessEnvVar('IONIC_DEV', 'true');
            expect(config_1.getIsProd(context)).toEqual(false);
        });
        it('should set isProd false with package.json string config', function () {
            context = {};
            config_2.setAppPackageJsonData({ config: { ionic_dev: 'true' } });
            expect(config_1.getIsProd(context)).toEqual(false);
        });
        it('should set isProd false with package.json config', function () {
            context = {};
            config_2.setAppPackageJsonData({ config: { ionic_dev: true } });
            expect(config_1.getIsProd(context)).toEqual(false);
        });
        it('should not reassign isProd when already set', function () {
            context = {};
            context.isProd = true;
            config_2.addArgv('--dev');
            expect(config_1.getIsProd(context)).toEqual(true);
        });
        it('should set isProd false with short --d arg', function () {
            context = {};
            config_2.addArgv('-d');
            expect(config_1.getIsProd(context)).toEqual(false);
        });
        it('should set isProd false with full --dev arg', function () {
            context = {};
            config_2.addArgv('--dev');
            expect(config_1.getIsProd(context)).toEqual(false);
        });
        it('should default to isProd true', function () {
            context = {};
            expect(config_1.getIsProd(context)).toEqual(true);
        });
    });
    describe('getConfigValue', function () {
        it('should get arg full value', function () {
            config_2.addArgv('--full');
            config_2.addArgv('fullArgValue');
            config_2.addArgv('-s');
            config_2.addArgv('shortArgValue');
            config_2.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config_2.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config_1.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('fullArgValue');
        });
        it('should get arg short value', function () {
            config_2.addArgv('-s');
            config_2.addArgv('shortArgValue');
            config_2.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config_2.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config_1.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('shortArgValue');
        });
        it('should get envVar value', function () {
            config_2.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config_2.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config_1.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myProcessEnvVar');
        });
        it('should get package.json config value', function () {
            config_2.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config_1.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myPackageConfigVal');
        });
        it('should get default value', function () {
            var val = config_1.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('defaultValue');
        });
    });
    describe('bundlerStrategy', function () {
        it('should get rollup by full arg', function () {
            config_2.addArgv('--rollup');
            config_2.addArgv('my.rollup.confg.js');
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by short arg', function () {
            config_2.addArgv('-r');
            config_2.addArgv('my.rollup.confg.js');
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by bundler arg', function () {
            config_2.addArgv('--bundler');
            config_2.addArgv('rollup');
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by env var', function () {
            config_2.setProcessEnv({
                ionic_bundler: 'rollup'
            });
            config_2.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by package.json config', function () {
            config_2.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get webpack with invalid env var', function () {
            config_2.setProcessEnv({
                ionic_bundler: 'bobsBundler'
            });
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
        it('should get rollup by env var', function () {
            config_2.setProcessEnv({
                ionic_bundler: 'rollup'
            });
            config_2.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get rollup by package.json config', function () {
            config_2.setAppPackageJsonData({ config: { ionic_bundler: 'rollup' } });
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('rollup');
        });
        it('should get webpack by default', function () {
            var bundler = config_1.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
    });
    describe('getUserConfigFile', function () {
        it('should get config from package.json config', function () {
            config_2.setAppPackageJsonData({
                config: { ionic_config: 'myconfig.js' }
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from env var', function () {
            config_2.setProcessEnv({
                IONIC_CONFIG: 'myconfig.js'
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from short arg', function () {
            config_2.addArgv('-s');
            config_2.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from full arg', function () {
            config_2.addArgv('--full');
            config_2.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get userConfigFile', function () {
            var userConfigFile = 'myconfig.js';
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should not get a user config', function () {
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config_1.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(null);
        });
    });
    var context;
    beforeEach(function () {
        config_2.setProcessArgs(['node', 'ionic-app-scripts']);
        config_2.setProcessEnv({});
        config_2.setCwd('');
        config_2.setAppPackageJsonData(null);
        context = config_1.generateContext({});
    });
});

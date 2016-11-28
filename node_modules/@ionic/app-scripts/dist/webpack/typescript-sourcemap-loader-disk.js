"use strict";
var logger_1 = require('../logger/logger');
var helpers_1 = require('../util/helpers');
module.exports = function typescriptSourcemapLoaderDisk(source, map) {
    this.cacheable();
    var callback = this.async();
    if (this.resourcePath.indexOf('node_modules') > -1) {
        // it's not a source file, so use the default
        callback(null, source, map);
    }
    else {
        // it's a src file
        loadBetterSourceMap(this.resourcePath, callback, source, map);
    }
};
function loadBetterSourceMap(javascriptFilePath, callback, originalSource, originalMap) {
    var sourceMapPath = javascriptFilePath + '.map';
    var tsFilePath = helpers_1.changeExtension(javascriptFilePath, '.ts');
    var sourceMapContent = null;
    var typescriptFileContent = null;
    var readSourceMapPromise = helpers_1.readFileAsync(sourceMapPath);
    readSourceMapPromise.then(function (content) {
        sourceMapContent = content;
    });
    var readTsFilePromise = helpers_1.readFileAsync(tsFilePath);
    readTsFilePromise.then(function (content) {
        typescriptFileContent = content;
    });
    var promises = [];
    promises.push(readSourceMapPromise);
    promises.push(readTsFilePromise);
    Promise.all(promises)
        .then(function () {
        if (!sourceMapContent || !sourceMapContent.length) {
            throw new Error('Failed to read sourcemap file');
        }
        else if (!typescriptFileContent || !typescriptFileContent.length) {
            throw new Error('Failed to read typescript file');
        }
        else {
            return JSON.parse(sourceMapContent);
        }
    }).then(function (sourceMapObject) {
        if (!sourceMapObject.sourcesContent || sourceMapObject.sourcesContent.length === 0) {
            logger_1.Logger.debug("loadBetterSourceMap: Assigning Typescript content to source map for " + javascriptFilePath);
            sourceMapObject.sourcesContent = [typescriptFileContent];
        }
        callback(null, originalSource, sourceMapObject);
    }).catch(function (err) {
        logger_1.Logger.debug("Failed to generate typescript sourcemaps for " + javascriptFilePath + ": " + err.message);
        // just use the default
        callback(null, originalSource, originalMap);
    });
}

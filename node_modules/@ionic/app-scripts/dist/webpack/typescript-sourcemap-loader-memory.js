"use strict";
var path_1 = require('path');
var helpers_1 = require('../util/helpers');
module.exports = function typescriptSourcemapLoaderMemory(source, map) {
    this.cacheable();
    var callback = this.async();
    var context = helpers_1.getContext();
    var absolutePath = path_1.resolve(path_1.normalize(this.resourcePath));
    var javascriptPath = helpers_1.changeExtension(this.resourcePath, '.js');
    var javascriptFile = context.fileCache.get(javascriptPath);
    var sourceMapPath = javascriptPath + '.map';
    var sourceMapFile = context.fileCache.get(sourceMapPath);
    var sourceMapObject = map;
    if (sourceMapFile) {
        sourceMapObject = JSON.parse(sourceMapFile.content);
        sourceMapObject.sources = [absolutePath];
        if (!sourceMapObject.sourcesContent || sourceMapObject.sourcesContent.length === 0) {
            sourceMapObject.sourcesContent = [source];
        }
    }
    callback(null, javascriptFile.content, sourceMapObject);
};

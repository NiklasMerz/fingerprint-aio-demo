"use strict";
var helpers_1 = require('../util/helpers');
var path_1 = require('path');
function provideCorrectSourcePath(webpackObj) {
    var context = helpers_1.getContext();
    return provideCorrectSourcePathInternal(webpackObj, context);
}
exports.provideCorrectSourcePath = provideCorrectSourcePath;
function provideCorrectSourcePathInternal(webpackObj, context) {
    var webpackResourcePath = webpackObj.resourcePath;
    var noTilde = webpackResourcePath.replace(/~/g, 'node_modules');
    var absolutePath = path_1.resolve(path_1.normalize(noTilde));
    if (process.env.IONIC_SOURCE_MAP === 'eval') {
        // add another path.sep to the front to account for weird webpack behavior
        return path_1.sep + absolutePath;
    }
    return absolutePath;
}

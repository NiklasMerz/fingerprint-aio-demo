"use strict";
var HybridFileSystem = (function () {
    function HybridFileSystem(fileCache, originalFileSystem) {
        this.fileCache = fileCache;
        this.originalFileSystem = originalFileSystem;
    }
    HybridFileSystem.prototype.isSync = function () {
        return this.originalFileSystem.isSync();
    };
    HybridFileSystem.prototype.stat = function (path, callback) {
        return this.originalFileSystem.stat(path, callback);
    };
    HybridFileSystem.prototype.readdir = function (path, callback) {
        return this.originalFileSystem.readdir(path, callback);
    };
    HybridFileSystem.prototype.readJson = function (path, callback) {
        return this.originalFileSystem.readJson(path, callback);
    };
    HybridFileSystem.prototype.readlink = function (path, callback) {
        return this.originalFileSystem.readlink(path, callback);
    };
    HybridFileSystem.prototype.purge = function (pathsToPurge) {
        if (this.fileCache) {
            for (var _i = 0, pathsToPurge_1 = pathsToPurge; _i < pathsToPurge_1.length; _i++) {
                var path = pathsToPurge_1[_i];
                this.fileCache.remove(path);
            }
        }
    };
    HybridFileSystem.prototype.readFile = function (path, callback) {
        if (this.fileCache) {
            var file = this.fileCache.get(path);
            if (file) {
                callback(null, new Buffer(file.content));
                return;
            }
        }
        return this.originalFileSystem.readFile(path, callback);
    };
    return HybridFileSystem;
}());
exports.HybridFileSystem = HybridFileSystem;
;

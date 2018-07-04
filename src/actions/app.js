"use strict";
exports.__esModule = true;
var _a;
var AppActionType;
(function (AppActionType) {
    AppActionType["Download"] = "download";
    AppActionType["EnterUrl"] = "enterUrl";
    AppActionType["SetType"] = "setType";
    AppActionType["BrowseForDestination"] = "browseForDestination";
    AppActionType["SetDestination"] = "setDestination";
    AppActionType["UpdateDownloadState"] = "updateDownloadState";
    AppActionType["UpdateDownloadTitle"] = "updateDownloadTitle";
    AppActionType["UpdateDownloadProgress"] = "updateDownloadProgress";
    AppActionType["SettingsLoad"] = "settingsLoad";
})(AppActionType = exports.AppActionType || (exports.AppActionType = {}));
var DownloadState;
(function (DownloadState) {
    DownloadState["Started"] = "started";
    DownloadState["InProgress"] = "inProgress";
    DownloadState["Complete"] = "complete";
})(DownloadState = exports.DownloadState || (exports.DownloadState = {}));
var DownloadType;
(function (DownloadType) {
    DownloadType["Video"] = "video";
    DownloadType["Music"] = "music";
})(DownloadType = exports.DownloadType || (exports.DownloadType = {}));
exports.downloadTypes = (_a = {},
    _a[DownloadType.Video] = 'Video',
    _a[DownloadType.Music] = 'Music',
    _a);
exports.updateDownloadProgress = function (downloadId, progress) { return ({
    type: AppActionType.UpdateDownloadProgress,
    downloadId: downloadId,
    progress: progress
}); };
exports.updateDownloadTitle = function (downloadId, title) { return ({
    type: AppActionType.UpdateDownloadTitle,
    downloadId: downloadId,
    title: title
}); };
exports.updateDownloadState = function (downloadId, state) { return ({
    type: AppActionType.UpdateDownloadState,
    downloadId: downloadId,
    state: state
}); };
exports.settingsLoad = function (value) { return ({
    type: AppActionType.SettingsLoad,
    value: value
}); };
exports.download = function (downloadId) { return ({ type: AppActionType.Download, downloadId: downloadId }); };
exports.enterUrl = function (url) { return ({ type: AppActionType.EnterUrl, value: url }); };
exports.setType = function (type) { return ({ type: AppActionType.SetType, value: type }); };
exports.browseForDestination = function () { return ({ type: AppActionType.BrowseForDestination }); };
exports.setDestination = function (path) { return ({ type: AppActionType.SetDestination, value: path }); };

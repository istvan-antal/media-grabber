"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var app_1 = require("../actions/app");
var initialState = {
    url: '',
    type: app_1.DownloadType.Video,
    destination: '',
    downloadId: 0,
    downloads: []
};
exports.app = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case app_1.AppActionType.SettingsLoad:
            return __assign({}, state, { destination: action.value.destination });
        case app_1.AppActionType.UpdateDownloadProgress:
            return __assign({}, state, { downloads: state.downloads.map(function (item) {
                    if (item.id === action.downloadId) {
                        return __assign({}, item, { progress: action.progress });
                    }
                    return item;
                }) });
        case app_1.AppActionType.UpdateDownloadTitle:
            return __assign({}, state, { downloads: state.downloads.map(function (item) {
                    if (item.id === action.downloadId) {
                        return __assign({}, item, { title: action.title });
                    }
                    return item;
                }) });
        case app_1.AppActionType.UpdateDownloadState:
            return __assign({}, state, { downloads: state.downloads.map(function (item) {
                    if (item.id === action.downloadId) {
                        return __assign({}, item, { state: action.state });
                    }
                    return item;
                }) });
        case app_1.AppActionType.Download:
            return __assign({}, state, { url: '', downloadId: action.downloadId, downloads: state.downloads.concat([
                    {
                        id: action.downloadId,
                        type: state.type,
                        url: state.url,
                        destination: state.destination,
                        progress: 0,
                        state: app_1.DownloadState.Started
                    }
                ]) });
        case app_1.AppActionType.SetType:
            return __assign({}, state, { type: action.value });
        case app_1.AppActionType.EnterUrl:
            return __assign({}, state, { url: action.value });
        case app_1.AppActionType.SetDestination:
            return __assign({}, state, { destination: action.value });
    }
    return __assign({}, state);
};

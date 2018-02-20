export enum AppActionType {
    Download = 'download',
    EnterUrl = 'enterUrl',
    SetType = 'setType',
    BrowseForDestination = 'browseForDestination',
    SetDestination = 'setDestination',
    UpdateDownloadState = 'updateDownloadState',
    UpdateDownloadTitle = 'updateDownloadTitle',
    UpdateDownloadProgress = 'updateDownloadProgress',
    SettingsLoad = 'settingsLoad',
}

export enum DownloadState {
    Started = 'started',
    InProgress = 'inProgress',
    Complete = 'complete',
}

interface DownloadAction {
    type: AppActionType.Download;
    downloadId: number;
}

interface EnterUrlAction {
    type: AppActionType.EnterUrl;
    value: string;
}

interface SetTypeAction {
    type: AppActionType.SetType;
    value: DownloadType;
}

interface BrowseForDestinationAction {
    type: AppActionType.BrowseForDestination,
}

interface SetDestinationAction {
    type: AppActionType.SetDestination;
    value: string;
}

interface UpdateDownloadTitleAction {
    type: AppActionType.UpdateDownloadTitle;
    downloadId: number;
    title: string;
}

interface UpdateDownloadStateAction {
    type: AppActionType.UpdateDownloadState;
    downloadId: number;
    state: DownloadState;
}

interface UpdateDownloadProgressAction {
    type: AppActionType.UpdateDownloadProgress;
    downloadId: number;
    progress: number;
}

interface SettingsLoadAction {
    type: AppActionType.SettingsLoad,
    value: {
        destination: string;
    };
}

export enum DownloadType {
    Video = 'video',
    Music = 'music',
}

export const downloadTypes: {
    [key in DownloadType]: string;
} = {
    [DownloadType.Video]: 'Video',
    [DownloadType.Music]: 'Music',
};

export type AppAction = DownloadAction | EnterUrlAction | SetTypeAction |
    BrowseForDestinationAction | SetDestinationAction |
    UpdateDownloadStateAction | UpdateDownloadTitleAction | UpdateDownloadProgressAction |
    SettingsLoadAction;

export const updateDownloadProgress = (downloadId: number, progress: number) => ({
    type: AppActionType.UpdateDownloadProgress,
    downloadId,
    progress,
});
export const updateDownloadTitle = (downloadId: number, title: string) => ({
    type: AppActionType.UpdateDownloadTitle,
    downloadId,
    title,
});
export const updateDownloadState = (downloadId: number, state: DownloadState) => ({
    type: AppActionType.UpdateDownloadState,
    downloadId,
    state,
});
export const settingsLoad = (value: SettingsLoadAction['value']) => ({
    type: AppActionType.SettingsLoad,
    value,
});
export const download = (downloadId: number): DownloadAction => ({ type: AppActionType.Download, downloadId });
export const enterUrl = (url: string): EnterUrlAction => ({ type: AppActionType.EnterUrl, value: url });
export const setType = (type: DownloadType): SetTypeAction => ({ type: AppActionType.SetType, value: type });
export const browseForDestination = () => ({ type: AppActionType.BrowseForDestination });
export const setDestination = (path: string): SetDestinationAction => ({ type: AppActionType.SetDestination, value: path });
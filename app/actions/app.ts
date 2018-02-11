export enum AppActionType {
    Download = 'download',
    EnterUrl = 'enterUrl',
    SetType = 'setType',
    SetDestination = 'setDestination',
    UpdateDownloadState = 'updateDownloadState',
    UpdateDownloadProgress = 'updateDownloadProgress',
}

export enum DownloadState {
    Started = 'started',
    InProgress = 'inProgress',
    Complete = 'complete',
}

interface DownloadAction {
    type: AppActionType.Download;
}

interface EnterUrlAction {
    type: AppActionType.EnterUrl;
    value: string;
}

interface SetTypeAction {
    type: AppActionType.SetType;
    value: DownloadType;
}

interface SetDestinationAction {
    type: AppActionType.SetDestination;
    value: string;
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

export enum DownloadType {
    Video = 'video',
}

export type AppAction = DownloadAction | EnterUrlAction | SetTypeAction |
    SetDestinationAction | UpdateDownloadStateAction | UpdateDownloadProgressAction;

export const updateDownloadProgress = (downloadId: number, progress: number) => ({
    type: AppActionType.UpdateDownloadState,
    downloadId,
    progress,
});
export const updateDownloadState = (downloadId: number, state: DownloadState) => ({
    type: AppActionType.UpdateDownloadState,
    downloadId,
    state,
});
export const download = (): DownloadAction => ({ type: AppActionType.Download });
export const enterUrl = (url: string): EnterUrlAction => ({ type: AppActionType.EnterUrl, value: url });
export const setType = (type: DownloadType): SetTypeAction => ({ type: AppActionType.SetType, value: type });
export const setDestination = (path: string): SetDestinationAction => ({ type: AppActionType.SetDestination, value: path });
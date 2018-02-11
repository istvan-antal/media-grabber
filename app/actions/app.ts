export enum AppActionType {
    Download = 'download',
    EnterUrl = 'enterUrl',
    SetType = 'setType',
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

export enum DownloadType {
    Video = 'video',
}

export type AppAction = DownloadAction | EnterUrlAction | SetTypeAction;

export const download = (): DownloadAction => ({ type: AppActionType.Download });
export const enterUrl = (url: string): EnterUrlAction => ({ type: AppActionType.EnterUrl, value: url });
export const setType = (type: DownloadType): SetTypeAction => ({ type: AppActionType.SetType, value: type });
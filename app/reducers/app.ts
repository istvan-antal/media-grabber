import { AppAction, DownloadType, AppActionType, DownloadState } from '../actions/app';

export interface AppState {
    url: string;
    type: DownloadType;
    destination: string;
    downloadId: number;
    downloads: Array<{
        id: number;
        type: DownloadType;
        url: string;
        title?: string;
        destination: string;
        progress: number;
        state: DownloadState;
    }>;
}

const initialState = {
    url: '',
    type: DownloadType.Video,
    destination: '',
    downloadId: 0,
    downloads: [],
}

export const app = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case AppActionType.SettingsLoad:
            return {
                ...state,
                destination: action.value.destination,
            };
        case AppActionType.UpdateDownloadProgress:
            return {
                ...state,
                downloads: state.downloads.map(item => {
                    if (item.id === action.downloadId) {
                        return {
                            ...item,
                            progress: action.progress,
                        };
                    }
                    return item;
                }),
            };
        case AppActionType.UpdateDownloadTitle:
            return {
                ...state,
                downloads: state.downloads.map(item => {
                    if (item.id === action.downloadId) {
                        return {
                            ...item,
                            title: action.title,
                        };
                    }
                    return item;
                }),
            };
        case AppActionType.UpdateDownloadState:
        return {
            ...state,
            downloads: state.downloads.map(item => {
                if (item.id === action.downloadId) {
                    return {
                        ...item,
                        state: action.state,
                    };
                }
                return item;
            }),
        };
        case AppActionType.Download:
        return {
            ...state,
            url: '',
            downloadId: action.downloadId,
            downloads: [
                ...state.downloads,
                {
                    id: action.downloadId,
                    type: state.type,
                    url: state.url,
                    destination: state.destination,
                    progress: 0,
                    state: DownloadState.Started,
                }
            ],
        };
        case AppActionType.SetType:
        return {
            ...state,
            type: action.value,
        };
        case AppActionType.EnterUrl:
        return {
            ...state,
            url: action.value,
        };
        case AppActionType.SetDestination:
            return {
                ...state,
                destination: action.value,
            };
    }
    return {
        ...state
    };
};
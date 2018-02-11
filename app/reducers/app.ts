import { AppAction, DownloadType, AppActionType, DownloadState } from '../actions/app';

export interface AppState {
    url: string;
    type: DownloadType;
    destination: string;
    downloadId: number;
    downloads: Array<{
        id: number;
        url: string;
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
        case AppActionType.UpdateDownloadProgress:
            return {
                ...state,
                downloads: state.downloads.map(item => {
                    if (item.id = action.downloadId) {
                        return {
                            ...item,
                            progress: action.progress,
                        };
                    }
                    return item;
                }),
            };
        case AppActionType.UpdateDownloadState:
        return {
            ...state,
            downloads: state.downloads.map(item => {
                if (item.id = action.downloadId) {
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
            downloadId: state.downloadId + 1,
            downloads: [
                ...state.downloads,
                {
                    id: state.downloadId + 1,
                    url: state.url,
                    destination: state.destination,
                    progress: 0,
                    state: DownloadState.Started,
                }
            ],
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
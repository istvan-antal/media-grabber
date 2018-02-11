import { AppAction, DownloadType, AppActionType } from '../actions/app';

export interface AppState {
    url: string;
    type: DownloadType;
}

const initialState = {
    url: '',
    type: DownloadType.Video,
}

export const app = (state: AppState = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case AppActionType.EnterUrl:
        return {
            ...state,
            url: action.value,
        };
    }
    return {
        ...state
    };
};
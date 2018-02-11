import { createStore, applyMiddleware, MiddlewareAPI, Dispatch, Middleware, AnyAction, Action } from 'redux';
import { AppAction, AppActionType } from './actions/app';
import { app, AppState } from './reducers/app';
const { remote, ipcRenderer } = require('electron');

export const backendMiddleware: Middleware = <AppState>(store: MiddlewareAPI<AppState>) => (next: Dispatch<AppState>) => (originalAction: any) => {
    const result = next(originalAction);
    const action: AppAction = originalAction;

    switch (action.type) {
        case AppActionType.Download:
            ipcRenderer.send('clientAction', [result, action]);
    }

    return result
}

export default createStore(app, applyMiddleware(backendMiddleware));
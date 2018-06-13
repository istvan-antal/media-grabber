import { createStore, applyMiddleware, MiddlewareAPI, Dispatch, Middleware, /*AnyAction, Action*/ } from 'redux';
import { AppAction, AppActionType } from './actions/app';
import { app/*, AppState*/ } from './reducers/app';
const { /*remote, */ipcRenderer } = require('electron');

export const backendMiddleware: Middleware = <AppState>(store: MiddlewareAPI<AppState>) => (next: Dispatch<AppState>) => (originalAction: any) => {
    ipcRenderer.send('clientLog', JSON.stringify(store.getState()));
    const result = next(originalAction);
    const action: AppAction = originalAction as any;

    // ipcRenderer.send('clientLog', JSON.stringify(action));

    switch (action.type) {
        case AppActionType.BrowseForDestination:
        case AppActionType.SetDestination:
        case AppActionType.UpdateDownloadProgress:
        case AppActionType.Download:
        case AppActionType.UpdateDownloadState:
            ipcRenderer.send('clientAction', [store.getState(), action]);
    }

    return result
}

const store = createStore(app as any, applyMiddleware(backendMiddleware));

ipcRenderer.on('backendAction', (_e: any, action: AppAction) => {
    store.dispatch(action);
});

ipcRenderer.send('clientReady', []);

export default store;
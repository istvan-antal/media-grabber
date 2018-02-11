import * as React from 'react';
import { render } from 'react-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, Provider } from 'react-redux';
import { download, enterUrl, setType } from './actions/app';
import { AppState } from './reducers/app';
import store from './store';
import App from './App';

const mapStateToProps = (state: AppState) => state;

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
    actions: bindActionCreators({ download, enterUrl, setType }, dispatch),
});

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

render((
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
), document.getElementById('root'));

if ((module as any).hot) {
    (module as any).hot.accept();
}

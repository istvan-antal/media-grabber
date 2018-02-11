import * as React from 'react';
import { AppState } from './reducers/app';
import { download, enterUrl, setType, DownloadType } from './actions/app';

interface Props extends AppState {
    actions: {
        download: typeof download,
        enterUrl: typeof enterUrl,
        setType: typeof setType,
    };
}

export default class App extends React.Component<Props> {
    render() {
        return (
            <form>
                <input onChange={e => { this.props.actions.enterUrl(e.target.value); }} value={this.props.url} type="text" placeholder="URL" />
                <select onChange={e => { this.props.actions.setType(e.target.value as DownloadType); }} value={this.props.type}>
                    <option value="video">Video</option>
                </select>
                <input onClick={this.props.actions.download} type="button" value="Download" />
            </form>
        );
    }
}
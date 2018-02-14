import * as React from 'react';
import { downloadTypes } from './actions/app';
import { AppState } from './reducers/app';
import {
    download, enterUrl, setType, setDestination,
    DownloadType,
} from './actions/app';
import './App.css';

interface Props extends AppState {
    actions: {
        download: typeof download,
        enterUrl: typeof enterUrl,
        setType: typeof setType,
        setDestination: typeof setDestination,
    };
}

export default class App extends React.Component<Props> {
    render() {
        return (
            <div>
                <form>
                    <input onChange={e => { this.props.actions.enterUrl(e.target.value); }} value={this.props.url} type="text" placeholder="URL" />
                    <select onChange={e => { this.props.actions.setType(e.target.value as DownloadType); }} value={this.props.type}>
                        {Object.keys(downloadTypes).map(key => (
                            <option value={key}>{downloadTypes[key as DownloadType]}</option>
                        ))}
                    </select>
                    <input onChange={e => { this.props.actions.setDestination(e.target.value); }} value={this.props.destination} type="text" placeholder="Destination" />
                    <input onClick={e => { this.props.actions.download(this.props.downloadId + 1); }} type="button" value="Download" />
                </form>
                <table>
                    <tbody>
                        {this.props.downloads.slice().reverse().map(download => (
                            <tr key={download.id}>
                                <td>
                                    {download.title || download.url}
                                </td>
                                <td>
                                    <progress value={download.progress} max="100" />
                                </td>
                                <td>
                                    {download.state}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
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
                    <div className="row">
                        <input onChange={e => { this.props.actions.enterUrl(e.target.value); }} value={this.props.url} type="text" placeholder="URL" />
                        <select onChange={e => { this.props.actions.setType(e.target.value as DownloadType); }} value={this.props.type}>
                            {Object.keys(downloadTypes).map(key => (
                                <option value={key}>{downloadTypes[key as DownloadType]}</option>
                            ))}
                        </select>
                        <input onClick={e => { this.props.actions.download(this.props.downloadId + 1); }} type="button" value="Download" />
                    </div>
                    <div className="row">
                        <input onChange={e => { this.props.actions.setDestination(e.target.value); }} value={this.props.destination} type="text" placeholder="Destination" />
                    </div>
                </form>
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                        {this.props.downloads.slice().reverse().map(download => (
                            <tr className={download.state} key={download.id}>
                                <td>
                                    {download.title || download.url}
                                </td>
                                <td>
                                    {download.progress < 100 &&
                                        <progress value={download.progress} max="100" />
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
import * as React from 'react';
import { AppState } from './reducers/app';
import {
    download, enterUrl, setType, setDestination,
    DownloadType,
} from './actions/app';

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
                        <option value="video">Video</option>
                    </select>
                    <input onChange={e => { this.props.actions.setDestination(e.target.value); }} value={this.props.destination} type="text" placeholder="Destination" />
                    <input onClick={this.props.actions.download} type="button" value="Download" />
                </form>
                <table>
                    <tbody>
                        {this.props.downloads.map(download => (
                            <tr key={download.id}>
                                <td>
                                    {download.url}
                                </td>
                                <td>
                                    {download.progress}
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
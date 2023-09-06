import React from 'react';
import Divider from '../Divider';
import { TableRow } from '../TableRow';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const DialogRoomMigrationProcessOverview = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-7xl space-y-4'>
            <div className='w-full max-w-4xl space-y-4 mx-auto'>
                <h3 id="dialog-migration-overview" className='text-2xl font-semibold'><a href="#dialog-migration-overview" className='hover:underline'>Dialog Room Migration Process</a></h3>
                <Divider className='!mt-1' />
                <p>We outline here the steps that the client takes when moving between two Hubs rooms on the same origin host. This can happen when clicking on a link in Hub A to Hub B, or when the user clicks the "back" button in their browser and the previous page was a Hub on the same host.</p>
            </div>

            <table className='w-full inline-block mt-4 md:w-auto table-auto overflow-x-auto rounded-md'>
                <thead className='text-xs uppercase bg-slate-700 text-slate-100'>
                    <tr>
                        <th scope="col" className="px-2 py-3">File</th>
                        <th scope="col" className="px-6 py-3">Function</th>
                        <th scope="col" className="px-6 max-w-sm py-3">Translation</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/components/open-media-button.js" target="_blank" className='underline text-sm'><code>open-media-button.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this.onClick = async () => {
    ...
    } else if ((hubId = await isHubsRoomUrl(this.src))) {
        ...
        } else if (isLocalHubsUrl(this.src)) {
            const waypoint = url.hash && url.hash.substring(1);
            changeHub(hubId, true, waypoint);
        }
        ...
    }
    ...
}`}
                        </SyntaxHighlighter>,
                        <p>Called when a "visit room" link is tapped in the 3D environment.</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/change-hub.js" target="_blank" className='underline text-sm'><code>change-hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`export async function changeHub(hubId, addToHistory = true, waypoint = "") {
    let data;
    try {
        data = await APP.hubChannel.migrateToHub(hubId);
    } catch (e) {
        ...
        return;
    }
    const hub = data.hubs[0];
    ...
    APP.dialog.disconnect();
    ...
    await Promise.all([
        APP.dialog.connect({
            serverUrl: \`wss://\${hub.host}:\${hub.port}\`,
            roomId: hub.hub_id,
            serverParams: { host: hub.host, port: hub.port, turn: hub.turn },
            scene,
            clientId: APP.dialog._clientId,
            forceTcp: APP.dialog._forceTcp,
            forceTurn: APP.dialog._forceTurn,
            iceTransportPolicy: APP.dialog._iceTransportPolicy
        }),
        ...
      ]);
    ...
}`}
                        </SyntaxHighlighter>,
                        <div className='space-y-4 max-w-sm'>
                            <p className='italic'>This function involves calls to many other client systems, most of which are not covered in this translation.</p>
                            <p>In order to migrate to another Dialog instance, we must first obtain data about that Hub from Reticulum, including the host, port number, and Hub ID.</p>
                            <p>Once the client has that data, we can disconnect from the current Dialog server and connect to the new one. This is done in the same way as in <a className="underline" href="#dialog-connection-overview">"Dialog Connection Process" above</a>.</p>
                        </div>
                    ]} />
                </tbody>
            </table>
        </div>
    )
}
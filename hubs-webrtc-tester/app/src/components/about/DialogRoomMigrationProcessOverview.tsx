import React from 'react';
import Divider from '../Divider';
import { TableRow } from '../TableRow';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const DialogRoomMigrationProcessOverview = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-4xl space-y-4'>
            <h3 id="dialog-migration-overview" className='text-2xl font-semibold'><a href="#dialog-migration-overview" className='hover:underline'>Dialog Room Migration Process</a></h3>
            <Divider className='!mt-1' />
            <p>We outline here the steps that the client takes when moving between two Hubs rooms on the same origin host. This can happen when clicking on a link in Hub A to Hub B, or when the user clicks the "back" button in their browser and the previous page was a Hub on the same host.</p>

            <table className='w-full inline-block mt-4 md:w-auto table-auto overflow-x-auto rounded-md'>
                <thead className='text-xs uppercase bg-slate-700 text-slate-100'>
                    <tr>
                        <th scope="col" className="px-2 py-3">File</th>
                        <th scope="col" className="px-6 py-3">Function</th>
                        <th scope="col" className="px-6 py-3">Translation</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/hub.js" target="_blank" className='underline text-sm'><code>hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`document.addEventListener("DOMContentLoaded") Callback`}
                        </SyntaxHighlighter>,
                        <p>Fires upon page load</p>
                    ]} />
                </tbody>
            </table>
        </div>
    )
}
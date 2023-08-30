import React, { useEffect, useRef, useState } from 'react';
import { DialogConnectionProcessOverview } from "./DialogConnectionProcessOverview"
import Divider from '../Divider';
import { TableOfContents } from './TableOfContents';
import { useHeadings } from '../../hooks/useHeadings';
import { linearScale } from '../../shared/lib/utilities';
import { HubsDivider } from '../HubsDivider';
import { DialogRoomMigrationProcessOverview } from './DialogRoomMigrationProcessOverview';

export const DialogProcessesDemystified = ({ darkThemeEnabled }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headings = useHeadings(containerRef.current ? containerRef.current : undefined, "h3");

    return (
        <div ref={containerRef} className='mt-4 pt-4 w-full space-y-8 flex flex-col items-center'>
            <div className='w-full max-w-4xl p-2'>
                <h2 id="dialog-processes-demystified" className='text-3xl font-semibold'><a href="#dialog-processes-demystified" className='hover:underline'>Dialog Processes Demystified</a></h2>
                <Divider className='!mt-1' />
                <p>Here, we contextualize and explore various internal processes that occur relative to the Hubs client, Reticulum, and Dialog:</p>
                <ul className='mt-2'>
                    {headings.map(heading => (
                        <li key={heading.id} className='text-md list-disc ml-4'>
                            <a className='underline' href={`#${heading.id}`} > {heading.text} </a>
                        </li>
                    ))}
                </ul>
            </div>

            <DialogConnectionProcessOverview darkThemeEnabled={darkThemeEnabled} />

            <DialogRoomMigrationProcessOverview darkThemeEnabled={darkThemeEnabled} />

            <HubsDivider className='w-full max-w-6xl' />
        </div>
    )
}
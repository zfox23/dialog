import React from 'react';
import { LibraryOverview } from './LibraryOverview';
import { ProtooSignaling } from './ProtooSignaling';
import { MediasoupSFU } from './MediasoupSFU';
import { HubsDivider } from '../HubsDivider';

export const HubsWebRTCLibraries = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 pt-4 w-full flex flex-col items-center space-y-4'>
            <LibraryOverview />

            <ProtooSignaling darkThemeEnabled={darkThemeEnabled} />

            <MediasoupSFU darkThemeEnabled={darkThemeEnabled} />

            <HubsDivider className='w-full max-w-6xl' />
        </div>
    )
}
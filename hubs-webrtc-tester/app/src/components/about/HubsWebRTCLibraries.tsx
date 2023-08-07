import React, { useState } from 'react';
import Divider from '../Divider';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { StaticImage } from 'gatsby-plugin-image';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { isDarkThemeEnabled } from '../ToggleThemeSwitch';
import { useEventListenerWindow } from '../../hooks/useEventListener';
import { LibraryOverview } from './LibraryOverview';
import { ProtooSignaling } from './ProtooSignaling';
import { MediasoupSFU } from './MediasoupSFU';

export const HubsWebRTCLibraries = ({ }) => {
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    return (
        <div className='mt-4 pt-4 w-full space-y-4'>
            <LibraryOverview />

            <ProtooSignaling />            

            <MediasoupSFU />
        </div>
    )
}
import React from 'react';
import { ThemeToggleSwitch } from './ToggleThemeSwitch';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export const Footer = ({ }) => {
    return (
        <footer className='w-full bg-slate-200 dark:bg-neutral-900 relative p-2 flex justify-between items-center'>
            <div className='text-sm opacity-70 hover:opacity-100 transition-all'>
                <a className='font-semibold hover:underline' target="_blank" href='https://github.com/zfox23/dialog/tree/hubs-webrtc-tester/hubs-webrtc-tester'><code>hubs-webrtc-tester</code></a> created by <a className='font-semibold hover:underline' target="_blank" href='https://hubs.mozilla.com'>the ducks at Mozilla Hubs</a>
            </div>
            <ThemeToggleSwitch />
        </footer>
    )
}
import React, { useState } from 'react';
import { isBrowser } from '../../shared/lib/utilities';
import { QuestionMarkCircleIcon, UserMinusIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { Button } from '../Button';
import { MicrophoneIcon } from '@heroicons/react/24/solid';

export const AudioInputPanel = ({ }) => {
    return (
        <div className='flex flex-col mb-8 bg-slate-200 dark:bg-neutral-900 rounded-md items-center'>
            <div className='flex gap-1 w-full justify-center bg-blue-300/40 dark:bg-indigo-900 rounded-t-md p-2'>
                <h2 className='font-semibold text-xl h-8'>{<MicrophoneIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Audio Input</h2>
            </div>
            <div className='px-6 pb-4'>
            </div>
        </div>
    )
}
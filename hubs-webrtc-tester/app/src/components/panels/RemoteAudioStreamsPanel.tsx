import { ArrowPathIcon, QuestionMarkCircleIcon, SpeakerWaveIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { ConsumerAudioTrackUI } from '../ConsumerAudioTrackUI';
import { Button } from '../Button';

export const RemoteAudioStreamsPanel = ({ audioStreamData, onRefreshLocalAudioStreamsClicked }) => {
    const [showAudioStreamsHelp, setShowAudioStreamsHelp] = useState(false);

    return (
        <div className='flex flex-col mb-8 p-6 pt-4 bg-slate-200 dark:bg-neutral-900 rounded-md items-center'>
            <div className='flex gap-1'>
                <h2 className='font-semibold text-xl h-8'>{<SpeakerWaveIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Remote Audio Streams</h2>
                <button className='transition-all opacity-70 hover:opacity-100' onClick={e => setShowAudioStreamsHelp(!showAudioStreamsHelp)}><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700 dark:text-slate-200' /></button>
            </div>
            {showAudioStreamsHelp ?
                <ul className='w-full max-w-xl list-disc ml-4'>
                    <li>Once you're connected to a Dialog instance, tap the button below to start listening to audio streams associated with all remote Dialog Consumers.</li>
                    <li>🤞 At some point, there will be a checkbox here for automatically adding/removing audio streams in this list.</li>
                </ul> : null
            }
            <Button className='max-w-md mt-4' buttonType="button" buttonIconLeft={<ArrowPathIcon className='w-5 h-5' />} buttonText="Refresh Audio Streams" onClick={onRefreshLocalAudioStreamsClicked} />
            <div id='outputAudioElContainer' className='w-full max-w-sm bg-slate-300 rounded-md p-2 flex flex-col items-center gap-1 mt-4'>
                {audioStreamData.map((audioTrackInfo, idx) => {
                    return <ConsumerAudioTrackUI key={idx} audioTrackInfo={audioTrackInfo} />
                })}
            </div>
        </div>
    )
}
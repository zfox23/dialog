import React from 'react';

export const ConsumerAudioTrackUI = ({ audioTrackInfo }) => {
    return (
        <div className='flex flex-col gap-1'>
            <p>{audioTrackInfo.consumerId}</p>
            <audio autoPlay={true} controls={true} className='w-full rounded-md' ref={audio => { if (!audio) { return; } audio.srcObject = audioTrackInfo.mediaStream; audio.play(); }} />
        </div>
    )
}
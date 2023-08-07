import React from 'react';
import Divider from '../Divider';

export const FrequentlyAskedQuestions = ({ }) => {
    return (
        <div className='mt-4 pt-4 w-full space-y-4'>
            <h2 id="faq" className='text-2xl font-semibold hover:underline'><a href="#faq">Frequently Asked Questions</a></h2>
            <Divider className='!mt-1' />
            <div>
                <h3 id="faq-spatialized" className='text-xl font-semibold'><a className="hover:underline" href="#faq-spatialized">My Hubs client is consuming the audio streams associated with remote peers. How are those audio streams spatialized for 3D sound?</a></h3>
            </div>
        </div>
    )
}
import React from 'react';
import Divider from '../Divider';

export const Conclusion = ({ }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-4xl space-y-4'>
            <h2 id="conclusion" className='text-3xl font-semibold'><a href="#conclusion" className='hover:underline'>Conclusion</a></h2>
            <Divider className='!mt-1' />
            <p>All done!</p>
        </div>
    )
}
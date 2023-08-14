import { Transition } from '@headlessui/react';
import { ChevronRightIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const AccordionPanel = ({ labelCollapsed, labelExpanded, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='w-full flex flex-col overflow-clip relative'>
            <button className={`z-20 bg-slate-100 hover:underline border-slate-300 dark:border-slate-400/20 border-b-2 dark:bg-slate-500/20 text-lg font-semibold w-full text-left p-4 flex items-center ${isExpanded ? 'rounded-t-md' : 'rounded-md'}`} onClick={() => { setIsExpanded(!isExpanded); }}>
                <ChevronRightIcon className={`w-5 h-5 mr-2 transition-transform inline ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
                <p>{isExpanded ? labelExpanded : labelCollapsed}</p>
            </button>
            <Transition
                className='space-y-4 w-full z-10'
                show={isExpanded}
                enter="ease-in duration-300"
                enterFrom="opacity-0 -translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-out duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-full">
                {children}
            </Transition>
        </div>
    )
}
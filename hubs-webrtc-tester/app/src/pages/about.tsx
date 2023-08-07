import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { ChevronRightIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';
import { StaticImage } from "gatsby-plugin-image";
import Divider from '../components/Divider';
import { useEventListenerWindow } from '../hooks/useEventListener';
import { ThemeToggleSwitch, isDarkThemeEnabled } from '../components/ToggleThemeSwitch';
import { Menu, Transition } from '@headlessui/react';
import { Introduction } from '../components/about/Introduction';
import { WhatIsWebRTC } from '../components/about/WhatIsWebRTC';
import { CommunicationDataFlow } from '../components/about/CommunicationDataFlow';
import { HubsWebRTCLibraries } from '../components/about/HubsWebRTCLibraries';
import { FrequentlyAskedQuestions } from '../components/about/FrequentlyAskedQuestions';

const useHeadings = () => {
    interface Headings {
        id: string;
        text: string;
        level: number;
    }

    const [headings, setHeadings] = useState<Headings[]>([]);
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"))
            .filter((element) => element.id && element.id !== 'navigation')
            .map((element) => ({
                id: element.id,
                text: element.textContent ?? "",
                level: Number(element.tagName.substring(1))
            }));
        setHeadings(elements);
    }, []);
    return headings;
}

const TableOfContents = ({ className }: { className?: string }) => {
    const headings = useHeadings();
    return (
        <nav className={className}>
            <ul>
                {headings.map(heading => (
                    <li key={heading.id} style={{ marginLeft: `${heading.level - 2}em` }}>
                        <a className='hover:underline' href={`#${heading.id}`} > {heading.text} </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const AboutPage = ({ }) => {
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    return (
        <Layout>
            <header className='mb-8 flex flex-col items-center'>
                <h1 className='text-4xl font-semibold'>How Mozilla Hubs Uses WebRTC</h1>
                <a className='text-sm underline' href='/'>Return to Tester Home</a>
            </header>

            <div className='flex fixed z-40 top-3 right-0 flex-col items-end transition-colors'>
                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button tabIndex={0} className={`p-2 w-12 h-12 z-20 bg-slate-200/95 dark:bg-neutral-700/95 text-neutral-600 dark:text-slate-50 ${open ? 'rounded-tl-md' : 'rounded-l-md'} group`}>
                                {open ?
                                    <SolidBookmarkIcon className='group-active:scale-100 group-hover:scale-110' /> :
                                    <OutlineBookmarkIcon className='group-active:scale-100 group-hover:scale-110'/>}
                            </Menu.Button>
                            <Transition
                                className='max-h-96 overflow-y-auto max-w-sm bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 border-solid border-2 border-r-0 shadow-lg p-2 rounded-l-md'
                                enter="transition duration-250 ease-out"
                                enterFrom="transform translate-x-full opacity-0"
                                enterTo="transform translate-x-0 opacity-100"
                                leave="transition duration-200 ease-out"
                                leaveFrom="transform translate-x-0 opacity-100"
                                leaveTo="transform translate-x-full opacity-0"
                            >
                                <Menu.Items>
                                    <Menu.Item>
                                        <>
                                        <div className='flex justify-between'>
                                            <h2 className='font-semibold text-2xl'>Navigation</h2>
                                            <ThemeToggleSwitch />
                                        </div>
                                        <Divider className='mb-2' />
                                        <TableOfContents className='w-full' />
                                        </>
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>

            <div className='w-full rounded-md animate-gradient flex justify-center' style={{ "background": "linear-gradient(107.97deg,#489cbe 6.73%,#5427c9 39.4%,#a8527c 77.18%,#a67878 104.75%)", "backgroundSize": "250% 250%" }}>
                <StaticImage className="rounded-md max-w-md" src="../images/header-transparent.png" alt="Hubs 💖 WebRTC" quality={100} />
            </div>

            <div className='space-y-8 w-full'>
                <div className='mt-4 pt-4'>
                    <h2 id="navigation" className='text-3xl font-semibold hover:underline'><a href="#navigation">Navigation</a></h2>
                    <Divider className='!mt-1' />
                    <TableOfContents />
                </div>

                <Introduction />

                <WhatIsWebRTC />

                <CommunicationDataFlow />

                <HubsWebRTCLibraries />

                <FrequentlyAskedQuestions />
            </div>
        </Layout>
    )
}

export default AboutPage;
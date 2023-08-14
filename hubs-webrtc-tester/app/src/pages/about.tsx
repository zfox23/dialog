import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { ArrowTopRightOnSquareIcon, ChevronRightIcon, ExclamationCircleIcon, BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
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
import { useHeadings } from '../hooks/useHeadings';
import { DialogConnectionProcessOverview } from '../components/about/DialogConnectionProcessOverview';
import { Conclusion } from '../components/about/Conclusion';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { Link } from 'gatsby';
import { linearScale } from '../shared/lib/utilities';
import { CodeSampleLibrary } from '../components/about/CodeSampleLibrary';
import { SEO } from '../components/SEO';
import { HubsDivider } from '../components/HubsDivider';

const TableOfContents = ({ className }: { className?: string }) => {
    const headings = useHeadings();
    return (
        <nav className={className}>
            <ul>
                {headings.map(heading => (
                    <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1.25}em`, fontSize: `${linearScale(heading.level, 2, 6, 1.25, 0.75)}rem` }}>
                        <a className='hover:underline' href={`#${heading.id}`} > {heading.text} </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const PageNavigationMenu = () => {
    return (
        <div className='flex fixed z-40 top-3 right-0 bottom-3 flex-col items-end transition-colors'>
            <Menu>
                {({ open }) => (
                    <>
                        <div className={`fixed inset-0 pointer-events-none transition-colors ${open ? 'bg-neutral-800/40' : 'transparent'}`} />
                        <Menu.Button tabIndex={0} className={`p-2 w-12 h-12 z-20 bg-slate-200/95 dark:bg-neutral-700/95 text-neutral-600 dark:text-slate-50 ${open ? 'rounded-tl-md' : 'rounded-l-md'} group`}>
                            {open ?
                                <SolidBookmarkIcon className='group-active:scale-100 group-hover:scale-110' /> :
                                <OutlineBookmarkIcon className='group-active:scale-100 group-hover:scale-110' />}
                        </Menu.Button>
                        <Transition
                            className='overflow-y-auto max-w-sm md:max-w-md bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 border-solid border-2 border-r-0 shadow-lg p-2 md:p-3 rounded-l-md'
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
    )
}

const AboutPage = ({ }) => {
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    return (
        <Layout>
            <SEO title='How Mozilla Hubs Uses WebRTC < Hubs WebRTC Tester' />
            <div className='mb-4 md:mb-8 w-full flex flex-col items-center'>
                <header className='text-white pt-16 pb-8 md:py-8 w-full animate-gradient flex flex-col items-center relative' style={{ "background": "linear-gradient(107.97deg,#489cbe 6.73%,#5427c9 39.4%,#a8527c 77.18%,#a67878 104.75%)", "backgroundSize": "250% 250%" }}>
                    <Link className='absolute top-3 left-0 bg-slate-200/95 dark:bg-neutral-700/95 text-neutral-600 dark:text-slate-50 p-1 rounded-r-md hover:underline opacity-60 hover:opacity-100 text-sm transition-all' to="../"><ChevronLeftIcon className='h-5 w-4 inline-block' />Return to <code>hubs-webrtc-tester</code></Link>
                    <h1 className='text-4xl font-semibold underline text-center'><a href="#">How Mozilla Hubs Uses WebRTC</a></h1>
                    <h2 className='text-sm mt-1 opacity-75 hover:opacity-100 transition-opacity'>a web resource by <a className='underline' target="_blank" href='https://zachfox.io'>zach fox<ArrowTopRightOnSquareIcon className='h-3 w-3 ml-1 -top-0.5 relative inline-block' /></a></h2>
                    <StaticImage placeholder='none' objectFit='contain' className="rounded-md max-w-md" src="../images/header-transparent.png" alt="Hubs 💖 WebRTC" quality={100} />
                    <ThemeToggleSwitch className='text-slate-50' isLarge={true} />
                </header>
            </div>

            <PageNavigationMenu />

            <div className='w-full flex flex-col items-center mb-16 md:mb-48'>
                <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative w-full max-w-4xl'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50 mt-0.5 -ml-12' />
                    </div>
                    <div className='z-10 relative space-y-4'>
                        <p><span className='font-semibold'>Your feedback will help improve this page!</span> You can submit questions and comments about this page via Discord DM (@ZachAtMozilla) or <a className='underline' target="_blank" href='https://discord.com/invite/sBMqSjCndj'>the "🔒private-dev" channel on the Hubs Discord server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                        <p><span className='font-semibold'>This page is under early and active development.</span> Language, layout, and contents are subject to change at any time.</p>
                        <p className='font-semibold'>This page's source is currently available <a className='underline' target="_blank" href='https://github.com/zfox23/dialog/tree/hubs-webrtc-tester/hubs-webrtc-tester'>here on GitHub<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                    </div>
                </div>

                <div className='!mt-4 p-2 w-full flex justify-center py-4 bg-slate-200/60 dark:bg-neutral-700 border-y-2 border-slate-300/40 dark:border-neutral-600'>
                    <div className='w-full max-w-4xl'>
                        <h2 id="navigation" className='text-3xl font-semibold hover:underline'><a href="#navigation">Navigation</a></h2>
                        <Divider className='!mt-1' />
                        <TableOfContents />
                    </div>
                </div>

                <div className='space-y-16 md:space-y-24 w-full flex flex-col items-center'>
                    <Introduction />

                    <WhatIsWebRTC />

                    <CommunicationDataFlow darkThemeEnabled={darkThemeEnabled} />

                    <HubsWebRTCLibraries darkThemeEnabled={darkThemeEnabled} />

                    <DialogConnectionProcessOverview />

                    <FrequentlyAskedQuestions darkThemeEnabled={darkThemeEnabled} />

                    <CodeSampleLibrary darkThemeEnabled={darkThemeEnabled} />

                    <Conclusion />
                </div>
            </div>

            <div className='w-full animate-gradient flex flex-col items-center relative' style={{ "background": "linear-gradient(107.97deg,#489cbe 6.73%,#5427c9 39.4%,#a8527c 77.18%,#a67878 104.75%)", "backgroundSize": "250% 250%" }}>
                <Link className='my-2 bg-slate-200/95 dark:bg-neutral-700/95 text-neutral-600 dark:text-slate-50 p-2 rounded-md hover:underline text-sm transition-all' to="../"><ChevronLeftIcon className='h-5 w-4 inline-block' />Return to <code>hubs-webrtc-tester</code></Link>
                <StaticImage placeholder='none' objectFit='contain' className="rounded-md max-w-md" src="../images/header-transparent.png" alt="Hubs 💖 WebRTC" quality={100} />
            </div>
        </Layout>
    )
}

export default AboutPage;
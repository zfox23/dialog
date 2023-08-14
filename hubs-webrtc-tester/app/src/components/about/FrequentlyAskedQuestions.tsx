import React, { useState } from 'react';
import Divider from '../Divider';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ChevronRightIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';


export const FrequentlyAskedQuestions = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-4xl'>
            <div>
                <h2 id="faq" className='text-3xl font-semibold'><a href="#faq" className='hover:underline'>Frequently Asked Questions</a></h2>
                <Divider className='!mt-1' />
            </div>

            <div className='space-y-8 md:space-y-16'>
                <div>
                    <div>
                        <h3 id="faq-spatial-audio" className='text-2xl font-semibold'><a href="#faq-spatial-audio" className='hover:underline'>Spatial Audio</a></h3>
                        <Divider className='!mt-1' />
                    </div>
                    <div className='space-y-8 md:space-y-16'>
                        <div>
                            <h4 id="faq-spatialized" className='text-xl font-semibold'><a className="hover:underline" href="#faq-spatialized">How does the Hubs client process remote audio streams into spatialized 3D sound?</a></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at quam neque. Sed convallis leo quis vehicula auctor. Aenean lacinia eros vestibulum magna rutrum elementum. Quisque iaculis malesuada quam. Cras tempus nibh odio, ut tincidunt turpis fringilla id. Praesent nisl odio, tincidunt in justo eu, ullamcorper dapibus ligula. Sed eu lectus vitae mi fermentum tincidunt eu vitae eros. Suspendisse tempus nulla mi, ut sodales leo tempor vel. Etiam vehicula quis lorem eget commodo. Integer tellus ante, efficitur ut urna vel, auctor viverra arcu.</p>
                        </div>
                    </div>
                </div>


                <div>
                    <div>
                        <h3 id="faq-capacity" className='text-2xl font-semibold'><a href="#faq-capacity" className='hover:underline'>WebRTC Capacity</a></h3>
                        <Divider className='!mt-1' />
                    </div>
                    <div className='space-y-8 md:space-y-16'>
                        <div>
                            <h4 id="faq-how-many" className='text-xl font-semibold'><a className="hover:underline" href="#faq-how-many">How many Hubs clients can connect to one Dialog instance?</a></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at quam neque. Sed convallis leo quis vehicula auctor. Aenean lacinia eros vestibulum magna rutrum elementum. Quisque iaculis malesuada quam. Cras tempus nibh odio, ut tincidunt turpis fringilla id. Praesent nisl odio, tincidunt in justo eu, ullamcorper dapibus ligula. Sed eu lectus vitae mi fermentum tincidunt eu vitae eros. Suspendisse tempus nulla mi, ut sodales leo tempor vel. Etiam vehicula quis lorem eget commodo. Integer tellus ante, efficitur ut urna vel, auctor viverra arcu.</p>
                        </div>

                        <div>
                            <h4 id="faq-future" className='text-xl font-semibold'><a className="hover:underline" href="#faq-future">What are some ways the Hubs team is considering improving Dialog's capacity?</a></h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at quam neque. Sed convallis leo quis vehicula auctor. Aenean lacinia eros vestibulum magna rutrum elementum. Quisque iaculis malesuada quam. Cras tempus nibh odio, ut tincidunt turpis fringilla id. Praesent nisl odio, tincidunt in justo eu, ullamcorper dapibus ligula. Sed eu lectus vitae mi fermentum tincidunt eu vitae eros. Suspendisse tempus nulla mi, ut sodales leo tempor vel. Etiam vehicula quis lorem eget commodo. Integer tellus ante, efficitur ut urna vel, auctor viverra arcu.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
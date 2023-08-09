import React from 'react';
import Divider from '../Divider';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, ExclamationCircleIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { StaticImage } from 'gatsby-plugin-image';

const PeerToPeer = ({ }) => {
    return (
        <div className='!mt-4 space-y-4'>
            <h3 id="communication-p2p" className='font-semibold text-2xl'><a href="#communication-p2p" className='hover:underline'>Peer-to-Peer (P2P) Communication</a></h3>
            <Divider className='!mt-1' />
            <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative'>
                <div className='p-1 overflow-clip w-20 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                    <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50 mt-0.5 -ml-12' />
                </div>
                <div className='z-10 relative'>
                    <p><span className='font-semibold'>Hubs does <i>not</i> use P2P communication for voice and video data.</span> However, understanding this architecture is fundamental to understanding more complex communication architectures.</p>
                </div>
            </div>
            <p>With P2P communication, <span className='font-semibold'>each peer sends their audio/video data to all other connected peers:</span></p>
            <StaticImage objectFit='contain' className='mx-auto w-full rounded-md' src="../../images/p2p.png" alt="WebRTC Peer-to-Peer architecture diagram" quality={100} />
            <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                        <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                    </div>
                    <div className='z-10 relative'>
                        <h4 className='text-2xl font-semibold'>P2P Pros</h4>
                        <ul className='list-disc ml-4 mt-2 space-y-2'>
                            <li><span className='font-semibold'>Reduced complexity and cost:</span> P2P communication doesn't require the use of any intermediate servers for audio/video data transmission</li>
                            <li><span className='font-semibold'>Privacy by default:</span> Peers are connected directly via secure protocols</li>
                        </ul>
                    </div>
                </div>
                <div className='p-4 rounded-md md:max-w-sm bg-red-50 dark:bg-red-800/20 relative'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                        <HandThumbDownIcon className='text-red-300 dark:text-red-600/40 opacity-50 mt-0.5' />
                    </div>
                    <div className='z-10 relative'>
                        <h4 className='text-2xl font-semibold'>P2P Cons</h4>
                        <ul className='list-disc ml-5 mt-2 space-y-2'>
                            <li><p><span className='font-semibold'>Upload bandwidth too high with multiple participants:</span> Each peer must upload audio/video data to all other peers.</p></li>
                            <li><span className='font-semibold'>CPU usage too high with multiple participants:</span> Each peer must encode their audio/video for each remote peer, and that encoding process is resource-intensive.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <p><span className='font-semibold'>The cons noted above make the P2P architecture a non-starter for most applications</span>, since most folks' upload speeds and CPUs are not fast enough to support more than a couple of peers.</p>
            <p>Since the P2P architecture won't work for a multi-user application like Hubs, we must select a different communication architecture.</p>
        </div>
    )
}

const SFU = ({ }) => {
    return (
        <div className='space-y-4'>
            <h3 id="communication-sfu" className='font-semibold text-2xl'><a href="#communication-sfu" className='hover:underline'>WebRTC Communication with an SFU (The Hubs Way)</a></h3>
            <Divider className='!mt-1' />
            <p>The most common WebRTC communication architecture involves the use of a <span className='font-semibold'>Selective Forwarding Unit</span>, or SFU. A Selective Forwarding Unit is a piece of software that runs on a server. The SFU receives multiple audio/video data streams from its peers. Then, the SFU's logic determines how to <i>forward</i> those data streams to all of the peers connected to it.</p>

            <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                    <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                </div>
                <div className='z-10 relative'>
                    <p><span className='font-semibold'>The Mozilla Hubs SFU is named Dialog.</span> Dialog is written in NodeJS. You can take a look at Dialog's source code <a className='underline' target="_blank" href='https://github.com/mozilla/dialog'>here on GitHub<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                </div>
            </div>

            <p>In the graphic below, notice how each peer only has to upload its audio/video data to <i>one</i> place: The SFU. The SFU is responsible for sending that data to all of the peers connected to it.</p>

            <StaticImage objectFit='contain' className='mx-auto w-full rounded-md' src="../../images/sfu.png" alt="WebRTC SFU architecture diagram" quality={100} />

            <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                        <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                    </div>
                    <div className='z-10 relative'>
                        <h4 className='text-2xl font-semibold'>SFU Pros</h4>
                        <ul className='list-disc ml-4 mt-2 space-y-2'>
                            <li><span className='font-semibold'>Reduced upload bandwidth requirements for peers:</span> Each peer only needs to upload one data stream.</li>
                            <li><span className='font-semibold'>Reduced CPU requirements for peers:</span> Each peer only needs to encode the data stream once.</li>
                            <li><span className='font-semibold'>Increased flexibility:</span> For example, each peer can request that the SFU send other peers' data in lower quality.</li>
                        </ul>
                    </div>
                </div>
                <div className='p-4 rounded-md md:max-w-sm bg-red-50 dark:bg-red-800/20 relative'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                        <HandThumbDownIcon className='text-red-300 dark:text-red-600/40 opacity-50 mt-0.5' />
                    </div>
                    <div className='z-10 relative'>
                        <h4 className='text-2xl font-semibold'>SFU Cons</h4>
                        <ul className='list-disc ml-5 mt-2 space-y-2'>
                            <li><p><span className='font-semibold'>Increased system complexity:</span> Someone has to write and maintain complex SFU code.</p></li>
                            <li><p><span className='font-semibold'>Server requirements:</span> The hardware powering the SFU needs to be capable of forwarding audio/video data streams from many peers, which can be computationally expensive.</p></li>
                            <li><span className='font-semibold'>Audio/video data isn't encrypted by default:</span> The SFU developer could access each peer's audio/video data unless the SFU developer implements end-to-end encryption (TODO: LEARN IF HUBS IMPLEMENTS E2EE FOR VIDEO/VOICE DATA).</li>
                        </ul>
                    </div>
                </div>
            </div>

            <p>There is a third mainstream architecture for WebRTC communication, and it involves using an "MCU," or Multipoint Control Unit. If you'd like to learn about this architecture, check out <a className='underline' target="_blank" href='https://www.digitalsamba.com/blog/p2p-sfu-and-mcu-webrtc-architectures-explained'>this article on digitalsamba.com<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
        </div>
    )
}

const ICESTUNTURN = ({ }) => {
    return (
        <div className='space-y-8'>
            <div className='space-y-4'>
                <h3 id="ICE-STUN-and-TURN" className='font-semibold text-2xl'><a href="#ICE-STUN-and-TURN" className='hover:underline'>ICE, STUN, and TURN</a></h3>
                <Divider className='!mt-1' />
                <p>For any two WebRTC endpoints to be able to communicate with each other, they must understand each other's network conditions and agree on a method of communication. ("WebRTC endpoints" may be two peers in a peer-to-peer network, or one peer and one SFU.)</p>
                <p>The process by which two WebRTC endpoints discover each others' network conditions and select a method of communication is called <span className='font-semibold'>Interactive Connectivity Establishment, or ICE</span>.</p>
                <p>There are several networking-related challenges we need to overcome during the ICE process. These challenges are important to understand, since they directly impact the way we implement WebRTC within client and server applications.</p>
            </div>

            <div className='space-y-4'>
                <h4 id="networking-irl"><a href="#networking-irl" className='hover:underline text-xl'>Networking in Real-Life Conditions - The Challenges</a></h4>
                <Divider className='!mt-1' />
                <p>As you read this, your device is probably connected to the Internet via a router. When your device made a request for this website's HTML, JavaScript, and CSS, your router kept track of which device made that request. Then, it knew to return the result of your request to <i>your device</i>, rather than another device on your network.</p>
                <p>As the request information packets passed through your networking equipment, your ISP's networking equipment, and this website host's networking equipment, the source and destination IP addresses and ports of the packets were changed until they arrived successfully at the website host's IP address. Then, packets returning from the website host were translated back to the original IP addresses and ports.</p>
                <p>This process refers to <span className="font-semibold">Network Address Translation, or NAT</span>. The act of changing the information packets' source and destination IP addresses and ports is called <span className='font-semibold'>creating a NAT mapping</span>.</p>
                <p>In most cases, two given WebRTC endpoints will exist on two physically disparate networks, separated by such a router and/or firewall. In those cases, NAT must occur for those endpoints to send and receive media packets.</p>

                <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                    </div>
                    <div className='z-10 relative'>
                        <p>A Dialog SFU associated with a given Hub is accessible directly via a domain name and port combination, so the only network address translation that must occur in the Hubs case exists on the connecting client's side.</p>
                    </div>
                </div>

                <p>Despite a successful NAT process, there are other potential issues which may prevent two WebRTC endpoints from successfully connecting. For example, your firewall's configuration may contain specific rules which disallow traffic of a certain kind to pass, and those rules may apply to WebRTC media traffic. In other cases, a network configuration may heuristically view WebRTC traffic as suspicious and block it.</p>

                <p>It can be frustrating to determine exactly which aspect of a network prevents successful WebRTC packet transmission. The issue could be hardware-related, software-related, or even a disconnected network cable. It's important for WebRTC application developers to gracefully handle as many known connection failure cases as they can, and develop meticulous logging practices for catching unhandled error cases.</p>
            </div>

            <div className='space-y-4'>
                <h4 id="stun"><a href="#stun" className='hover:underline text-xl'>STUN (Session Traversal Utilities for NAT)</a></h4>
                <Divider className='!mt-1' />
                <p>When trying to establish two-way WebRTC media communication between two endpoints, each endpoint needs to tell the other "here is the IP address and port you might be able to use to send me WebRTC data."</p>
                <p><span className='font-semibold'>STUN is a protocol which allows a WebRTC endpoint to determine the public IP address and port allocated to it after Network Address Translation has occurred.</span> This IP address and port may then be reused for WebRTC purposes - although it may be the case that this information is unusable <a href="#turn" className='underline'>(more on that when discussing TURN)</a>.</p>
                <p>There are several dozen publicly-available STUN servers which provide this service. <a className='underline' target="_blank" href='https://raw.githubusercontent.com/pradt2/always-online-stun/master/valid_hosts.txt'>Here's a list of public STUN servers maintained by "pradt2" on GitHub.<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></p>

                <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                    </div>
                    <div className='z-10 relative'>
                        <p>The Hubs client uses Google's public STUN servers, primarily <code>stun:stun1.l.google.com:19302</code>.</p>
                    </div>
                </div>
            </div>

            <div className='space-y-4'>
                <h4 id="turn"><a href="#turn" className='hover:underline text-xl'>TURN (Traversal Using Relays around NAT)</a></h4>
                <Divider className='!mt-1' />
                <p>In some cases, even when two WebRTC endpoints know the public IP address and port established for direct WebRTC communication, direct communication is impossible. This may occur due to strict firewall rules or <a href="#nat-compatibility" className='underline'>incompatible NAT types</a>.</p>

                <div id="nat-compatibility" className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                    </div>
                    <div className='z-10 relative'>
                        <p>Nintendo has <a className='underline' target="_blank" href='https://en-americas-support.nintendo.com/app/answers/detail/a_id/12472/~/compatibility-between-nat-types'>published a great document<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> which describes, in simplified terms, NAT type compatibilities.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export const CommunicationDataFlow = ({ }) => {
    return (
        <div className='mt-4 pt-4 w-full max-w-4xl space-y-8'>
            <div>
                <h2 id="communication-data-flow" className='text-3xl font-semibold'><a href="#communication-data-flow" className='hover:underline'>WebRTC Communication Data Flow</a></h2>
                <Divider className='!mt-1' />
                <p>When two people video chat using a WebRTC-based application, Person A's voice and video data must somehow be transmitted over the Internet and received by Person B.</p>
                <p>The simplest architecture for sending and receiving this data is for Person A's client to send that data directly to Person B's client. This architecture is called "Peer to Peer" communication.</p>
            </div>

            <PeerToPeer />

            <SFU />

            <ICESTUNTURN />
        </div>
    )
}
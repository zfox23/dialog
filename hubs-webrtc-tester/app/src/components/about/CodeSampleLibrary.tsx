import React, { useState } from 'react';
import Divider from '../Divider';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ChevronRightIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

const CodeSampleLibraryCoturn = ({ darkThemeEnabled }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='space-y-4'>
            <h4 id="code-sample-coturn" className='text-xl font-semibold'><a className="hover:underline" href="#code-sample-coturn">Sending TURN Information to the Hubs Client</a></h4>
            <p>By following the relatively complex code path below - which is written in chronological order - you will learn:</p>
            <ol className='list-disc ml-4'>
                <li>How the Reticulum server code determines what TURN information to send to the client</li>
                <li>How, upon initial connection to Dialog, the client code makes use of that TURN information</li>
            </ol>
            <p>TODO: Make sure that the Elixir function below is what's actually run when someone joins a Hubs room. Although the <code>.receive(&quot;ok&quot;, async data =&gt; &#123;</code> is throwing me off.</p>
            <div className='w-full flex flex-col overflow-clip relative'>
                <button className={`z-20 bg-slate-100 hover:underline border-slate-300 dark:border-slate-400/20 border-b-2 dark:bg-slate-500/20 text-lg font-semibold w-full text-left p-4 flex items-center ${isExpanded ? 'rounded-t-md' : 'rounded-md'}`} onClick={() => { setIsExpanded(!isExpanded); }}>
                    <ChevronRightIcon className={`w-5 h-5 mr-2 transition-transform inline ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
                    <p>{isExpanded ? "Hide" : "Show"} <code>coturn</code> Code</p>
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
                    <div className='p-4 rounded-b-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                        <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                            <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                        </div>
                        <div className='z-10 relative space-y-2 w-full'>
                            <h5 className='text-lg font-semibold'>Reticulum (Server) Code</h5>
                            <SyntaxHighlighter className="transition-colors rounded-md" language="elixir" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                {`# reticulum/lib/ret_web/views/api/v1/hub_view.ex
def render("show.json", %{hub: %Hub{scene: %Scene{}} = hub, embeddable: embeddable}) do
    hub |> render_with_scene(embeddable)
end

# reticulum/lib/ret_web/views/api/v1/hub_view.ex
def render_with_scene(hub, embeddable) do
    %{
        hubs: [
            %{
                ...
                host: hub.host,
                port: Ret.Hub.janus_port(),
                turn: Ret.Hub.generate_turn_info(),
                ...
            }
        ]
    }
end

# reticulum/lib/ret/hub.ex > generate_turn_info
def generate_turn_info do
    if Ret.Coturn.enabled?() do
        {username, credential} = Ret.Coturn.generate_credentials()

        transports =
            (Application.get_env(:ret, Ret.Coturn)[:public_tls_ports] || "5349")
            |> String.split(",")
            |> Enum.map(&%{port: &1 |> Integer.parse() |> elem(0)})

        %{enabled: true, username: username, credential: credential, transports: transports}
    else
        %{enabled: false}
    end
end

# reticulum/lib/ret/coturn.ex > Ret.Coturn
def enabled? do
    !!realm()
end

defp realm do
    Application.get_env(:ret, __MODULE__)[:realm]
end

# reticulum/config/dev.exs
config :ret, Ret.Coturn, realm: "ret"
# reticulum/config/prod.exs
config :ret, page_auth: [username: "", password: "", realm: "Reticulum"]
`}
                            </SyntaxHighlighter>
                        </div>

                        <div>
                            <h5 className='text-lg font-semibold mt-4'>Client Code</h5>
                            <Divider />
                            <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                {`//hubs/src/hub.js > "DOMContentLoaded" callback
document.addEventListener("DOMContentLoaded", async () => {
    ...
    const hubPhxChannel = socket.channel(\`hub:\${hubId}\`, APP.hubChannelParamsForPermsToken(oauthFlowPermsToken));
    ...
    hubPhxChannel
        .join()
        .receive("ok", async data => {
            ...
            handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data);
        })
    ...
});

// hubs/src/hub.js > handleHubChannelJoined > <function> > loadEnvironmentAndConnect()
function handleHubChannelJoined(entryManager, hubChannel, messageDispatch, data) {
    const hub = data.hubs[0];
    (async () => {
        APP.dialog.connect({
            ...
            serverParams: { host: hub.host, port: hub.port, turn: hub.turn },
            ...
    })();
}

//hubs/src/naf-dialog-adapter.js > DialogAdapter > connect()
async connect({ serverUrl, roomId, serverParams, scene, clientId, forceTcp, forceTurn, iceTransportPolicy }) {
    ...
    this._serverParams = serverParams;
    ...
    this._protoo = new protooClient.Peer(protooTransport);
    ...
    return new Promise((resolve, reject) => {
        this._protoo.on("open", async () => {  
            try {
                await this._joinRoom();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
}

//hubs/src/naf-dialog-adapter.js > DialogAdapter > _joinRoom()
async _joinRoom() {
    ...
    const { host, turn } = this._serverParams;
    const iceServers = this.getIceServers(host, turn);

    await this.createSendTransport(iceServers);
    await this.createRecvTransport(iceServers);
    ...
}


//hubs/src/naf-dialog-adapter.js > DialogAdapter > getIceServers()
getIceServers(host, turn) {
    const iceServers = [];

    this._serverUrl = \`wss://\${host}:\${port}\`;

    if (turn && turn.enabled) {
        turn.transports.forEach(ts => {
            // Try both TURN DTLS and TCP/TLS
            if (!this._forceTcp) {
                iceServers.push({
                    urls: \`turns:\${host}:\${ts.port}\`,
                    username: turn.username,
                    credential: turn.credential
                });
            }

            iceServers.push({
                urls: \`turns:\${host}:\${ts.port}?transport=tcp\`,
                username: turn.username,
                credential: turn.credential
            });
        });
    }
    iceServers.push({ urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:stun2.l.google.com:19302" });
    return iceServers;
}`}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    )
}

export const CodeSampleLibrary = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-4xl space-y-8'>
            <div className='space-y-4'>
                <h2 id="code-samples" className='text-3xl font-semibold'><a href="#code-samples" className='hover:underline'>Code Sample Library (Advanced)</a></h2>
                <Divider className='!mt-1' />
                <p>Here you'll find contextualized examples of code found throughout the Hubs/Dialog codebases. It can be challenging to find the exact code that answers a specific question about program flow. You may find your answer in this section.</p>
            </div>

            <div className='space-y-8 md:space-y-16'>
                <div>
                    <div>
                        <h3 id="code-samples-turn" className='text-2xl font-semibold'><a href="#code-samples-turn" className='hover:underline'>TURN</a></h3>
                        <Divider className='!mt-1' />
                    </div>
                    <div className='space-y-8 md:space-y-16'>
                        <CodeSampleLibraryCoturn darkThemeEnabled={darkThemeEnabled} />
                    </div>
                </div>
            </div>
        </div>
    )
}
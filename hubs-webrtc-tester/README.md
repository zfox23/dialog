# Mozilla Hubs WebRTC Tester
⚠️ This tool is under early and active development. Some functionality may not work as expected. ⚠️

This repository hosts two applications:
1. A Web-based client application meant for manual testing of the Hubs WebRTC stack. It's a simplified version of the Hubs Web client.
2. (Not Yet Implemented) A NodeJS client application meant for automated testing of the Hubs WebRTC stack.

## Usage
To use this Tester against a local `hubs-compose` instantiation, `hubs-compose` will need to be running first. Follow [the `hubs-compose` documentation](https://github.com/mozilla/hubs-compose/) to get that working.

_(Untested as of 2023-07-20)_ You should also be able to run this tester against Dialog running on its own (i.e. without running it through `hubs-compose`). Follow [the `dialog` documentation](https://github.com/mozilla/dialog) to get that working.

### Web Client Usage
#### Prerequisites
1. Install [the latest version of NodeJS LTS](https://nodejs.org/en/download).
    - This developer has v18.16.0 installed.
2. Using your preferred command line interface, `cd` into the `app` directory within this folder.
3. In your command line, type `npm i` and press enter to install the application's NodeJS dependencies.

#### Running the Web Tester Client
1. In your command line, `cd` into the `app` directory within this folder.
2. Type `npm run develop` and press enter.
3. Navigate to [`http://localhost:8000`](http://localhost:8000) to access the tool.

You can use `npm run build` to build a faster, minified version of the tester application that can be deployed on a remote Web server from the resultant `public/` folder. Right now, there are no significant differences between a local development build and a "production" build.

### NodeJS Client Usage
#### Prerequisites
1. Install [the latest version of NodeJS LTS](https://nodejs.org/en/download).
    - This developer has v18.16.0 installed.
2. Using your preferred command line interface, `cd` into the `app` directory within this folder.
3. In your command line, type `npm i` and press enter to install the application's NodeJS dependencies.

#### Running the NodeJS Tester Client
<it doesn't exist yet 👻>

----------------------------------------------------------------

# Notes, Open Questions, and More
## Technologies Used
### Web Client
The Tester's Web Client makes use of:
- [mediasoup-client](https://github.com/versatica/mediasoup-client) because Hubs' server-side WebRTC stack is based on Mediasoup.
- [protoo-client](https://protoo.versatica.com/#protoo-client) for WebRTC signaling.
- [Gatsby](https://www.gatsbyjs.com/) for quick React frontend development and a great JS composition toolchain.
- [TailwindCSS](https://tailwindcss.com/) for pretty styling.
- [Hero Icons](https://heroicons.com/) for pretty icons.

### NodeJS Client
<it doesn't exist yet 👻>
- Some code is shared between the Tester's Web client and the NodeJS client. You can find that code in `app/src/shared/*`.

## Developer's Notes and Questions
### Dialog Authentication
Here's how I think client-server authentication works with Dialog **in a development environment**.

1. Dialog's `dialog.Dockerfile` copies `files/dev-perms.pub.pem` into `/etc/perms.pub.pem`.
    - `dev-perms.pub.pem` is a file contained within the `hubs-compose` repository.
    - `dev-perms.pub.pem` contains a public key.
2. *(I think?)* Dialog's `run.sh` script - which runs when Docker starts Dialog - `echo`es that `perms.pub.pem` key into `/app/certs/perms.pub.pem`.
3. A Dialog-related configuration file (`dialog/config.js`) contains a configuration key/value pair, where the key is `authKey` and its value is `${__dirname}/certs/perms.pub.pem`.
4. Dialog's `index.js` file is executed, whose `run()` function is executed. This does a bunch of stuff, including setting a global-to-`index.js` variable called `authKey` to the _contents_ of the file specified by `config.authKey`.
5. Dialog's Protoo Web Socket server starts up. It begins listening for `'connectionrequest'` events.
    - [Protoo is a signaling framework.](https://protoo.versatica.com/)
6. When Protoo gets a `'connectionrequest'`, it does some basic request verification ("Does this request contain a `roomId` and `peerId`?), then puts a lambda function into an `AwaitQueue`.
7. When the queue executes that lambda function, we call `index.js/getOrCreateRoom()`.
8. `getOrCreateRoom()` returns an existing Dialog Room or creates a new Room. If it creates a new Room, it calls the static `Room.create()` function and passes the `authKey` defined above.
9. When a new Dialog `Room` class is instantiated, That `Room`'s `authKey` member variable value is set using the value passed to `Room.create()`. **Yay!**

There are two instances where a Dialog client sends a JWT to Dialog:
1. When the Dialog client sends a `'kick'` request to the Dialog Prooto signaling server.
    - The JWT contains a `kick_users` field - like a permission - to determine whether the client is actually capable of kicking users.
2. When the Dialog client sends a `'join'` request to the Dialog Protoo signaling server.
    - Locally, I've commented out this verification code. This enables any client to connect to a Dialog Room.

#### Where's the Dialog Client JWT come from?
**IDK yet lol**

In `naf-dialog-adapter.js`, the Protoo signaling server `'join'` request includes:
```js
{
    ...
    token: APP.hubChannel.token
}
```

There are hundreds of hits for `hubChannel` and `token` across the codebase, so I don't know how this is set and don't need to look too deeply into it right now.

### Protoo Signaling Server
- Why does the `'join'` request contain `{ device: this._device }` when it doesn't seem like `this._device` is ever set?

## Differences Between `naf-dialog-adapter` and `hubs-webrtc-tester`

This is a non-exhaustive table that I'll add to when I think about it. It'll be important to perform a meaningful diff between this client code and the Hubs client code at some point, because they will inevitably be different.

| `naf-dialog-adapter`                                          | `hubs-webrtc-tester`                  |
|---------------------------------------------------------------|---------------------------------------|
| `DialogAdapter.connect()` has an unused `forceTurn` parameter | Removed unusued `forceTurn` parameter |
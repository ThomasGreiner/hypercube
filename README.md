# Hypercube: prototype implementation of a concept for a modern browser's user interface

Hypercube is the result of a [bachelor thesis titled "Conception and prototyping of a modern browser's user interface"][bachelorthesis]. It is a JavaScript-based prototype used for visualizing ideas expressed in the concept which are:

- the browser in the background
- a different approach to bookmark management
- focus on navigation

Limitations and other important information about the prototype can be found in the [bachelor thesis][bachelorthesis]. While previous versions were running as a Chrome Extension and a Chrome App, the most recent ones can run as a stand-alone application based on [node-webkit][nw].

## Setup

- Download [node-webkit][nw]
- Execute the included `nw` executable with the path to this directory as a parameter (e.g. `~/programs/nw .`)

## Known Issues

`libudev.so.0` is missing when executing node-webkit's `nw` executable:
- Linux x64: `sudo ln -s /lib/x86_64-linux-gnu/libudev.so.1 /lib/x86_64-linux-gnu/libudev.so.0`
- Linux x86: `sudo ln -s /lib/i386-linux-gnu/libudev.so.1 /lib/i386-linux-gnu/libudev.so.0`

[bachelorthesis]: https://www.greinr.com/bachelorthesis/conception-and-prototyping-of-a-modern-browsers-user-interface
[nw]: https://github.com/nwjs/nw.js

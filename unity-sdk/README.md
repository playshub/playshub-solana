# Playshub Ton SDK

## Features

- Support connect your app to TON wallets via TonConnectUI
- Send transaction with comment via plain-text
  - Support convert plain-text to BoC

## Technique

- @tonconnect/ui: TonConnect UI is a UI kit for TonConnect SDK. Use it to connect your app to TON wallets via TonConnect protocol.
- tonweb: Utils library for working TON, especially TON BoC

# Getting Started

## Install with CDN

- Add the script to your HTML file:

```html
<script src="https://unpkg.com/unity-sdk@latest"></script>
```

- ℹ️ If you don't want auto-update the library, pass concrete version instead of latest, e.g.

```html
<script src="https://unpkg.com/unity-sdk@0.0.1"></script>
```

- Add `load-sdk.js` scripts

```html
<script src="./load-sdk.js"></script>
```

- Prepare `load-sdk.js` file

```js
const plugin = new SolUnitySDK.default({
  manifestUrl: "https://<YOUR_APP_URL>/tonconnect-manifest.json",
});
```

## Install with npm

```shell
npm i unity-sdk
```

# Usage

- Using with Unity throw `jslib` plugin

```jslib
mergeInto(LibraryManager.library, {
  Connect: function () {
    plugin.connect();
  },
  Disconnect: function () {
    plugin.disconnect();
  },
  IsConnected: function () {
    return plugin.isConnected();
  },
  GetAccount: function () {
    var returnStr = plugin.getAccount();
    var bufferSize = lengthBytesUTF8(returnStr) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(returnStr, buffer, bufferSize);
    return buffer;
  },
  SendTon: async function (args) {
    var returnStr = await plugin.sendTon(UTF8ToString(args));
    var bufferSize = lengthBytesUTF8(returnStr) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(returnStr, buffer, bufferSize);
    return buffer;
  },
});
```

| Function             | Description                                      |
| -------------------- | ------------------------------------------------ |
| plugin.connect()     | Connect your app to TON wallets via TonConnectUI |
| plugin.disconnect()  | Disconnect your app from TON wallets             |
| plugin.isConnected() | Return connected status                          |
| plugin.getAccount()  | Return account connected address                 |
| plugin.sendTon()     | Send transaction with comment via plaint-text    |
| plugin.getBalance()  | Get balance of connected address                 |

## Examples

- GetAccount

```js
plugin.getAccount();
{
  account: "UQAbB+ykyJKBtL17EUxDOyL2H55aakn05uDVW06aH0wJNLJB"; // friendly-address
  chain: "TESTNET"; // testnet or mainnet
}
```

- GetBalance

```js
plugin.getBalance(); // TON
```

- SendTon

```js
plugin.sendTon(
  JSON.stringify({
    validUntil: Math.floor(Date.now() / 1000) + 60,
    address: "UQDv9l280Mdnlq9GFOsM-boZ6Kc2af8imSsblRSW0vBvV8io",
    amount: "20000000", // nanoton
    comment: "test test test test test", // send with comment via plain-text
  })
);
```

- Complete example via [Examples](./examples/)

## Authors and acknowledgment

Playshub Team

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Project status

We are still developing this project following the roadmap in here: https://playshub.io/

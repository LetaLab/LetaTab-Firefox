# Leta Tab (Firefox)

<p align="left">  
<img src="https://github.com/user-attachments/assets/79b0c0a6-6caa-4d3f-bebb-c1facc760e06" alt="OG" width="15%">
</p>

---

<p align="center">
  <em>Hi, I'm Leta - the mascot of all projects under the LetaLab umbrella!</em><br><br>
  <em>Andrzej brought me to life using Inkscape! I am related to Tux!</em><br>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6230a1e-3fbd-48f7-965c-fdb42e52d370" alt="icon-512" width="220">
</p>

---

**Set your own New Tab page, in a click.**

Every new tab defaults to the browser's own New Tab page, and there's no built-in way to point it at your own dashboard, search page, or anything else you'd rather see first - not without editing a file by hand, anyway. Leta Tab lets you set any web address once, in a small popup, and every new tab opens straight to it from then on.

"Leta Tab" is a small, single-purpose extension for Firefox, and it's part of the LetaLab family of projects - you can find the rest of them at [https://LetaLab.eu](https://letalab.eu). A separate version for Chrome, Edge, Brave, and other Chromium based browsers is also available.

Website is created by me and I do everything that is in my limited power to make it [safe and private](https://www.ssllabs.com/ssltest/analyze.html?d=letalab.eu&hideResults=on&latest).

| SSLLabs Server testing results |
|---|
| <a href="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2"><img width="50%" alt="SSLLabs Server testing results" src="https://github.com/user-attachments/assets/9fe4044b-92f6-4de6-9e65-5fbf79fb4df2" /></a> |

![Manifest](https://img.shields.io/badge/Manifest-V3-blue)
![Browser](https://img.shields.io/badge/Firefox-140%2B-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

- [Get the extension](#get-the-extension)
- [Screenshots](#screenshots)
- [Features](#features)
- [How it works](#how-it-works)
- [Permissions](#permissions)
- [Privacy and security](#privacy-and-security)
- [Known issues and support](#known-issues-and-support)
- [Directory structure](#directory-structure)
- [License](#license)
- [Credits](#credits)

## Get the extension

The easiest way to install Leta Tab is straight from Firefox's official add-on store:

[![Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install-orange)](ADD-THIS-LATER)

## Screenshots

_Screenshots of the popup and New Tab page will be added here once the store listing is ready._

## Features

- Set any web address as your New Tab page from a small popup,
- Your choice is saved instantly through Firefox's own `storage.sync` and stays put - no re-prompting, no reset on browser restart. It keeps working the same way even if you're not signed in to Firefox Sync, it just won't follow you to another device until you are
- A simple ON/OFF toggle in the popup lets you pause the redirect without uninstalling anything - when it's off, a new tab shows a plain message instead
- No address is set by default. Until you choose one, a new tab shows a short message telling you what to do, instead of quietly opening somewhere you never picked
- Web addresses are checked before they're saved, so a typo can't quietly break your New Tab page
- Zero configuration beyond that one address field - no accounts, no onboarding, no setup wizard
- A small link to letalab.eu at the bottom of the popup - just a plain link that opens in a new tab, nothing tracking it

## How it works

Leta Tab uses the `chrome_url_overrides` manifest key to replace the browser's New Tab page with its own page (`newtab.html`). Despite the name, this is a standard key that Firefox itself implements for exactly this purpose, it is not a Chrome only feature.

The new page reads `browser.storage.sync` as soon as it loads. If you've saved an address in the popup and the extension is enabled, it sends the browser straight there. If you haven't saved one yet, it shows a short message instead of a blank page. There is no built-in fallback address anywhere in the code.

Saving works the same way in reverse - typing an address in the popup writes it to `browser.storage.sync` a moment after you stop typing, once it's checked that the address starts with `https://` or `http://`. That's the same storage area the New Tab page reads from, so the next tab you open already reflects the change.

```text
popup (user types an address)
  -> validate it's http:// or https://
       -> browser.storage.sync.set()
            -> newtab.html loads (chrome_url_overrides)
                 -> reads browser.storage.sync.get()
                      -> window.location.href = saved address
```

No network requests anywhere in this chain except the one page you asked to open, no external dependencies, no build step - just vanilla JavaScript, and no background script at all, since there's nothing that needs to run in the background.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Remembers the New Tab address you choose and whether the extension is enabled |

That's genuinely all of it - no host permissions, no `<all_urls>`, no `tabs`, no `cookies`, no `scripting`, no `webRequest`. Leta Tab also declares `none` under Firefox's data collection permissions, since it doesn't collect or transmit anything. If a future version ever needs something new, this table gets updated in the same commit that adds it.

## Privacy and security

- No data collection of any kind - no analytics, no crash reporting, no telemetry, no update-check pings. The extension never contacts any server, including one of its own
- Exactly two values are ever stored, using Firefox's own `browser.storage.sync`: the New Tab address, and the on/off state
- No remote code loading - the full source ships inside the installed package, nothing is fetched or evaluated at runtime
- No host permissions of any kind - the extension can't read or modify any website's content, it only opens the one address you chose, the same as typing it yourself
- Full details live in the [Privacy Policy](https://letalab.eu/Leta Tab/Privacy_Policy.html), also hosted at [https://LetaLab.eu](https://letalab.eu)

## Known issues and support

Leta Tab relies only on the documented `chrome_url_overrides` API, not a workaround, so there's no equivalent to the undocumented-API risk some other extensions carry.

Firefox handles a New Tab conflict differently from Chromium browsers: it doesn't silently hand control to whichever extension was installed most recently. The first time you open a new tab after installing Leta Tab (or any extension that changes the New Tab page), Firefox shows a one time prompt asking whether to keep the change. You can review or reverse this choice later under Settings > Home, where Firefox also names the extension currently in control.

Firefox requires every extension to be signed by Mozilla before it can stay installed in Release or Beta Firefox, whether it's listed on addons.mozilla.org or self-distributed. Unsigned copies only run temporarily through `about:debugging`, or permanently in Firefox Developer Edition, Nightly, or ESR with signing checks turned off in `about:config`. This is a Firefox platform rule, not something Leta Tab can opt out of.

The minimum supported version is Firefox 140 (Firefox for Android 142), higher than the 109 that first introduced Manifest V3. That's because the manifest also declares the `data_collection_permissions` key Mozilla introduced for new extensions in November 2025, and that key itself is only understood from those versions onward. Validated with `web-ext lint`, 0 errors, 0 warnings.

Running into that, or anything else that doesn't behave the way it should? Open a thread in [Issues](https://github.com/LetaLab/Leta Tab/issues).

## Directory structure

```text
├── leta-tab-firefox/
│   ├── manifest.json              includes browser_specific_settings for Firefox
│   ├── newtab.html                the overridden New Tab page
│   ├── redirect.js                reads browser.storage.sync and redirects, or shows a short message. No default URL
│   ├── favicon.png
│   ├── favicon-16.png / favicon-32.png / favicon-128.png
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── LICENSE
├── Privacy_Policy.html    source for the page hosted at letalab.eu, not part of the extension
└── README.md              this file, not part of the extension
```

## License

MIT - see [`LICENSE`](leta-tab-firefox/LICENSE)

## Credits

Built by [LetaLab.eu](https://letalab.eu) - a small collection of tools built for actual daily use.

# ss13.live

A standalone fork of Space Station 13 as it was on /tg/station in 2017, with quality-of-life features brought over from modern tg, running in a web browser with no BYOND. The whole game, about 400,000 lines of DM in its original form, now lives as TypeScript that you edit directly (a small subset of the language, shown below), and a TypeScript engine runs it. It plays single-player offline in one browser tab, or multiplayer through a small Node server: station, jobs, HUD, chat, tgui windows, sound, and round end and restart.

## How it works

The game is split into two parts, the same way BYOND splits it:

- **Game code** (`web/game/`): the rules. There are about 26,000 procs and 13,800 types, one `.ts` file per original `.dm` file. Procs are generator functions registered with `rt.def(...)` and types with `rt.type(...)`. A bundler turns them into the build's game files. The start of the airlock's `Destroy` proc, as an example:

  ```ts
  rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
  	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
  	rt.setSv(f, "wires", null);
  	if (truthy(rt.sv(f, "charge"))) {
  		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "charge")]);
  		rt.setSv(f, "charge", null);
  	}
  	...
  	return (yield* g.callSuper(f, [], rt.Args.Same));
  }, true);
  ```

  It is a small subset of TypeScript: type notes on parameters and variables only (no classes, generics or interfaces), and the type checker doesn't run on it. Variables and procs are reached by name through `rt`, as in DM.
- **Engine** (`web/src/`): a rewrite of what BYOND supplied. It handles the type tree, the scheduler and sleeping procs, garbage collection, the built-in procs, the map loader, `.dmi` icons, appearances, lighting, line of sight, input, verbs, browse popups, tgui and sound.

In the browser, the game runs in a Web Worker that acts as the server. The page acts as the client: it draws with PixiJS and handles input. The two talk with `postMessage`. The game's own save files (character setup, preferences, anything it writes to its `data/` folder) are kept in the browser's IndexedDB. For multiplayer, the same game code runs in a Node server instead (`web/tools/server.mjs`), and each player's page talks to it over a WebSocket. Saved worlds are a separate thing, made by the build tools and not by players: the build includes a world saved just before round start, so the page loads into the lobby in seconds instead of initializing the station first.

Assets are the original plain files at the repo root: `icons/`, `sound/`, `_maps/`, `config/`, `strings/`, `html/`, `interface/` and `tgui/`.

## Running it

You need Node 20.

```bash
cd web
npm install
npm run build:static          # builds the offline copy in web/dist/
python3 -m http.server 8013 --directory dist
```

Then open http://localhost:8013/. Page options go on the end of the address, for example `?join=Captain` to skip the lobby or `?scenario=NAME` to play a scripted scenario from `web/scenarios/`.

For multiplayer, run the game server instead (`node tools/server.mjs --lobby`, options in the header of `web/tools/server.mjs` and in [web/README.md](web/README.md)); each browser tab that connects is one player.

For development:

| Command (from `web/`) | What it does |
|---|---|
| `npm test` | Engine and page tests |
| `npm run boot-check -- NAME` | Boots the game headless in Node and checks its log against recorded BYOND results in `web/reference/`. The main check after any game or engine change |
| `npm run build:tgui` | Rebuilds the tgui assets from `tgui/src` |

More commands are in [web/README.md](web/README.md). The rules for editing game code are in [web/game/README.md](web/game/README.md). New to the code? [web/game/HOW-TO-READ.md](web/game/HOW-TO-READ.md) explains what `rt.sv`, `live()` and `yield*` mean, with a worked example.

## Layout

| Folder | Contents |
|---|---|
| `web/game/` | Game code (TypeScript) |
| `web/src/` | Engine: `vm/` runs the game, `render/` draws, `worker/` is the game thread (the code that runs inside the Web Worker), plus `dmi/`, `vfs/`, `appearance/` |
| `web/worker/` | The game page (`index.html` and its scripts): the client side, despite the folder's name |
| `web/tests/`, `web/reference/` | Tests and the BYOND recordings they compare against |
| `web/tools/` | Build, boot, profiling and check scripts |

## Timeline

All of this happened in 2026. The code was written by AI coding assistants (mostly Claude Code), directed and play-tested by one person.

- **Start (Sep 26):** Took a copy of /tg/station as it stood on 30 June 2017 (upstream commit `a110e881`) and set up BYOND 511 to record reference rounds. OpenDream's compiler turned the whole game into one JSON file of types and bytecode.
- **A VM that matches BYOND (Sep 27):** A TypeScript bytecode VM booted the game headless in Node, and its logs matched BYOND's for a full round start.
- **In the browser (Sep 29–30):** The game drew in a page (PixiJS, lighting, line of sight) and became playable: input, verbs, popups, tgui, sound. A self-caching static build made it work offline.
- **Translation (Oct 1–5):** The bytecode was translated into TypeScript, which ran faster than the VM. On Oct 4 the work moved to this repository: the translated TypeScript became the source, and DM, OpenDream and the JSON were dropped. The bytecode interpreter was deleted a day later and the translated code cleaned up to read well.
- **Its own game (Oct 3–9):** Quality-of-life features from modern tg (glides, diagonal movement, runechat, widescreen, balloon alerts), old HTML windows converted to tgui, large speed work (atmos, explosions, map drawing), plus scenario files for scripted rounds and saved worlds for fast starts.
- **Multiplayer (Oct 9–13):** The game runs in a Node server and each browser tab is one player. Played over LAN, then over the internet through a tunnel. Stutter was removed along the way.
- **Lag hiding (Oct 14–16):** A jitter buffer, smaller messages on the wire, and movement prediction in the page, so play feels right at real ping. Tick timing was fixed so player input is never starved.
- **Hardening and tidy-up (Oct 13–17):** A security review of the server (checked messages, rate limits, admin only by a secret link, a stricter page policy), a crowd test with bots, and a reorganisation of the engine code against a set of code principles.
- **Release prep (Oct 17):** AGPL v3 licence for all code, the non-commercial `goon/` assets replaced by modern tg's CC BY-SA ones, the domain `ss13.live` bought.
- **Public (Oct 18):** https://ss13.live went live through a Cloudflare tunnel, with a source link to the public repo [Greytide-inc/ss13.live](https://github.com/Greytide-inc/ss13.live). A friend joined from his own PC.
- **Small fixes from real play (Oct 19):** carried light, ghost and diagonal-step prediction, the colour picker.
- **Now (Oct 20):** Picking up, putting down and vehicles show at the click; soft sight shadows; open player names; faster explosions near pipes.

Current tick cost is about 3 ms on a full 10-minute boot with no players (the budget is 50 ms a tick). A crowd test of bots over the network played smoothly with 40 players. It is played live at https://ss13.live.

## Licence

All code, including the engine in `web/src` and the tools in `web/tools`, is licensed under the [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html) (`LICENSE`). If you run a modified copy as a public server, its players must be offered your source. The /tg/station code it comes from was AGPL v3 from [commit 333c566b](https://github.com/tgstation/tgstation/commit/333c566b88108de218d882840e61928a9b759d8f) (2014-12-31) and GPL v3 before it (`LICENSE-GPLv3.txt`).

tgui's client side is under the MIT licence (`tgui/LICENSE.md`); the Font Awesome fonts it uses are under the SIL Open Font License 1.1 (`tgui/assets/fonts/SIL-OFL-1.1-LICENSE.md`); tgui's assets are under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

All other assets, including icons and sounds, are under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) unless a file next to them says otherwise (`sound/ambience/license.txt`, `config/title_screens/LICENSE.txt`).

## Credits

The game, its sprites and its sounds are the work of the [/tg/station 13](https://github.com/tgstation/tgstation) contributors and the Space Station 13 coders before them. Features brought back from later /tg/station are theirs too.

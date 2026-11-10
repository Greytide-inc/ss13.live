# ss13.live

A standalone fork of Space Station 13 as it was on /tg/station in 2017, with quality-of-life features brought over from modern tg, running in a web browser with no BYOND. The whole game, about 400,000 lines of DM in its original form, now lives as TypeScript that you edit directly (a small subset of the language, shown below), and a TypeScript engine runs it. It plays single-player in one browser tab with nothing else running, or multiplayer through a small Node server: station, jobs, HUD, chat, tgui windows, sound, and round end and restart.

Play it at https://ss13.live. Singleplayer is always there and runs on your own computer; Multiplayer opens when the game server is up, and the page shows whether it is.

## How it works

The game is split into two parts, the same way BYOND splits it:

- **Game code** (`web/game/`): the rules. There are about 26,000 procs and 13,800 types, one `.ts` file per original `.dm` file. Procs are functions registered with `rt.def(...)` (generator functions if they can sleep) and types with `rt.type(...)`. A bundler turns them into the build's game files. Part of the airlock's `Destroy` proc, as an example:

  ```ts
  rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
  	yield* qdel(this.wires);
  	this.wires = null;
  	if (this.charge) {
  		yield* qdel(this.charge);
  		this.charge = null;
  	}
  	...
  	return (yield* parent_proc());
  }, true);
  ```

  It is a small subset of TypeScript written to read like the DM it came from: `this.wires` for a var, `qdel(x)` for a proc, `parent_proc()` for `..()`. Type notes go on parameters and variables only (no classes, generics or interfaces), and the type checker doesn't run on it. The build compiles it into calls that keep DM's rules (vars and procs looked up by name at run time, DM's truth and maths), and stops on a mistake.
- **Engine** (`web/src/`): a rewrite of what BYOND supplied. It handles the type tree, the scheduler and sleeping procs, garbage collection, the built-in procs, the map loader, `.dmi` icons, appearances, lighting, line of sight, input, verbs, browse popups, tgui and sound.

In the browser, the game runs in a Web Worker that acts as the server. The page acts as the client: it draws with PixiJS and handles input. The two talk with `postMessage`. The game's own save files (character setup, preferences, anything it writes to its `data/` folder) are kept in the browser's IndexedDB. For multiplayer, the same game code runs in a Node server instead (`web/tools/server.mjs`), and each player's page talks to it over a WebSocket. Saved worlds are a separate thing, made by the build tools and not by players: the build includes a world saved just before round start, so the page loads into the lobby in seconds instead of initializing the station first.

Assets are the original plain files at the repo root: `icons/`, `sound/`, `_maps/`, `config/`, `strings/`, `html/`, `interface/` and `tgui/`.

## Running it

You need Node 20.

```bash
cd web
npm install
npm run build:static          # builds the game in web/dist/
python3 -m http.server 8013 --directory dist
```

Then open http://localhost:8013/. Page options go on the end of the address, for example `?join=Captain` to skip the lobby.

For multiplayer, run the game server instead (`node tools/server.mjs --dist dist --lobby`, options in the header of `web/tools/server.mjs` and in [web/README.md](web/README.md)); each browser tab that connects is one player.

For development:

| Command (from `web/`) | What it does |
|---|---|
| `npm test` | Engine and page tests |
| `npm run boot-check -- NAME` | Boots the game headless in Node and checks its log: every boot milestone in order and no runtime error. The main check after any game or engine change |
| `npm run build:tgui` | Rebuilds the tgui assets from `tgui/src` |

More commands are in [web/README.md](web/README.md). The rules for editing game code are in [web/game/README.md](web/game/README.md). New to the code? [web/game/HOW-TO-READ.md](web/game/HOW-TO-READ.md) explains the names you'll meet most, `function*` and `yield*`, with a worked example.

## Layout

| Folder | Contents |
|---|---|
| `web/game/` | Game code (TypeScript) |
| `web/src/` | Engine: `vm/` runs the game, `render/` draws, `worker/` is the game thread (the code that runs inside the Web Worker), plus `dmi/`, `vfs/`, `appearance/` |
| `web/worker/` | The game page (`index.html` and its scripts): the client side, despite the folder's name |
| `web/site/` | The landing page at ss13.live |
| `web/tests/` | Tests |
| `web/tools/` | Build, boot, profiling and check scripts |

## Licence

All code, including the engine in `web/src` and the tools in `web/tools`, is licensed under the [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html) (`LICENSE`). If you run a modified copy as a public server, its players must be offered your source. The /tg/station code it comes from was AGPL v3 from [commit 333c566b](https://github.com/tgstation/tgstation/commit/333c566b88108de218d882840e61928a9b759d8f) (2014-12-31) and GPL v3 before it (`LICENSE-GPLv3.txt`).

tgui's client side is under the MIT licence (`tgui/LICENSE.md`); the Font Awesome fonts it uses are under the SIL Open Font License 1.1 (`tgui/assets/fonts/SIL-OFL-1.1-LICENSE.md`); tgui's assets are under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

All other assets, including icons and sounds, are under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) unless a file next to them says otherwise (`sound/ambience/license.txt`, `config/title_screens/LICENSE.txt`).

## Credits

The game, its sprites and its sounds are the work of the [/tg/station 13](https://github.com/tgstation/tgstation) contributors and the Space Station 13 coders before them. This port's code was written by AI coding assistants (mostly Claude Code), directed and play-tested by one person.

# ss13.live (beta)

2017 /tg/station in a web browser with no BYOND: single-player offline in one tab, or multiplayer through a Node server. The game code is hand-editable TypeScript in `game/`, run by a TypeScript engine in `src/`: game rules in a Web Worker (or the server), drawing, UI and input on the page. Assets (icons, sounds, maps, config, html, tgui) are the plain folders at the repo root. A full round plays in Chrome and Firefox.

## Play it

Build the game into `dist/` (repo root: `source activate`, then from `web/`); `node tools/server.mjs --dist dist --lobby` serves it (see Multiplayer below):

```bash
npm run build:static -- --no-snapshot   # quick (~10-40 s): no saved worlds, the station takes ~40 s to load
npm run build:static                    # full (~2 min): saved worlds, loads in ~15 s; for release builds
```

## Commands (from `web/`, after `source ../activate`)

| Command | What it does |
|---|---|
| `npm test` | Every quick test (engine, page, drawing, icons, VFS, compare-logs, tgui fixtures; ~30 s), listed in `tests/all.mjs`: a new test goes there. Doesn't compile `game/` |
| `npm run boot-check -- [--twice] NAME` | Boot headless in Node (~3.5 min), compare the log with the BYOND recording in `reference/`. Rebundles `game/` when it changed. Exit 0 = clean |
| `npm run build:static [-- --no-snapshot] [-- --dist build/NAME-dist]` | Build `dist/` (the game page) or your own test copy with `--dist`. Full builds save worlds for Box, Runtime and the scenario maps |
| `node tools/csp.mjs` | After any edit to `worker/index.html`'s inline script: refreshes its CSP hashes (else the page runs nothing and never connects; `npm test` catches it) |
| `npm run build:tgui` | Rebuild `tgui/assets/tgui.js` + `.css` from `tgui/src` (~6 s); then `build:static` |
| `node tools/make-snapshot.mjs NAME [--map runtime] [--after-start S]` | Save a world S game seconds into a round (default 300) as `build/snapshot-cache/world-NAME.snap.gz`; build:static ships it while it matches. The page loads it with `?snap=NAME`. Mid-round sleeps must be tails (`game/README.md`) |
| `tools/scenario-check.sh [NAME...]` | Runs every scenario with an `expect:` / `expect-not:` header line (or the named ones) and prints ok/FAIL each; exit 1 if any failed (~36 s for one). Needs `npx tsc -p .` first |
| `node build/dist/src/tools/boot.js --scenario NAME` | Play `scenarios/NAME.txt` (map, job, seed, length, scripted input) headless on a fake clock, so a seed always gives the same run (`--real-clock` for timing). The page: `?scenario=NAME` |
| `GASDUMP_DIR=build/gd-A node build/dist/src/tools/boot.js --scenario gas-diff --log build/x.log --data-out build/x-data`, then again into `gd-B`, then `node tools/gas-diff.mjs build/gd-A build/gd-B`. After a game/ change add `--no-snapshot` to both runs (the saved lobby no longer matches the new build, so only one side would load it) | Gas guard for atmos speed-ups: exact gas state (active turfs, pipelines, turf sample) at 3 points; exit 0 = bit-identical, 1 = differences listed |
| `npm run test:restart` | Round end in the offline build: three worlds, two restarts, headless Firefox (~2.5 min) |
| `npm run gallery` / `npm run worker-boot -- --join Assistant` | Developer page on :8471 / boot in headless Chrome and screenshot |

## Multiplayer: `tools/server.mjs`

One Node process runs the game loop in a worker thread, serves a built dist over HTTP and takes WebSocket players. Messages are the worker protocol as JSON; per-player messages go only to that player.

```
npm run build:static -- --dist build/mp-dist --no-snapshot
node tools/server.mjs --dist build/mp-dist --port 8780 [--join Assistant] [--seconds N] [--log FILE] [--lobby] [--hot] [--spawn-near] [--tgui PATH] [--no-deflate]
```

It boots the round itself and logs the worker's `[vm-boot]` lines to stdout and `build/server-PORT.log`; Ctrl-C or `--seconds` stops it. `--tgui PATH` opens that window for the player (test aid).

- **Play through it:** open `http://localhost:8780/?server=ws://localhost:8780` (another computer: this machine's address). Each tab names its player with `&name=Alice` (none = the page asks); the page sends `Name#secret` (`&name=Alice%23secret`, or typed; no `#` = a random secret kept in the browser) and plays as `Alice @tag` (`tools/tripcode.mjs`, keyed by `--pepper FILE`), and the tag tells two players with the same name apart (each has its own character; the same secret gets it back). `--reserved FILE` (one name a line) keeps names for admins only, matched as ckeys. The first player starts the round; later ones late-join as Assistant at arrivals. A closed tab disconnects its player (the body stays); the same tag again replaces a still-open tab. Not in server mode: `?` start options, saved prefs, a new round after the end. **Admin** only by a secret, never by being on this machine: the server prints an admin link at start (`&adminkey=`, new each run; `--host-key KEY` picks it); other admins: `--admins FILE` (one tag a line). `tools/admin-check.mjs` checks admins, bans and tripcodes; `tools/boot-vote-check.mjs` the players' boot vote (voted off until the next round, by key and address), `tools/map-vote-check.mjs` the map vote (the next world loads the winner). `--saves FILE` keeps savefiles (character setups) across rounds and restarts (`tools/saves-check.mjs`); without it they last one round. Once everyone has left, a fresh world starts after 15 min with nobody back (`--empty-reset S`, 0 = never).
- **Checks against a running server:** `tools/mp-check.mjs PORT` (with `--spawn-near`: two players see each other walk and talk, a taken name is refused, a middle click's own answer already shows the hand swap, a player who left is gone from Who); `tools/fuzz-check.mjs PORT [LOG]` (not `--lobby`, `--seconds 200`: junk, oversized, forged and flood input from a second player, and a page that goes silent after its hello is closed (~30 s); exit 0 = server and other player untouched; limits at the top of `server.mjs`, shape checks in `src/worker/input-check.ts`); `tools/ws-client-test.mjs --url ws://127.0.0.1:8780 --key HOSTKEY` (message and byte counts); `tools/worker-boot.mjs --server-port 8780 --name Alice --keys "east*5"` (a page as a driver; needs `node --experimental-websocket`).
- **Log level:** `server.mjs --log-level quiet|normal|chatty` (page: `?log=quiet|chatty`); quiet drops the per-input lines (key, topic, Click, ...), chatty adds every `to client:` line, uncut. Mid-round on the server: `curl "http://127.0.0.1:PORT/loglevel?level=chatty"` (this machine only, no X-Forwarded-For; a player socket can't send it).
- **Hot loading:** `node tools/hot.mjs [--port N] [game/code/FILE.ts ...]` loads edited `game/` files into a running `server.mjs --hot` (no files named = everything edited since its build; ~1 s). Only proc bodies may differ: exit 0 = loaded (prints the changed procs), 2 = needs a rebuild and restart (a new or changed var, type, global, proc, arguments, verb setting), 1 = failed. Sleeping or looping procs finish on old code; world-start code isn't rerun; errors show as `game/FILE.ts:LINE (hot-loaded)`. Its own check: `tools/hot-check.mjs --dist build/NAME-dist` (~70 s).

## Window checks

- **Far or hostile player vs a window's hrefs:** `node tools/topic-check.mjs --dist build/NAME-dist --only SCENARIO`.
- **tgui-quick** (layout, no game, ~1 s): `node --experimental-websocket tools/tgui-quick.mjs [--shot DIR] [--click TEXT] NAME...` loads tgui in headless Firefox with a fixture (`tests/tgui-fixtures/NAME.json`: `{config, data}`, optional `checks`: `text`, `disabled`, `enabled`, `boxMin`, `clicks`) and prints the window text, buttons (`[disabled]` = greyed), box widths, image 404s, page errors, and the href a clicked button would send. New fixtures: `capture:NAME` in a `ui2-tgui --steps` run writes one from a real game.
- **ui2-tgui** (what a click does in the game): `?tgui=PATH` stands the player next to the first such atom with its window open (`src/worker/boot-worker.ts`, `opts.tgui`); a state-log hook there (search `fabTgt`) logs the machine's vars as `tgui: tNNN ...` lines. Run it on your own build: `ui2-tgui --dist build/NAME-dist`.

## Folders

| Folder | What's in it |
|---|---|
| `game/` | The game code (hand-edited TypeScript), bundled by `tools/translate-tg.mjs` into `build/`. Rules: `game/README.md` |
| `src/` | Engine and page code: `vm/` runs the game, `render/` draws, `worker/` the game thread, `dmi/` icons, `vfs/` files and saves |
| `worker/` | The game page. `draw/`, `gallery/`, `skin/`: developer test pages |
| `tests/`, `tools/` | Tests; build, boot and check scripts |
| `reference/` | Recorded BYOND results that boot-check and the tests compare against |
| `build/`, `dist/` | Not in git: generated files and boot logs (old logs can go), and the offline copy |


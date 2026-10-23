// joining a server, the page's pure logic (no DOM), so tests/static/join.test.mjs can check it. The page (index.html) wires it up.

/**
 * The name to join as: `ask(offered)` is the page's name prompt (null = Cancel). It offers the name this browser last joined as,
 * else "Player" and four random digits: a plain "Player" for everyone made the second visitor who pressed OK "held this round".
 */
export function joinName(saved, ask, rand = Math.random) {
	const offered = saved || `Player${1000 + Math.floor(rand() * 9000)}`;
	return (ask(offered) ?? "").trim() || offered;
}

/** What to keep for next time from "Name#secret": the name only (the secret never goes in storage), or null. */
export const nameToSave = (asked) => asked.split("#")[0].trim() || null;

/**
 * Whether closing the tab should ask first: while a game is showing (a page can't block Ctrl+W, and W walks). Not before the first
 * view, not once the world stopped or the server refused this page, never under a test driver (`webdriver` = navigator.webdriver).
 */
export const warnOnLeave = (boot, webdriver = false) => !webdriver && boot.views > 0 && !boot.done && !boot.error;

// A short list of secrets people pick first: such a secret's tag is anyone's who tries the same word.
const COMMON = new Set(["password", "passw0rd", "12345678", "123456789", "1234567890", "qwertyui", "qwertyuiop", "iloveyou", "11111111", "00000000",
	"abcdefgh", "abc12345", "password1", "letmein1", "sunshine", "princess", "football", "baseball", "superman", "trustno1", "whatever", "welcome1",
	"spacestation", "spacestation13", "ss13ss13", "greytide", "robustin", "honkhonk", "clownclown", "assistant"]);
/** Whether to warn before joining with this secret (plans/site.md step 4: warn, never block). An empty secret is no secret: no warning. */
export const weakSecret = (s) => s !== "" && (s.length < 8 || COMMON.has(s.toLowerCase()));

/** What the join window sends: "Name" or "Name#secret" (the server makes the tag from the secret). */
export const joinString = (name, secret) => (name.trim().replace(/#/g, "") || "Player") + (secret ? "#" + secret : "");

/** The join window's answer when the server refuses a name ({type:"nameTaken"}): a red notice, or null for "replaced" (another tab: an error window). */
export function nameAnswer(reason, name) {
	if (reason === "reserved") return { cls: "", text: `"${name}" is kept for the admins. Pick another name.` };
	if (reason === "connected") return { cls: "red", text: `"${name}" is already playing on this server. Pick another name, or add a secret: that makes you a different ${name}.` };
	if (reason === "empty") return { cls: "red", text: "Type a name first." };
	return null;
}

/** The "something went wrong" windows: title, message, detail, buttons (labels; the page wires them by label). */
export const ERRORS = {
	crash: ["The game stopped", "Your round can't go on. Reloading starts a new one.", ["Save bug report", "Reload"]],
	tab: ["Playing in another tab", "Only one tab can play as you at a time.", ["Back to ss13.live", "Play here instead"]],
	lost: ["Lost the server", "The host may have stopped or restarted it. Your character is still there if the round goes on.", ["Back to ss13.live", "Reconnect"]],
	refused: ["Can't join", "Singleplayer still works.", ["Back to ss13.live"]],
};

/**
 * The loading window's steps (a bar per step; plans/site.md step 7 gives each its measured share). `loadStep(mode, step)` gives
 * the step's place; "stage" texts from the worker ("Loading the station... 12 / 36 MB") are matched to a step by loadStepOf.
 */
export const LOAD_STEPS = {
	solo: ["Downloading the game", "Downloading the station", "Unpacking the station", "Opening the lobby"],
	mp: ["Connecting to the server", "Joining the lobby"],
};
export function loadStepOf(mode, ev) {
	if (mode === "mp") return ev === "connected" ? 1 : 0;
	if (/^Loading the station/.test(ev)) return 1;
	if (/^Unpacking/.test(ev) || ev === "world-new") return 2; // world-new: no saved station, the map loads here
	if (["snapshot", "round-start", "joined", "lobby"].includes(ev)) return 3;
	return ev === "loaded" ? 1 : 0;
}
/** "12 / 36 MB" in a stage text, as a share of that step (0 when there is none). */
export const stepShare = (text) => { const m = /(\d+) \/ (\d+) MB/.exec(text ?? ""); return m && +m[2] ? Math.min(1, m[1] / m[2]) : 0; };

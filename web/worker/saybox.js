// the say box's pure logic (no DOM), so tests/static/saybox.test.mjs can check it. The page (index.html) wires it up.
// A channel is what the bottom bar's text means: "say", "radio", "me", "whisper", or null = a plain verb command line.
export const CHANNELS = [
	{ id: "say", label: "Say", color: "#dce8ff", title: 'Say: everyone nearby hears you. Start a line with / to run a command instead (/resist)' },
	{ id: "radio", label: "Radio", color: "#d6f0d2", title: 'Radio: your headset, common channel. Start with :e, :s ... to pick another (say ";...")' },
	{ id: "me", label: "Me", color: "#ffe9c4", title: 'Me: an emote, "Name does something" (verb: me "...")' },
	{ id: "whisper", label: "Whisper", color: "#e6dcf5", title: 'Whisper: only people right next to you (verb: whisper "...")' },
];
const ids = CHANNELS.map((c) => c.id);

/** The channel after `id` (dir +1) or before it (-1), wrapping. */
export const nextChannel = (id, dir = 1) => ids[(ids.indexOf(id) + dir + ids.length) % ids.length];

/**
 * What to send for `text` typed in `channel`: null for an empty box, else {text}. Every channel is speech; a line starting with
 * "/" is a plain command in any channel ("/resist", "/ooc hi"), so "me too" or "look at that" is said, not run as a verb.
 */
export function lineFor(channel, text) {
	const t = text.trim();
	if (!t || t === "/") return null;
	if (t[0] === "/") return { text: t.slice(1).trim() };
	if (channel === "say") return { text: 'say "' + t };
	if (channel === "me") return { text: 'me "' + t };
	if (channel === "whisper") return { text: 'whisper "' + t };
	if (channel === "radio") return { text: /^[:.][a-z]/i.test(t) ? 'say "' + t : 'say ";' + t }; // ":e hi" picked its own channel; else the common one
	throw new Error("unknown channel " + channel);
}

/** Is the player typing a message? With something in the box, while the box has focus. */
export const isTyping = (text, focused) => focused && text.trim() !== "";

/** Keys that open the box from the map (tg's hotkeys: T = say, M = me); null for any other key or one with a modifier. */
export const hotkeyOpens = (key, mods) => (mods ? null : key === "T" ? "say" : key === "M" ? "me" : null);

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

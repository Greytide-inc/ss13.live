// The \proper / \improper text markers (measured through web/tests/dm/look.dm).
// No imports: the object tree uses this while loading.

// Each is 2 characters (255, 21) / (255, 22), kept by
// length(), copytext(), uppertext(), replacetext(), url_encode(), "[x]" and so on, and stripped
// only by world.log output, text2file(), file << text, html_encode(), ckey(), ckeyEx(),
// json_encode(); cmptext() and sorttext() compare without them.
export const PROPER = "\xff\x15";
export const IMPROPER = "\xff\x16";
const MARKERS = /\xff[\x15\x16]/g;

/** `s` without \proper / \improper markers. */
export function stripMarkers(s: string): string {
	return s.indexOf("\xff") < 0 ? s : s.replace(MARKERS, "");
}

/** Compiled text with DMCompiler's one-character markers (U+FF10, U+FF11) turned into BYOND's two. */
export function byondMarkers(s: string): string {
	if (s.indexOf("０") < 0 && s.indexOf("１") < 0) return s;
	return s.replace(/０/g, PROPER).replace(/１/g, IMPROPER);
}

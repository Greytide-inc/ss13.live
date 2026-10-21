// proc-path.ts - Splits an rt.def proc path into owner type, name and proc/verb (its own file so objtree.ts can use it).

/** A proc path: "/proc/x" (global), "/type/proc/x", "/type/verb/x", or "/type/x" (a verb override written without `verb/`). */
export function parseProcPath(path: string): { owner: string; name: string; verb: boolean } {
	const i = path.lastIndexOf("/"), name = path.slice(i + 1), rest = path.slice(0, i);
	const j = rest.lastIndexOf("/"), kw = rest.slice(j + 1);
	if (kw === "proc" || kw === "verb") return { owner: rest.slice(0, j) || "/", name, verb: kw === "verb" };
	return { owner: rest || "/", name, verb: true };
}

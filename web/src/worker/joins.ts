// joins - Who comes into the world, and when. The first player (the page's own, or the server's first connection) connects at a set
// point of the boot; later players (tools/server.mjs's connect / disconnect messages) wait until that first join is settled. Messages
// can come at any time, so a disconnect cancels the same player's connect that is still waiting, and the first player can be gone
// (refused, or left) without blocking everyone after them.
//
// The first player's mode:
//   waiting  the world is not ready for them yet (a disconnect now means they are not there when it is: "gone" at that point)
//   setup    connected, the gender click and join or Ready still to come (boot-worker's join wait)
//   in       joined: later players come in
//   gone     refused, or left before joining: later players come in without them

export type FirstMode = "waiting" | "setup" | "in" | "gone";
export interface Arrival { key: string; ckey: string; job: string; near?: boolean; address?: string }

/** BYOND's ckey: lower case, letters, digits and @ only. */
export const ckeyOf = (key: string): string => key.toLowerCase().replace(/[^a-z0-9@]/g, "");

export class Joins {
	mode: FirstMode = "waiting";
	private arrivals: Arrival[] = [];
	private leaving: string[] = [];
	private cancelled: string[] = [];
	private firstAway = false;

	constructor(readonly firstCkey: string) {}

	/** Later players come in once the first join is settled. */
	get open(): boolean { return this.mode === "in" || this.mode === "gone"; }

	/** A player connected (a message: runs in a later tick). */
	connect(a: Omit<Arrival, "ckey">): void {
		const ckey = ckeyOf(a.key);
		if (this.mode === "waiting" && ckey === this.firstCkey) { this.firstAway = false; return; } // the first player back before their join: they join as the first
		this.arrivals = this.arrivals.filter((x) => x.ckey !== ckey);
		this.arrivals.push({ ...a, ckey });
	}

	/** A player's connection closed (a message: runs in a later tick). */
	disconnect(key: string): void {
		const ckey = ckeyOf(key), n = this.arrivals.length;
		this.arrivals = this.arrivals.filter((x) => x.ckey !== ckey);
		if (this.arrivals.length < n) { this.cancelled.push(ckey); return; } // never came in: nothing to drop
		if (this.mode === "waiting" && ckey === this.firstCkey) { this.firstAway = true; return; }
		this.leaving.push(ckey);
	}

	/** The world is ready for the first player: "setup" = connect them now; "gone" = they left, nobody connects for them. */
	firstArrives(): FirstMode {
		if (this.mode === "waiting") this.mode = this.firstAway ? "gone" : "setup";
		return this.mode;
	}

	/** The first player's connect was refused, or they left before joining. */
	firstGone(): void { if (this.mode !== "in") this.mode = "gone"; }

	/** The first player has joined. */
	firstIn(): void { if (this.mode === "setup") this.mode = "in"; }

	/** The players to drop this tick (their records exist, or did). */
	takeLeaving(): string[] { const l = this.leaving; this.leaving = []; return l; }

	/** Waiting connects cancelled by a disconnect: each still gets the "disconnect" answer a dropped client gets. */
	takeCancelled(): string[] { const l = this.cancelled; this.cancelled = []; return l; }

	/** The players to connect this tick: none until the first join is settled. */
	takeArrivals(): Arrival[] {
		if (!this.open) return [];
		const l = this.arrivals; this.arrivals = []; return l;
	}
}

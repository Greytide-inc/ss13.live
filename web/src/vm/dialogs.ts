// dialogs: the pop-up questions (input(), alert(), a verb's argument boxes) that are open on players' pages.
// Each one is open until exactly one of: the player answers, the player cancels, the cap pushes it out, the player leaves.
// Every way out goes through close(), which takes the dialog off the list and returns it with its answer (null = cancelled);
// the caller (Clients) hands that answer to whoever was waiting. Plain data only, so a saved world can hold open dialogs.
import type { Value } from "./value.js";

/** A dialog that just closed, and its answer. */
export interface Closed<W> { waiting: W; value: Value }

export interface Dialog<W> {
	/** The player who was asked. */
	ckey: string;
	/** A list dialog: the answer is a row number into these. */
	items?: Value[];
	/** A number box. */
	num?: boolean;
	/** An alert: the answer is one of these button texts. */
	buttons?: string[];
	/** Who gets the answer, once (the caller's own record). */
	waiting: W;
}

export class Dialogs<W> {
	private readonly byId = new Map<number, Dialog<W>>();
	private nextId = 0;

	constructor(private readonly maxPerPlayer: number) {}

	/** Opens a dialog and returns its id. ps-security: a player's open dialogs are capped (each holds a waiting thread): past the cap the oldest is cancelled (`closed`). */
	open(d: Dialog<W>): { id: number; closed: Closed<W>[] } {
		const mine = this.idsOf(d.ckey);
		const closed = mine.length >= this.maxPerPlayer ? this.close(mine[0], null) : [];
		const id = ++this.nextId;
		this.byId.set(id, d);
		return { id, closed };
	}

	/** The page's answer to dialog `id`: `value` is the text, number, or list index; null = Cancel; an alert answers its button's text.
	 * ps-security: only the player who was asked may answer, and only with something the dialog offers (a list row, one of the
	 * alert's buttons); anything else leaves the dialog open (nothing returned). */
	answer(id: number, value: string | number | null, ckey?: string): Closed<W>[] {
		const p = this.byId.get(id);
		if (!p) return [];
		if (ckey !== undefined && p.ckey !== ckey) return [];
		if (value !== null && p.items && !(typeof value === "number" && Number.isInteger(value) && value >= 0 && value < p.items.length)) return [];
		if (value !== null && p.buttons && !(typeof value === "string" && p.buttons.includes(value))) return [];
		let v: Value = null;
		if (p.items) v = typeof value === "number" ? p.items[value] ?? null : null;
		else if (value !== null) v = p.num ? Number(value) || 0 : value;
		return this.close(id, v);
	}

	/** The player left: every dialog still open for them is cancelled, so nothing stays waiting on a page that is gone. */
	playerLeft(ckey: string): Closed<W>[] {
		return this.idsOf(ckey).flatMap((id) => this.close(id, null));
	}

	/** How many dialogs are open for this player. */
	openFor(ckey: string): number {
		return this.idsOf(ckey).length;
	}

	private idsOf(ckey: string): number[] {
		const out: number[] = [];
		for (const [id, p] of this.byId) if (p.ckey === ckey) out.push(id);
		return out;
	}

	private close(id: number, value: Value): Closed<W>[] {
		const p = this.byId.get(id);
		if (!p) return [];
		this.byId.delete(id);
		return [{ waiting: p.waiting, value }];
	}
}

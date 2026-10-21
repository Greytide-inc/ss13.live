// view-merge - Folds view updates a slow connection hasn't room for into one (ViewQueue: server.mjs holds them back while a player's acks lag).
// Applying merge(a, b) on the page gives the same picture as applying a then b, except that glides and the camera skip to b's last step.
// `merged` counts the ticks folded in, so the page keeps glides at one tick's speed. seq is rewritten by the server, not here.
export function mergeViews(a, b) {
	if (b.full) return b;
	const apps = new Map(a.apps), gone = new Set(a.gone);
	for (const id of b.gone) { apps.delete(id); gone.add(id); } // the page drops gone ids before adding apps: an id added in a and gone in b must not come back
	for (const [id, ap] of b.apps) { apps.set(id, ap); gone.delete(id); }
	const tiles = new Map(a.tiles.map((t) => [t[0] + "," + t[1], t]));
	for (const t of b.tiles) tiles.set(t[0] + "," + t[1], t);
	const moved = new Map((a.moved ?? []).map((m) => [m[0], m]));
	for (const m of b.moved ?? []) moved.set(m[0], m); // only each object's last step glides; earlier ones are skipped
	for (const id of gone) moved.delete(id);
	const anims = [...(a.anims ?? []), ...(b.anims ?? [])];
	const out = { ...b, full: a.full, apps: [...apps], gone: a.full ? [] : [...gone], tiles: [...tiles.values()], moved: [...moved.values()], screen: b.screen ?? a.screen, merged: (a.merged ?? 1) + (b.merged ?? 1) };
	if (b.off === undefined && a.off !== undefined) out.off = a.off;
	if (b.hud === undefined && a.hud !== undefined) out.hud = a.hud;
	if (b.icons === undefined && a.icons !== undefined) out.icons = a.icons;
	if (b.light === undefined && a.light !== undefined) out.light = a.light;
	if (b.opq === undefined && a.opq !== undefined) out.opq = a.opq;
	if (a.now) out.now = 1; // netcode 1: still answers a click
	if (anims.length) out.anims = anims; else delete out.anims;
	return out;
}

// One player's views, numbered; a page that says so in its hello (acks: 1) acks each one it gets. When the oldest unacked view is older
// than the best round trip seen plus QUEUE_MS, views are queueing somewhere (a slow or stalled link, or a page busy elsewhere): new ones
// are held and merged, and go out as one on the ack that clears the queue. Until the first ack, anything unacked after GUESS_RTT counts
// as queueing, so a big join view on a slow link already holds back the ones after it. QUEUE_MS 150 made each lost-packet stall worse. A client that doesn't ack (test tools) gets every view.
export const QUEUE_MS = 300, GUESS_RTT = 250;
export class ViewQueue {
	constructor(send, acking = false, now = () => performance.now()) { Object.assign(this, { send, acking, now, seq: 0, sent: [], minRtt: Infinity, measured: false, held: null, merged: 0 }); }
	queued() { return this.acking && this.sent.length > 0 && this.now() - this.sent[0][1] > (this.measured ? this.minRtt + QUEUE_MS : GUESS_RTT); }
	push(update) {
		if (this.held || this.queued()) this.held = this.held ? mergeViews(this.held, update) : update;
		else this.out(update);
	}
	ack(s) {
		if (!this.acking) return;
		const t = this.now();
		while (this.sent.length && this.sent[0][0] <= s) {
			const [seq, at] = this.sent.shift();
			if (seq === s) { this.minRtt = Math.min(this.minRtt, t - at); this.measured = true; }
		}
		if (this.held && !this.queued()) { const h = this.held; this.held = null; this.out(h); }
	}
	out(update) {
		const seq = ++this.seq;
		if (this.acking) this.sent.push([seq, this.now()]);
		if (update.merged) this.merged += update.merged - 1;
		this.send({ ...update, seq });
	}
}

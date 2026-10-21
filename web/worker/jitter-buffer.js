// jitter-buffer - Holds views a little on the page so uneven arrivals play evenly (lag-smoothing step 3). Multiplayer only (worker/index.html
// socketWorker); tools/lag-replay.mjs --jb measures it. Each view's "lateness" is its arrival minus its world.time; the earliest of the last
// WINDOW views is the on-time mark, and how far the 90th percentile sits above it is the jitter. A view is held until on-time + jitter (at most
// MAX_MS), so a view that came early waits for the late ones' pace. Without jitter (a calm LAN) it holds ~0 ms. Other messages keep their
// place behind held views, so a sound still plays with the view it belongs to.
const WINDOW = 60, MAX_MS = 100;

export class JitterBuffer {
	constructor(release) {
		this.release = release; this.q = []; this.late = []; this.timer = null;
		this.held = []; // ms each view was held, for the F9 report (the page empties it)
	}
	// m: any message; wt: its world.time in deciseconds if it is a view, else undefined
	push(m, wt, now = performance.now()) {
		let at = now;
		if (wt !== undefined) {
			const l = now - wt * 100;
			this.late.push(l); if (this.late.length > WINDOW) this.late.shift();
			const s = [...this.late].sort((a, b) => a - b), base = s[0], jit = Math.min(MAX_MS, s[Math.floor(s.length * 0.9)] - base);
			at = Math.min(now + MAX_MS, wt * 100 + base + jit); // a new round (world.time starts over) or a merged view lands early: never past MAX_MS
		}
		if (this.q.length) at = Math.max(at, this.q[this.q.length - 1][0]); // order kept
		if (wt !== undefined && this.held.length < 20000) this.held.push(Math.max(0, Math.round(at - now)));
		this.q.push([at, m]);
		this.pump(now);
	}
	pump(now = performance.now()) {
		clearTimeout(this.timer); this.timer = null;
		while (this.q.length && this.q[0][0] <= now + 1) this.release(this.q.shift()[1]);
		if (this.q.length) this.timer = setTimeout(() => this.pump(), this.q[0][0] - now);
	}
	flush() { clearTimeout(this.timer); this.timer = null; for (const [, m] of this.q.splice(0)) this.release(m); }
}

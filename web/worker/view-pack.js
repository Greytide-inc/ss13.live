// view-pack - Shrinks view updates on the multiplayer wire (lag-smoothing step 2). ViewPacker (tools/server.mjs, one per player, after
// view-merge) and ViewUnpacker (the page, worker/index.html, one per connection) keep the same state, so the page gets back the same views:
// - each drawable layer (an appearance without its overlays, or one overlay) goes once, default fields left out, under a number (`L`:
//   [num, fields]); apps are [id, rootNum, overlayNums];
// - a screen list with the same ids in the same order as the last one goes as its changed entries (`sd`: [index, entry]);
// - key/view/baseView/sight/eyeTile/pred are left out when the same as last sent.
// A full update starts both sides over (a new round's page has a new unpacker); `Lreset` forgets the layers after LIMIT of them. Unpacked layers are fresh objects: the page writes into them.
const DEFAULTS = { icon: null, iconState: "", dir: 2, color: null, alpha: 255, transform: null, pixelX: 0, pixelY: 0, invisibility: 0, blendMode: 0, maptext: null, maptextWidth: 32, maptextHeight: 32, maptextX: 0, maptextY: 0 };
const STICKY = ["key", "view", "baseView", "sight", "eyeTile", "pred", "steps"];
const LIMIT = 50000; // layers remembered before starting over (a full update)

export class ViewPacker {
	constructor() { this.reset(); }
	reset() { this.nums = new Map(); this.screen = null; this.last = {}; }
	num(layer, out) {
		const f = {};
		for (const k in layer) if (k !== "overlays" && !(k in DEFAULTS && layer[k] === DEFAULTS[k])) f[k] = layer[k];
		const key = JSON.stringify(f);
		let n = this.nums.get(key);
		if (n === undefined) { n = this.nums.size; this.nums.set(key, n); out.push([n, f]); }
		return n;
	}
	/** u: a view update as view-merge sends it (seq set). Returns the packed one; u is not changed. */
	pack(u) {
		const p = { ...u, packed: 1 };
		if (u.full) this.reset();
		else if (this.nums.size > LIMIT) { this.nums = new Map(); p.Lreset = 1; }
		const L = [];
		p.apps = u.apps.map(([id, ap]) => [id, this.num(ap, L), ap.overlays.map((o) => this.num(o, L))]);
		if (L.length) p.L = L;
		const s = u.screen, was = this.screen;
		if (s) {
			if (!p.full && was && was.length === s.length && s.every((e, i) => e[0] === was[i][0])) {
				p.sd = [];
				for (let i = 0; i < s.length; i++) if (s[i][1] !== was[i][1] || s[i][2] !== was[i][2]) p.sd.push([i, s[i]]);
				p.screen = null;
			}
			this.screen = s;
		}
		for (const k of STICKY) {
			const j = JSON.stringify(u[k]);
			if (!p.full && this.last[k] === j) delete p[k];
			this.last[k] = j;
		}
		return p;
	}
}

export class ViewUnpacker {
	constructor() { this.layers = []; this.screen = null; this.last = {}; }
	/** Gives back the update ViewPacker was given (an unpacked one passes through). */
	unpack(p) {
		if (!p.packed) return p;
		const u = { ...p };
		delete u.packed; delete u.L; delete u.sd; delete u.Lreset;
		if (p.full) { this.layers = []; this.screen = null; this.last = {}; }
		if (p.Lreset) this.layers = [];
		const ly = this.layers;
		for (const [n, f] of p.L ?? []) ly[n] = f;
		u.apps = p.apps.map(([id, r, os]) => [id, { ...DEFAULTS, ...ly[r], overlays: os.map((n) => ({ ...DEFAULTS, ...ly[n] })) }]);
		if (p.sd) { u.screen = this.screen.slice(); for (const [i, e] of p.sd) u.screen[i] = e; }
		if (u.screen) this.screen = u.screen;
		for (const k of STICKY) { if (k in p) this.last[k] = p[k]; else u[k] = this.last[k]; }
		return u;
	}
}

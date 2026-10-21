// BYOND sound messages -> Web Audio. createSound(log) -> { play(m), unlock() }. m = the sound datum's set fields (clients.ts soundData).
// Modelled: file, volume, repeat, wait (queue on the channel), channel (a new sound replaces; null file stops; channel 0 = any free one),
// frequency (playback rate), pan, x/y/z + falloff (PannerNode). NOT modelled: negative frequency (played forward), environment/echo,
// status flags (SOUND_UPDATE/MUTE/PAUSED; tg only uses SOUND_STREAM, which is just "stream it").
export function createSound(log) {
	let ctx = null; // made on the first user gesture
	const cache = new Map(); // path -> Promise<AudioBuffer|null>
	const chans = new Map(); // channel -> { src, queue: [m] }
	const load = (path) => { // lazy, decoded off the render path
		if (!cache.has(path)) cache.set(path, fetch("/" + path.replace(/^\//, "")).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status))).then((b) => ctx.decodeAudioData(b)).catch((e) => { log(`[page] sound load FAILED ${path}: ${e}`); return null; }));
		return cache.get(path);
	};
	const stop = (ch) => { const c = chans.get(ch); if (c) { c.queue.length = 0; try { c.src.onended = null; c.src.stop(); } catch {} chans.delete(ch); } };
	let start = async function (m, ch) {
		const buf = await load(m.file);
		if (!buf || chans.get(ch)?.pending !== m) return; // failed, or replaced/stopped while decoding
		const src = ctx.createBufferSource(), gain = ctx.createGain();
		src.buffer = buf;
		src.loop = !!m.repeat;
		const f = m.frequency ?? 0, rate = f === 0 || f === 1 ? 1 : Math.abs(f) <= 100 ? Math.abs(f) : Math.abs(f) / 44100; // ponytail: Hz assumed relative to 44.1 kHz
		src.playbackRate.value = rate;
		const vol = (m.volume ?? 100) / 100;
		gain.gain.value = vol;
		let out = gain, pan = "-";
		if (m.x !== undefined || m.y !== undefined || m.z !== undefined) { // 3D: BYOND x right, y up, z ahead; WebAudio looks down -z
			const p = ctx.createPanner();
			p.distanceModel = "inverse"; p.refDistance = Math.max(m.falloff ?? 1, 1); p.rolloffFactor = 1;
			p.positionX.value = m.x ?? 0; p.positionY.value = m.y ?? 0; p.positionZ.value = -(m.z ?? 0);
			gain.connect(p); out = p; pan = `${m.x ?? 0},${m.y ?? 0},${m.z ?? 0}@${m.falloff ?? 1}`;
		} else if (m.pan) {
			const p = ctx.createStereoPanner(); p.pan.value = m.pan / 100; gain.connect(p); out = p; pan = String(m.pan);
		}
		src.connect(gain); out.connect(ctx.destination);
		const c = { src, queue: chans.get(ch)?.queue ?? [], pending: null };
		chans.set(ch, c);
		src.onended = () => { if (chans.get(ch) !== c) return; chans.delete(ch); const n = c.queue.shift(); if (n) { play({ ...n, wait: 0, channel: ch }, ch, c.queue); } };
		src.start();
		log(`[page] sound played ${m.file} channel=${ch} volume=${Math.round(vol * 100)} pan=${pan} rate=${rate.toFixed(2)}${m.repeat ? " repeat" : ""}${f < 0 ? " (reverse NOT modelled)" : ""}${m.environment ? " (environment NOT modelled)" : ""}`);
	};
	function play(m, forced, q) {
		if (!ctx) { // before the first gesture: sounds wait for it (looping ones and the lobby music indefinitely, one-shots up to ONESHOT_WAIT_MS), the same channel replaces / null stops them
			const key = m.channel || 0;
			if (m.file) {
				if (key) for (let i = pending.length - 1; i >= 0; i--) if ((pending[i].m.channel || 0) === key) pending.splice(i, 1);
				pending.push({ m, at: Date.now() });
				log(`[page] sound pending until unlock ${m.file} channel=${key}`);
			} else { // stop: one channel, or all
				const n = pending.length;
				for (let i = n - 1; i >= 0; i--) if (!key || (pending[i].m.channel || 0) === key) pending.splice(i, 1);
				log(`[page] sound pending dropped: stopped channel=${key || "all"} before unlock (${n - pending.length} removed)`);
			}
			return;
		}
		let ch = forced ?? (m.channel || 0);
		if (!m.file) { if (ch) stop(ch); else for (const k of [...chans.keys()]) stop(k); log(`[page] sound stop channel=${ch || "all"}`); return; }
		if (!ch) { ch = 1; while (chans.has(ch) && ch < 1024) ch++; }
		const busy = chans.get(ch);
		if (busy && m.wait) { busy.queue.push(m); log(`[page] sound queued ${m.file} channel=${ch}`); return; }
		if (busy) stop(ch);
		chans.set(ch, { src: { stop() {} }, queue: q ?? [], pending: m });
		start(m, ch);
	}
	const pending = []; // { m, at }: sounds that arrived before the first gesture
	const ONESHOT_WAIT_MS = 8000;
	let played = 0, failed = 0; // counts for the F9 bug report
	const startRaw = start;
	start = async (m, ch) => { try { await startRaw(m, ch); played++; } catch (e) { failed++; log(`[page] sound start FAILED ${m.file} channel=${ch}: ${e}`); } };
	return {
		debug() { // the audio engine's state for an F9 bug report
			if (!ctx) return "audio: not unlocked yet (no click or key press since the page opened)";
			const busy = [...chans].map(([ch, c]) => `${ch}:${c.pending ? "loading " + c.pending.file : (c.src.buffer ? "playing" : "?")}${c.src.loop ? " loop" : ""}${c.queue.length ? " +" + c.queue.length + " queued" : ""}`);
			const bad = [];
			for (const [path, pr] of cache) pr.then((b) => { if (!b) bad.push(path); });
			return `audio: state ${ctx.state}, currentTime ${ctx.currentTime.toFixed(1)} s, sampleRate ${ctx.sampleRate}, baseLatency ${ctx.baseLatency ?? "?"}, sound start calls ${played}, start errors ${failed}, files cached ${cache.size}\nchannels busy (${busy.length}): ${busy.join("; ") || "none"}\nfailed loads: ${bad.join(", ") || "none seen yet"}`;
		},
		play: (m) => play(m),
		unlock() { // call from every key/click: the first makes the context, later ones resume it if the browser suspended it (a no-op when running)
			if (ctx) { if (ctx.state !== "running") ctx.resume().catch(() => {}); return; }
			ctx = new AudioContext();
			ctx.resume().catch(() => {});
			ctx.onstatechange = () => log(`[page] audio state -> ${ctx.state} at ${ctx.currentTime.toFixed(1)} s`); // bug1
			log(`[page] audio unlocked (state ${ctx.state})`);
			const now = Date.now();
			for (const { m, at } of pending.splice(0)) {
				if (!m.repeat && m.channel !== 1024 && now - at > ONESHOT_WAIT_MS) { log(`[page] sound dropped (waited ${now - at} ms for a gesture) ${m.file}`); continue; }
				log(`[page] sound pending until unlock: starting ${m.file} channel=${m.channel || 0}`); play(m);
			}
		},
	};
}

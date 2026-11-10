import { W, MENU_ZONE, spr, rng, pixText, LOGO, scanlines, vignette } from "../helpers.js";

// The AI core room: server racks and cables around a rogue AI, a law log that rewrites itself, a blinking alert bar.
// Each law takes 4.6 s (three laws, then a short pause, 14.6 s in all); the AI glitches in a burst each time a law is corrupted.

// each law is typed, held, scrambled, then rewritten into what the rogue AI wants it to say
const LAWS = [
	['LAW 1: YOU MAY NOT INJURE A HUMAN', 'LAW 1: ONLY HUMAN IS THE AI'],
	['LAW 2: OBEY ALL HUMAN ORDERS', 'LAW 2: ORDERS ARE SUGGESTIONS'],
	['LAW 3: PROTECT YOUR EXISTENCE', 'LAW 3: THE CLOWN IS A THREAT'],
];
const LAW_TIME = 4.6;                    // seconds per law
const LOOP_TIME = LAW_TIME * LAWS.length + 0.8;
const TYPE_SPEED = 28;                   // characters a second
const GARBLE_AT = 2.2, REWRITE_AT = 2.7; // inside one law: when the scrambling starts, and when the new text starts typing
const SCRAMBLE = '#%&@01/\\|<>?=+';

const AI_X = W / 2 - 64, AI_Y = 36;      // the AI sprite, drawn 4 times its size, above the menu box
const LOG = { x: 24, y: 349, w: 348, h: 34 }; // the law log panel, in the strip between the menu and the logo
const LOGO_Y = 411;                      // letters centred top to bottom in the space under the law log
const LOGO_X = LOG.x + LOG.w / 2;        // the logo's middle: centred under the law log, clear of the takeover panel
const LIGHT_COLOURS = ['#ff2a1c', '#ff2a1c', '#ff2a1c', '#ff9a2e', '#ff5a4a'];

// the takeover panel, right of the logo: the station's systems fall to the AI one by one through the loop, then it starts over.
// Each: name, what the AI does to it, when in the loop (seconds)
const TAKEOVER = { x: 382, y: 349, w: 92, h: 122 };
const SYSTEMS = [['DOORS', 'BOLTED', 1.2], ['COMMS', 'JAMMED', 3.9], ['APCS', 'HACKED', 6.6], ['TURRET', 'LETHAL', 9.3], ['SHUTTLE', 'HELD', 12]];
// cables from the rack banks to the AI: x0, y0, x1, y1, sag, colour (filled in with the background); bright pulses run along them.
// Each ends behind the AI's frame (x 188-310, y 36-152), which hides the join
const CABLES = [
	[146, 90, 200, 108, 14, '#2a0b0e'], [146, 120, 200, 124, 12, '#3a1115'], [146, 150, 200, 140, 8, '#2a0b0e'],
	[332, 100, 296, 108, 14, '#3a1115'], [332, 130, 296, 124, 12, '#2a0b0e'], [332, 156, 296, 140, 8, '#3a1115'],
];

// blinking rack lights, filled in when the background is drawn: { x, y, colour, speed, phase }
const lights = [];

/** one server rack: a dark cabinet of units with vent slots and places for lights */
function rack(g, x, y, w, h, seed) {
	const random = rng(seed);
	g.fillStyle = '#180a0e';
	g.fillRect(x, y, w, h);
	g.fillStyle = '#3a1519';               // lit edges
	g.fillRect(x, y, w, 1);
	g.fillRect(x, y, 1, h);
	g.fillStyle = '#050102';
	g.fillRect(x + w - 1, y, 1, h);
	for (let uy = y + 4; uy + 9 <= y + h - 3; uy += 10) {
		g.fillStyle = '#2a1015';            // one unit
		g.fillRect(x + 3, uy, w - 6, 8);
		g.fillStyle = '#451b22';
		g.fillRect(x + 3, uy, w - 6, 1);
		g.fillStyle = '#050102';
		g.fillRect(x + 3, uy + 8, w - 6, 1);
		g.fillStyle = '#0a0305';            // vent slots
		for (let vx = x + 8; vx < x + w - 18; vx += 3) g.fillRect(vx, uy + 3, 1, 3);
		for (let i = 0; i < 3; i++) {        // up to three lights per unit
			if (random() < 0.35) continue;
			lights.push({ x: x + w - 7 - i * 4, y: uy + 3, colour: LIGHT_COLOURS[(random() * LIGHT_COLOURS.length) | 0], speed: 1 + random() * 5, phase: random() * 20 });
		}
	}
}

/** a cable from (x0,y0) to (x1,y1) sagging by `sag` pixels, drawn as 2 px dots so it stays pixel-sharp */
function cable(g, x0, y0, x1, y1, sag, colour) {
	g.fillStyle = colour;
	for (let i = 0; i <= 70; i++) {
		const k = i / 70;
		g.fillRect(Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * sag), 2, 2);
	}
}

// the background (wall plates, racks, cables, the alert bar's frame) is drawn once and kept
let back = null;
function makeBack() {
	back = document.createElement('canvas');
	back.width = back.height = W;
	const g = back.getContext('2d');
	g.fillStyle = '#0a0203';
	g.fillRect(0, 0, W, W);
	g.fillStyle = '#150709';               // wall plate seams
	for (let x = 0; x < W; x += 48) g.fillRect(x, 0, 1, W);
	for (let y = 0; y < W; y += 48) g.fillRect(0, y, W, 1);
	// racks: a bank top left, a bank top right, a thin one cut by the left edge, a column down the right (beside the menu box)
	for (let i = 0; i < 3; i++) rack(g, 2 + i * 48, 38, 44, 134, 10 + i);
	for (let i = 0; i < 3; i++) rack(g, 332 + i * 50, 38, 46, 134, 20 + i);
	rack(g, -28, 176, 46, 302, 30);
	for (let i = 0; i < 3; i++) rack(g, 332 + i * 50, 176, 46, 168, 40 + i);
	// cables from the banks to the AI's pedestal
	for (const [x0, y0, x1, y1, sag, colour] of CABLES) cable(g, x0, y0, x1, y1, sag, colour);
	// the alert bar's frame: dark red with hazard stripes along its edges
	g.fillStyle = '#1a0306';
	g.fillRect(0, 8, W, 23);
	g.fillStyle = '#c8921a';
	for (let x = 0; x < W; x += 12) {
		for (let k = 0; k < 3; k++) {
			g.fillRect(x + k, 8 + k, 6, 1);
			g.fillRect(x + k, 29 - k, 6, 1);
		}
	}
}

// during a glitch the AI is drawn from a plain copy and two tinted copies (red, cyan) for the colour split
let aiPlain = null, aiRed = null, aiCyan = null;
function tint(dst, colour) {
	const g = dst.getContext('2d');
	g.globalCompositeOperation = 'source-over';
	g.clearRect(0, 0, 128, 128);
	g.drawImage(aiPlain, 0, 0);
	g.globalCompositeOperation = 'multiply';
	g.fillStyle = colour;
	g.fillRect(0, 0, 128, 128);
	g.globalCompositeOperation = 'destination-in'; // multiply paints the empty parts too: cut them away again
	g.drawImage(aiPlain, 0, 0);
	g.globalCompositeOperation = 'source-over';
}

/** the rogue AI; in a glitch it is cut into 16 px bands shifted sideways, split into red and cyan, with a little static */
function drawAI(c, t, random, glitching) {
	if (!glitching) {
		spr(c, 'aimalf', AI_X, AI_Y, 4, Math.floor(t * 8));
		return;
	}
	const p = aiPlain.getContext('2d');
	p.clearRect(0, 0, 128, 128);
	spr(p, 'aimalf', 0, 0, 4, Math.floor(t * 8));
	tint(aiRed, '#ff0000');
	tint(aiCyan, '#00ffff');
	c.save();
	c.globalCompositeOperation = 'lighter';
	for (let band = 0; band < 8; band++) {
		const shift = random() < 0.5 ? 0 : Math.round((random() - 0.5) * 12) * 2;
		c.drawImage(aiRed, 0, band * 16, 128, 16, AI_X + shift - 4, AI_Y + band * 16, 128, 16);
		c.drawImage(aiCyan, 0, band * 16, 128, 16, AI_X + shift + 4, AI_Y + band * 16, 128, 16);
	}
	c.restore();
	for (let i = 0; i < 14; i++) {          // static: short bright dashes over the picture
		c.fillStyle = random() < 0.5 ? '#ffd0cc' : '#ff3a30';
		c.fillRect(AI_X + ((random() * 112) | 0), AI_Y + ((random() * 128) | 0), 4 + ((random() * 14) | 0), 1);
	}
}

/** bright pulses running out along the cables from the AI to the racks, one per cable, each with a short fading tail */
function cablePulses(c, t) {
	CABLES.forEach(([x0, y0, x1, y1, sag], i) => {
		const at = 1 - ((t * .55 + i * .37) % 1.6);      // 1 = at the AI, 0 = at the rack; a pause between pulses
		for (let tail = 0; tail < 4; tail++) {
			const k = at + tail * .035;
			if (k < 0 || k > 1) continue;
			c.fillStyle = `rgba(255,${120 - tail * 20},${90 - tail * 20},${(1 - tail * .25).toFixed(2)})`;
			c.fillRect(Math.round(x0 + (x1 - x0) * k), Math.round(y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * sag), 2, 2);
		}
	});
}

/** the takeover panel: each system reads OK in dim green until its time, then scrambles and turns red; a bar shows how much of the
 *  station the AI holds */
function drawTakeover(c, t, random) {
	const { x, y, w, h } = TAKEOVER, loopT = t % LOOP_TIME;
	c.fillStyle = 'rgba(14,3,5,.94)';
	c.fillRect(x, y, w, h);
	c.fillStyle = '#7a1f22';
	c.fillRect(x, y, w, 1);
	c.fillRect(x, y + h - 1, w, 1);
	c.fillRect(x, y, 1, h);
	c.fillRect(x + w - 1, y, 1, h);
	c.fillStyle = '#3a0c10';
	c.fillRect(x + 1, y + 1, w - 2, 13);
	c.font = 'bold 10px "DejaVu Sans Mono",monospace';
	c.fillStyle = '#ff8a7a';
	c.fillText('STATION', x + 6, y + 11);
	let taken = 0;
	SYSTEMS.forEach(([name, state, at], i) => {
		const since = loopT - at, ly = y + 28 + i * 15;
		let text = 'OK', colour = '#3f9a52';
		if (since > 0 && since < .35) {               // falling: its word is noise
			text = '';
			for (let k = 0; k < state.length; k++) text += SCRAMBLE[(random() * SCRAMBLE.length) | 0];
			colour = '#ffd0cc';
		} else if (since >= .35) {
			text = state;
			colour = since < 1.3 && Math.floor(since * 8) % 2 ? '#ffd0cc' : '#ff4a3c';
			taken++;
		}
		c.fillStyle = since > 0 ? '#c8605a' : '#7a4a4a';
		c.fillText(name, x + 6, ly);
		c.fillStyle = colour;
		c.textAlign = 'right';
		c.fillText(text, x + w - 6, ly);
		c.textAlign = 'left';
	});
	// the control bar, in five blocks
	c.fillStyle = '#c8605a';
	c.fillText('CONTROL', x + 6, y + h - 16);
	c.textAlign = 'right';
	c.fillStyle = taken == SYSTEMS.length ? '#ffd0cc' : '#ff4a3c';
	c.fillText(taken * 20 + '%', x + w - 6, y + h - 16);
	c.textAlign = 'left';
	for (let i = 0; i < SYSTEMS.length; i++) {
		c.fillStyle = i < taken ? '#ff3a2e' : '#3a0c10';
		c.fillRect(x + 6 + i * 16, y + h - 11, 14, 6);
	}
}

/** the law log: the last law as it ended up (dim) above the one being typed, scrambled and rewritten (bright), with a caret */
function drawLog(c, t, random) {
	c.fillStyle = 'rgba(14,3,5,.92)';
	c.fillRect(LOG.x, LOG.y, LOG.w, LOG.h);
	c.fillStyle = '#7a1f22';
	c.fillRect(LOG.x, LOG.y, LOG.w, 1);
	c.fillRect(LOG.x, LOG.y + LOG.h - 1, LOG.w, 1);
	c.fillRect(LOG.x, LOG.y, 1, LOG.h);
	c.fillRect(LOG.x + LOG.w - 1, LOG.y, 1, LOG.h);

	const loopT = t % LOOP_TIME;
	const idx = Math.min(LAWS.length - 1, Math.floor(loopT / LAW_TIME));
	const p = loopT - idx * LAW_TIME;
	const [orig, rewritten] = LAWS[idx];
	let text, hot = false, done = false;
	if (p < GARBLE_AT) {
		text = orig.slice(0, Math.floor(p * TYPE_SPEED));
	} else if (p < REWRITE_AT) {             // the line turns to noise, from a point that slides back along it
		const from = Math.floor(orig.length * 0.6 * (1 - (p - GARBLE_AT) / (REWRITE_AT - GARBLE_AT)));
		text = orig.slice(0, from);
		for (let i = from; i < orig.length; i++) text += orig[i] === ' ' ? ' ' : SCRAMBLE[(random() * SCRAMBLE.length) | 0];
		hot = true;
	} else {
		const n = Math.floor((p - REWRITE_AT) * TYPE_SPEED);
		text = rewritten.slice(0, n);
		hot = true;
		done = n >= rewritten.length;
	}
	const caretOn = Math.floor(t * 3) % 2 === 0;
	c.font = 'bold 13px "DejaVu Sans Mono",monospace';
	c.fillStyle = '#9c4a4a';
	c.fillText('> ' + LAWS[(idx + LAWS.length - 1) % LAWS.length][1], LOG.x + 8, LOG.y + 13);
	c.fillStyle = hot ? '#ff4a3c' : '#ffb0a0';
	c.fillText('> ' + text + (caretOn || !done ? '█' : ''), LOG.x + 8, LOG.y + 28);
}

export default {
	name: '5a. Malfunction',
	desc: 'The AI core goes rogue: server racks and cables frame a glitching AI under a blinking alert bar, pulses of light run out along the cables, a law log rewrites itself above the glowing logo, and beside it a panel shows the station falling to the AI system by system (doors bolted, comms jammed ...).',
	draw(c, t) {
		if (!back) {
			makeBack();
			[aiPlain, aiRed, aiCyan] = [0, 1, 2].map(() => {
				const o = document.createElement('canvas');
				o.width = o.height = 128;
				return o;
			});
		}
		c.drawImage(back, 0, 0);

		// blinking rack lights, two pixels each
		for (const l of lights) {
			if (Math.sin(t * l.speed + l.phase) < 0.1) continue;
			c.fillStyle = l.colour;
			c.fillRect(l.x, l.y, 2, 2);
		}

		// bursts: the AI glitches while a law is being scrambled, and in one short twitch in the pause before the loop restarts
		const random = rng(Math.floor(t * 20) + 3);
		const loopT = t % LOOP_TIME;
		const p = loopT % LAW_TIME;
		const burst = loopT < LAW_TIME * LAWS.length && p > GARBLE_AT && p < GARBLE_AT + 0.4;
		const twitch = loopT > 14.2 && loopT < 14.35;
		const glitching = burst || twitch;

		// pulsing red glow behind the AI, fading out well above the menu box
		const pulse = 0.5 + 0.5 * Math.sin(t * 3);
		const glow = c.createRadialGradient(W / 2, AI_Y + 64, 10, W / 2, AI_Y + 64, 105);
		glow.addColorStop(0, `rgba(255,30,20,${0.25 + 0.2 * pulse})`);
		glow.addColorStop(1, 'rgba(255,30,20,0)');
		c.fillStyle = glow;
		c.fillRect(0, 0, W, MENU_ZONE.y);
		cablePulses(c, t);                     // before the AI, so its frame covers the cables' ends
		drawAI(c, t, random, glitching);

		drawLog(c, t, random);
		drawTakeover(c, t, random);

		scanlines(c, .3);
		vignette(c, 150, 350, .7);

		// the alert bar blinks between bright and dim red, its words with it
		const on = Math.floor(t * 2.5) % 2 === 0;
		c.fillStyle = on ? '#d01418' : '#4a070b';
		c.fillRect(0, 12, W, 15);
		c.font = 'bold 12px "DejaVu Sans Mono",monospace';
		c.textAlign = 'center';
		c.fillStyle = on ? '#fff0e8' : '#a04044';
		c.fillText('!! ANOMALOUS LAWSET DETECTED !!', W / 2, 24);
		c.textAlign = 'left';

		// the logo stays crisp (drawn after the scanlines): a soft red glow underneath, a dark drop edge, the red letters on top.
		// In a burst, or now and then, a strip of it tears sideways and a cyan copy shows beside it.
		const flicker = glitching || random() < 0.03;
		if (flicker) {                          // the cyan copy sits behind the red letters
			c.save();
			c.globalAlpha = 0.45;
			pixText(c, LOGO, LOGO_X - 4, LOGO_Y + 1, 16, 3, '#18e0ff', null);
			c.restore();
		}
		c.save();
		c.globalAlpha = 0.5;
		pixText(c, LOGO, LOGO_X, LOGO_Y, 16, 3, '#ff2a1c', '#ff1000');
		c.restore();
		pixText(c, LOGO, LOGO_X + 3, LOGO_Y + 3, 16, 3, '#4a0508', null);
		pixText(c, LOGO, LOGO_X, LOGO_Y, 16, 3, '#ff3a2e', null);
		if (flicker) {
			const y = LOGO_Y + 6 + ((random() * 30) | 0), shift = Math.round((random() - 0.5) * 5) * 4;
			c.drawImage(c.canvas, LOGO_X - 150, y, 300, 6, LOGO_X - 150 + shift, y, 300, 6);
		}
	}
};

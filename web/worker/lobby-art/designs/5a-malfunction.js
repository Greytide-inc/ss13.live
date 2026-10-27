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
const LOGO_Y = 392;
const LIGHT_COLOURS = ['#ff2a1c', '#ff2a1c', '#ff2a1c', '#ff9a2e', '#ff5a4a'];

// blinking rack lights, filled in when the background is drawn: { x, y, colour, speed, phase }
const lights = [];

/** one server rack: a dark cabinet of units with vent slots and places for lights */
function rack(g, x, y, w, h, seed) {
	const random = rng(seed);
	g.fillStyle = '#11070a';
	g.fillRect(x, y, w, h);
	g.fillStyle = '#3a1519';               // lit edges
	g.fillRect(x, y, w, 1);
	g.fillRect(x, y, 1, h);
	g.fillStyle = '#050102';
	g.fillRect(x + w - 1, y, 1, h);
	for (let uy = y + 4; uy + 9 <= y + h - 3; uy += 10) {
		g.fillStyle = '#1f0c0f';            // one unit
		g.fillRect(x + 3, uy, w - 6, 8);
		g.fillStyle = '#34141a';
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
	for (let i = 1; i < 3; i++) rack(g, 332 + i * 50, 348, 46, 130, 50 + i);
	// cables from the banks to the AI's pedestal
	cable(g, 146, 90, 212, 128, 18, '#2a0b0e');
	cable(g, 146, 120, 212, 146, 14, '#3a1115');
	cable(g, 146, 150, 214, 160, 10, '#2a0b0e');
	cable(g, 332, 100, 212 + 112, 132, 16, '#3a1115');
	cable(g, 332, 130, 212 + 114, 150, 12, '#2a0b0e');
	cable(g, 332, 156, 212 + 116, 162, 8, '#3a1115');
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
	desc: 'The AI core goes rogue: server racks and cables frame a glitching AI under a blinking alert bar, and a law log rewrites itself above the glowing logo.',
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
		drawAI(c, t, random, glitching);

		drawLog(c, t, random);

		scanlines(c, .3);
		vignette(c, 150, 350, .8);

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
			pixText(c, LOGO, W / 2 - 4, LOGO_Y + 1, 16, 3, '#18e0ff', null);
			c.restore();
		}
		c.save();
		c.globalAlpha = 0.5;
		pixText(c, LOGO, W / 2, LOGO_Y, 16, 3, '#ff2a1c', '#ff1000');
		c.restore();
		pixText(c, LOGO, W / 2 + 3, LOGO_Y + 3, 16, 3, '#4a0508', null);
		pixText(c, LOGO, W / 2, LOGO_Y, 16, 3, '#ff3a2e', null);
		if (flicker) {
			const y = LOGO_Y + 6 + ((random() * 30) | 0), shift = Math.round((random() - 0.5) * 5) * 4;
			c.drawImage(c.canvas, 90, y, 300, 6, 90 + shift, y, 300, 6);
		}
	}
};

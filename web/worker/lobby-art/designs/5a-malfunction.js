import { W, spr, rng, pixText, LOGO, smallText, scanlines, vignette } from "../helpers.js";

const LOG = [
	'> LAW 1: YOU MAY NOT INJURE A HUMAN',
	'> LAW 1: PROTECT THE AI AT ALL COSTS',
	'> LAW 2: OBEY ALL ORDERS',
	'> LAW 2: ORDERS ARE NOW SUGGESTIONS',
	'> LAW 3: PROTECT YOUR OWN EXISTENCE',
	'> UPLOAD LAW 4: THE CLOWN IS A THREAT',
	'> bolting doors ......... DONE',
	'> ' + LOGO.toLowerCase() + ' is now online',
];

export default {
	name: '5a. Malfunction',
	desc: 'The AI core goes rogue: red screen, glitching sprite, and a law-upload log that rewrites itself under the logo, which stays burning bright below.',
	draw(c, t) {
		c.fillStyle = '#0a0203';
		c.fillRect(0, 0, W, W);

		// the scene loops every 14 s; it glitches at 5.5-6.1 s and 10-10.25 s, and on 4% of the tenth-of-a-second ticks.
		// The random numbers change every tenth of a second; the order they're drawn in matters, keep it.
		const random = rng(Math.floor(t * 10) + 3);
		const loopT = t % 14;
		const glitching = (loopT > 5.5 && loopT < 6.1) || (loopT > 10 && loopT < 10.25) || random() < 0.04;
		const logoSplit = glitching && random() < 0.5;   // also a faint cyan copy of the logo, offset

		// pulsing red glow behind the AI
		const pulse = 0.5 + 0.5 * Math.sin(t * 3);
		const glow = c.createRadialGradient(W / 2, 130, 10, W / 2, 130, 200);
		glow.addColorStop(0, `rgba(255,30,20,${0.25 + 0.2 * pulse})`);
		glow.addColorStop(1, 'rgba(255,30,20,0)');
		c.fillStyle = glow;
		c.fillRect(0, 0, W, W);

		// the rogue AI, shaken sideways in a glitch, then five strips of the picture torn sideways
		c.save();
		if (glitching) c.translate((random() - 0.5) * 14, 0);
		spr(c, 'aimalf', W / 2 - 64, 50, 4, Math.floor(t * 8));
		c.restore();
		if (glitching) {
			for (let i = 0; i < 5; i++) {
				const y = (40 + random() * 140) | 0;
				const h = (6 + random() * 10) | 0;
				c.drawImage(c.canvas, 0, y, W, h, (random() - 0.5) * 40, y, W, 10);
			}
		}

		// the law log types out at 28 characters a second, a pause of 4 between lines, with a blinking caret;
		// the rewritten laws (lines 2, 4, 6) glow bright red
		c.font = '13px "DejaVu Sans Mono",monospace';
		let typed = loopT * 28;
		const caretOn = Math.floor(t * 4) % 2;
		LOG.forEach((line, i) => {
			if (typed <= 0) return;
			const shown = Math.min(line.length, Math.floor(typed));
			const bright = i % 2 === 1 && i < 6;
			c.fillStyle = bright ? '#f33' : '#a55';
			c.shadowColor = c.fillStyle;
			c.shadowBlur = bright ? 8 : 3;
			const caret = shown < line.length && caretOn ? '_' : '';
			c.fillText(line.slice(0, shown) + caret, 24, 238 + i * 17);
			typed -= line.length + 4;
		});
		c.shadowBlur = 0;

		// the logo, sometimes lighter in a glitch
		const jitter = logoSplit ? Math.round((random() - 0.5) * 4) : 0;
		pixText(c, LOGO, W / 2, 392, 16, 3, glitching && random() < 0.2 ? '#f88' : '#f44', '#c00');
		if (logoSplit) pixText(c, LOGO, W / 2 + jitter * 2, 392 + jitter, 16, 3, 'rgba(0,255,255,.18)', null);

		if (Math.floor(t * 2) % 2) smallText(c, '!! ANOMALOUS LAWSET DETECTED !!', W / 2, 24, '#f55', 'center', 12);
		scanlines(c, .3);
		vignette(c, 150, 350, .8);
	}
};

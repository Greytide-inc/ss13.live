import { W, spr, pixText, LOGO, scanlines, vignette } from "../helpers.js";

const GREEN = '#3f6';
const LOG = [
	'NANOTRASEN STATION OS v13.2558',
	'> checking crew manifest ...... OK',
	'> plasma levels .......... NOMINAL',
	'> clown containment ......... FAIL',
	'> ian ........................ :)',
	'> uplink: ' + LOGO.toLowerCase(),
	'> welcome aboard, crewmember.',
];

export default {
	name: '5. AI terminal',
	desc: 'Green-screen boot log typed out by the station AI under the logo, which is always on screen. Nerdy and calm.',
	draw(c, t) {
		c.fillStyle = '#020a04';
		c.fillRect(0, 0, W, W);

		// the boot log types out at 24 characters a second, a pause of 6 between lines, starting over every 16 s;
		// a blinking block cursor follows the line being typed
		c.font = '13px "DejaVu Sans Mono",monospace';
		c.fillStyle = GREEN;
		c.shadowColor = GREEN;
		c.shadowBlur = 6;
		let typed = (t % 16) * 24;
		const cursorOn = Math.floor(t * 3) % 2;
		LOG.forEach((line, i) => {
			if (typed <= 0) return;
			const shown = Math.min(line.length, Math.floor(typed));
			const cursor = shown < line.length && cursorOn ? '█' : '';
			c.fillText(line.slice(0, shown) + cursor, 28, 236 + i * 20);
			typed -= line.length + 6;
		});
		c.shadowBlur = 0;

		spr(c, 'ai', W / 2 - 48, 40, 3, Math.floor(t * 8));
		pixText(c, LOGO, W / 2, 390, 16, 3, '#6f8', '#2c4');
		scanlines(c, .28);
		vignette(c, 150, 360, .75);
	}
};

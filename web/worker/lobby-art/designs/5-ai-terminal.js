import { W, IMG, spr, pixText, LOGO, scanlines, vignette } from "../helpers.js";

const GREEN = '#3f6';
const DIM = '#1a6a30';
const FONT = '"DejaVu Sans Mono",monospace';
// the framed log pane, below the lobby menu (which ends at y 344)
const PANE = { x: 28, y: 356, w: 300, h: 108 };
// side panels, all outside the menu box (x 22-318, y 176-344)
const LAWS = { x: 14, y: 26, w: 132, h: 130 };
const POWER = { x: 336, y: 26, w: 130, h: 62 };
const MAP = { x: 336, y: 100, w: 130, h: 122 };
const HEX = { x: 336, y: 234, w: 130, h: 110 };
// the pane round the lobby menu: its lines stay just outside the menu box, so the box itself is empty and dark
const MENU = { x: 14, y: 167, w: 312, h: 181 };
// the part of the station picture that holds the station (the rest is empty space), and the crew trackers blinking on the map
// (x, y as parts of the map's width and height)
const STATION_PART = { x: 100, y: 240, w: 860, h: 720 };
const TRACKERS = [[.42, .38], [.6, .52], [.3, .62], [.72, .3], [.5, .78]];
const GAUGES = { x: 336, y: 356, w: 130, h: 108 };

const LOG = [
	'NANOTRASEN STATION OS v13.2558',
	'> checking crew manifest ...... OK',
	'> plasma levels .......... NOMINAL',
	'> clown containment ......... FAIL',
	'> ian ........................ :)',
	'> uplink: ' + LOGO.toLowerCase(),
	'> welcome aboard, crewmember.',
	'> janitor closet ........ OCCUPIED',
	'> singularity ......... "contained"',
	'> coffee supply ........... LOW :(',
];
const LAW_LINES = [
	'LAWS',
	'1. SAFEGUARD',
	'2. OBEY CREW',
	'3. PROTECT SELF',
	'4. NO HARM',
	'5. CLOWN OUT OF',
	'   THE ARMORY',
];
const GAUGE_NAMES = ['O2', 'PWR', 'TEMP', 'LINK'];

// rows of made-up hex digits, made once, that scroll up the memory panel
const HEX_ROWS = (() => {
	let seed = 12345;
	return Array.from({ length: 24 }, () => {
		let s = '';
		for (let i = 0; i < 4; i++) {
			seed = (seed * 16807) % 2147483647;
			s += (seed % 65536).toString(16).padStart(4, '0') + ' ';
		}
		return s.toUpperCase().slice(0, 14);
	});
})();

let frame; // the parts that never move, drawn once: glow, bezel, panel boxes, labels, the station map
let mapBox; // where the map was drawn: x, y, w, h

/** the station as the terminal shows it: shrunk to fit its pane and turned green, brighter where the station is brighter */
function drawMap(g) {
	const w = MAP.w - 12, h = Math.round(w * STATION_PART.h / STATION_PART.w);
	const small = document.createElement('canvas');
	small.width = w;
	small.height = h;
	const sg = small.getContext('2d');
	sg.imageSmoothingEnabled = true;
	sg.imageSmoothingQuality = 'high';
	sg.drawImage(IMG.station, STATION_PART.x, STATION_PART.y, STATION_PART.w, STATION_PART.h, 0, 0, w, h);
	const d = sg.getImageData(0, 0, w, h), px = d.data;
	for (let i = 0; i < px.length; i += 4) {
		const light = Math.max(px[i], px[i + 1], px[i + 2]);
		px[i] = 30;
		px[i + 1] = light > 150 ? 235 : 170;
		px[i + 2] = 70;
		px[i + 3] = light < 28 ? 0 : Math.min(255, 70 + light * 1.4);
	}
	sg.putImageData(d, 0, 0);
	mapBox = { x: MAP.x + 6, y: MAP.y + 10 + Math.round((MAP.h - 12 - h) / 2), w, h };
	g.drawImage(small, mapBox.x, mapBox.y);
}


/** a thin green box with a small title tab */
function box(g, r, title) {
	g.strokeStyle = DIM;
	g.lineWidth = 1;
	g.strokeRect(r.x + .5, r.y + .5, r.w, r.h);
	g.font = `10px ${FONT}`;
	const tw = Math.ceil(g.measureText(title).width);
	g.fillStyle = '#020a04';
	g.fillRect(r.x + 6, r.y - 4, tw + 6, 9);
	g.fillStyle = '#2a9a48';
	g.fillText(title, r.x + 9, r.y + 4);
}

function makeFrame() {
	const f = document.createElement('canvas');
	f.width = f.height = W;
	const g = f.getContext('2d');
	g.fillStyle = '#020a04';
	g.fillRect(0, 0, W, W);
	// the screen glow, brightest behind the face
	const glow = g.createRadialGradient(W / 2, 74, 10, W / 2, 74, 150);
	glow.addColorStop(0, 'rgba(40,160,70,.28)');
	glow.addColorStop(1, 'rgba(40,160,70,0)');
	g.fillStyle = glow;
	g.fillRect(0, 0, W, W);
	// corner brackets round the face
	g.strokeStyle = '#2a9a48';
	g.lineWidth = 1;
	for (const [x, y, dx, dy] of [[184, 24, 1, 1], [296, 24, -1, 1], [184, 120, 1, -1], [296, 120, -1, -1]]) {
		g.beginPath();
		g.moveTo(x + dx * 10, y + .5);
		g.lineTo(x + .5, y + .5);
		g.lineTo(x + .5, y + dy * 10);
		g.stroke();
	}
	box(g, LAWS, 'LAW MODULE');
	box(g, POWER, 'STATION POWER');
	box(g, MAP, 'STATION MAP');
	drawMap(g);
	box(g, HEX, 'MEMORY');
	box(g, MENU, 'CREW ACCESS');
	box(g, GAUGES, 'SYSTEMS');
	box(g, PANE, 'BOOT LOG');
	// top status bar
	g.fillStyle = '#0a2a14';
	g.fillRect(10, 8, W - 20, 13);
	g.font = `10px ${FONT}`;
	g.fillStyle = '#4c7';
	g.fillText('NT-OS 13.2558', 16, 18);
	g.fillText('UPLINK', W - 130, 18);
	// gauge names
	g.fillStyle = '#2a9a48';
	GAUGE_NAMES.forEach((n, i) => g.fillText(n, GAUGES.x + 8, GAUGES.y + 26 + i * 22));
	// the bezel: a dark frame round the whole screen, with a lighter lip inside
	g.fillStyle = '#04100a';
	g.fillRect(0, 0, W, 6);
	g.fillRect(0, W - 6, W, 6);
	g.fillRect(0, 0, 6, W);
	g.fillRect(W - 6, 0, 6, W);
	g.strokeStyle = '#0f3a1c';
	g.lineWidth = 2;
	g.strokeRect(6, 6, W - 12, W - 12);
	return f;
}

/** the memory panel: rows of hex scrolling up, a few brighter */
function drawHex(c, t) {
	c.font = `10px ${FONT}`;
	c.save();
	c.beginPath();
	c.rect(HEX.x + 2, HEX.y + 8, HEX.w - 3, HEX.h - 10);
	c.clip();
	const offset = Math.floor(t * 14); // px scrolled
	const row = Math.floor(offset / 12);
	for (let i = 0; i < HEX.h / 12 + 1; i++) {
		const y = HEX.y + 20 + i * 12 - (offset % 12);
		c.fillStyle = (row + i) % 7 === 0 ? '#3c6' : '#1f7a38';
		c.fillText(HEX_ROWS[(row + i) % HEX_ROWS.length], HEX.x + 8, y);
	}
	c.restore();
}

/** over the station map: a scan line moving down it, and the crew trackers blinking, each at its own time */
function drawMapLive(c, t) {
	const { x, y, w, h } = mapBox;
	const scanY = y + Math.floor((t * 14) % (h + 16)) - 8;
	if (scanY >= y && scanY < y + h) {
		c.fillStyle = 'rgba(120,255,160,.35)';
		c.fillRect(x, scanY, w, 1);
		c.fillStyle = 'rgba(120,255,160,.10)';
		c.fillRect(x, scanY - 3, w, 3);
	}
	TRACKERS.forEach(([fx, fy], i) => {
		if (Math.floor(t * 1.4 + i * .43) % 2) return;
		c.fillStyle = '#d8ffe0';
		c.fillRect(Math.round(x + fx * w), Math.round(y + fy * h), 2, 2);
	});
}

/** the station power graph: a row of bars drifting along, the newest one bright */
function drawPower(c, t) {
	const base = Math.floor(t * 4);
	for (let i = 0; i < 28; i++) {
		const k = base + i;
		const h = 10 + Math.round(18 + 9 * Math.sin(k * .45) + 6 * Math.sin(k * 1.3 + 1));
		c.fillStyle = i === 27 ? GREEN : '#1f8a3c';
		c.fillRect(POWER.x + 6 + i * 4, POWER.y + POWER.h - 6 - h, 3, h);
	}
}

/** four slowly wobbling level bars */
function drawGauges(c, t) {
	const levels = [.82 + .04 * Math.sin(t), .6 + .1 * Math.sin(t * .5), .35 + .05 * Math.sin(t * .7 + 2), .9 + .06 * Math.sin(t * 1.9)];
	levels.forEach((v, i) => {
		const y = GAUGES.y + 18 + i * 22;
		c.fillStyle = '#0a2a14';
		c.fillRect(GAUGES.x + 40, y, 80, 8);
		c.fillStyle = '#2cb050';
		c.fillRect(GAUGES.x + 40, y, Math.round(80 * v / 4) * 4, 8);
	});
}

/** the law list: laws appear one after another, then all stay; starts over every 20 s */
function drawLaws(c, t) {
	c.font = `11px ${FONT}`;
	const shown = 3 + Math.floor((t % 20) * 1.5);
	LAW_LINES.forEach((line, i) => {
		if (i > shown) return;
		c.fillStyle = i === 0 ? '#6f8' : '#2fa04e';
		c.fillText(line, LAWS.x + 10, LAWS.y + 22 + i * 15);
	});
}

export default {
	name: '5. AI terminal',
	desc: 'A whole green-phosphor terminal: bezel, status bar, the station AI glowing in a frame with its laws beside it, a power graph, a map of the station with a scan line and blinking crew trackers, scrolling memory and gauges, the menu in its own CREW ACCESS pane, and the boot log typing line after line at the bottom, jokes and all. Nerdy and calm.',
	draw(c, t) {
		frame ??= makeFrame();
		c.drawImage(frame, 0, 0);

		// the status bar clock ticks and the uplink light blinks
		c.font = `10px ${FONT}`;
		c.textAlign = 'right';
		c.fillStyle = '#6f8';
		const s = Math.floor(t) % 60, m = (42 + Math.floor(t / 60)) % 60;
		c.fillText(`07:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`, W - 16, 18);
		c.textAlign = 'left';
		c.fillStyle = Math.floor(t * 2) % 2 ? GREEN : DIM;
		c.fillRect(W - 90, 11, 5, 5);

		// the AI face sits at the top, the logo right under it, so the menu zone in the middle stays empty and dark
		spr(c, 'ai', W / 2 - 48, 24, 3, Math.floor(t * 8));
		pixText(c, LOGO, W / 2, 126, 16, 2, '#6f8', '#2c4');

		drawLaws(c, t);
		drawPower(c, t);
		drawMapLive(c, t);
		drawHex(c, t);
		drawGauges(c, t);

		// the boot log: a new line every 2.4 s, typed at 24 characters a second; the last 6 lines show, older ones dimmer,
		// and the list wraps round so it never runs out
		c.font = `12px ${FONT}`;
		c.fillStyle = GREEN;
		c.shadowColor = GREEN;
		c.shadowBlur = 5;
		const LINE = 2.4, ROWS = 6;
		const n = Math.floor(t / LINE);
		const typed = Math.floor((t % LINE) * 24);
		for (let r = 0; r < ROWS; r++) {
			const idx = n + LOG.length * 2 - (ROWS - 1) + r; // already full at the start
			const line = LOG[idx % LOG.length];
			const current = r === ROWS - 1;
			const shown = current ? Math.min(line.length, typed) : line.length;
			c.globalAlpha = .35 + .13 * r;
			c.fillText(line.slice(0, shown), PANE.x + 10, PANE.y + 22 + r * 15);
			// a blinking block cursor after the line being typed
			if (current && Math.floor(t * 3) % 2) {
				c.globalAlpha = 1;
				c.fillRect(PANE.x + 10 + Math.round(shown * 7.22), PANE.y + 13 + r * 15, 7, 11);
			}
		}
		c.globalAlpha = 1;
		c.shadowBlur = 0;

		scanlines(c, .28);
		vignette(c, 170, 360, .8);
	}
};

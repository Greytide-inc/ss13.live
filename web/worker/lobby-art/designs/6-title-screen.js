import { W, IMG, MENU_ZONE, rng, pixText, LOGO, TAGLINE, smallText } from "../helpers.js";

// Three layers of stars, far to near. Each layer drifts left at its own speed (the parallax), and they get bigger and brighter as they get nearer.
const LAYERS = [
	{ count: 110, speed: 4, size: 1, alpha: .45 },
	{ count: 60, speed: 10, size: 1, alpha: .8 },
	{ count: 22, speed: 22, size: 2, alpha: 1 },
];
// star colours: mostly white, some pale blue, some pale yellow
const TINTS = ['255,255,255', '255,255,255', '175,205,255', '255,240,185'];
const random = rng(13);
const STARS = LAYERS.flatMap((layer, i) => Array.from({ length: layer.count }, () => ({
	layer: i, x: random() * W, y: random() * W, tint: TINTS[random() * TINTS.length | 0],
	twinkle: random() < .2 ? random() * 6 : -1, // only about one star in five twinkles
})));

const LOGO_TOP = 40, LOGO_H = 80;

// the station far off in the bottom-right corner, clear of the menu box: its middle and how wide it is drawn
const STATION = { x: 404, y: 404, size: 200 };
// its blinking lights: x, y from the station's middle, colour, seconds per blink, when in that time it lights
const BEACONS = [[-53, -37, '255,70,60', 2.4, 0], [46, 50, '255,70,60', 2.4, 1.2], [17, 78, '120,255,150', 3.2, .5], [-50, 37, '255,255,255', 1.6, .2], [77, 19, '255,255,255', 1.6, 1]];

let nebula = null, logoBase = null, logoFill = null, shine = null, station = null;

/** a dark, faint cloud of colour for depth; drawn once, and black over the menu box so the menu stays clear */
function buildNebula() {
	nebula = document.createElement('canvas');
	nebula.width = nebula.height = W;
	const g = nebula.getContext('2d');
	const blobs = [[380, 120, 190, '40,30,110'], [120, 430, 170, '20,60,100'], [440, 380, 150, '80,25,80'], [250, 40, 130, '25,45,110']];
	for (const [x, y, r, rgb] of blobs) {
		const grad = g.createRadialGradient(x, y, 0, x, y, r);
		grad.addColorStop(0, `rgba(${rgb},.24)`);
		grad.addColorStop(1, `rgba(${rgb},0)`);
		g.fillStyle = grad;
		g.fillRect(0, 0, W, W);
	}
	fadeOutOverMenu(g);
}

/** rub a layer out over the menu box, with a soft edge so no box shape shows */
function fadeOutOverMenu(g) {
	g.save();
	g.globalCompositeOperation = 'destination-out';
	g.filter = 'blur(14px)';
	g.fillRect(MENU_ZONE.x - 60, MENU_ZONE.y - 24, MENU_ZONE.w + 84, MENU_ZONE.h + 48);
	g.restore();
}

/** the station seen from far away, drawn once: the map shrunk, its black background cut away, dimmed to a cool grey-blue that is darker
 *  towards the bottom right (its night side), with a faint glow behind it */
function buildStation() {
	const { x, y, size } = STATION;
	const small = document.createElement('canvas');
	small.width = small.height = size;
	const sg = small.getContext('2d');
	sg.imageSmoothingEnabled = true;
	sg.imageSmoothingQuality = 'high';
	sg.drawImage(IMG.station, 0, 0, size, size);
	const d = sg.getImageData(0, 0, size, size), px = d.data;
	for (let i = 0; i < px.length; i += 4) px[i + 3] = Math.min(255, Math.max(px[i], px[i + 1], px[i + 2]) * 6);
	sg.putImageData(d, 0, 0);
	sg.globalCompositeOperation = 'source-atop';
	const shade = sg.createLinearGradient(size * .2, size * .2, size * .8, size * .8);
	shade.addColorStop(0, 'rgba(90,130,230,.18)');
	shade.addColorStop(1, 'rgba(0,4,20,.72)');
	sg.fillStyle = shade;
	sg.fillRect(0, 0, size, size);

	station = document.createElement('canvas');
	station.width = station.height = W;
	const g = station.getContext('2d');
	const glow = g.createRadialGradient(x, y, 10, x, y, 130);
	glow.addColorStop(0, 'rgba(60,100,190,.13)');
	glow.addColorStop(1, 'rgba(60,100,190,0)');
	g.fillStyle = glow;
	g.fillRect(0, 0, W, W);
	fadeOutOverMenu(g);
	g.drawImage(small, x - size / 2, y - size / 2);
}

/** the arrivals shuttle: every 24 s a tiny ship flies in from the left edge (under the menu), docks at the station's left arm, waits,
 *  and flies back out the way it came */
function shuttle(c, t) {
	const p = (t + 19) % 24;                         // the first one is already on its way in as the picture opens
	const dockX = STATION.x - 88, y = STATION.y - 14;
	let x, coming = true, docked = false;
	if (p < 7) x = dockX - (1 - p / 7) ** 2 * 330;    // in, slowing down
	else if (p < 11) { x = dockX; docked = true; }
	else if (p < 17) { x = dockX - ((p - 11) / 6) ** 2 * 330; coming = false; } // out, speeding up
	else return;
	x = Math.round(x);
	c.fillStyle = '#aab6c6';                          // hull, a light nose, a blue window
	c.fillRect(x, y, 7, 3);
	c.fillStyle = '#e6eef8';
	c.fillRect(coming ? x + 5 : x, y, 2, 1);
	c.fillStyle = '#5a8fd8';
	c.fillRect(coming ? x + 4 : x + 1, y + 1, 2, 1);
	if (!docked) {                                    // the engine flame trails behind it
		const long = Math.floor(t * 12) % 2;
		c.fillStyle = long ? '#ffd76a' : '#ff9a3a';
		c.fillRect(coming ? x - 2 - long : x + 7, y + 1, 2 + long, 1);
	}
}

/** the logo built once: red hard shadow, dark outline, orange glow and the yellow letters; plus the letters alone for the shine to light up */
function buildLogo() {
	const make = () => {
		const cv = document.createElement('canvas');
		cv.width = W;
		cv.height = LOGO_H;
		return cv;
	};
	logoBase = make();
	logoFill = make();
	shine = make();
	const b = logoBase.getContext('2d'), f = logoFill.getContext('2d');
	pixText(b, LOGO, W / 2, 3, 16, 3, '#ffd34e'); // the glow first, so the shadow and outline sit crisp on top of it
	pixText(b, LOGO, W / 2 + 3, 6, 16, 3, '#a33');
	for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-3, -3], [3, -3], [-3, 3], [3, 3]]) pixText(b, LOGO, W / 2 + dx, dy + 3, 16, 3, '#3a0a0a');
	pixText(b, LOGO, W / 2, 3, 16, 3, '#ffd34e');
	pixText(f, LOGO, W / 2, 3, 16, 3, '#ffd34e');
}

/** a shooting star: one every 8 seconds, a short bright streak down and to the left, always above the menu box */
function shootingStar(c, t) {
	const slot = Math.floor(t / 8), p = t - slot * 8;
	if (p > 1 || slot < 1) return;
	const r = rng(slot * 97 + 5);
	const hx = 200 + r() * 270 - p * 260, hy = 10 + r() * 70 + p * 80;
	for (let i = 0; i < 14; i++) {
		c.fillStyle = `rgba(220,235,255,${((1 - i / 14) * (1 - p * .6)).toFixed(2)})`;
		c.fillRect(Math.round(hx + i * 3), Math.round(hy - i * 0.92), 2, 2);
	}
}

export default {
	name: '6. Title screen',
	desc: 'A game title screen: the yellow logo with a hard shadow, outline and a shine that sweeps across it, over three layers of coloured stars drifting left past a faint nebula, the menu on the left. Far off in the bottom-right corner hangs the station, its lights blinking, a tiny shuttle docking and leaving.',
	draw(c, t) {
		if (!nebula) { buildNebula(); buildLogo(); buildStation(); }
		c.fillStyle = '#03040a';
		c.fillRect(0, 0, W, W);
		c.drawImage(nebula, 0, 0);

		// the stars drift left, wrapping round; a few twinkle (dimmer now and then)
		for (const s of STARS) {
			const layer = LAYERS[s.layer];
			const x = ((s.x - layer.speed * t) % W + W) % W;
			const a = layer.alpha * (s.twinkle < 0 ? 1 : .55 + .45 * Math.sin(t * 2.5 + s.twinkle));
			c.fillStyle = `rgba(${s.tint},${a.toFixed(2)})`;
			c.fillRect(x | 0, s.y | 0, layer.size, layer.size);
		}
		shootingStar(c, t);

		// the station, its lights blinking, and the shuttle coming and going
		c.drawImage(station, 0, 0);
		for (const [dx, dy, rgb, every, at] of BEACONS) {
			const since = ((t - at) % every + every) % every;
			if (since > .5) continue;
			const x = STATION.x + dx, y = STATION.y + dy;
			c.fillStyle = `rgba(${rgb},${since < .25 ? 1 : .5})`;
			c.fillRect(x, y, 2, 2);
			if (since < .25) {
				c.fillStyle = `rgba(${rgb},.3)`;
				c.fillRect(x - 1, y - 1, 4, 4);
			}
		}
		shuttle(c, t);

		// the logo: shadow, outline and letters, then a bright slanted band sweeps across the letters every 6 seconds
		c.drawImage(logoBase, 0, LOGO_TOP);
		const sweep = (t % 6) / 1.2; // 0 to 1 over the first 1.2 s, then rests
		if (sweep < 1) {
			const s = shine.getContext('2d');
			s.globalCompositeOperation = 'source-over';
			s.clearRect(0, 0, W, LOGO_H);
			s.drawImage(logoFill, 0, 0);
			s.globalCompositeOperation = 'source-atop';
			const bx = Math.round(60 + sweep * 380);
			s.fillStyle = '#fffbe0';
			s.beginPath();
			s.moveTo(bx + 20, 0);
			s.lineTo(bx + 40, 0);
			s.lineTo(bx + 20, LOGO_H);
			s.lineTo(bx, LOGO_H);
			s.fill();
			c.drawImage(shine, 0, LOGO_TOP);
		}
		smallText(c, TAGLINE, W / 2, 130, '#9cf');

		// a quiet title-screen footer in the empty bottom-left
		smallText(c, '© NANOTRASEN 2563', 14, W - 14, 'rgba(150,170,210,.4)', 'left', 11);
	}
};

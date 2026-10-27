import { IMG, W, rng, pixText, starfield, tiles, spr, LOGO, MENU_ZONE } from "../helpers.js";

// the lobby menu is drawn on top, never moves, and must stay over dark, quiet picture: the hull breach covers MENU_ZONE
const ZONE = { x0: MENU_ZONE.x, y0: MENU_ZONE.y, x1: MENU_ZONE.x + MENU_ZONE.w, y1: MENU_ZONE.y + MENU_ZONE.h };
const BANNER_Y = 0, BANNER_H = 150;
const BANNER_BOTTOM = BANNER_Y + BANNER_H;
const BEACON_Y = 34;                              // the beacons sit on the banner, at its two ends
const BEACONS_X = [44, W - 44];
const WALL_X = 416, WALL_Y = 448;                 // the room: floor, a wall down the right side and one along the bottom
const LAMPS = [[420, 226, .9, 'v'], [420, 396, .8, 'v'], [120, 452, .7, 'h'], [330, 452, .6, 'h']];   // x, y, brightness, which way the fitting lies
const DYING_LAMP = 1;                             // flickers hard and sparks
const SPARK_EVERY = 1.7;                          // seconds

// canvases drawn on off-screen, made once
const offscreen = {};
function canvas(name) {
	if (!offscreen[name]) {
		offscreen[name] = document.createElement('canvas');
		offscreen[name].width = offscreen[name].height = W;
	}
	return offscreen[name];
}

// a smooth random wobble between 0 and 1 that depends only on t
function hash01(n) {
	n = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return n - Math.floor(n);
}
function flicker(t, seed, rate) {
	const step = Math.floor(t * rate), f = t * rate - step;
	const a = hash01(step + seed * 97), b = hash01(step + 1 + seed * 97);
	return a + (b - a) * f * f * (3 - 2 * f);
}

// a wedge of light from x, y towards `angle`, `halfWidth` radians either side, fading out over `length`
function beam(c, x, y, angle, length, halfWidth, colourAt) {
	const g = c.createRadialGradient(x, y, 0, x, y, length);
	g.addColorStop(0, colourAt(1));
	g.addColorStop(.35, colourAt(.55));
	g.addColorStop(1, colourAt(0));
	c.fillStyle = g;
	c.beginPath();
	c.moveTo(x, y);
	c.arc(x, y, length, angle - halfWidth, angle + halfWidth);
	c.closePath();
	c.fill();
}

// the map tinted `colour`, kept only where `mask` is painted
function litMap(name, map, colour, mask) {
	const cv = canvas(name), g = cv.getContext('2d');
	g.imageSmoothingEnabled = false;
	g.globalCompositeOperation = 'source-over';
	g.clearRect(0, 0, W, W);
	g.drawImage(map, 0, 0);
	g.globalCompositeOperation = 'multiply';
	g.fillStyle = colour;
	g.fillRect(0, 0, W, W);
	g.globalCompositeOperation = 'destination-in';
	g.drawImage(mask, 0, 0);
	return cv;
}

// a rotating beacon seen from the side, brightest when turned towards us
function beacon(c, x, y, angle) {
	const lit = Math.max(0, Math.cos(angle));

	// base
	c.fillStyle = '#111';
	c.fillRect(x - 16, y + 6, 32, 8);
	c.fillStyle = '#444';
	c.fillRect(x - 16, y + 6, 32, 2);
	c.fillStyle = '#2a2a2a';
	c.fillRect(x - 12, y + 4, 24, 2);

	// dome, the bright lamp inside it swinging side to side, highlights, seams
	c.fillStyle = `rgb(${150 + 80 * lit | 0},${10 + 40 * lit | 0},${10 + 30 * lit | 0})`;
	c.fillRect(x - 10, y - 6, 20, 10);
	c.fillRect(x - 9, y - 10, 18, 4);
	c.fillRect(x - 7, y - 12, 14, 2);
	c.fillRect(x - 4, y - 14, 8, 2);
	c.fillStyle = `rgba(255,${150 + 90 * lit | 0},${110 + 90 * lit | 0},${.5 + .5 * lit})`;
	c.fillRect(Math.round(x + Math.sin(angle) * 7) - 2, y - 11, 4, 15);
	c.fillStyle = 'rgba(255,220,210,.8)';
	c.fillRect(x - 7, y - 9, 2, 4);
	c.fillRect(x - 5, y - 11, 2, 2);
	c.fillStyle = 'rgba(30,0,0,.6)';
	c.fillRect(x - 10, y - 1, 20, 1);
	c.fillRect(x - 1, y - 14, 2, 18);

	// glow while it faces us
	if (lit > .05) {
		c.save();
		c.globalCompositeOperation = 'lighter';
		const g = c.createRadialGradient(x, y - 4, 0, x, y - 4, 56);
		g.addColorStop(0, `rgba(255,110,80,${.9 * lit ** 2})`);
		g.addColorStop(1, 'rgba(255,0,0,0)');
		c.fillStyle = g;
		c.fillRect(x - 56, y - 60, 112, 112);
		c.restore();
	}
}

// ---- the hull breach ----

// the torn edge of the hole: a ring of points round MENU_ZONE, each pushed outward a random amount (never inward), made once.
// Every other point is pushed further out, so the edge is a row of sharp teeth.
const HOLE_MARGIN = 14;
const BREACH = (() => {
	const random = rng(31);
	const x0 = ZONE.x0 - HOLE_MARGIN, x1 = ZONE.x1 + HOLE_MARGIN;
	const y0 = ZONE.y0 - HOLE_MARGIN, y1 = ZONE.y1 + HOLE_MARGIN;
	const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
	const ring = [];
	// walk the rectangle's edge, one point about every 11 px
	const edge = (ax, ay, bx, by) => {
		const steps = Math.round(Math.hypot(bx - ax, by - ay) / 11);
		for (let i = 0; i < steps; i++) ring.push([ax + (bx - ax) * i / steps, ay + (by - ay) * i / steps]);
	};
	edge(x0, y0, x1, y0);
	edge(x1, y0, x1, y1);
	edge(x1, y1, x0, y1);
	edge(x0, y1, x0, y0);
	return ring.map(([x, y], i) => {
		// pushed away from the centre, the corners further so the hole is not a plain box
		const dx = x - cx, dy = y - cy, len = Math.hypot(dx, dy);
		const corner = Math.abs(dx) / (x1 - x0) * Math.abs(dy) / (y1 - y0) * 4;
		const push = 2 + random() * 6 + (i % 2 ? 6 : 0) + corner * 12 * random();
		return [x + dx / len * push, y + dy / len * push];
	});
})();
const HOLE_CENTRE = [(ZONE.x0 + ZONE.x1) / 2, (ZONE.y0 + ZONE.y1) / 2];

// a few cracks running out across the floor from the edge: a start point, then short steps (made once, drawn into the room)
const CRACKS = (() => {
	const random = rng(77);
	const [cx, cy] = HOLE_CENTRE;
	return [2, 9, 15, 27, 33, 41, 52, 58, 66, 74].map((k) => {
		let [x, y] = BREACH[k % BREACH.length];
		let angle = Math.atan2(y - cy, x - cx);
		const points = [[x, y]];
		for (let i = 0; i < 5; i++) {
			angle += (random() - .5) * 1.2;
			const len = 5 + random() * 9;
			x += Math.cos(angle) * len;
			y += Math.sin(angle) * len;
			points.push([x, y]);
		}
		return points;
	});
})();

// where the torn edge throws sparks (index into BREACH) and how often each one flares
const RIM_SPARKS = [[18, 3.1], [44, 4.3], [60, 2.6]];

// things sucked towards the hole: sprite or scrap, where it starts, seconds to cross the floor, spin speed
const ITEMS = [
	['crew_ian_s', 388, 250, 11, .5], ['crew_skel_s', 270, 420, 13, -.4], ['crew_clown_s', 380, 405, 15, .35], ['crew_monkey_e', 60, 412, 12, -.6],
	['wall', 395, 190, 8, 1.2], ['wall', 340, 430, 9, -1.1], ['floor', 372, 330, 7, 1.5], ['floor', 150, 405, 8, -1.4],
	['wall', 230, 400, 10, .9], ['floor', 405, 300, 9, -.8],
];

/** a 1 px wide line drawn pixel by pixel, so it stays crisp */
function pixLine(c, x0, y0, x1, y1) {
	const steps = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0)));
	for (let i = 0; i <= steps; i++) c.fillRect(Math.round(x0 + (x1 - x0) * i / steps), Math.round(y0 + (y1 - y0) * i / steps), 1, 1);
}

/** add the torn edge to the current path, every point moved `grow` px away from the middle of the hole */
function traceEdge(c, grow) {
	const [cx, cy] = HOLE_CENTRE;
	BREACH.forEach(([x, y], i) => {
		const dx = x - cx, dy = y - cy, len = Math.hypot(dx, dy);
		const px = x + dx / len * grow, py = y + dy / len * grow;
		if (i == 0) c.moveTo(px, py);
		else c.lineTo(px, py);
	});
	c.closePath();
}
function tracePath(c, grow) {
	c.beginPath();
	traceEdge(c, grow);
}

/** make the room once: floor tiles, a wall down the right and along the bottom, scorched tiles, alarms and cracks */
function buildRoom() {
	const room = canvas('room'), r = room.getContext('2d');
	r.imageSmoothingEnabled = false;
	r.fillStyle = '#161010';
	r.fillRect(0, 0, W, W);
	tiles(r, 'floor', 0, 144);
	tiles(r, 'alert_wall', WALL_X, 144);
	tiles(r, 'alert_wall', 0, WALL_Y);

	// the wall casts a stepped shadow on the floor
	for (let i = 0; i < 4; i++) {
		r.fillStyle = `rgba(0,0,0,${.14 + .1 * (3 - i)})`;
		r.fillRect(WALL_X - 4 - i * 4, 144, 4, WALL_Y - 144);
		r.fillRect(0, WALL_Y - 4 - i * 4, WALL_X, 4);
	}
	r.fillStyle = 'rgba(255,255,255,.18)';
	r.fillRect(WALL_X, 144, 1, W);
	r.fillRect(0, WALL_Y, W, 1);

	// burnt-out tiles near the hole, and fire alarms on the walls
	for (const [x, y] of [[352, 160], [352, 224], [352, 288], [352, 352], [320, 384], [256, 384], [32, 384], [384, 192]]) spr(r, 'dark', x, y);
	spr(r, 'alert_fdoor', 448, 288);
	spr(r, 'alert_fdoor', 224, WALL_Y);

	// cracks, dark with a lighter edge underneath
	for (const [dy, colour] of [[1, 'rgba(255,255,255,.12)'], [0, 'rgba(0,0,0,.75)']]) {
		r.fillStyle = colour;
		for (const line of CRACKS) {
			for (let i = 1; i < line.length; i++) pixLine(r, line[i - 1][0], line[i - 1][1] + dy, line[i][0], line[i][1] + dy);
		}
	}
	return room;
}

/** one thing sucked towards the hole: it fades in, speeds up as it nears the edge, and is hidden by the hole itself */
function drawItem(c, t, [kind, x0, y0, seconds, spin], n) {
	const life = ((t + n * 3.7) % seconds) / seconds;
	const pull = life * life;
	const x = x0 + (HOLE_CENTRE[0] - x0) * pull, y = y0 + (HOLE_CENTRE[1] - y0) * pull + Math.sin(t * 1.3 + n) * 3;
	c.save();
	c.globalAlpha = Math.min(1, life * 8);
	c.translate(Math.round(x), Math.round(y));
	c.rotate(t * spin + n);
	if (kind == 'wall' || kind == 'floor') {
		// a torn chunk of wall plate or a loose floor tile: a 16 px corner of the sprite over a shadow
		c.fillStyle = 'rgba(0,0,0,.35)';
		c.fillRect(-6, -6, 16, 16);
		c.drawImage(IMG[kind == 'wall' ? 'alert_wall' : 'floor'], 0, 0, 16, 16, -8, -8, 16, 16);
	} else {
		c.drawImage(IMG[kind], 0, 0, 32, 32, -32, -32, 64, 64);
	}
	c.restore();
}

/**
 * sparks from x0, y0: a burst every `every` s (some skipped), the last one still fading out, flying in directions
 * aim +- spread/2, with a yellow flash of radius `flash` as it starts (0 = none). Each burst's sparks come from its
 * own seeded random numbers, so a burst looks the same every frame.
 */
function sparks(c, t, x0, y0, seed, every, aim, spread, flash) {
	const burstNow = Math.floor(t / every), sinceNow = t - burstNow * every;
	for (const [burst, age] of [[burstNow, sinceNow], [burstNow - 1, sinceNow + every]]) {
		const random = rng(1000 + seed * 131 + ((burst % 997) + 997) % 997 * 7919);
		random();
		random();
		if (random() < .15 || age > 1.1) continue;
		const count = 7 + Math.floor(random() * 6);

		// a yellow flash as it starts
		if (age < .08 && flash) {
			c.save();
			c.globalCompositeOperation = 'lighter';
			const g = c.createRadialGradient(x0, y0, 0, x0, y0, flash);
			g.addColorStop(0, 'rgba(255,240,180,.7)');
			g.addColorStop(1, 'rgba(255,200,0,0)');
			c.fillStyle = g;
			c.fillRect(x0 - flash, y0 - flash, flash * 2, flash * 2);
			c.restore();
		}

		// sparks fly out, slow down, drop, and cool from white to yellow to orange; young ones leave a trail dot
		for (let i = 0; i < count; i++) {
			const angle = aim + (random() - .5) * spread;
			const speed = 40 + random() * 90;
			const life = .3 + random() * .7;
			if (age > life) continue;
			const fade = 1 - age / life;
			const dist = speed * age * (1 - age * .5);
			const x = x0 + Math.cos(angle) * dist;
			const y = y0 + Math.sin(angle) * dist + 30 * age * age;
			c.fillStyle = fade > .6 ? '#fffbe0' : fade > .3 ? '#ffd040' : '#ff7020';
			c.fillRect(Math.round(x), Math.round(y), 2, 2);
			if (fade > .4) {
				c.fillStyle = 'rgba(255,200,60,.5)';
				c.fillRect(Math.round(x - Math.cos(angle) * 3), Math.round(y - Math.sin(angle) * 3), 2, 2);
			}
		}
	}
}

/** the hole itself: bent plating with a lit rim, then dark space with dim stars inside; nothing else is drawn inside it */
function breach(c, t, pulse) {
	// the torn hull round the hole, in steps from dark outer plating to bent metal at the lip
	for (const [grow, colour] of [[13, '#150808'], [9, '#2c1412'], [5, '#4a2622']]) {
		tracePath(c, grow);
		c.fillStyle = colour;
		c.fill();
	}

	// dark space, stars barely drifting and dim
	c.save();
	tracePath(c, 0);
	c.clip();
	c.fillStyle = '#000';
	c.fillRect(0, 0, W, W);
	c.globalAlpha = .45;
	starfield(c, t, 1.5);
	c.restore();

	// the lip catches the red light: each tooth edge shines more the more it faces up towards the beacons
	const [cx, cy] = HOLE_CENTRE;
	c.lineWidth = 2;
	for (let i = 0; i < BREACH.length; i++) {
		const [ax, ay] = BREACH[i], [bx, by] = BREACH[(i + 1) % BREACH.length];
		const mx = (ax + bx) / 2 - cx, my = (ay + by) / 2 - cy;
		const up = Math.max(0, -my / Math.hypot(mx, my));
		c.strokeStyle = `rgba(255,${90 + 80 * up | 0},${60 + 60 * up | 0},${.35 + .3 * up + .35 * pulse})`;
		c.beginPath();
		c.moveTo(ax, ay);
		c.lineTo(bx, by);
		c.stroke();
	}

	// a thin dark line where the lip meets the plating
	tracePath(c, 5);
	c.strokeStyle = 'rgba(0,0,0,.6)';
	c.lineWidth = 1;
	c.stroke();
}

/** sparks and flickering light at a few places on the torn edge, only outside the hole */
function rimSparks(c, t) {
	c.save();
	c.beginPath();
	c.rect(0, 0, W, W);
	traceEdge(c, 0);
	c.clip('evenodd');
	const [cx, cy] = HOLE_CENTRE;
	RIM_SPARKS.forEach(([k, rate], i) => {
		const [x, y] = BREACH[k];
		const aim = Math.atan2(y - cy, x - cx);
		const glow = flicker(t, 20 + i, rate * 3) ** 2;
		c.save();
		c.globalCompositeOperation = 'lighter';
		const g = c.createRadialGradient(x, y, 0, x, y, 44);
		g.addColorStop(0, `rgba(255,170,90,${.5 * glow})`);
		g.addColorStop(1, 'rgba(255,90,30,0)');
		c.fillStyle = g;
		c.fillRect(x - 44, y - 44, 88, 88);
		c.restore();
		sparks(c, t, x, y, 5 + i, rate, aim, 2.2, 0);
	});
	c.restore();
}

let room = null;                                  // the floor, walls and cracks, drawn the first time

export default {
	name: '3. Red alert',
	desc: 'A bomb has blown a jagged hull breach in a station room: dark space and dim stars show through the hole, its bent edge catching the red light and sparking, while loose plating, floor tiles and a few crew are sucked towards it. Two rotating beacons on a hazard-striped banner sweep red light round the room, a broken lamp sparks and CODE RED flashes under the logo.',
	draw(c, t) {
		room = room || buildRoom();

		// the room with the things being sucked into the hole drawn on it
		const map = canvas('a'), mapG = map.getContext('2d');
		mapG.imageSmoothingEnabled = false;
		mapG.globalCompositeOperation = 'source-over';
		mapG.drawImage(room, 0, 0);
		ITEMS.forEach((item, n) => drawItem(mapG, t, item, n));

		// the two beacons turn opposite ways, a quarter turn apart; each throws two opposite beams
		const angles = [t * 2.2, -(t * 2.2 + Math.PI / 2)];
		const beams = (draw) => BEACONS_X.forEach((x, i) => { for (let half = 0; half < 2; half++) draw(x, angles[i] + half * Math.PI); });

		// the red pulse follows the beacons: strongest when one of them faces us
		const facing = Math.max(0, Math.cos(angles[0])) + Math.max(0, Math.cos(angles[1]));
		const pulse = .12 + .88 * Math.min(1, facing);

		// the room dimmed to a pulsing dark red
		c.save();
		c.drawImage(map, 0, 0);
		c.globalCompositeOperation = 'multiply';
		c.fillStyle = `rgb(${110 + 40 * pulse | 0},${30 + 8 * pulse | 0},${32})`;
		c.fillRect(0, 0, W, W);
		c.restore();

		// where the beams and a glow round each beacon fall, the room shows bright red
		const beamMask = canvas('m'), m = beamMask.getContext('2d');
		m.globalCompositeOperation = 'source-over';
		m.clearRect(0, 0, W, W);
		beams((x, angle) => beam(m, x, BEACON_Y, angle, 560, 0.26, (k) => `rgba(255,255,255,${k})`));
		for (const x of BEACONS_X) {
			const g = m.createRadialGradient(x, BEACON_Y, 0, x, BEACON_Y, 110);
			g.addColorStop(0, 'rgba(255,255,255,.8)');
			g.addColorStop(1, 'rgba(255,255,255,0)');
			m.fillStyle = g;
			m.fillRect(0, 0, W, W);
		}
		c.drawImage(litMap('l', map, 'rgb(255,70,55)', beamMask), 0, 0);

		// the lamps flicker gently; the dying one jumps between on, dim and off
		const lamps = LAMPS.map(([x, y, brightness], i) => {
			const v = flicker(t, i, i == DYING_LAMP ? 14 : 3);
			return [x, y, (i == DYING_LAMP ? (v > .55 ? 1 : v > .35 ? .25 : 0) : .75 + .25 * v) * brightness];
		});

		// where each lamp shines, the room shows warm white, plus a halo round the lamp
		const lampMask = canvas('w'), lm = lampMask.getContext('2d');
		lm.globalCompositeOperation = 'source-over';
		lm.clearRect(0, 0, W, W);
		for (const [x, y, s] of lamps) {
			if (s <= 0) continue;
			const g = lm.createRadialGradient(x, y, 0, x, y, 70);
			g.addColorStop(0, `rgba(255,255,255,${s})`);
			g.addColorStop(1, 'rgba(255,255,255,0)');
			lm.fillStyle = g;
			lm.fillRect(x - 70, y - 70, 140, 140);
		}
		const lampLit = litMap('lw', map, 'rgb(255,225,190)', lampMask);
		c.save();
		c.globalCompositeOperation = 'lighter';
		c.globalAlpha = .8;
		c.drawImage(lampLit, 0, 0);
		c.globalAlpha = 1;
		for (const [x, y, s] of lamps) {
			if (s <= 0) continue;
			const g = c.createRadialGradient(x, y, 0, x, y, 40);
			g.addColorStop(0, `rgba(255,230,190,${.35 * s})`);
			g.addColorStop(1, 'rgba(255,200,150,0)');
			c.fillStyle = g;
			c.fillRect(x - 40, y - 40, 80, 80);
		}
		c.restore();

		// the lamp fittings: bright when on, dark red when off
		LAMPS.forEach(([x, y, , way], i) => {
			const s = lamps[i][2];
			c.fillStyle = s > .1 ? `rgba(255,250,235,${.4 + .6 * s})` : '#311';
			if (way == 'v') c.fillRect(x - 1, y - 5, 3, 10);
			else c.fillRect(x - 5, y - 1, 10, 3);
		});

		// red haze along the beams: a wide faint wedge and a narrow brighter one
		c.save();
		c.globalCompositeOperation = 'lighter';
		beams((x, angle) => {
			beam(c, x, BEACON_Y, angle, 520, 0.2, (k) => `rgba(255,40,25,${.22 * k})`);
			beam(c, x, BEACON_Y, angle, 420, 0.07, (k) => `rgba(255,120,90,${.22 * k})`);
		});
		c.restore();

		// sparks from the dying lamp, falling away from its wall
		const [sparkX, sparkY] = LAMPS[DYING_LAMP];
		sparks(c, t, sparkX, sparkY, 0, SPARK_EVERY, Math.PI, 3.2, 50);

		// the blast-shutter banner: shadow, dark red body, faint panel lines
		c.fillStyle = 'rgba(0,0,0,.5)';
		c.fillRect(0, BANNER_BOTTOM, W, 8);
		const body = c.createLinearGradient(0, BANNER_Y, 0, BANNER_BOTTOM);
		body.addColorStop(0, '#2a0b0b');
		body.addColorStop(.12, '#1a0606');
		body.addColorStop(.5, '#110303');
		body.addColorStop(.88, '#1a0606');
		body.addColorStop(1, '#2a0b0b');
		c.globalAlpha = .94;
		c.fillStyle = body;
		c.fillRect(0, BANNER_Y, W, BANNER_H);
		c.globalAlpha = 1;
		c.fillStyle = 'rgba(255,255,255,.05)';
		for (let y = BANNER_Y + 16; y < BANNER_BOTTOM - 16; y += 22) c.fillRect(0, y, W, 1);

		// hazard stripes along its top and bottom, reddened with the pulse
		for (const y of [BANNER_Y, BANNER_BOTTOM - 12]) {
			c.save();
			c.beginPath();
			c.rect(0, y, W, 12);
			c.clip();
			c.fillStyle = '#c79a00';
			c.fillRect(0, y, W, 12);
			c.fillStyle = '#120a00';
			for (let x = -24; x < W + 24; x += 24) {
				c.beginPath();
				c.moveTo(x, y);
				c.lineTo(x + 12, y);
				c.lineTo(x + 24, y + 12);
				c.lineTo(x + 12, y + 12);
				c.closePath();
				c.fill();
			}
			c.fillStyle = `rgba(120,0,0,${.35 - .2 * pulse})`;
			c.fillRect(0, y, W, 12);
			c.restore();
		}

		// pulsing red lines inside the stripes, and rivets
		c.fillStyle = `rgba(255,50,40,${.5 + .5 * pulse})`;
		c.fillRect(0, BANNER_Y + 12, W, 2);
		c.fillRect(0, BANNER_BOTTOM - 14, W, 2);
		c.fillStyle = '#5a3030';
		for (let x = 20; x < W; x += 88) {
			c.fillRect(x, BANNER_Y + 19, 2, 2);
			c.fillRect(x, BANNER_BOTTOM - 21, 2, 2);
		}

		// the logo with a drop shadow
		pixText(c, LOGO, W / 2 + 4, BANNER_Y + 30, 16, 4, '#000', null);
		pixText(c, LOGO, W / 2, BANNER_Y + 26, 16, 4, '#fff', '#f22');

		// CODE RED plate blinking twice a second, with three chevrons each side lighting up one by one, outside in
		const plateOn = Math.floor(t * 2) % 2 == 0;
		const plateY = BANNER_BOTTOM - 46, plateW = 176;
		c.fillStyle = plateOn ? '#c00' : '#2a0000';
		c.fillRect(W / 2 - plateW / 2, plateY, plateW, 26);
		c.strokeStyle = '#f44';
		c.lineWidth = 2;
		c.strokeRect(W / 2 - plateW / 2 + 1, plateY + 1, plateW - 2, 24);
		pixText(c, 'CODE RED', W / 2, plateY + 4, 10, 2, plateOn ? '#fff' : '#f33', plateOn ? '#f00' : null);
		for (let i = 0; i < 3; i++) {
			c.fillStyle = Math.floor(t * 6) % 3 == 2 - i ? '#ff4030' : '#4a0c0c';
			for (const side of [-1, 1]) {
				const x = W / 2 + side * (plateW / 2 + 16 + i * 16);
				c.beginPath();
				c.moveTo(x - side * 5, plateY + 3);
				c.lineTo(x + side * 5, plateY + 13);
				c.lineTo(x - side * 5, plateY + 23);
				c.closePath();
				c.fill();
			}
		}

		BEACONS_X.forEach((x, i) => beacon(c, x, BEACON_Y, angles[i]));

		// pulsing red towards the edges, black in the corners
		const edges = c.createRadialGradient(W / 2, W / 2, 170, W / 2, W / 2, 360);
		edges.addColorStop(0, 'rgba(0,0,0,0)');
		edges.addColorStop(.7, `rgba(60,0,0,${.25 + .2 * pulse})`);
		edges.addColorStop(1, 'rgba(0,0,0,.75)');
		c.fillStyle = edges;
		c.fillRect(0, 0, W, W);

		// last, the hull breach over everything, so no light, spark or haze reaches the menu; its sparks stay outside the hole
		c.save();
		c.beginPath();
		c.rect(0, BANNER_BOTTOM, W, W - BANNER_BOTTOM);
		c.clip();
		breach(c, t, pulse);
		rimSparks(c, t);
		c.restore();
	},
};

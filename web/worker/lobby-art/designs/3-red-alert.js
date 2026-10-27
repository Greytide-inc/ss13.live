import { IMG, W, rng, pixText, LOGO } from "../helpers.js";

const BANNER_Y = 164, BANNER_H = 150;
const BANNER_BOTTOM = BANNER_Y + BANNER_H;
const BEACON_Y = BANNER_Y - 14;                   // the beacons sit on the banner's top edge
const BEACONS_X = [44, W - 44];
const LAMPS = [[372, 402, .9], [566, 392, .7], [470, 586, 1], [352, 592, .6]];   // x, y on the station map, brightness
const DYING_LAMP = 2;                             // flickers hard and sparks
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

export default {
	menuY: 262,
	name: '3. Red alert',
	desc: 'Close-up of the station in emergency red: two rotating beacons on a hazard-striped blast-shutter banner sweep real light across the map, a broken lamp flickers and sparks. CODE RED flashes under the logo.',
	draw(c, t) {
		// a 240 px square of the station map, drifting left and right, scaled up 2x
		const viewX = Math.round(337 + Math.sin(t * 0.1) * 20), viewY = 368;
		const map = canvas('a'), mapG = map.getContext('2d');
		mapG.imageSmoothingEnabled = false;
		mapG.globalCompositeOperation = 'source-over';
		mapG.drawImage(IMG.station, viewX, viewY, 240, 240, 0, 0, W, W);
		const toScreen = (x, y) => [(x - viewX) * 2, (y - viewY) * 2];

		// the two beacons turn opposite ways, a quarter turn apart; each throws two opposite beams
		const angles = [t * 2.2, -(t * 2.2 + Math.PI / 2)];
		const beams = (draw) => BEACONS_X.forEach((x, i) => { for (let half = 0; half < 2; half++) draw(x, angles[i] + half * Math.PI); });
		const pulse = 0.5 + 0.5 * Math.sin(t * 4.4);

		// the map dimmed to a pulsing dark red
		c.save();
		c.drawImage(map, 0, 0);
		c.globalCompositeOperation = 'multiply';
		c.fillStyle = `rgb(${92 + 28 * pulse | 0},${22 + 5 * pulse | 0},${24})`;
		c.fillRect(0, 0, W, W);
		c.restore();

		// where the beams and a glow round each beacon fall, the map shows bright red
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
		const strength = LAMPS.map(([, , brightness], i) => {
			const v = flicker(t, i, i == DYING_LAMP ? 14 : 3);
			return (i == DYING_LAMP ? (v > .55 ? 1 : v > .35 ? .25 : 0) : .75 + .25 * v) * brightness;
		});
		const lamps = LAMPS.map(([x, y], i) => [...toScreen(x, y), strength[i]]);

		// where each lamp shines, the map shows warm white, plus a halo round the lamp
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
		for (const [x, y, s] of lamps) {
			c.fillStyle = s > .1 ? `rgba(255,250,235,${.4 + .6 * s})` : '#311';
			c.fillRect(Math.round(x) - 3, Math.round(y) - 1, 6, 2);
		}

		// red haze along the beams: a wide faint wedge and a narrow brighter one
		c.save();
		c.globalCompositeOperation = 'lighter';
		beams((x, angle) => {
			beam(c, x, BEACON_Y, angle, 520, 0.2, (k) => `rgba(255,40,25,${.22 * k})`);
			beam(c, x, BEACON_Y, angle, 420, 0.07, (k) => `rgba(255,120,90,${.22 * k})`);
		});
		c.restore();

		// sparks from the dying lamp: a burst every SPARK_EVERY s (some skipped), the last one still fading out.
		// Each burst's sparks come from its own seeded random numbers, so a burst looks the same every frame.
		const [sparkX, sparkY] = toScreen(LAMPS[DYING_LAMP][0], LAMPS[DYING_LAMP][1]);
		const burstNow = Math.floor(t / SPARK_EVERY), sinceNow = t - burstNow * SPARK_EVERY;
		for (const [burst, age] of [[burstNow, sinceNow], [burstNow - 1, sinceNow + SPARK_EVERY]]) {
			const random = rng(1000 + ((burst % 997) + 997) % 997 * 7919);
			random();
			random();
			if (random() < .15 || age > 1.1) continue;
			const count = 7 + Math.floor(random() * 6);

			// a yellow flash as it starts
			if (age < .08) {
				c.save();
				c.globalCompositeOperation = 'lighter';
				const g = c.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 50);
				g.addColorStop(0, 'rgba(255,240,180,.7)');
				g.addColorStop(1, 'rgba(255,200,0,0)');
				c.fillStyle = g;
				c.fillRect(sparkX - 50, sparkY - 50, 100, 100);
				c.restore();
			}

			// sparks fly out, slow down, drop, and cool from white to yellow to orange; young ones leave a trail dot
			for (let i = 0; i < count; i++) {
				const angle = random() * Math.PI * 2;
				const speed = 40 + random() * 90;
				const life = .3 + random() * .7;
				if (age > life) continue;
				const fade = 1 - age / life;
				const dist = speed * age * (1 - age * .5);
				const x = sparkX + Math.cos(angle) * dist;
				const y = sparkY + Math.sin(angle) * dist + 30 * age * age;
				c.fillStyle = fade > .6 ? '#fffbe0' : fade > .3 ? '#ffd040' : '#ff7020';
				c.fillRect(Math.round(x), Math.round(y), 2, 2);
				if (fade > .4) {
					c.fillStyle = 'rgba(255,200,60,.5)';
					c.fillRect(Math.round(x - Math.cos(angle) * 3), Math.round(y - Math.sin(angle) * 3), 2, 2);
				}
			}
		}

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
	},
};

import { W, spr, starfield, pixText, LOGO, TAGLINE, smallText, crwPut, scanlines, vignette, rng } from "../helpers.js";

const TEXT_Y = 474;      // the clock under the grid
const GRID_TOP = 126, GRID_BOTTOM = 458, GAP = 6;
const LEFT_X = 10, LEFT_W = 320;                 // left column: wide, holds the dead screen over the menu
const RIGHT_X = LEFT_X + LEFT_W + GAP, RIGHT_W = 470 - RIGHT_X;
const TOP_H = 228;                               // top row: covers the whole menu box
const BOTTOM_Y = GRID_TOP + TOP_H + GAP, BOTTOM_H = GRID_BOTTOM - BOTTOM_Y;

const lerp = (a, b, f) => a + (b - a) * f;

// "HH:MM:SS" for seconds since midnight
function clockText(seconds) {
	const two = (n) => String(n).padStart(2, '0');
	return two(Math.floor(seconds / 3600) % 24) + ':' + two(Math.floor(seconds / 60) % 60) + ':' + two(seconds % 60);
}

// small camera name in the screen's top-left corner, with a blinking REC dot if recording
function cameraLabel(c, t, x, y, label, rec) {
	if (rec && Math.floor(t * 1.5) % 2) {
		c.fillStyle = '#f33';
		c.beginPath();
		c.arc(x + 9, y + 8, 3, 0, 7);
		c.fill();
	}
	// a dark strip behind the name, so a ceiling light in the view never runs through the text
	c.font = 'bold 10px "DejaVu Sans Mono",monospace';
	c.fillStyle = 'rgba(4,10,6,.75)';
	c.fillRect(x + 14, y + 4, Math.ceil(c.measureText(label).width) + 4, 11);
	smallText(c, label, x + 16, y + 12, rec ? '#cfc' : '#586', 'left', 10);
}

// fill a shape given as x,y pairs
function quad(c, colour, ...p) {
	c.fillStyle = colour;
	c.beginPath();
	c.moveTo(p[0], p[1]);
	for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
	c.fill();
}

// the corridor's shape for one screen: where the far wall sits (bx0..bx1, top..bottom); the walls run out to the screen edges
function shape(x, y, w, h, wide, tall) {
	const bw = w * wide, bh = h * tall, vx = x + w / 2, vy = y + h * 0.4;
	return { x, y, w, h, bx0: Math.round(vx - bw), bx1: Math.round(vx + bw), top: Math.round(vy - bh), bottom: Math.round(vy + bh) };
}
// a point on the left (side -1) or right (side 1) wall: f = 0 is the far wall, 1 the screen edge; v = 0 ceiling, 1 floor
function wallAt(s, side, f, v) {
	const farX = side < 0 ? s.bx0 : s.bx1, edgeX = side < 0 ? s.x : s.x + s.w;
	return [lerp(farX, edgeX, f), lerp(lerp(s.top, s.bottom, v), s.y + s.h * v, f)];
}
// depth steps bunch up far away and spread out near the camera
const depth = (i, n) => (i / n) * (i / n);

// the stars outside a window (clipped to it), with a shuttle docking or a planet below
function windowView(c, t, x, y, w, h, number, shuttle) {
	c.save();
	c.beginPath();
	c.rect(x, y, w, h);
	c.clip();
	c.save();
	c.translate(x - 40 * number, y - 30 * number);
	starfield(c, t, 10, -1, 0);
	c.restore();
	if (shuttle) {
		// grey hull, blue window, a thruster flame that flickers
		const sx = Math.round(x + w * 0.25 + Math.sin(t * 0.3) * 4), sy = Math.round(y + h * 0.5 + Math.sin(t * 0.5) * 2);
		c.fillStyle = '#9aa6b4';
		c.fillRect(sx, sy, 26, 8);
		c.fillStyle = '#c4ced8';
		c.fillRect(sx + 4, sy, 18, 2);
		c.fillStyle = '#6a7684';
		c.fillRect(sx + 6, sy - 3, 10, 3);
		c.fillRect(sx + 6, sy + 8, 10, 3);
		c.fillStyle = '#58d';
		c.fillRect(sx + 20, sy + 2, 5, 3);
		c.fillStyle = Math.floor(t * 12) % 2 ? '#fd6' : '#f93';
		c.fillRect(sx - 5, sy + 2, 5, 4);
		c.fillStyle = '#f63';
		c.fillRect(sx - 8, sy + 3, 3, 2);
	} else {
		// a blue planet rising behind the window's lower edge
		c.fillStyle = '#25508a';
		c.beginPath();
		c.arc(Math.round(x + w * 0.65), Math.round(y + h * 1.9), Math.round(h * 1.15), 0, 7);
		c.fill();
		c.fillStyle = '#5da0e0';
		c.beginPath();
		c.arc(Math.round(x + w * 0.65), Math.round(y + h * 1.9), Math.round(h * 1.15), 3.6, 5.4);
		c.lineWidth = 2;
		c.strokeStyle = '#7fc0ff';
		c.stroke();
		c.lineWidth = 1;
	}
	c.restore();
}

// the far wall of each place: arrivals = a window with a shuttle, hall = double doors, bridge = window over consoles
function farWall(c, t, s, scene, number) {
	const w = s.bx1 - s.bx0, h = s.bottom - s.top;
	c.fillStyle = '#2c3846';
	c.fillRect(s.bx0, s.top, w, h);
	if (scene === 'arrivals') {
		windowView(c, t, s.bx0 + 4, s.top + 4, w - 8, h - 8, number, true);
		c.strokeStyle = '#7a8896';
		c.lineWidth = 2;
		c.strokeRect(s.bx0 + 3, s.top + 3, w - 6, h - 6);
		c.lineWidth = 1;
	} else if (scene === 'hall') {
		const dx = s.bx0 + Math.round(w * 0.25), dw = Math.round(w * 0.5), dh = h - 8;
		c.fillStyle = '#556678';
		c.fillRect(dx, s.top + 8, dw, dh);
		c.fillStyle = '#6f8294';
		c.fillRect(dx + 2, s.top + 10, Math.round(dw / 2) - 3, dh - 4);
		c.fillRect(dx + Math.round(dw / 2) + 1, s.top + 10, Math.round(dw / 2) - 3, dh - 4);
		c.fillStyle = '#9fb';
		c.fillRect(dx + 4, s.top + 3, dw - 8, 3);
	} else {
		const glassH = Math.round(h * 0.55);
		windowView(c, t, s.bx0 + 3, s.top + 3, w - 6, glassH, number, false);
		c.fillStyle = '#18202a';
		c.fillRect(s.bx0, s.top + glassH + 5, w, h - glassH - 5);
		for (let i = 0; i < 5; i++) {
			const on = Math.floor(t * 2 + i * 1.7) % 3 === 0;
			c.fillStyle = on ? '#fd6' : (i % 2 ? '#3c8' : '#2a6');
			c.fillRect(s.bx0 + 4 + Math.round(i * (w - 8) / 5), s.top + glassH + 9, 3, 2);
		}
	}
}

// one camera screen showing a place in perspective: ceiling with lights, side walls, floor, a far wall that depends
// on the place, and crew walking across the front. crew is a list of [who, direction letter]; scale is the sprite
// size; everything is clipped to the screen
function corridorView(c, t, x, y, w, h, crew, scale, label, number, scene) {
	const s = shape(x, y, w, h, scene === 'hall' ? 0.2 : 0.3, scene === 'bridge' ? 0.22 : 0.2);
	c.save();
	c.beginPath();
	c.rect(x, y, w, h);
	c.clip();

	// ceiling, side walls, floor, far wall
	c.fillStyle = '#10161d';
	c.fillRect(x, y, w, h);
	quad(c, '#232e3a', x, y, x + w, y, s.bx1, s.top, s.bx0, s.top);
	quad(c, '#2b3846', x, y, s.bx0, s.top, s.bx0, s.bottom, x, y + h);
	quad(c, '#2b3846', x + w, y, s.bx1, s.top, s.bx1, s.bottom, x + w, y + h);
	quad(c, '#3a4553', x, y + h, x + w, y + h, s.bx1, s.bottom, s.bx0, s.bottom);
	farWall(c, t, s, scene, number);

	// floor tile seams
	c.strokeStyle = '#242d38';
	for (let i = 1; i < 7; i++) {
		const f = depth(i, 7), fy = lerp(s.bottom, y + h, f);
		c.beginPath();
		c.moveTo(lerp(s.bx0, x, f), fy);
		c.lineTo(lerp(s.bx1, x + w, f), fy);
		c.stroke();
	}
	for (let i = 0; i <= 8; i++) {
		c.beginPath();
		c.moveTo(lerp(s.bx0, s.bx1, i / 8), s.bottom);
		c.lineTo(lerp(x - w * 0.6, x + w * 1.6, i / 8), y + h);
		c.stroke();
	}
	// wall panel seams and the red stripe along both walls
	for (const side of [-1, 1]) {
		c.strokeStyle = '#1c2530';
		for (let i = 1; i < 6; i++) {
			const [ax, ay] = wallAt(s, side, depth(i, 6), 0), [bx, by] = wallAt(s, side, depth(i, 6), 1);
			c.beginPath();
			c.moveTo(ax, ay);
			c.lineTo(bx, by);
			c.stroke();
		}
		const [fx, fy] = wallAt(s, side, 0, 0.76), [nx, ny] = wallAt(s, side, 1, 0.76);
		const [fx2, fy2] = wallAt(s, side, 0, 0.84), [nx2, ny2] = wallAt(s, side, 1, 0.84);
		quad(c, '#c33', fx, fy, nx, ny, nx2, ny2, fx2, fy2);
	}

	// ceiling lights down the middle, one of them flickering
	for (let i = 1; i < 5; i++) {
		const f = depth(i, 5), ly = lerp(s.top, y, f), lw = lerp(6, 24, f) * (w > 200 ? 1.6 : 1);
		c.fillStyle = i === 2 && Math.floor(t * 9 + number) % 11 === 0 ? '#556' : '#e8f0f8';
		c.fillRect(Math.round(x + w / 2 - lw / 2), Math.round(ly + 1), Math.round(lw), 2 + Math.round(f * 2));
	}

	// crew walking across the floor, looping round
	const loop = w + 64 * scale;
	crew.forEach(([who, dir], i) => {
		const speed = (dir === 'e' ? 1 : -1) * 14 * scale;
		const px = ((i * (loop / crew.length) + t * speed) % loop + loop) % loop - 32 * scale;
		const bob = Math.floor(t * 5 + i) % 2 ? scale : 0;
		crwPut(c, 'crew_' + who + '_' + dir, x + px + 16 * scale, y + h - 6 * scale, scale, 0, true, bob);
	});
	c.restore();

	cameraLabel(c, t, x, y, label, true);
}

// over a live screen: a faint flicker, a pale bar rolling down, and every few seconds a quarter-second burst of static
function cameraNoise(c, t, x, y, w, h, number) {
	c.save();
	c.beginPath();
	c.rect(x, y, w, h);
	c.clip();
	c.fillStyle = `rgba(190,255,200,${0.02 + 0.02 * (Math.sin(t * 41 + number * 3) + 1)})`;
	c.fillRect(x, y, w, h);
	c.fillStyle = 'rgba(200,255,210,.06)';
	c.fillRect(x, y + Math.round((t * 22 + number * 40) % (h + 20)) - 10, w, 8);
	const period = 6 + number * 2.3, phase = (t + number * 2.9) % period;
	if (phase < 0.28) {
		const random = rng(Math.floor(t * 30) * 7 + number);
		c.fillStyle = 'rgba(215,235,215,.4)';
		for (let i = 0; i < 160; i++) c.fillRect(x + Math.floor(random() * w / 2) * 2, y + Math.floor(random() * h / 2) * 2, 2, 2);
		c.fillStyle = 'rgba(230,255,230,.3)';
		c.fillRect(x, y + Math.floor(random() * (h - 6)), w, 4);
		c.fillStyle = 'rgba(0,0,0,.35)';
		c.fillRect(x, y + Math.floor(random() * (h - 6)), w, 2);
	}
	c.restore();
}

// the dead screen over the menu box: near-black with a few very faint static flecks, label in the top corner
function signalLostScreen(c, t, x, y, w, h) {
	c.fillStyle = '#04070a';
	c.fillRect(x, y, w, h);
	const random = rng(1000 + Math.floor(t * 12));
	c.fillStyle = 'rgba(130,150,130,.07)';
	for (let i = 0; i < 90; i++) c.fillRect(x + random() * (w - 2), y + random() * (h - 2), 2, 1);
	cameraLabel(c, t, x, y, 'CAM 00 - SIGNAL LOST', false);
}

// the 4 px bevelled bezel around a screen: light edge top-left, dark edge bottom-right, dark lip against the glass
function bezel(c, x, y, w, h) {
	c.fillStyle = '#28323e';
	c.fillRect(x - 4, y - 4, w + 8, 4);
	c.fillRect(x - 4, y + h, w + 8, 4);
	c.fillRect(x - 4, y, 4, h);
	c.fillRect(x + w, y, 4, h);
	c.fillStyle = '#4d5b6a';
	c.fillRect(x - 4, y - 4, w + 8, 1);
	c.fillRect(x - 4, y - 4, 1, h + 8);
	c.fillStyle = '#080b0f';
	c.fillRect(x - 4, y + h + 3, w + 8, 1);
	c.fillRect(x + w + 3, y - 4, 1, h + 8);
	c.strokeStyle = '#05080b';
	c.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
}

// a screw head with a lighter top edge and a slot
function screw(c, x, y) {
	c.fillStyle = '#566472';
	c.fillRect(x - 2, y - 2, 5, 5);
	c.fillStyle = '#8795a3';
	c.fillRect(x - 1, y - 2, 3, 1);
	c.fillStyle = '#1a222b';
	c.fillRect(x - 1, y, 3, 1);
}

// the console's bottom bar: a bevelled strip, screws at both ends and four status lights blinking at their own pace
function bottomBar(c, t) {
	c.fillStyle = '#1a222c';
	c.fillRect(0, 462, W, 18);
	c.fillStyle = '#4d5b6a';
	c.fillRect(0, 462, W, 1);
	c.fillStyle = '#080b0f';
	c.fillRect(0, 479, W, 1);
	screw(c, 8, 471);
	screw(c, W - 9, 471);
	const lights = [['#4f6', 0], ['#fb3', 0.6], ['#f44', 0.35], ['#4cf', 1.7]];
	lights.forEach(([colour, rate], i) => {
		const lx = 214 + i * 18, on = rate === 0 || Math.floor(t * rate * 2 + i * 0.5) % 2 === 0;
		c.fillStyle = '#0a0e12';
		c.fillRect(lx - 1, 467, 8, 8);
		c.fillStyle = on ? colour : '#222b33';
		c.fillRect(lx, 468, 6, 6);
		if (on) {
			c.fillStyle = 'rgba(255,255,255,.55)';
			c.fillRect(lx + 1, 469, 2, 2);
		}
	});
}

const SCREENS = [
	{ x: LEFT_X, y: GRID_TOP, w: LEFT_W, h: TOP_H },
	{ x: RIGHT_X, y: GRID_TOP, w: RIGHT_W, h: TOP_H },
	{ x: LEFT_X, y: BOTTOM_Y, w: LEFT_W, h: BOTTOM_H },
	{ x: RIGHT_X, y: BOTTOM_Y, w: RIGHT_W, h: BOTTOM_H },
];

export default {
	name: '2b. Corridor cam',
	desc: 'A security console with four camera screens in bevelled bezels, scanlines and now and then a burst of static: CAM 02 looks at an arrivals window where a shuttle docks, CAM 04 down the main hall, CAM 07 at the bridge, with the crew (and Ian, and a cyborg) walking by; the fourth, over the menu, has lost its signal and sits dark. Bright green logo above, blinking status lights below.',
	draw(c, t) {
		// console background and panel edge
		c.fillStyle = '#0d1218';
		c.fillRect(0, 0, W, W);
		c.fillStyle = '#161d26';
		c.fillRect(0, 118, W, 344);
		c.fillStyle = '#4d5b6a';
		c.fillRect(0, 118, W, 1);

		// dark title band: the AI's monitor
		c.fillStyle = 'rgba(0,0,0,.55)';
		c.fillRect(0, 20, W, 98);
		bezel(c, 14, 44, 48, 48);
		c.fillStyle = '#0b1210';
		c.fillRect(14, 44, 48, 48);
		spr(c, 'ai', 22, 52, 1, Math.floor(t * 8));

		// the four screens: dead one top-left (behind the menu), places elsewhere
		signalLostScreen(c, t, LEFT_X, GRID_TOP, LEFT_W, TOP_H);
		corridorView(c, t, RIGHT_X, GRID_TOP, RIGHT_W, TOP_H,
			[['clown', 'e'], ['ian', 'e'], ['monkey', 'e']], 2, 'CAM 02 - ARRIVALS', 1, 'arrivals');
		corridorView(c, t, LEFT_X, BOTTOM_Y, LEFT_W, BOTTOM_H,
			[['nt', 'w'], ['syndi', 'w'], ['secbot', 'w'], ['drone', 'w'], ['cat', 'w'], ['borg', 'w']], 2, 'CAM 04 - MAIN HALL', 2, 'hall');
		corridorView(c, t, RIGHT_X, BOTTOM_Y, RIGHT_W, BOTTOM_H,
			[['wizard', 'e'], ['secborg', 'e']], 2, 'CAM 07 - BRIDGE', 3, 'bridge');
		SCREENS.forEach((r, i) => {
			if (i > 0) cameraNoise(c, t, r.x, r.y, r.w, r.h, i);
			bezel(c, r.x, r.y, r.w, r.h);
		});

		// camera look: green wash, scanlines, dark edges
		c.fillStyle = 'rgba(20,60,30,.12)';
		c.fillRect(0, 0, W, W);
		scanlines(c, .2);
		vignette(c, 220, 380, .4);

		// the logo last, so the wash doesn't dull it: bright phosphor green with a glow
		pixText(c, LOGO, W / 2, 30, 16, 4, '#8fffaa', '#2f8');
		smallText(c, TAGLINE, W / 2, 108, '#b6f5be');

		// console bottom bar: label, status lights, clock counting up from 12:20:34
		bottomBar(c, t);
		smallText(c, 'MONITOR BANK 1', 22, TEXT_Y, '#cfc', 'left', 12);
		smallText(c, clockText(Math.floor(t) + 43200 + 1234), W - 22, TEXT_Y, '#cfc', 'right', 12);
	}
};

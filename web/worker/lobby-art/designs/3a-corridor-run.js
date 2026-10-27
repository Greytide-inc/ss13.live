import { W, spr, tiles, pixText, LOGO, smallText, vignette, rng, MENU_ZONE } from "../helpers.js";

const SCALE = 3;            // the floor tiles and wall are drawn at 3x
const TILE = 32 * SCALE;
const WALL_BOTTOM = 192, FLOOR_Y = 216;
const DOOR_SCALE = 2, DOOR_Y = 96;     // fire doors are smaller so the logo and EVACUATE line have room above them
const SPACING = 240;        // between fire doors, and between alarm lights
const LOOP = 3 * SPACING;   // doors and lights repeat after this
const BEAM_RANGE = 230;
const LIGHT_Y = 112;        // the alarm light sprite's top (scale 2)

// the long window to space, a bit bigger than the menu box so the menu sits on dark glass
const FRAME = 10;
const WIN_X = MENU_ZONE.x - 10, WIN_Y = MENU_ZONE.y - 8;
const WIN_W = MENU_ZONE.w + 20, WIN_H = MENU_ZONE.h + 16;
const random = rng(11);
const WINDOW_STARS = Array.from({ length: 40 }, () => ({ x: random() * WIN_W, y: random() * WIN_H, tw: random() * 6 }));

// x of a door or light, scrolled left and looping from -120 to 600
const loopX = (x, scrolled) => ((x - scrolled) % LOOP + LOOP) % LOOP - 120;

// the runners: one row on one floor line, all the same size and speed, running left to right in and out across the whole width
const RUN_SCALE = 3, RUN_FEET_Y = 462, RUN_SPEED = 100, RUN_GAP = 136;
const RUNNERS = ['alert_clownE', 'alert_ntE', 'alert_wizE', 'alert_ianE', 'alert_syndiE'];
const RUN_LOOP = RUNNERS.length * RUN_GAP;     // wider than the screen plus a sprite, so each leaves fully before it returns

// the wall's fixed detail (pipes, seams, rivets), drawn once; the seams scroll, so it is a strip one LOOP... wide as the picture plus a tile
const SEAM = 96;
let wallDetail = null;
function makeWallDetail() {
	const o = document.createElement('canvas');
	o.width = W + SEAM;
	o.height = WALL_BOTTOM;
	const g = o.getContext('2d');
	// panel seams: a dark groove with a lighter edge, and rivets
	for (let x = 0; x < o.width; x += SEAM) {
		g.fillStyle = 'rgba(0,0,0,.55)';
		g.fillRect(x, 0, 3, WALL_BOTTOM);
		g.fillStyle = 'rgba(255,255,255,.10)';
		g.fillRect(x + 3, 0, 1, WALL_BOTTOM);
		g.fillStyle = 'rgba(255,255,255,.18)';
		for (const y of [6, 84, 168]) {
			g.fillRect(x + 8, y, 2, 2);
			g.fillRect(x + SEAM - 10, y, 2, 2);
		}
	}
	return o;
}
// a pipe along the whole wall: dark body, light top highlight, collars every so often
function pipe(c, y, h, scrolled) {
	c.fillStyle = '#16181c';
	c.fillRect(0, y, W, h);
	c.fillStyle = '#3a3f48';
	c.fillRect(0, y, W, 2);
	c.fillStyle = '#0a0b0d';
	c.fillRect(0, y + h - 2, W, 2);
	c.fillStyle = '#2a2d34';
	for (let x = -(scrolled % 120) - 120; x < W; x += 120) c.fillRect(x, y - 2, 8, h + 4);
}

export default {
	name: '3a. Corridor run',
	desc: 'A hallway in red alarm: crew, Ian and a wizard sprint along the floor under sweeping sirens, past a long dark window onto quiet space.',
	draw(c, t) {
		wallDetail ??= makeWallDetail();
		c.fillStyle = '#000';
		c.fillRect(0, 0, W, W);

		// the floor scrolls at 70 px a second, the wall behind it at half that
		const floorScroll = t * 70;
		const wallScroll = Math.floor(floorScroll * 0.5);
		const floorX = -Math.floor(floorScroll % TILE);
		tiles(c, 'alert_wall', -Math.floor(wallScroll % TILE), 0, WALL_BOTTOM, SCALE);
		tiles(c, 'floor', floorX, FLOOR_Y, W, SCALE);

		// darken the wall, then draw its detail: panel seams, a ceiling pipe and a low pipe
		c.fillStyle = 'rgba(0,0,0,.45)';
		c.fillRect(0, 0, W, WALL_BOTTOM);
		c.drawImage(wallDetail, -(wallScroll % SEAM), 0);
		pipe(c, 4, 8, wallScroll);
		pipe(c, 168, 10, wallScroll);

		// skirting between wall and floor: a gold stripe with dark dashes moving with the floor
		c.fillStyle = '#000';
		c.fillRect(0, WALL_BOTTOM, W, FLOOR_Y - WALL_BOTTOM);
		c.fillStyle = '#d9b400';
		c.fillRect(0, WALL_BOTTOM, W, 4);
		c.fillStyle = '#222';
		c.fillRect(0, 196, W, 2);
		c.fillStyle = '#111';
		for (let x = floorX * 2 % 48 - 48; x < W; x += 48) c.fillRect(x, WALL_BOTTOM, 24, 4);
		c.fillStyle = 'rgba(0,0,0,.3)';
		c.fillRect(0, 198, W, W);

		// fire doors, with the alarm lights halfway between them
		for (let i = 0; i < 3; i++) spr(c, 'alert_fdoor', loopX(i * SPACING, wallScroll), DOOR_Y, DOOR_SCALE);
		const lightXs = [0, 1, 2].map((i) => loopX(i * SPACING + SPACING / 2, wallScroll));

		// each light throws two opposite red beams that spin round it, only onto the wall
		c.save();
		c.beginPath();
		c.rect(0, 0, W, WALL_BOTTOM);
		c.clip();
		c.globalCompositeOperation = 'lighter';
		lightXs.forEach((x, i) => {
			c.save();
			c.translate(x + 32, LIGHT_Y + 16);
			c.rotate(t * 2.4 + i * 2.1);
			const glow = c.createRadialGradient(0, 0, 0, 0, 0, BEAM_RANGE);
			glow.addColorStop(0, 'rgba(255,70,40,.8)');
			glow.addColorStop(1, 'rgba(255,0,0,0)');
			c.fillStyle = glow;
			for (let side = 0; side < 2; side++) {
				c.beginPath();
				c.moveTo(0, 0);
				c.arc(0, 0, BEAM_RANGE, -0.3, 0.3);
				c.closePath();
				c.fill();
				c.rotate(Math.PI);
			}
			c.restore();
		});
		c.restore();
		lightXs.forEach((x) => spr(c, 'alert_light', x, LIGHT_Y, DOOR_SCALE, Math.floor(t * 10)));

		// the runners, each with a soft shadow, bobbing a step out of time with the next
		RUNNERS.forEach((sprite, i) => {
			const x = Math.floor(((i * RUN_GAP + t * RUN_SPEED) % RUN_LOOP + RUN_LOOP) % RUN_LOOP) - 2 * 32 * RUN_SCALE + 20;
			const bob = Math.floor(t * 8 + i) % 2 ? 0 : -RUN_SCALE;
			const mid = x + 16 * RUN_SCALE;
			c.fillStyle = 'rgba(0,0,0,.22)';
			c.fillRect(mid - 11 * RUN_SCALE, RUN_FEET_Y - RUN_SCALE, 22 * RUN_SCALE, 3 * RUN_SCALE);
			c.fillStyle = 'rgba(0,0,0,.3)';
			c.fillRect(mid - 8 * RUN_SCALE, RUN_FEET_Y - RUN_SCALE, 16 * RUN_SCALE, 2 * RUN_SCALE);
			spr(c, sprite, x, RUN_FEET_Y - 32 * RUN_SCALE + bob, RUN_SCALE);
		});

		// pulsing red alarm wash, dark edges, a dark fade at the top so the logo reads
		const pulse = 0.5 + 0.5 * Math.sin(t * 5);
		c.fillStyle = `rgba(180,0,0,${.12 + .16 * pulse})`;
		c.fillRect(0, 0, W, W);
		vignette(c, 170, 360, .5);
		const topShade = c.createLinearGradient(0, 0, 0, 100);
		topShade.addColorStop(0, 'rgba(0,0,0,.55)');
		topShade.addColorStop(1, 'rgba(0,0,0,0)');
		c.fillStyle = topShade;
		c.fillRect(0, 0, W, 100);

		// the window over everything: dark glass, a few dim stars, then a chunky metal frame
		c.fillStyle = '#02030a';
		c.fillRect(WIN_X, WIN_Y, WIN_W, WIN_H);
		WINDOW_STARS.forEach((s) => {
			c.fillStyle = `rgba(190,200,255,${.2 + .15 * Math.sin(t * 2 + s.tw)})`;
			c.fillRect(WIN_X + Math.floor(s.x), WIN_Y + Math.floor(s.y), 1, 1);
		});
		const fx = WIN_X - FRAME, fy = WIN_Y - FRAME, fw = WIN_W + 2 * FRAME, fh = WIN_H + 2 * FRAME;
		// four bars: dark outer line, mid steel, a light top edge, dark inner lip next to the glass
		const bars = [[fx, fy, fw, FRAME], [fx, WIN_Y + WIN_H, fw, FRAME], [fx, WIN_Y, FRAME, WIN_H], [WIN_X + WIN_W, WIN_Y, FRAME, WIN_H]];
		bars.forEach(([x, y, w, h]) => {
			c.fillStyle = '#3a3d46';
			c.fillRect(x, y, w, h);
		});
		c.fillStyle = '#5a5e69';
		c.fillRect(fx + 1, fy + 1, fw - 2, 2);
		c.fillRect(fx + 1, fy + 1, 2, fh - 2);
		c.fillStyle = '#1a1c21';
		c.fillRect(fx, fy + fh - 2, fw, 2);
		c.fillRect(fx + fw - 2, fy, 2, fh);
		c.fillRect(fx, fy, fw, 1);
		c.fillRect(fx, fy, 1, fh);
		// inner lip around the glass
		c.fillStyle = '#0c0d11';
		c.fillRect(WIN_X - 2, WIN_Y - 2, WIN_W + 4, 2);
		c.fillRect(WIN_X - 2, WIN_Y + WIN_H, WIN_W + 4, 2);
		c.fillRect(WIN_X - 2, WIN_Y, 2, WIN_H);
		c.fillRect(WIN_X + WIN_W, WIN_Y, 2, WIN_H);
		// bolts at the corners and halfway along the long sides
		c.fillStyle = '#8a8f9b';
		const bx = [fx + 3, fx + fw - 7, fx + Math.floor(fw / 2) - 2], by = [fy + 3, fy + fh - 7];
		bx.forEach((x) => by.forEach((y) => c.fillRect(x, y, 4, 4)));
		c.fillStyle = '#25272d';
		bx.forEach((x) => by.forEach((y) => c.fillRect(x + 2, y + 2, 2, 2)));
		// the red alarm glinting along the frame's outer edges
		c.fillStyle = `rgba(255,40,30,${.12 + .22 * pulse})`;
		c.fillRect(fx, fy, fw, 2);
		c.fillRect(fx, fy + fh - 2, fw, 2);

		pixText(c, LOGO, W / 2, 8, 16, 3, '#fff', '#f22');
		if (Math.floor(t * 2) % 2 === 0) smallText(c, '!! EVACUATE !!', W / 2, 90, '#f66', 'center', 16);
	}
};

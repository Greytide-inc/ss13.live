import { W, spr, tiles, pixText, LOGO, smallText, vignette } from "../helpers.js";

const SCALE = 3;            // the hallway is drawn at 3x
const TILE = 32 * SCALE;
const WALL_BOTTOM = 192, FLOOR_Y = 216;
const SPACING = 240;        // between fire doors, and between alarm lights
const LOOP = 3 * SPACING;   // doors and lights repeat after this
const BEAM_RANGE = 260;

// x of a door or light, scrolled left and looping from -120 to 600
const loopX = (x, scrolled) => ((x - scrolled) % LOOP + LOOP) % LOOP - 120;

// the runners: two rows looping left to right, the back row smaller and slower
const RUNNERS = [
	{ sprite: 'alert_wizE', startX: 100, speed: 90, scale: 4, feetY: 360 },
	{ sprite: 'alert_ntE', startX: 340, speed: 90, scale: 4, feetY: 360 },
	{ sprite: 'alert_ntE', startX: 580, speed: 90, scale: 4, feetY: 360 },
	{ sprite: 'alert_clownE', startX: 0, speed: 120, scale: 5, feetY: 466 },
	{ sprite: 'alert_ianE', startX: 240, speed: 120, scale: 5, feetY: 466 },
	{ sprite: 'alert_syndiE', startX: 480, speed: 120, scale: 5, feetY: 466 },
];

export default {
	name: '3a. Corridor run',
	desc: 'A station hallway at ground level: crew, Ian and a wizard sprint past under flashing fire-alarm lights while red sirens sweep the walls.',
	draw(c, t) {
		c.fillStyle = '#000';
		c.fillRect(0, 0, W, W);

		// the floor scrolls at 70 px a second, the wall behind it at half that
		const floorScroll = t * 70;
		const wallScroll = floorScroll * 0.5;
		const floorX = -Math.floor(floorScroll % TILE);
		tiles(c, 'alert_wall', -Math.floor(wallScroll % TILE), 0, WALL_BOTTOM, SCALE);
		tiles(c, 'floor', floorX, FLOOR_Y, W, SCALE);

		// skirting between wall and floor: a gold stripe with dark dashes moving with the floor
		c.fillStyle = '#000';
		c.fillRect(0, WALL_BOTTOM, W, FLOOR_Y - WALL_BOTTOM);
		c.fillStyle = '#d9b400';
		c.fillRect(0, WALL_BOTTOM, W, 4);
		c.fillStyle = '#222';
		c.fillRect(0, 196, W, 2);
		c.fillStyle = '#111';
		for (let x = floorX * 2 % 48 - 48; x < W; x += 48) c.fillRect(x, WALL_BOTTOM, 24, 4);

		// darken the wall, and a bit less from the skirting down
		c.fillStyle = 'rgba(0,0,0,.4)';
		c.fillRect(0, 0, W, WALL_BOTTOM);
		c.fillStyle = 'rgba(0,0,0,.3)';
		c.fillRect(0, 198, W, W);

		// fire doors, with the alarm lights halfway between them
		for (let i = 0; i < 3; i++) spr(c, 'alert_fdoor', loopX(i * SPACING, wallScroll), 100, SCALE);
		const lightXs = [0, 1, 2].map((i) => loopX(i * SPACING + SPACING / 2, wallScroll));

		// each light throws two opposite red beams that spin round it
		c.save();
		c.globalCompositeOperation = 'lighter';
		lightXs.forEach((x, i) => {
			c.save();
			c.translate(x + 48, 130);
			c.rotate(t * 3 + i * 2.1);
			const glow = c.createRadialGradient(0, 0, 0, 0, 0, BEAM_RANGE);
			glow.addColorStop(0, 'rgba(255,50,30,.45)');
			glow.addColorStop(1, 'rgba(255,0,0,0)');
			c.fillStyle = glow;
			for (let side = 0; side < 2; side++) {
				c.beginPath();
				c.moveTo(0, 0);
				c.arc(0, 0, BEAM_RANGE, -0.35, 0.35);
				c.closePath();
				c.fill();
				c.rotate(Math.PI);
			}
			c.restore();
		});
		c.restore();
		lightXs.forEach((x) => spr(c, 'alert_light', x, 112, SCALE, Math.floor(t * 10)));

		// the runners, each with a shadow, bobbing a step out of time with the next
		RUNNERS.forEach((r, i) => {
			const loop = W + 240;
			const x = ((r.startX + t * r.speed) % loop + W + 240) % loop - 170;
			const bob = Math.floor(t * r.speed / 9 + i) % 2 ? 0 : -r.scale;
			c.fillStyle = 'rgba(0,0,0,.45)';
			c.fillRect(Math.round(x + r.scale * 6), r.feetY - r.scale, r.scale * 20, r.scale * 2);
			spr(c, r.sprite, x, r.feetY - 32 * r.scale + bob, r.scale);
		});

		// pulsing red alarm wash, dark edges, a dark fade at the top so the logo reads
		const pulse = 0.5 + 0.5 * Math.sin(t * 5);
		c.fillStyle = `rgba(180,0,0,${.15 + .2 * pulse})`;
		c.fillRect(0, 0, W, W);
		vignette(c, 160, 350, .55);
		const topShade = c.createLinearGradient(0, 0, 0, 150);
		topShade.addColorStop(0, 'rgba(0,0,0,.6)');
		topShade.addColorStop(1, 'rgba(0,0,0,0)');
		c.fillStyle = topShade;
		c.fillRect(0, 0, W, 150);

		pixText(c, LOGO, W / 2, 22, 16, 4, '#fff', '#f22');
		if (Math.floor(t * 2) % 2) smallText(c, '!! EVACUATE !!', W / 2, 128, '#f66', 'center', 16);
	}
};

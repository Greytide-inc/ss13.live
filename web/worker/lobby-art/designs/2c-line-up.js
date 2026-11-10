import { W, tiles, pixText, LOGO, TAGLINE, smallText, crwPut } from "../helpers.js";

const FEET_Y = 438;     // the suspects' feet, and the 0 of the height chart
const FLOOR_Y = 420;
const PX_PER_FOOT = 12;
const FIRST_X = 50, SPACING = 72;   // centres of the five suspects
const BEEPSKY_X = 430;              // Beepsky stands well clear of the last suspect and the edge
const GLASS = { x: 16, y: 140, w: 314, h: 224 };   // the one-way mirror, covering the whole menu box (x 22..318, y 176..344)
const CAMERA = { x: 452, y: 40 };   // the wall camera that takes the flash photos, right of the logo sign
const BOARD = { x: 346, y: 144, w: 124, h: 150 };  // the charge board on the wall right of the mirror
const SUSPECTS = [
	['crew_syndi', 'GRAND', 'SABOTAGE'], ['crew_pirate', 'SPACE', 'PIRACY'], ['crew_clown', 'EXCESSIVE', 'HONKING'],
	['crew_skel', 'INDECENT', 'EXPOSURE'], ['crew_wizard', 'UNLICENSED', 'MAGIC'],
];
// the spotlight stops on each suspect in turn, along the row and back: STAY seconds on one, then MOVE seconds gliding to the next
const ORDER = [0, 1, 2, 3, 4, 3, 2, 1], STAY = 2.7, MOVE = 0.6;
const FLASH_AT = 0.9;               // the camera takes the photo this long after the spotlight arrives

let wallCache = null;   // the wall, drawn once: a moody blue-grey with panel seams, darker toward the corners

/** the interrogation-room wall with its height chart: built once, then copied every frame */
function buildWall() {
	const cv = document.createElement('canvas');
	cv.width = cv.height = W;
	const c = cv.getContext('2d');
	const sky = c.createLinearGradient(0, 0, 0, FLOOR_Y);
	sky.addColorStop(0, '#2c3d4a');
	sky.addColorStop(1, '#4b6170');
	c.fillStyle = sky;
	c.fillRect(0, 0, W, W);

	// wall panels: vertical seams every 60 px with a light edge beside each, and a darker skirting board
	for (let x = 30; x < W; x += 60) {
		c.fillStyle = 'rgba(0,0,0,.28)';
		c.fillRect(x, 0, 2, FLOOR_Y);
		c.fillStyle = 'rgba(255,255,255,.06)';
		c.fillRect(x + 2, 0, 1, FLOOR_Y);
	}
	c.fillStyle = 'rgba(0,0,0,.25)';
	c.fillRect(0, FLOOR_Y - 14, W, 10);

	// height chart: a line for every half foot from 3' to 8'; the full feet are brighter and numbered at both edges and right of the mirror
	for (let half = 6; half <= 16; half++) {
		const ft = half / 2, y = FEET_Y - ft * PX_PER_FOOT, full = half % 2 == 0;
		c.fillStyle = full ? '#c9d6de' : '#7d909d';
		c.fillRect(0, y, W, 1);
		c.fillStyle = full ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.2)';
		c.fillRect(0, y + 1, W, 1);
		if (full && ft >= 4) {
			for (const [x, align] of [[3, 'left'], [W - 3, 'right'], [348, 'left']]) {
				if (x == 3 && y < 376) continue;   // the mirror's frame hides the left end of the higher lines
				smallText(c, ft + "'", x, y - 2, '#e8f0f4', align, 10);
			}
		}
	}
	smallText(c, 'HEIGHT', 400, FEET_Y - 8 * PX_PER_FOOT - 8, '#c9d6de', 'center', 10);

	// dark corners
	const g = c.createRadialGradient(W / 2, W / 2, 130, W / 2, W / 2, 340);
	g.addColorStop(0, 'rgba(0,0,0,0)');
	g.addColorStop(1, 'rgba(0,0,0,.6)');
	c.fillStyle = g;
	c.fillRect(0, 0, W, FLOOR_Y);
	return cv;
}

export default {
	name: '2c. Line-up',
	desc: 'A police line-up room: five suspects on numbered spots in front of a numbered height chart on a moody blue-grey wall, a spotlight stopping on each in turn while a wall camera takes the photo (the suspect flinches) and a board on the wall names the charge (the clown: excessive honking), and Beepsky on guard, with a dark framed one-way mirror on the wall above them.',
	draw(c, t) {
		wallCache ??= buildWall();
		c.drawImage(wallCache, 0, 0);

		// floor with a yellow line along its top
		c.fillStyle = '#394552';
		c.fillRect(0, FLOOR_Y, W, 60);
		tiles(c, 'dark', 0, FLOOR_Y);
		c.fillStyle = '#e8d34a';
		c.fillRect(0, FLOOR_Y - 4, W, 4);

		// the spotlight stops on one suspect, then glides to the next
		const turn = Math.floor(t / (STAY + MOVE)), inTurn = t - turn * (STAY + MOVE);
		const now = ORDER[turn % ORDER.length], next = ORDER[(turn + 1) % ORDER.length];
		const glide = Math.max(0, (inTurn - STAY) / MOVE), eased = glide * glide * (3 - 2 * glide);
		const spotX = FIRST_X + SPACING * (now + (next - now) * eased);
		const sinceFlash = inTurn - FLASH_AT;

		// a pool of light on the floor under the spotlight
		c.fillStyle = 'rgba(255,250,200,.12)';
		c.beginPath();
		c.ellipse(Math.round(spotX), FEET_Y + 2, 54, 10, 0, 0, 7);
		c.fill();

		// the suspects, dimmed unless the spotlight is on them, each fidgeting (2 px up) for a third of a second
		// every 3.5 s at its own time, over a numbered plate; the one in the spotlight flinches at the camera flash
		SUSPECTS.forEach(([who], i) => {
			const x = FIRST_X + i * SPACING;
			const flinch = i == now && sinceFlash > 0 && sinceFlash < 0.25;
			const hop = flinch ? 3 : Math.floor(t * 3 + i * 5) % 10 == 0 ? 2 : 0;
			c.save();
			c.filter = `brightness(${Math.abs(x - spotX) < 46 ? 1 : 0.6})`;
			crwPut(c, who + '_s', x, FEET_Y, 2, 0, true, hop);
			c.restore();

			c.fillStyle = '#f4f4f0';
			c.fillRect(x - 16, 447, 32, 22);
			c.fillStyle = '#222';
			c.font = 'bold 16px "DejaVu Sans Mono",monospace';
			c.textAlign = 'center';
			c.fillText(String(i + 1), x, 464);
			c.textAlign = 'left';
		});

		// the spotlight's beam, widening and fading towards the floor
		const beam = c.createLinearGradient(0, 0, 0, FEET_Y);
		beam.addColorStop(0, 'rgba(255,250,200,.30)');
		beam.addColorStop(1, 'rgba(255,250,200,.06)');
		c.fillStyle = beam;
		c.beginPath();
		c.moveTo(spotX - 8, 0);
		c.lineTo(spotX + 8, 0);
		c.lineTo(spotX + 52, FEET_Y);
		c.lineTo(spotX - 52, FEET_Y);
		c.fill();

		// Beepsky on guard at the right, three times his size, bobbing
		crwPut(c, 'crew_secbot_w', BEEPSKY_X, FEET_Y, 3, 0, true, Math.round(Math.sin(t * 3) * 1.5 + 2));

		// the charge board: which suspect is in the spotlight and what for; the name of the charge types itself out
		c.fillStyle = '#0c1218';
		c.fillRect(BOARD.x - 3, BOARD.y - 3, BOARD.w + 6, BOARD.h + 6);
		c.fillStyle = '#8d9eab';
		c.fillRect(BOARD.x - 2, BOARD.y - 2, BOARD.w + 4, BOARD.h + 4);
		c.fillStyle = '#10181f';
		c.fillRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h);
		c.fillStyle = '#e8d34a';
		c.fillRect(BOARD.x, BOARD.y, BOARD.w, 16);
		smallText(c, 'NOW VIEWING', BOARD.x + BOARD.w / 2, BOARD.y + 12, '#14202c', 'center', 11);
		const moving = inTurn > STAY;
		if (!moving) {
			smallText(c, 'SUSPECT', BOARD.x + 10, BOARD.y + 34, '#8fa3b0', 'left', 10);
			pixText(c, String(now + 1), BOARD.x + BOARD.w - 34, BOARD.y + 22, 16, 3, '#ffe66a', null);
			smallText(c, 'CHARGE:', BOARD.x + 10, BOARD.y + 92, '#8fa3b0', 'left', 10);
			const [, line1, line2] = SUSPECTS[now], typed = Math.floor(inTurn * 22);
			smallText(c, line1.slice(0, typed), BOARD.x + 10, BOARD.y + 108, '#ff8a70', 'left', 12);
			smallText(c, line2.slice(0, Math.max(0, typed - line1.length)), BOARD.x + 10, BOARD.y + 123, '#ff8a70', 'left', 12);
		}
		SUSPECTS.forEach((_, i) => {             // five lamps along the bottom, the current one lit
			c.fillStyle = '#05080b';
			c.fillRect(BOARD.x + 13 + i * 22, BOARD.y + BOARD.h - 14, 10, 8);
			c.fillStyle = i == now && !moving ? '#ffe66a' : '#3a4650';
			c.fillRect(BOARD.x + 14 + i * 22, BOARD.y + BOARD.h - 13, 8, 6);
		});

		// the camera flashes once for each suspect, fading out over 0.4 s; a hard white spark at the camera lens
		if (sinceFlash > 0 && sinceFlash < 0.4) {
			const fade = 1 - sinceFlash / 0.4;
			c.fillStyle = `rgba(255,255,255,${0.4 * fade * fade})`;
			c.fillRect(0, 0, W, W);
			c.fillStyle = `rgba(255,255,255,${fade})`;
			c.fillRect(CAMERA.x - 14, CAMERA.y + 6, 28, 3);
			c.fillRect(CAMERA.x - 1, CAMERA.y - 6, 3, 28);
		}

		// the one-way mirror: a dark pane with a few very dim diagonal reflection streaks, drawn only above and below the menu box
		c.fillStyle = '#05080c';
		c.fillRect(GLASS.x, GLASS.y, GLASS.w, GLASS.h);
		c.save();
		c.beginPath();
		c.rect(GLASS.x, GLASS.y, GLASS.w, 176 - GLASS.y);
		c.rect(GLASS.x, 344, GLASS.w, GLASS.y + GLASS.h - 344);
		c.clip();
		for (const [sx, wide, alpha] of [[110, 22, .08], [160, 8, .07], [270, 26, .06]]) {
			c.fillStyle = `rgba(150,180,210,${alpha})`;
			c.beginPath();
			c.moveTo(sx, GLASS.y);
			c.lineTo(sx + wide, GLASS.y);
			c.lineTo(sx - 90 + wide, GLASS.y + GLASS.h);
			c.lineTo(sx - 90, GLASS.y + GLASS.h);
			c.fill();
		}
		c.restore();
		// a solid steel frame: dark outer edge, light edge, mid band, dark inner edge
		const frame = (grow, colour, line) => {
			c.strokeStyle = colour;
			c.lineWidth = line;
			c.strokeRect(GLASS.x - grow, GLASS.y - grow, GLASS.w + 2 * grow, GLASS.h + 2 * grow);
		};
		frame(7, '#0c1218', 2);
		frame(5, '#8d9eab', 2);
		frame(3, '#4d5d6b', 2);
		frame(1, '#1a232c', 2);
		c.lineWidth = 1;
		// the wall camera: a small box on a bracket, its red light blinking
		c.fillStyle = '#10171e';
		c.fillRect(CAMERA.x - 3, CAMERA.y - 12, 6, 10);
		c.fillStyle = '#6c7d8a';
		c.fillRect(CAMERA.x - 16, CAMERA.y - 2, 32, 18);
		c.fillStyle = '#9aabb7';
		c.fillRect(CAMERA.x - 16, CAMERA.y - 2, 32, 3);
		c.fillStyle = '#10171e';
		c.fillRect(CAMERA.x - 14, CAMERA.y + 4, 8, 8);
		c.fillStyle = '#37506a';
		c.fillRect(CAMERA.x - 12, CAMERA.y + 6, 4, 4);
		c.fillStyle = Math.floor(t * 1.5) % 2 ? '#ff4040' : '#5a1818';
		c.fillRect(CAMERA.x + 8, CAMERA.y + 4, 4, 4);

		// logo sign with a yellow border
		c.fillStyle = '#14202c';
		c.fillRect(56, 14, 368, 92);
		c.strokeStyle = '#e8d34a';
		c.lineWidth = 3;
		c.strokeRect(57.5, 15.5, 365, 89);
		c.lineWidth = 1;
		pixText(c, LOGO, W / 2, 26, 16, 4, '#fff', '#e8d34a');
		smallText(c, TAGLINE, W / 2, 98, '#cdb');
	}
};

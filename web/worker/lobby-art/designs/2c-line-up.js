import { W, spr, tiles, pixText, LOGO, TAGLINE, smallText, crwPut } from "../helpers.js";

const FEET_Y = 438;     // the suspects' feet, and the 0 of the height chart
const FLOOR_Y = 420;
const PX_PER_FOOT = 16;
const FIRST_X = 50, SPACING = 72;   // centres of the five suspects

export default {
	name: '2c. Line-up',
	desc: 'A security identification line-up: five suspects shuffling in front of a height chart while a spotlight sweeps along them, a camera flash pops every few seconds, and Beepsky stands guard.',
	draw(c, t) {
		c.fillStyle = '#7f94a8';
		c.fillRect(0, 0, W, W);

		// height chart: a line per foot from 3 to 10, the even ones thicker and labelled
		for (let ft = 3; ft <= 10; ft++) {
			const y = FEET_Y - ft * PX_PER_FOOT;
			const even = ft % 2 == 0;
			c.fillStyle = even ? '#1a2736' : '#2c3b4c';
			c.fillRect(0, y, W, even ? 2 : 1);
			if (even) smallText(c, ft + "'", 10, y - 3, '#1a2736', 'left', 10);
		}
		smallText(c, 'HEIGHT', W - 10, FEET_Y - 10 * PX_PER_FOOT - 6, '#1a2736', 'right', 10);

		// floor with a yellow line along its top
		c.fillStyle = '#394552';
		c.fillRect(0, FLOOR_Y, W, 60);
		tiles(c, 'dark', 0, FLOOR_Y);
		c.fillStyle = '#e8d34a';
		c.fillRect(0, FLOOR_Y - 4, W, 4);

		// the spotlight sweeps from the first suspect to the last and back
		const spotX = (Math.sin(t * 0.7) * 0.5 + 0.5) * (SPACING * 4) + FIRST_X;

		// the suspects, dimmed unless the spotlight is on them, each lifting 4 px for half a second
		// every 3.5 s at its own time, over a numbered plate
		['crew_syndi', 'crew_pirate', 'crew_clown', 'crew_skel', 'crew_wizard'].forEach((who, i) => {
			const x = FIRST_X + i * SPACING;
			const hop = Math.floor(t * 2 + i * 3) % 7 == 0 ? 4 : 0;
			c.save();
			c.filter = `brightness(${Math.abs(x - spotX) < 46 ? 1 : 0.5})`;
			crwPut(c, who + '_s', x, FEET_Y, 3, 0, true, hop);
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

		// Beepsky on guard at the right, bobbing
		crwPut(c, 'crew_secbot_w', 430, FEET_Y, 2, 0, true, Math.round(Math.sin(t * 3) * 1.5 + 2));

		// the AI's monitor, top left
		c.fillStyle = '#0a1118';
		c.fillRect(6, 34, 40, 40);
		c.strokeStyle = '#e8d34a';
		c.strokeRect(6.5, 34.5, 39, 39);
		spr(c, 'ai', 10, 38, 1, Math.floor(t * 8));

		// logo sign with a yellow border
		c.fillStyle = '#14202c';
		c.fillRect(56, 14, 368, 92);
		c.strokeStyle = '#e8d34a';
		c.lineWidth = 3;
		c.strokeRect(57.5, 15.5, 365, 89);
		c.lineWidth = 1;
		pixText(c, LOGO, W / 2, 26, 16, 4, '#fff', '#e8d34a');
		smallText(c, TAGLINE, W / 2, 98, '#cdb');

		// camera flash every 3 s (at t = 2, 5, 8 ...), fading out over 0.4 s
		const sinceFlash = (t + 1) % 3;
		if (sinceFlash < 0.4) {
			const fade = 1 - sinceFlash / 0.4;
			c.fillStyle = `rgba(255,255,255,${0.8 * fade * fade})`;
			c.fillRect(0, 0, W, W);
		}
	}
};

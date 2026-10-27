import { IMG, W, spr, tiles, starfield, pixText, LOGO, TAGLINE, smallText, crwPut, scanlines, vignette } from "../helpers.js";

const WINDOW_TOP = 150, WINDOW_W = 130, WINDOW_H = 90;
const WINDOW_BOTTOM = WINDOW_TOP + WINDOW_H;
const STATION_W = 220;   // the station as seen through the windows
const FLOOR_Y = 268;
const TEXT_Y = 467;      // the REC line and the clock

// "HH:MM:SS" for seconds since midnight
function clockText(seconds) {
	const two = (n) => String(n).padStart(2, '0');
	return two(Math.floor(seconds / 3600) % 24) + ':' + two(Math.floor(seconds / 60) % 60) + ':' + two(seconds % 60);
}

export default {
	name: '2b. Corridor cam',
	desc: 'A security-camera view of a station hallway: stars and the station drift past the windows while the whole crew (and Ian, and a cyborg) keep marching past in both directions, with a REC light and a ticking clock.',
	draw(c, t) {
		// wall, panel seams, ceiling light strip
		c.fillStyle = '#1b2430';
		c.fillRect(0, 0, W, W);
		c.fillStyle = '#222d3a';
		for (let x = 0; x < W; x += 48) c.fillRect(x, 120, 2, 148);
		c.fillStyle = '#34414f';
		c.fillRect(0, 126, W, 4);
		c.fillStyle = '#9cb';
		c.fillRect(0, 126, W, 1);

		// three windows on one sky: stars, a blue tint, the station sliding past, a glint on the glass
		const station = IMG.station;
		const stationH = STATION_W * station.height / station.width;
		const stationX = W - (((t + 40) * 9) % (W + STATION_W + 120));
		for (let i = 0; i < 3; i++) {
			const x = 20 + i * 152;
			c.save();
			c.beginPath();
			c.rect(x, WINDOW_TOP, WINDOW_W, WINDOW_H);
			c.clip();
			starfield(c, t, 10, -1, 0);
			const tint = c.createLinearGradient(0, WINDOW_TOP, 0, WINDOW_BOTTOM);
			tint.addColorStop(0, 'rgba(40,70,140,.35)');
			tint.addColorStop(1, 'rgba(10,20,50,0)');
			c.fillStyle = tint;
			c.fillRect(x, WINDOW_TOP, WINDOW_W, WINDOW_H);
			c.globalAlpha = 0.7;
			c.drawImage(station, Math.round(stationX), 195 - Math.round(stationH / 2), STATION_W, stationH);
			c.globalAlpha = 1;
			c.fillStyle = 'rgba(255,255,255,.07)';
			c.beginPath();
			c.moveTo(x + 20, WINDOW_TOP);
			c.lineTo(x + 46, WINDOW_TOP);
			c.lineTo(x + 16, WINDOW_BOTTOM);
			c.lineTo(x - 10, WINDOW_BOTTOM);
			c.fill();
			c.restore();

			// frame and sill
			c.strokeStyle = '#6c7885';
			c.lineWidth = 4;
			c.strokeRect(x, WINDOW_TOP, WINDOW_W, WINDOW_H);
			c.lineWidth = 1;
			c.fillStyle = '#8a97a3';
			c.fillRect(x - 4, WINDOW_BOTTOM, 138, 4);
		}

		// dark band with a red stripe under the windows, then the floor
		c.fillStyle = '#2b3644';
		c.fillRect(0, 244, W, 24);
		c.fillStyle = '#c33';
		c.fillRect(0, 252, W, 4);
		tiles(c, 'floor', 0, FLOOR_Y);
		c.fillStyle = 'rgba(0,0,0,.2)';
		c.fillRect(0, FLOOR_Y, W, 6);

		// two lines of crew, evenly spaced and looping: the back row walks left at 2x size, the front row right at 3x
		const loop = W + 160;
		const back = ['crew_nt', 'crew_syndi', 'crew_secbot', 'crew_drone', 'crew_cat', 'crew_borg'];
		back.forEach((who, i) => {
			const x = ((i * (loop / back.length) - t * 22) % loop + loop) % loop - 80;
			const bob = Math.floor(t * 5 + i) % 2 ? 2 : 0;
			crwPut(c, who + '_w', x + 32, 330, 2, 0, true, bob);
		});
		const front = ['crew_clown', 'crew_wizard', 'crew_ian', 'crew_secborg', 'crew_monkey'];
		front.forEach((who, i) => {
			const x = ((i * (loop / front.length) + t * 34) % loop + loop) % loop - 100;
			const bob = Math.floor(t * 6 + i) % 2 ? 3 : 0;
			crwPut(c, who + '_e', x + 48, 430, 3, 0, true, bob);
		});

		// dark title band: the AI's monitor, logo and tagline
		c.fillStyle = 'rgba(0,0,0,.55)';
		c.fillRect(0, 20, W, 100);
		c.fillStyle = '#0b1210';
		c.fillRect(10, 40, 52, 52);
		c.strokeStyle = '#6c7885';
		c.strokeRect(10.5, 40.5, 51, 51);
		spr(c, 'ai', 20, 48, 1, Math.floor(t * 8));
		pixText(c, LOGO, W / 2, 32, 16, 4, '#e8f4e8', '#5c8');
		smallText(c, TAGLINE, W / 2, 108, '#9c9');

		// camera look: green wash, scanlines, dark edges
		c.fillStyle = 'rgba(20,60,30,.18)';
		c.fillRect(0, 0, W, W);
		scanlines(c, .22);
		vignette(c, 160, 350, .7);

		// blinking REC light, camera name, clock counting up from 12:20:34
		c.fillStyle = '#f33';
		if (Math.floor(t * 1.5) % 2) {
			c.beginPath();
			c.arc(30, 462, 6, 0, 7);
			c.fill();
		}
		smallText(c, 'REC  CAM 04 - MAIN HALL', 44, TEXT_Y, '#cfc', 'left', 12);
		smallText(c, clockText(Math.floor(t) + 43200 + 1234), W - 14, TEXT_Y, '#cfc', 'right', 12);
	}
};

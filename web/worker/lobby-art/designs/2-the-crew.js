import { W, spr, tiles, starfield, crwPut, crwLogo } from "../helpers.js";

// the observation window: wide at the top, then a tall pane down the left side that holds the menu
const FRAME = 14;             // thick hull frame round the window
const TOP = 12;               // the frame along the top
const TOP_PANE_BOTTOM = 168;   // the full-width part of the window ends here
const SIDE_PANE_RIGHT = 336;   // the tall left pane ends here
const SILL_Y = 358;            // bottom of the tall pane
const BASEBOARD_Y = 376;
const DECK_Y = 382;            // floor tiles start here
const FEET_Y = 452;
const AI_X = 364;              // left edge of the AI's wall screen
const AI_Y = 204;
const CREW_GAP = 70;           // even spacing along the deck
const CREW_X0 = 65;

// a small rivet: a light dot with a dark one under it
function rivet(c, x, y) {
	c.fillStyle = '#1c242c';
	c.fillRect(x, y + 1, 2, 2);
	c.fillStyle = '#9aa6b2';
	c.fillRect(x, y, 2, 2);
}

export default {
	name: '2. The crew',
	desc: 'An observation deck: a big riveted window of stars runs down the left side, the station AI watches from a bracketed wall screen on the right (vent, panel seams and blinking lights around it), and six station regulars idle on the deck below: clown, officer, wizard, syndie, Beepsky (light flashing), Ian (hops now and then).',
	draw(c, t) {
		starfield(c, t, 3);

		// wall everywhere below the top pane, with panel seams on the right
		c.fillStyle = '#27313d';
		c.fillRect(0, TOP_PANE_BOTTOM, W, BASEBOARD_Y - TOP_PANE_BOTTOM);
		c.fillStyle = '#1e2832';
		for (let x = SIDE_PANE_RIGHT + 30; x < W; x += 60) c.fillRect(x, TOP_PANE_BOTTOM + 14, 2, BASEBOARD_Y - TOP_PANE_BOTTOM - 14);

		// the tall pane: stars again, dimmed so the menu stays readable
		const paneH = SILL_Y - TOP_PANE_BOTTOM;
		c.save();
		c.beginPath();
		c.rect(FRAME, TOP_PANE_BOTTOM, SIDE_PANE_RIGHT - FRAME, paneH);
		c.clip();
		starfield(c, t, 3);
		c.fillStyle = 'rgba(0,0,0,.75)';
		c.fillRect(FRAME, TOP_PANE_BOTTOM, SIDE_PANE_RIGHT - FRAME, paneH);
		c.restore();

		// faint glass streaks across the top pane (only up there, well clear of the menu box)
		c.fillStyle = 'rgba(180,210,255,.05)';
		for (const [x, w] of [[90, 14], [140, 5], [330, 18], [380, 6]]) {
			for (let y = TOP; y < TOP_PANE_BOTTOM; y += 2) c.fillRect(x + ((TOP_PANE_BOTTOM - y) / 2 | 0), y, w, 2);
		}

		// window frame: top, left, right of the top pane, right of the tall pane, each with a light edge towards the glass and a dark outer edge
		c.fillStyle = '#46525e';
		c.fillRect(0, 0, W, TOP);
		c.fillRect(0, 0, FRAME, SILL_Y);
		c.fillRect(W - FRAME, 0, FRAME, TOP_PANE_BOTTOM);
		c.fillRect(SIDE_PANE_RIGHT, TOP_PANE_BOTTOM, 6, paneH);
		c.fillStyle = '#6b7885';
		c.fillRect(0, TOP - 3, W, 3);
		c.fillRect(FRAME - 3, TOP, 3, SILL_Y - TOP);
		c.fillRect(W - FRAME, TOP, 3, TOP_PANE_BOTTOM - TOP);
		c.fillStyle = '#2a333c';
		c.fillRect(0, 0, W, 2);
		c.fillRect(0, 0, 2, SILL_Y);
		c.fillRect(W - 2, 0, 2, TOP_PANE_BOTTOM);

		// rivets along the outer frame, and struts where the frame corners meet the glass
		for (let x = 20; x < W - 14; x += 40) rivet(c, x, 3);
		for (let y = 30; y < SILL_Y - 8; y += 40) rivet(c, 4, y);
		for (let y = 30; y < TOP_PANE_BOTTOM - 8; y += 40) rivet(c, W - 10, y);
		c.fillStyle = '#56626e';
		for (let i = 0; i < 14; i++) {
			c.fillRect(FRAME + i, TOP + i, 2, 1);          // top-left corner strut
			c.fillRect(W - FRAME - i - 2, TOP + i, 2, 1);  // top-right corner strut
		}

		// sill under the top pane's right part, with a light top edge
		c.fillStyle = '#8a97a3';
		c.fillRect(SIDE_PANE_RIGHT, TOP_PANE_BOTTOM - 10, W - SIDE_PANE_RIGHT, 10);
		c.fillStyle = '#b8c4cf';
		c.fillRect(SIDE_PANE_RIGHT, TOP_PANE_BOTTOM - 10, W - SIDE_PANE_RIGHT, 3);

		// sill under the tall pane, with a shadow under it
		c.fillStyle = '#8a97a3';
		c.fillRect(0, SILL_Y, SIDE_PANE_RIGHT + 6, 12);
		c.fillStyle = '#b8c4cf';
		c.fillRect(0, SILL_Y, SIDE_PANE_RIGHT + 6, 3);
		c.fillStyle = '#5a6672';
		c.fillRect(0, SILL_Y + 12, SIDE_PANE_RIGHT + 6, 2);

		// wall detail on the right: a horizontal seam, a dark pipe along the sill, a vent and two small lights
		const wallL = SIDE_PANE_RIGHT + 6;
		c.fillStyle = '#313c49';
		c.fillRect(wallL, TOP_PANE_BOTTOM, W - wallL, 4);
		c.fillStyle = '#1e2832';
		c.fillRect(wallL, 296, W - wallL, 2);
		c.fillStyle = '#3a4755';
		c.fillRect(wallL, 298, W - wallL, 1);
		c.fillStyle = '#14191f';                         // vent: a dark box with slats
		c.fillRect(372, 312, 72, 38);
		c.fillStyle = '#56626e';
		c.fillRect(372, 312, 72, 2);
		c.fillRect(372, 348, 72, 2);
		for (let y = 318; y < 346; y += 5) {
			c.fillStyle = '#2e3944';
			c.fillRect(376, y, 64, 3);
			c.fillStyle = '#0b0f13';
			c.fillRect(376, y + 3, 64, 1);
		}
		rivet(c, 374, 314); rivet(c, 436, 314); rivet(c, 374, 340); rivet(c, 436, 340);
		const blink = Math.floor(t * 1.5);
		c.fillStyle = blink % 2 ? '#f84' : '#531';       // amber light, out of step with the green one
		c.fillRect(352, 184, 5, 5);
		c.fillStyle = Math.floor(t * 0.7) % 3 ? '#27a' : '#4af';
		c.fillRect(352, 194, 5, 5);

		// the AI's wall screen: a cable from the vent up to a bracket, a thick bezel, then the screen
		c.fillStyle = '#0b0f13';
		c.fillRect(406, AI_Y + 84, 4, 312 - AI_Y - 84);
		c.fillStyle = '#5a6672';
		c.fillRect(AI_X + 30, AI_Y + 76, 28, 8);   // bracket under the bezel
		c.fillStyle = '#3a4755';
		c.fillRect(AI_X + 30, AI_Y + 82, 28, 2);
		c.fillStyle = '#14191f';                   // bezel: dark body, light top/left, dark bottom/right
		c.fillRect(AI_X - 6, AI_Y - 8, 100, 86);
		c.fillStyle = '#6b7885';
		c.fillRect(AI_X - 6, AI_Y - 8, 100, 3);
		c.fillRect(AI_X - 6, AI_Y - 8, 3, 86);
		c.fillStyle = '#0b0f13';
		c.fillRect(AI_X - 6, AI_Y + 75, 100, 3);
		c.fillRect(AI_X + 91, AI_Y - 8, 3, 86);
		rivet(c, AI_X - 2, AI_Y - 4); rivet(c, AI_X + 86, AI_Y - 4);
		c.fillStyle = '#04121c';
		c.fillRect(AI_X, AI_Y, 88, 70);

		// the AI's face and scanlines, kept inside the screen
		c.save();
		c.beginPath();
		c.rect(AI_X, AI_Y, 88, 70);
		c.clip();
		spr(c, 'ai', AI_X + 12, AI_Y + 2, 2, Math.floor(t * 8));
		c.fillStyle = 'rgba(0,0,0,.18)';
		for (let y = AI_Y; y < AI_Y + 70; y += 3) c.fillRect(AI_X, y, 88, 1);
		c.restore();

		// blinking status light
		c.fillStyle = Math.floor(t * 1.5) % 2 ? '#4f6' : '#183';
		c.fillRect(AI_X + 80, AI_Y + 72, 4, 3);

		// baseboard with a shadow strip below it, then the deck
		c.fillStyle = '#6a7580';
		c.fillRect(0, BASEBOARD_Y, W, 6);
		c.fillStyle = '#8a97a3';
		c.fillRect(0, BASEBOARD_Y, W, 2);
		tiles(c, 'floor', 0, DECK_Y);

		// the back of the deck darker, fading out towards the front
		const fade = c.createLinearGradient(0, DECK_Y, 0, 480);
		fade.addColorStop(0, 'rgba(0,10,25,.55)');
		fade.addColorStop(.6, 'rgba(0,10,25,.1)');
		fade.addColorStop(1, 'rgba(0,0,0,0)');
		c.fillStyle = fade;
		c.fillRect(0, DECK_Y, W, 100);
		c.fillStyle = 'rgba(0,0,0,.4)';
		c.fillRect(0, DECK_Y, W, 3);

		// a soft sheen on the tiles: a pale band that drifts slowly left to right behind the crew
		const sx = Math.round(((t * 12) % 700) - 110);
		c.fillStyle = 'rgba(180,210,255,.05)';
		for (let y = DECK_Y + 4; y < 480; y += 2) c.fillRect(sx + (y - DECK_Y) * 0.6 | 0, y, 90, 2);

		// the crew in an evenly spaced row, each bobbing a pixel at its own pace; Ian hops now and then, Beepsky's light flashes red and blue
		['clown', 'nt', 'wizard', 'syndi', 'secbot', 'ian'].forEach((who, i) => {
			const cx = CREW_X0 + i * CREW_GAP;
			let up = Math.floor(t * 0.9 + i * 0.37) % 2 && who != 'secbot' ? 1 : 0;
			if (who == 'ian') {
				const hopTime = (t + 1) % 4;                   // two quick hops every 4 seconds
				if (hopTime < 0.5) up = Math.floor(hopTime * 4) % 2 ? 0 : 4;
			}
			crwPut(c, 'crew_' + who + '_s', cx, FEET_Y, 3, 0, true, up);
			if (who == 'secbot') {
				c.fillStyle = Math.floor(t * 4) % 2 ? '#f33' : '#38f';
				c.fillRect(cx - 48 + 14 * 3, FEET_Y - 29 * 3 + 9 * 3, 3, 3);
			}
		});

		crwLogo(c, 36, '#fff', '#4af', 128, '#9bc');
	}
};

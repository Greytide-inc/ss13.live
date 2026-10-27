import { W, spr, tiles, starfield, crwPut, crwLogo } from "../helpers.js";

const BASEBOARD_Y = 284;
const DECK_Y = 290;       // floor tiles start here
const FEET_Y = 448;
const AI_X = W / 2 - 44;  // left edge of the AI's wall screen

export default {
	name: '2. The crew',
	desc: 'A line-up of station regulars standing on the deck in front of a big window full of stars: clown, officer, wizard, syndie, Beepsky, Ian, with the station AI watching from its wall screen.',
	draw(c, t) {
		starfield(c, t, 3);

		// window frame (top, left, right), then the sill with a light top edge and a shadow under it
		c.fillStyle = '#46525e';
		c.fillRect(0, 0, W, 6);
		c.fillRect(0, 0, 8, 208);
		c.fillRect(W - 8, 0, 8, 208);
		c.fillStyle = '#8a97a3';
		c.fillRect(0, 198, W, 12);
		c.fillStyle = '#b8c4cf';
		c.fillRect(0, 198, W, 3);
		c.fillStyle = '#5a6672';
		c.fillRect(0, 208, W, 2);

		// wall under the window, with panel seams
		c.fillStyle = '#27313d';
		c.fillRect(0, 210, W, 74);
		c.fillStyle = '#1e2832';
		for (let x = 0; x < W; x += 60) c.fillRect(x, 210, 2, 74);

		// the AI's wall screen: dark backing, bracket, screen
		c.fillStyle = '#14191f';
		c.fillRect(AI_X - 4, 206, 96, 82);
		c.fillStyle = '#5a6672';
		c.fillRect(AI_X - 4, 206, 96, 3);
		c.fillRect(AI_X - 4, 285, 96, 3);
		c.fillRect(AI_X - 4, 206, 3, 82);
		c.fillRect(AI_X + 89, 206, 3, 82);
		c.fillStyle = '#04121c';
		c.fillRect(AI_X, 212, 88, 70);

		// the AI's face and scanlines, kept inside the screen
		c.save();
		c.beginPath();
		c.rect(AI_X, 212, 88, 70);
		c.clip();
		spr(c, 'ai', W / 2 - 32, 214, 2, Math.floor(t * 8));
		c.fillStyle = 'rgba(0,0,0,.18)';
		for (let y = 212; y < 282; y += 3) c.fillRect(AI_X, y, 88, 1);
		c.restore();

		// blinking status light
		c.fillStyle = Math.floor(t * 1.5) % 2 ? '#4f6' : '#183';
		c.fillRect(AI_X + 80, 276, 4, 4);

		// baseboard and deck
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
		c.fillRect(0, DECK_Y, W, 190);

		// the crew in a row, hopping in turn twice a second (Beepsky doesn't hop)
		const step = Math.floor(t * 2);
		['clown', 'nt', 'wizard', 'syndi', 'secbot', 'ian'].forEach((who, i) => {
			const hop = (step + i) % 2 || who == 'secbot' ? 0 : 3;
			crwPut(c, 'crew_' + who + '_s', 66 + i * 69.6, FEET_Y, 3, 0, true, hop);
		});

		crwLogo(c, 36, '#fff', '#4af', 128, '#9bc');
	}
};
